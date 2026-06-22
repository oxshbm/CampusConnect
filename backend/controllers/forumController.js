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
    const { q, tag, sort = 'newest', page = 1, limit = 30 } = req.query;
    const filter = {};

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

    const userId = req.user?._id;
    const data = questions.map((q) => {
      const hasUpvoted = userId && (q.upvotes || []).some((id) => sameId(id, userId));
      const hasDownvoted = userId && (q.downvotes || []).some((id) => sameId(id, userId));
      return {
        ...q,
        hasUpvoted,
        hasDownvoted,
        upvoteCount: q.upvoteCount,
        downvoteCount: q.downvoteCount,
        isOwner: Boolean(userId && sameId(q.createdBy, userId)),
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

    const comments = await Comment.find({ question: question._id })
      .populate('author', 'name email course year')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: {
        ...question.toObject(),
        hasUpvoted,
        hasDownvoted,
        upvoteCount: question.upvotes.length,
        downvoteCount: question.downvotes.length,
        isOwner: Boolean(userId && sameId(question.createdBy?._id || question.createdBy, userId)),
        comments,
      },
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch question');
  }
};

const createQuestion = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const question = await Question.create({
      title: title.trim(),
      content: content.trim(),
      tags: normalizeTags(tags),
      createdBy: req.user._id,
    });

    const populated = await question.populate('createdBy', 'name email course year');

    res.status(201).json({ success: true, data: { ...populated.toObject(), upvoteCount: 0, downvoteCount: 0, hasUpvoted: false, hasDownvoted: false, isOwner: true, comments: [] } });
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
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const question = await getQuestionOr404(req.params.id);

    const comment = await Comment.create({
      question: question._id,
      author: req.user._id,
      content: content.trim(),
    });

    await Question.findByIdAndUpdate(question._id, { $inc: { commentCount: 1 } });

    const populated = await comment.populate('author', 'name email course year');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    sendError(res, error, 'Failed to add comment');
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
  deleteComment,
};
