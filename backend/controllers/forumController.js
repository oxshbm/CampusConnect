const mongoose = require('mongoose');
const Question = require('../models/Question');
const Comment = require('../models/Comment');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const sameId = (a, b) => a?.toString() === b?.toString();

const normalizeTags = (tags) => {
  if (!tags) return [];
  const source = Array.isArray(tags) ? tags : String(tags).split(',');
  return [...new Set(source.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
};

const sendError = (res, error, fallback) => {
  console.error(fallback, error);
  res.status(error.status || 500).json({ success: false, message: error.status ? error.message : fallback });
};

const getQuestionOr404 = async (questionId) => {
  if (!isValidId(questionId)) {
    const error = new Error('Invalid question id');
    error.status = 400;
    throw error;
  }

  const question = await Question.findById(questionId).populate('createdBy', 'name email course year');

  if (!question) {
    const error = new Error('Question not found');
    error.status = 404;
    throw error;
  }

  return question;
};

const getQuestions = async (req, res) => {
  try {
    const { q, tag, sort = 'newest', page = 1, limit = 30, bookmarked } = req.query;
    const filter = {};
    const userId = req.user?._id;

    if (q) {
      filter.$or = [
        { title: { $regex: q.trim(), $options: 'i' } },
        { content: { $regex: q.trim(), $options: 'i' } },
        { tags: { $regex: q.trim(), $options: 'i' } },
      ];
    }

    if (tag) {
      const tags = normalizeTags(tag);
      if (tags.length > 0) filter.tags = { $in: tags };
    }

    if (bookmarked === 'true' && userId) {
      filter.bookmarkedBy = userId;
    }

    const sortOption = sort === 'votes' ? { upvoteCount: -1, createdAt: -1 } : { createdAt: -1 };

    const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), 50);
    const safePage = Math.max(Number(page) || 1, 1);

    const [questions, total] = await Promise.all([
      Question.aggregate([
        { $match: filter },
        {
          $addFields: {
            upvoteCount: { $size: { $ifNull: ['$upvotes', []] } },
            downvoteCount: { $size: { $ifNull: ['$downvotes', []] } },
          },
        },
        { $sort: sortOption },
        { $skip: (safePage - 1) * safeLimit },
        { $limit: safeLimit },
      ]),
      Question.countDocuments(filter),
    ]);

    const data = questions.map((q) => {
      const hasUpvoted = userId && (q.upvotes || []).some((id) => sameId(id, userId));
      const hasDownvoted = userId && (q.downvotes || []).some((id) => sameId(id, userId));
      const isBookmarked = userId && (q.bookmarkedBy || []).some((id) => sameId(id, userId));

      let pollHasVoted = false;
      let pollSelectedOption = -1;
      if (q.poll && q.poll.options && userId) {
        for (let i = 0; i < q.poll.options.length; i++) {
          if ((q.poll.options[i].votes || []).some((id) => sameId(id, userId))) {
            pollHasVoted = true;
            pollSelectedOption = i;
            break;
          }
        }
      }

      const pollTotalVotes = q.poll?.options?.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0) || 0;
      const pollIsExpired = q.poll?.expiresAt ? new Date(q.poll.expiresAt) < new Date() : false;

      return {
        ...q,
        hasUpvoted,
        hasDownvoted,
        upvoteCount: q.upvoteCount,
        downvoteCount: q.downvoteCount,
        isOwner: Boolean(userId && sameId(q.createdBy, userId)),
        isBookmarked,
        pollHasVoted,
        pollSelectedOption,
        pollTotalVotes,
        pollIsExpired,
      };
    });

    const populated = await Question.populate(data, { path: 'createdBy', select: 'name email course year' });

    res.json({
      success: true,
      data: populated,
      pagination: { page: safePage, limit: safeLimit, total },
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch questions');
  }
};

const getQuestion = async (req, res) => {
  try {
    const question = await getQuestionOr404(req.params.id);

    const userId = req.user?._id;
    const hasUpvoted = userId && (question.upvotes || []).some((id) => sameId(id, userId));
    const hasDownvoted = userId && (question.downvotes || []).some((id) => sameId(id, userId));
    const isBookmarked = userId && (question.bookmarkedBy || []).some((id) => sameId(id, userId));

    let pollHasVoted = false;
    let pollSelectedOption = -1;
    if (question.poll && question.poll.options && userId) {
      for (let i = 0; i < question.poll.options.length; i++) {
        if ((question.poll.options[i].votes || []).some((id) => sameId(id, userId))) {
          pollHasVoted = true;
          pollSelectedOption = i;
          break;
        }
      }
    }

    const pollTotalVotes = question.poll?.options?.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0) || 0;
    const pollIsExpired = question.poll?.expiresAt ? new Date(question.poll.expiresAt) < new Date() : false;

    const comments = await Comment.find({ question: question._id })
      .populate('author', 'name email course year')
      .sort({ createdAt: 1 });

    const commentsWithMeta = comments.map((c) => ({
      ...c.toObject(),
      likeCount: c.likes?.length || 0,
      hasLiked: Boolean(userId && (c.likes || []).some((id) => sameId(id, userId))),
    }));

    res.json({
      success: true,
      data: {
        ...question.toObject(),
        hasUpvoted,
        hasDownvoted,
        upvoteCount: question.upvotes.length,
        downvoteCount: question.downvotes.length,
        isOwner: Boolean(userId && sameId(question.createdBy?._id || question.createdBy, userId)),
        isBookmarked,
        pollHasVoted,
        pollSelectedOption,
        pollTotalVotes,
        pollIsExpired,
        comments: commentsWithMeta,
      },
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch question');
  }
};

const createQuestion = async (req, res) => {
  try {
    const { title, content, tags, poll } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const questionData = {
      title: title.trim(),
      content: content.trim(),
      tags: normalizeTags(tags),
      createdBy: req.user._id,
    };

    if (poll && poll.question && poll.options && poll.options.length >= 2) {
      questionData.poll = {
        question: poll.question.trim(),
        options: poll.options.map((opt) => ({
          text: opt.text.trim(),
          votes: [],
        })),
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      };
    }

    const question = await Question.create(questionData);

    const populated = await question.populate('createdBy', 'name email course year');

    res.status(201).json({ success: true, data: { ...populated.toObject(), upvoteCount: 0, downvoteCount: 0, hasUpvoted: false, hasDownvoted: false, isOwner: true, comments: [], isBookmarked: false, pollHasVoted: false, pollSelectedOption: -1, pollTotalVotes: 0, pollIsExpired: false } });
  } catch (error) {
    sendError(res, error, 'Failed to create question');
  }
};

const voteOnQuestion = async (req, res) => {
  try {
    const { voteType } = req.body;
    if (!voteType || !['up', 'down'].includes(voteType)) {
      return res.status(400).json({ success: false, message: 'voteType must be "up" or "down"' });
    }

    const question = await getQuestionOr404(req.params.id);
    const userId = req.user._id;

    const upField = voteType === 'up' ? 'upvotes' : 'downvotes';
    const oppositeField = voteType === 'up' ? 'downvotes' : 'upvotes';

    const alreadyVoted = question[upField].some((id) => sameId(id, userId));
    const alreadyOpposite = question[oppositeField].some((id) => sameId(id, userId));

    if (alreadyVoted) {
      question[upField].pull(userId);
    } else {
      if (alreadyOpposite) question[oppositeField].pull(userId);
      question[upField].push(userId);
    }

    await question.save();

    res.json({
      success: true,
      data: {
        upvoteCount: question.upvotes.length,
        downvoteCount: question.downvotes.length,
        hasUpvoted: question.upvotes.some((id) => sameId(id, userId)),
        hasDownvoted: question.downvotes.some((id) => sameId(id, userId)),
      },
    });
  } catch (error) {
    sendError(res, error, 'Failed to vote');
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await getQuestionOr404(req.params.id);

    if (!sameId(question.createdBy?._id || question.createdBy, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the author can delete this question' });
    }

    await Comment.deleteMany({ question: question._id });
    await Question.findByIdAndDelete(question._id);

    res.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    sendError(res, error, 'Failed to delete question');
  }
};

const addComment = async (req, res) => {
  try {
    const { content, parent } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const question = await getQuestionOr404(req.params.id);

    if (parent) {
      const parentComment = await Comment.findById(parent);
      if (!parentComment || parentComment.question.toString() !== question._id.toString()) {
        return res.status(400).json({ success: false, message: 'Invalid parent comment' });
      }
    }

    const comment = await Comment.create({
      question: question._id,
      author: req.user._id,
      content: content.trim(),
      parent: parent || null,
    });

    if (!parent) {
      await Question.findByIdAndUpdate(question._id, { $inc: { commentCount: 1 } });
    }

    const populated = await comment.populate('author', 'name email course year');

    res.status(201).json({ success: true, data: { ...populated.toObject(), likeCount: 0, hasLiked: false } });
  } catch (error) {
    sendError(res, error, 'Failed to add comment');
  }
};

const getComments = async (req, res) => {
  try {
    const question = await getQuestionOr404(req.params.id);
    const userId = req.user?._id;
    const comments = await Comment.find({ question: question._id })
      .populate('author', 'name email course year')
      .sort({ createdAt: 1 });

    const data = comments.map((c) => ({
      ...c.toObject(),
      likeCount: c.likes?.length || 0,
      hasLiked: Boolean(userId && (c.likes || []).some((id) => sameId(id, userId))),
    }));

    res.json({ success: true, data });
  } catch (error) {
    sendError(res, error, 'Failed to fetch comments');
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const question = await getQuestionOr404(req.params.id);
    const userId = req.user._id;

    const alreadyBookmarked = (question.bookmarkedBy || []).some((id) => sameId(id, userId));

    if (alreadyBookmarked) {
      question.bookmarkedBy.pull(userId);
    } else {
      question.bookmarkedBy.push(userId);
    }

    await question.save();

    res.json({
      success: true,
      data: { isBookmarked: !alreadyBookmarked },
    });
  } catch (error) {
    sendError(res, error, 'Failed to toggle bookmark');
  }
};

const votePoll = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const question = await getQuestionOr404(req.params.id);
    const userId = req.user._id;

    if (!question.poll) {
      return res.status(400).json({ success: false, message: 'This question has no poll' });
    }

    if (question.poll.expiresAt && new Date(question.poll.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: 'This poll has expired' });
    }

    if (typeof optionIndex !== 'number' || optionIndex < 0 || optionIndex >= question.poll.options.length) {
      return res.status(400).json({ success: false, message: 'Invalid option index' });
    }

    const alreadyVoted = question.poll.options.some((opt) =>
      (opt.votes || []).some((id) => sameId(id, userId))
    );

    if (alreadyVoted) {
      return res.status(400).json({ success: false, message: 'You have already voted on this poll' });
    }

    question.poll.options[optionIndex].votes.push(userId);
    await question.save();

    const pollTotalVotes = question.poll.options.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0);

    res.json({
      success: true,
      data: {
        hasVoted: true,
        selectedOption: optionIndex,
        totalVotes: pollTotalVotes,
      },
    });
  } catch (error) {
    sendError(res, error, 'Failed to vote on poll');
  }
};

const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const userId = req.user._id;
    const alreadyLiked = (comment.likes || []).some((id) => sameId(id, userId));

    if (alreadyLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      success: true,
      data: {
        likeCount: comment.likes.length,
        hasLiked: !alreadyLiked,
      },
    });
  } catch (error) {
    sendError(res, error, 'Failed to like comment');
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (!sameId(comment.author, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the comment author can delete this comment' });
    }

    await Comment.findByIdAndDelete(comment._id);
    await Question.findByIdAndUpdate(comment.question, { $inc: { commentCount: -1 } });

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    sendError(res, error, 'Failed to delete comment');
  }
};

module.exports = {
  getQuestions,
  getQuestion,
  createQuestion,
  voteOnQuestion,
  deleteQuestion,
  addComment,
  getComments,
  toggleBookmark,
  votePoll,
  likeComment,
  deleteComment,
};
