const JoinRequestsPanel = ({ requests, onApprove, onReject, loading }) => {
  return (
    <div className="card p-4 md:p-8 border-l-4 border-l-amber-500">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Join Requests</h2>
        <span className="bg-amber-600 text-white text-sm font-bold px-3 py-1 rounded-full">
          {requests.length}
        </span>
      </div>

      {requests.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No pending requests.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request._id} className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">{request.requester?.name}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{request.requester?.email}</p>
                  {request.requester?.course && (
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      {request.requester.course} • Year {request.requester.year}
                    </p>
                  )}
                  {request.message && (
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">{request.message}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(request._id)}
                    disabled={loading}
                    className="btn-primary bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(request._id)}
                    disabled={loading}
                    className="btn-primary bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JoinRequestsPanel;
