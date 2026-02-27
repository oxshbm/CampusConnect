import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getIncomingConnections } from '../../api/connectionApi';

const AlumniDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await getIncomingConnections();
        if (response.success) {
          const pending = response.data.filter(c => c.status === 'pending').length;
          setPendingCount(pending);
        }
      } catch (error) {
        console.error('Failed to fetch connections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const profileComplete = user?.passingYear && user?.currentStatus && user?.bio;

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-emerald-50 dark:from-zinc-950 dark:to-zinc-900 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent mb-2">
            Welcome Back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">Alumni Portal Dashboard</p>
        </div>

        {/* Profile Completeness Alert */}
        {!profileComplete && (
          <div className="card p-4 mb-8 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20">
            <div className="flex items-start gap-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200 mb-2">Complete Your Profile</p>
                <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">Help students learn more about you by completing your profile.</p>
                <button
                  onClick={() => navigate('/alumni-portal/profile')}
                  className="text-sm font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200"
                >
                  Complete Profile →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Pending Connections Card */}
          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">Pending Requests</p>
                <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                  {loading ? '...' : pendingCount}
                </p>
              </div>
              <span className="text-5xl">👥</span>
            </div>
            <button
              onClick={() => navigate('/alumni-portal/connections')}
              className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold hover:underline mt-4"
            >
              View Connections →
            </button>
          </div>

          {/* Campus Events Card */}
          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">Campus Events</p>
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-2">📅</p>
              </div>
              <span className="text-5xl">📅</span>
            </div>
            <button
              onClick={() => navigate('/alumni-portal/events')}
              className="text-purple-600 dark:text-purple-400 text-sm font-semibold hover:underline mt-4"
            >
              See Events →
            </button>
          </div>

          {/* College Clubs Card */}
          <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">College Clubs</p>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">🏛️</p>
              </div>
              <span className="text-5xl">🏛️</span>
            </div>
            <button
              onClick={() => navigate('/alumni-portal/clubs')}
              className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline mt-4"
            >
              View Clubs →
            </button>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/alumni-portal/profile"
              className="p-4 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors"
            >
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">Edit Profile</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update your professional information</p>
            </a>
            <a
              href="/alumni-portal/connections"
              className="p-4 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors"
            >
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">Manage Connections</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Accept or reject connection requests</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
