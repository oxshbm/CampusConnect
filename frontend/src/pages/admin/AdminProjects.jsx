const AdminProjects = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
          Projects Management
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">Moderate project partnerships</p>
      </div>

      <div className="card p-12 text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
          Coming Soon
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-6">
          Project management features are currently under development. The backend for projects will
          be implemented to enable full admin control over project partnerships.
        </p>
        <div className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-4 py-2 rounded-lg text-sm font-medium">
          ℹ️ Backend implementation in progress
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;
