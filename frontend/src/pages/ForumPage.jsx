import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useForum } from '../hooks/useForum';
import QuestionCard from '../components/forum/QuestionCard';
import QuestionDetailModal from '../components/forum/QuestionDetailModal';
import CreateQuestionModal from '../components/forum/CreateQuestionModal';
import Spinner from '../components/common/Spinner';

const ForumPage = () => {
  const { user } = useAuth();
  const { loading, fetchQuestions, fetchComments, voteOnQuestion, deleteQuestion, addComment, deleteComment, createQuestion, updateComment, updateQuestion, toggleBookmark, votePoll, likeComment } = useForum();
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [sort, setSort] = useState('newest');
  const [showModal, setShowModal] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const latestRequest = useRef(0);

  const loadQuestions = useCallback(async () => {
    const requestId = ++latestRequest.current;
    const params = { sort };
    if (search.trim()) params.q = search.trim();
    if (activeTag) params.tag = activeTag;
    if (bookmarkedOnly && user) params.bookmarked = 'true';
    const data = await fetchQuestions(params);
    if (requestId !== latestRequest.current) return;
    setQuestions(data);
    const tags = [...new Set(data.flatMap((q) => q.tags || []))].sort();
    setAllTags(tags);
  }, [search, activeTag, sort, bookmarkedOnly, user, fetchQuestions]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadQuestions();
  };

  const handleVote = (questionId, updated) => {
    setQuestions((prev) => {
      const next = prev.map((q) =>
        q._id === questionId
          ? {
              ...q,
              upvoteCount: updated.upvoteCount ?? q.upvoteCount,
              downvoteCount: updated.downvoteCount ?? q.downvoteCount,
              hasUpvoted: updated.hasUpvoted ?? q.hasUpvoted,
              hasDownvoted: updated.hasDownvoted ?? q.hasDownvoted,
              commentCount: updated.commentCount ?? q.commentCount,
              isBookmarked: updated.isBookmarked ?? q.isBookmarked,
              pollHasVoted: updated.pollHasVoted ?? q.pollHasVoted,
              pollSelectedOption: updated.pollSelectedOption ?? q.pollSelectedOption,
              pollTotalVotes: updated.pollTotalVotes ?? q.pollTotalVotes,
              poll: updated.pollOptions
                ? {
                    ...q.poll,
                    options: q.poll.options.map((opt, i) => ({
                      ...opt,
                      votes: Array.from({ length: updated.pollOptions[i]?.voteCount ?? opt.votes?.length ?? 0 }),
                    })),
                  }
                : q.poll,
            }
          : q
      );
      if (sort === 'votes') next.sort((a, b) => b.upvoteCount - a.upvoteCount);
      return next;
    });
  };

  const handleDelete = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  };

  const handleBookmark = async (questionId) => {
    const data = await toggleBookmark(questionId);
    handleVote(questionId, { isBookmarked: data.isBookmarked });
    return data;
  };

  const handleLikeComment = async (commentId) => {
    return await likeComment(commentId);
  };

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 py-6 md:py-12 px-4 min-h-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 md:mb-12 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent mb-3">
              Forum
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Discuss ideas, ask questions, and connect with peers
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700"
            >
              New Post
            </button>
          )}
        </div>

        <div className="card p-4 md:p-6 mb-6 border-l-4 border-l-purple-600 dark:border-l-purple-500">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="input-field flex-1"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field w-auto px-3 py-3 text-sm"
            >
              <option value="newest">Latest</option>
              <option value="votes">Most Upvoted</option>
            </select>
            <button type="submit" className="btn-primary">
              🔎 Search
            </button>
          </form>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 items-center">
          <button
            onClick={() => setActiveTag('')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !activeTag && !bookmarkedOnly
                ? 'bg-purple-600 text-white'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeTag === tag
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
              }`}
            >
              {tag}
            </button>
          ))}
          {user && (
            <button
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                bookmarkedOnly
                  ? 'bg-yellow-500 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
              }`}
            >
              ⭐ Bookmarked
            </button>
          )}
        </div>

        {loading && <Spinner />}

        {!loading && questions.length === 0 && (
          <div className="text-center py-16 card">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium">No questions found</p>
            <p className="text-zinc-500 dark:text-zinc-500 mt-2">
              {search || activeTag ? 'Try adjusting your search or filters' : 'Be the first to ask a question'}
            </p>
          </div>
        )}

        {!loading && questions.length > 0 && (
          <div className="space-y-4">
            {questions.map((question) => (
              <QuestionCard
                key={question._id}
                question={question}
                onVote={handleVote}
                onDelete={handleDelete}
                voteOnQuestion={voteOnQuestion}
                onBookmark={handleBookmark}
                votePoll={votePoll}
                onSelect={setSelectedQuestion}
                onEdit={setEditingQuestion}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateQuestionModal
          onClose={() => setShowModal(false)}
          onCreated={loadQuestions}
          createQuestion={createQuestion}
        />
      )}

      {editingQuestion && (
        <CreateQuestionModal
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onUpdated={loadQuestions}
          createQuestion={createQuestion}
          updateQuestion={updateQuestion}
        />
      )}

      {selectedQuestion && (
        <QuestionDetailModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          user={user}
          onVote={handleVote}
          onDelete={handleDelete}
          voteOnQuestion={voteOnQuestion}
          addComment={addComment}
          deleteComment={deleteComment}
          updateComment={updateComment}
          fetchComments={fetchComments}
          onBookmark={handleBookmark}
          votePoll={votePoll}
          onLikeComment={handleLikeComment}
        />
      )}
    </div>
  );
};

export default ForumPage;
