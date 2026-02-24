import { useEffect, useState } from 'react';
import { getAllUsers, banUser, unbanUser, deleteUser } from '../../api/adminApi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      if (response.data.success) {
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Error fetching users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleBan = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to ban ${userName}?`)) return;

    try {
      setActionLoading(userId);
      const response = await banUser(userId);
      if (response.data.success) {
        fetchUsers();
        alert('User banned successfully');
      }
    } catch (err) {
      alert('Error banning user');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnban = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to unban ${userName}?`)) return;

    try {
      setActionLoading(userId);
      const response = await unbanUser(userId);
      if (response.data.success) {
        fetchUsers();
        alert('User unbanned successfully');
      }
    } catch (err) {
      alert('Error unbanning user');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to DELETE ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(userId);
      const response = await deleteUser(userId);
      if (response.data.success) {
        fetchUsers();
        alert('User deleted successfully');
      }
    } catch (err) {
      alert('Error deleting user');
      console.error(err);
    } finally {
      setActionLoading(null);
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
      <div>
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">Users Management</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Monitor and manage student accounts</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="card p-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="input-field w-full"
        />
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Groups
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {user.course}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {user.year}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {user.groupsJoinedCount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isBanned
                            ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                            : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
                        }`}
                      >
                        {user.isBanned ? '🚫 Banned' : '✅ Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {user.isBanned ? (
                          <button
                            onClick={() => handleUnban(user.id, user.name)}
                            disabled={actionLoading === user.id}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-medium transition-colors disabled:opacity-50"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBan(user.id, user.name)}
                            disabled={actionLoading === user.id}
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded font-medium transition-colors disabled:opacity-50"
                          >
                            Ban
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          disabled={actionLoading === user.id}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-medium transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
};

export default AdminUsers;
