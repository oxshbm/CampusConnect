import { useAuth } from '../../hooks/useAuth';

const timeLeft = (expiresAt) => {
  const diff = new Date(expiresAt) - new Date();
  if (diff <= 0) return 'Poll ended';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days}d left`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h left`;
  const mins = Math.floor(diff / (1000 * 60));
  return `${mins}m left`;
};

const PollDisplay = ({ poll, hasVoted, selectedOption, totalVotes, isExpired, onVote }) => {
  const { user } = useAuth();

  if (!poll || !poll.options || poll.options.length === 0) return null;

  const canVote = user && !hasVoted && !isExpired;

  const maxVotes = Math.max(...poll.options.map((opt) => opt.votes?.length || 0), 1);

  return (
    <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
          📊 {poll.question}
        </h4>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {isExpired ? 'Poll ended' : timeLeft(poll.expiresAt)}
        </span>
      </div>

      <div className="space-y-2">
        {poll.options.map((option, idx) => {
          const voteCount = option.votes?.length || 0;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isSelected = selectedOption === idx;
          const barWidth = totalVotes > 0 ? percentage : 0;

          return (
            <div key={idx}>
              <button
                onClick={() => canVote && onVote(idx)}
                disabled={!canVote}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  canVote
                    ? 'hover:border-purple-400 dark:hover:border-purple-500 cursor-pointer border-zinc-200 dark:border-zinc-600'
                    : isSelected
                      ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20 cursor-default'
                      : 'border-zinc-200 dark:border-zinc-600 cursor-default'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {option.text}
                    {isSelected && <span className="ml-2 text-purple-600 dark:text-purple-400 text-xs">✓</span>}
                  </span>
                  {!canVote && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {voteCount} vote{voteCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {!canVote && (
                  <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected
                          ? 'bg-purple-600 dark:bg-purple-500'
                          : 'bg-zinc-400 dark:bg-zinc-500'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {totalVotes > 0 && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
          {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default PollDisplay;
