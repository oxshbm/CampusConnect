import { useEffect, useState } from 'react';
import { getAllAdmins, createAdmin } from '../../api/adminApi';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllAdmins();
      if (response.data.success) {
        setAdmins(response.data.data);
      } else {
        setError('Failed to fetch admins');
      }
    } catch (err) {
      setError('Error fetching admins');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitLoading(true);

    try {
      const response = await createAdmin(name, email, password);
      if (response.data.success) {
        setSuccessMsg(`Admin "${name}" created successfully!`);
        setName('');
        setEmail('');
        setPassword('');
        setShowModal(false);
        fetchAdmins();
      } else {
        setError(response.data.message || 'Failed to create admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating admin');
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin text-4xl">🔄</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section with add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">Admin Management</h1>
          <p className="text-zinc-600 dark:text-zinc-400">View and add administrative accounts for CampusConnect</p>
        </div>
        <button
          onClick={() => {
            setError('');
            setSuccessMsg('');
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
        >
          <span>🛡️</span> Add New Admin
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg flex items-start gap-3 shadow-sm animate-fade-in">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-300 rounded-lg flex items-start gap-3 shadow-sm animate-fade-in">
          <span>✅</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Admins Table */}
      <div className="card overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  Joined Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                    No administrator accounts found
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200/50 dark:border-red-900/30">
                        🛡️ {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(admin.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Total Administrators: <span className="font-semibold text-zinc-900 dark:text-white">{admins.length}</span>
      </div>

      {/* Modal for adding admins */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl animate-slide-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                🛡️ Add New Admin
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                ✖️
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@campusconnect.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-850 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-2.5 px-4 rounded-lg text-sm font-semibold text-zinc-750 hover:bg-zinc-100 dark:text-zinc-350 dark:hover:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="py-2.5 px-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-750 hover:to-red-800 text-white font-semibold text-sm rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitLoading ? '🔄 Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
