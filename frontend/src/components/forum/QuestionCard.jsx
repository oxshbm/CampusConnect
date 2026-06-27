import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import PollDisplay from './PollDisplay';

const toId = (value) => value?._id || value?.id || value;
const sameId = (a, b) => toId(a)?.toString() === toId(b)?.toString();

const QuestionCard = ({ question, onVote, onDelete, voteOnQuestion, onBookmark, votePoll, onSelect, onEdit }) => {
  const { user } = useAuth();
  const userId = toId(user);
  const isOwner = Boolean(userId && sameId(question.createdBy?._id || question.createdBy, userId));
  const [menuOpen, setMenuOpen] = useState(false);

  const upvoteCount = question.upvoteCount ?? question.upvotes?.length ?? 0;
  const downvoteCount = question.downvoteCount ?? question.downvotes?.length ?? 0;
  const hasUpvoted = question.hasUpvoted;
  const hasDownvoted = question.hasDownvoted;
  const isBookmarked = question.isBookmarked;
  const tags = question.tags || [];

  const handleVote = async (voteType) => {
    if (!user || !voteOnQuestion) return;
    try {
      const data = await voteOnQuestion(question._id, voteType);
      if (onVote) onVote(question._id, data);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const handleDelete = () => {
    if (onDelete) onDelete(question._id);
  };

  const handleBookmark = async () => {
    if (!user || !onBookmark) return;
    try {
      const data = await onBookmark(question._id);
      if (onVote) onVote(question._id, { isBookmarked: data.isBookmarked });
    } catch (err) {
      console.error('Bookmark failed:', err);
    }
  };

  const handlePollVote = async (optionIndex) => {
    if (!user || !votePoll || !onVote) return;
    try {
      const data = await votePoll(question._id, optionIndex);
      if (onVote) onVote(question._id, { pollHasVoted: true, pollSelectedOption: optionIndex, pollTotalVotes: data.totalVotes, pollOptions: data.options });
    } catch (err) {
      console.error('Poll vote failed:', err);
    }
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
        <div className="flex flex-col items-center gap-1 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-l-lg min-w-[72px]">
          <button
            onClick={() => handleVote('up')}
            disabled={!user}
            className={`text-2xl leading-none transition-colors ${hasUpvoted ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-400 dark:text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400'} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            ▲
          </button>
          <span className={`text-base font-bold ${upvoteCount - downvoteCount > 0 ? 'text-purple-600 dark:text-purple-400' : upvoteCount - downvoteCount < 0 ? 'text-red-500 dark:text-red-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
            {upvoteCount - downvoteCount}
          </span>
          <button
            onClick={() => handleVote('down')}
            disabled={!user}
            className={`text-2xl leading-none transition-colors ${hasDownvoted ? 'text-red-500 dark:text-red-400' : 'text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400'} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            ▼
          </button>
        </div>

        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div onClick={() => onSelect(question)} className="cursor-pointer">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-2">
                  {question.title}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {user && (
                <button
                  onClick={handleBookmark}
                  className={`text-lg transition-colors ${isBookmarked ? 'text-yellow-500' : 'text-zinc-400 dark:text-zinc-500 hover:text-yellow-500'}`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                  {isBookmarked ? '⭐' : '☆'}
                </button>
              )}
              {isOwner && (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-2xl leading-none px-1 transition-colors"
                  >
                    ⋯
                  </button>
                  {menuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 min-w-[150px] z-50">
                        <button
                          onClick={() => { setMenuOpen(false); onEdit(question); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                        >
                           Edit
                        </button>
                        <button
                          onClick={() => { setMenuOpen(false); handleDelete(); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                        >
                           Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div onClick={() => onSelect(question)} className="cursor-pointer">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">
              {question.content}
            </p>
          </div>

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

          {question.poll && (
            <PollDisplay
              poll={question.poll}
              hasVoted={question.pollHasVoted}
              selectedOption={question.pollSelectedOption}
              totalVotes={question.pollTotalVotes}
              isExpired={question.pollIsExpired}
              onVote={handlePollVote}
            />
          )}

          <div className="flex items-center justify-between mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span>Posted by {question.createdBy?.name || 'Unknown'} {timeAgo(question.createdAt)}</span>
            <button
              onClick={() => onSelect(question)}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 text-white shadow-md hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700 transition-all"
            >
              💬 Comments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
