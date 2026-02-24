import { useEffect, useState } from 'react';
import { getAdminStats } from '../../api/adminApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminStats();
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          setError('Failed to fetch stats');
        }
      } catch (err) {
        setError('Error fetching stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin">🔄</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">Platform overview and statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users Card */}
        <div className="card p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-1">
                Total Users
              </p>
              <p className="text-5xl font-bold text-purple-600 dark:text-purple-400">
                {stats?.totalUsers || 0}
              </p>
            </div>
            <div className="text-5xl opacity-20">👥</div>
          </div>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-4">
            Registered students on platform
          </p>
        </div>

        {/* Groups Card */}
        <div className="card p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-1">
                Study Groups
              </p>
              <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                {stats?.totalGroups || 0}
              </p>
            </div>
            <div className="text-5xl opacity-20">📚</div>
          </div>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-4">Active study groups</p>
        </div>

        {/* Banned Users Card */}
        <div className="card p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-1">
                Banned Users
              </p>
              <p className="text-5xl font-bold text-red-600 dark:text-red-400">
                {stats?.bannedUsers || 0}
              </p>
            </div>
            <div className="text-5xl opacity-20">🚫</div>
          </div>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-4">Suspended accounts</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/users"
            className="p-4 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-950 rounded-lg hover:shadow-md transition-shadow border border-purple-200 dark:border-purple-700"
          >
            <p className="font-semibold text-purple-900 dark:text-purple-100">👥 Manage Users</p>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
              View, ban, or delete user accounts
            </p>
          </a>
          <a
            href="/admin/groups"
            className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-950 rounded-lg hover:shadow-md transition-shadow border border-blue-200 dark:border-blue-700"
          >
            <p className="font-semibold text-blue-900 dark:text-blue-100">📚 Manage Groups</p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Delete inappropriate study groups
            </p>
          </a>
          <a
            href="/admin/projects"
            className="p-4 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-950 rounded-lg hover:shadow-md transition-shadow border border-green-200 dark:border-green-700"
          >
            <p className="font-semibold text-green-900 dark:text-green-100">🚀 Manage Projects</p>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Moderate project partnerships
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
