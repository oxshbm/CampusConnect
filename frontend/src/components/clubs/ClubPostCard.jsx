const getTypeBadge = (type) => {
  const badges = {
    announcement: { emoji: '📢', label: 'Announcement', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    event: { emoji: '📅', label: 'Event', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    update: { emoji: '🔄', label: 'Update', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  };
  return badges[type] || badges.update;
};

export default function ClubPostCard({ post, isLeader, onDelete }) {
  const badge = getTypeBadge(post.type);
  const formatDate = (date) => {
    try {
      const d = new Date(date);
      const now = new Date();
      const diffMs = now - d;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="card p-6 border-l-4 border-l-purple-600 dark:border-l-purple-400">
      {/* Header with Badge */}
      <div className="flex items-start justify-between mb-3">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
          {badge.emoji} {badge.label}
        </span>
        {isLeader && (
          <button
            onClick={() => onDelete(post._id)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
          >
            Delete
          </button>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
        {post.title}
      </h3>

      {/* Content */}
      <p className="text-zinc-700 dark:text-zinc-300 mb-4 whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Event Details (if applicable) */}
      {post.type === 'event' && post.eventDate && (
        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded mb-4 space-y-1">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            📅 {new Date(post.eventDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          {post.eventTime && (
            <p className="text-sm text-blue-800 dark:text-blue-200">
              🕐 {post.eventTime}
            </p>
          )}
          {post.eventLocation && (
            <p className="text-sm text-blue-800 dark:text-blue-200">
              📍 {post.eventLocation}
            </p>
          )}
        </div>
      )}

      {/* Posted By & Time */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>Posted by {post.createdBy?.name || 'Unknown'}</span>
        <span>{formatDate(post.createdAt)}</span>
      </div>
    </div>
  );
}
