import { useEffect, useState } from 'react';
import { getAllGroups, deleteGroup } from '../../api/adminApi';

const AdminGroups = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await getAllGroups();
      if (response.data.success) {
        setGroups(response.data.data);
        setFilteredGroups(response.data.data);
      } else {
        setError('Failed to fetch groups');
      }
    } catch (err) {
      setError('Error fetching groups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = groups.filter(
      (group) =>
        group.name.toLowerCase().includes(query.toLowerCase()) ||
        group.subject.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  const handleDeleteGroup = async (groupId, groupName) => {
    if (!window.confirm(`Are you sure you want to DELETE "${groupName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(groupId);
      const response = await deleteGroup(groupId);
      if (response.data.success) {
        fetchGroups();
        alert('Group deleted successfully');
      }
    } catch (err) {
      alert('Error deleting group');
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
        <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
          Groups Management
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">Monitor and moderate study groups</p>
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
          placeholder="Search by group name or subject..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="input-field w-full"
        />
      </div>

      {/* Groups Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Group Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Creator
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Visibility
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {filteredGroups.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No groups found
                  </td>
                </tr>
              ) : (
                filteredGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm font-medium text-zinc-900 dark:text-white">
                      {group.name}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {group.subject}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">{group.createdBy.name}</p>
                        <p className="text-xs text-zinc-500">{group.createdBy.email}</p>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {group.membersCount} / {group.maxMembers}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          group.visibility === 'public'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                            : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
                        }`}
                      >
                        {group.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <button
                        onClick={() => handleDeleteGroup(group.id, group.name)}
                        disabled={actionLoading === group.id}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-medium transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Showing {filteredGroups.length} of {groups.length} groups
      </div>
    </div>
  );
};

export default AdminGroups;
