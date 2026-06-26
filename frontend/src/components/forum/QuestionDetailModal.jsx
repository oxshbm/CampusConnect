import { useAuth } from '../../hooks/useAuth';
import CommentSection from './CommentSection';
import PollDisplay from './PollDisplay';

const toId = (value) => value?._id || value?.id || value;
const sameId = (a, b) => toId(a)?.toString() === toId(b)?.toString();

const QuestionDetailModal = ({ question, onClose, user, onVote, onDelete, voteOnQuestion, addComment, deleteComment, fetchComments, onBookmark, votePoll, onLikeComment }) => {
  const userId = toId(user);
  const isOwner = Boolean(userId && sameId(question.createdBy?._id || question.createdBy, userId));

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
    onClose();
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
      if (onVote) onVote(question._id, { pollHasVoted: true, pollSelectedOption: optionIndex, pollTotalVotes: data.totalVotes });
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white pr-4">
            {question.title}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-2xl font-bold transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1 shrink-0">
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

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Posted by {question.createdBy?.name || 'Unknown'} {timeAgo(question.createdAt)}</span>
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
                    <button
                      onClick={handleDelete}
                      className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
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

              <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                <CommentSection
                  questionId={question._id}
                  fetchComments={fetchComments}
                  addComment={addComment}
                  deleteComment={deleteComment}
                  onLikeComment={onLikeComment}
                  onCommentCountChange={(delta) => {
                    if (onVote) onVote(question._id, { commentCount: (question.commentCount ?? 0) + delta });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailModal;
