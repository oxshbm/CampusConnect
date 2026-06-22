import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { voteOnQuestion } from '../../api/forumApi';
import CommentSection from './CommentSection';

const toId = (value) => value?._id || value?.id || value;
const sameId = (a, b) => toId(a)?.toString() === toId(b)?.toString();

const QuestionCard = ({ question, onVote, onDelete }) => {
  const { user } = useAuth();
  const userId = toId(user);
  const [expanded, setExpanded] = useState(false);
  const isOwner = Boolean(userId && sameId(question.createdBy?._id || question.createdBy, userId));

  const upvoteCount = question.upvoteCount ?? question.upvotes?.length ?? 0;
  const downvoteCount = question.downvoteCount ?? question.downvotes?.length ?? 0;
  const hasUpvoted = question.hasUpvoted;
  const hasDownvoted = question.hasDownvoted;
  const tags = question.tags || [];

  const handleVote = async (voteType) => {
    if (!user) return;
    try {
      const res = await voteOnQuestion(question._id, voteType);
      if (onVote) onVote(question._id, res.data);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const handleDelete = () => {
    if (onDelete) onDelete(question._id);
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="card p-0 hover:shadow-xl dark:hover:shadow-purple-900/50 hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-300">
      <div className="flex">
        <div className="flex flex-col items-center gap-1 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-l-lg min-w-[60px]">
          <button
            onClick={() => handleVote('up')}
            disabled={!user}
            className={`text-lg leading-none transition-colors ${hasUpvoted ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-400 dark:text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400'} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            ▲
          </button>
          <span className={`text-sm font-bold ${upvoteCount - downvoteCount > 0 ? 'text-purple-600 dark:text-purple-400' : upvoteCount - downvoteCount < 0 ? 'text-red-500 dark:text-red-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
            {upvoteCount - downvoteCount}
          </span>
          <button
            onClick={() => handleVote('down')}
            disabled={!user}
            className={`text-lg leading-none transition-colors ${hasDownvoted ? 'text-red-500 dark:text-red-400' : 'text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400'} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            ▼
          </button>
        </div>

        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-left w-full"
              >
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-2">
                  {question.title}
                </h3>
              </button>
            </div>
            {isOwner && (
              <button
                onClick={handleDelete}
                className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0 text-sm"
              >
                🗑️
              </button>
            )}
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">
            {question.content}
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span>Posted by {question.createdBy?.name || 'Unknown'} {timeAgo(question.createdAt)}</span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              💬 {question.commentCount ?? 0} comments
            </button>
          </div>

          {expanded && (
            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <CommentSection
                questionId={question._id}
                onCommentCountChange={(delta) => {
                  if (onVote) onVote(question._id, { commentCount: (question.commentCount ?? 0) + delta });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
