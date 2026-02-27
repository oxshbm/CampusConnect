import { useEffect, useState } from 'react';
import { getIncomingConnections, acceptConnection, rejectConnection } from '../../api/connectionApi';
import Spinner from '../../components/common/Spinner';

const AlumniConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await getIncomingConnections();
      if (response.success) {
        setConnections(response.data);
      } else {
        setError('Failed to fetch connections');
      }
    } catch (err) {
      setError('Error fetching connections');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId) => {
    setActionLoading(connectionId);
    try {
      const response = await acceptConnection(connectionId);
      if (response.success) {
        setConnections(connections.map(c =>
          c._id === connectionId ? { ...c, status: 'accepted' } : c
        ));
      } else {
        setError('Failed to accept connection');
      }
    } catch (err) {
      setError('Error accepting connection');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (connectionId) => {
    setActionLoading(connectionId);
    try {
      const response = await rejectConnection(connectionId);
      if (response.success) {
        setConnections(connections.map(c =>
          c._id === connectionId ? { ...c, status: 'rejected' } : c
        ));
      } else {
        setError('Failed to reject connection');
      }
    } catch (err) {
      setError('Error rejecting connection');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredConnections = connections.filter(c => {
    if (activeTab === 'pending') return c.status === 'pending';
    if (activeTab === 'accepted') return c.status === 'accepted';
    if (activeTab === 'rejected') return c.status === 'rejected';
    return true;
  });

  const pendingCount = connections.filter(c => c.status === 'pending').length;
  const acceptedCount = connections.filter(c => c.status === 'accepted').length;
  const rejectedCount = connections.filter(c => c.status === 'rejected').length;

  if (loading) return <Spinner />;

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-emerald-50 dark:from-zinc-950 dark:to-zinc-900 min-h-screen py-6 md:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent mb-2">
          Student Connections
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">Manage connection requests from students</p>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="card mb-8 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex gap-1 p-1">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                activeTab === 'pending'
                  ? 'bg-emerald-600 text-white'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('accepted')}
              className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                activeTab === 'accepted'
                  ? 'bg-green-600 text-white'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Accepted ({acceptedCount})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                activeTab === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Connections List */}
        <div className="space-y-4">
          {filteredConnections.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                {activeTab === 'pending' && 'No pending connection requests'}
                {activeTab === 'accepted' && 'No accepted connections yet'}
                {activeTab === 'rejected' && 'No rejected connections'}
              </p>
            </div>
          ) : (
            filteredConnections.map((connection) => (
              <div key={connection._id} className="card p-6 border-l-4 border-l-emerald-500">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {connection.student?.name}
                    </h3>

                    <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                      <p>📧 {connection.student?.email}</p>
                      <p>📚 {connection.student?.course} - Year {connection.student?.year}</p>
                    </div>

                    {connection.message && (
                      <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg mb-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Message:</p>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{connection.message}</p>
                      </div>
                    )}

                    <div className="text-xs text-zinc-500 dark:text-zinc-500">
                      Sent {new Date(connection.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {connection.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(connection._id)}
                        disabled={actionLoading === connection._id}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                      >
                        {actionLoading === connection._id ? '...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleReject(connection._id)}
                        disabled={actionLoading === connection._id}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                      >
                        {actionLoading === connection._id ? '...' : 'Reject'}
                      </button>
                    </div>
                  )}

                  {connection.status === 'accepted' && (
                    <div className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold rounded-lg">
                      ✓ Accepted
                    </div>
                  )}

                  {connection.status === 'rejected' && (
                    <div className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 font-semibold rounded-lg">
                      ✗ Rejected
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniConnectionsPage;
