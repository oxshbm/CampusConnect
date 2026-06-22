import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getQuestions, deleteQuestion } from '../api/forumApi';
import QuestionCard from '../components/forum/QuestionCard';
import CreateQuestionModal from '../components/forum/CreateQuestionModal';
import Spinner from '../components/common/Spinner';

const ForumPage = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [sort, setSort] = useState('newest');
  const [showModal, setShowModal] = useState(false);
  const [allTags, setAllTags] = useState([]);

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const params = { sort };
      if (search.trim()) params.q = search.trim();
      if (activeTag) params.tag = activeTag;
      const res = await getQuestions(params);
      const data = res.data || [];
      setQuestions(data);
      const tags = [...new Set(data.flatMap((q) => q.tags || []))].sort();
      setAllTags(tags);
    } catch (err) {
      console.error('Failed to load questions:', err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [search, activeTag, sort]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadQuestions();
  };

  const handleVote = (questionId, updated) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === questionId
          ? {
              ...q,
              upvoteCount: updated.upvoteCount ?? q.upvoteCount,
              downvoteCount: updated.downvoteCount ?? q.downvoteCount,
              hasUpvoted: updated.hasUpvoted ?? q.hasUpvoted,
              hasDownvoted: updated.hasDownvoted ?? q.hasDownvoted,
              commentCount: updated.commentCount ?? q.commentCount,
            }
          : q
      )
    );
  };

  const handleDelete = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  };

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 py-6 md:py-12 px-4 min-h-full">
      <div className="max-w-4xl mx-auto">
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
              💬 Ask Question
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
            <button type="submit" className="btn-primary">
              🔎 Search
            </button>
          </form>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveTag('')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !activeTag
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
          </div>
        )}

        <div className="flex gap-4 mb-6 border-b border-zinc-200 dark:border-zinc-700 pb-3">
          <button
            onClick={() => setSort('newest')}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              sort === 'newest'
                ? 'text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400'
                : 'text-zinc-500 dark:text-zinc-400 border-transparent hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setSort('votes')}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              sort === 'votes'
                ? 'text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400'
                : 'text-zinc-500 dark:text-zinc-400 border-transparent hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            Most Upvoted
          </button>
          {questions.length > 0 && (
            <span className="text-xs text-zinc-500 dark:text-zinc-500 ml-auto self-center">
              {questions.length} {questions.length === 1 ? 'question' : 'questions'}
            </span>
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
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateQuestionModal
          onClose={() => setShowModal(false)}
          onCreated={loadQuestions}
        />
      )}
    </div>
  );
};

export default ForumPage;
