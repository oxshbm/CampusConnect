import Spinner from '../common/Spinner';

const ApplicationsList = ({ applications, onApprove, onReject, loading }) => {
  const pendingApplications = applications?.filter((app) => app.status === 'pending') || [];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <Spinner />;

  if (pendingApplications.length === 0) {
    return (
      <div className="card p-8 border-l-4 border-l-amber-500">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">📋 Applicants</h2>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📧</div>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium">
            No pending applications yet
          </p>
          <p className="text-zinc-500 dark:text-zinc-500 mt-2">
            Applications will appear here once people apply to join your project
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8 border-l-4 border-l-amber-500">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
        📋 Applicants <span className="text-amber-600 dark:text-amber-400">({pendingApplications.length})</span>
      </h2>

      <div className="space-y-3">
        {pendingApplications.map((application) => (
          <div
            key={application._id}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-zinc-50 dark:from-amber-900/20 dark:to-zinc-900/20 rounded-lg border border-amber-200 dark:border-amber-700/50"
          >
            {/* Avatar */}
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 dark:from-amber-600 dark:to-amber-800 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {application.user && application.user.name
                ? application.user.name.charAt(0).toUpperCase()
                : '?'}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-zinc-900 dark:text-white truncate">
                {application.user?.name || 'Unknown User'}
              </p>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 space-x-2">
                <span>{application.user?.course || 'N/A'}</span>
                <span>•</span>
                <span>Year {application.user?.year || 'N/A'}</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                Applied {formatDate(application.appliedAt)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onApprove(application.user._id)}
                disabled={loading}
                className="btn-primary text-sm px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✓ Approve
              </button>
              <button
                onClick={() => onReject(application.user._id)}
                disabled={loading}
                className="btn-secondary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✕ Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsList;
