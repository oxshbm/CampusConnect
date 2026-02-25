import { useEffect, useState } from 'react';
import {
  getAllAdminClubs,
  approveClub,
  denyClub,
  deleteAdminClub,
} from '../../api/adminApi';

export default function AdminClubs() {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await getAllAdminClubs();
      if (response.data.success) {
        setClubs(response.data.data);
        setFilteredClubs(response.data.data);
      } else {
        setError('Failed to fetch clubs');
      }
    } catch (err) {
      setError('Error fetching clubs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = clubs.filter((club) =>
      club.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredClubs(filtered);
  };

  const handleApprove = async (clubId, clubName) => {
    if (!window.confirm(`Approve club "${clubName}"?`)) return;

    try {
      setActionLoading(clubId);
      const response = await approveClub(clubId);
      if (response.data.success) {
        fetchClubs();
        alert('Club approved successfully');
      }
    } catch (err) {
      alert('Error approving club');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeny = async (clubId, clubName) => {
    if (!window.confirm(`Deny club "${clubName}"? This cannot be undone.`)) return;

    try {
      setActionLoading(clubId);
      const response = await denyClub(clubId);
      if (response.data.success) {
        fetchClubs();
        alert('Club denied successfully');
      }
    } catch (err) {
      alert('Error denying club');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (clubId, clubName) => {
    if (!window.confirm(`Delete club "${clubName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(clubId);
      const response = await deleteAdminClub(clubId);
      if (response.data.success) {
        fetchClubs();
        alert('Club deleted successfully');
      }
    } catch (err) {
      alert('Error deleting club');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200">
            ⏳ Pending
          </span>
        );
      case 'approved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200">
            ✅ Approved
          </span>
        );
      case 'denied':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200">
            ❌ Denied
          </span>
        );
      default:
        return null;
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
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
          Clubs Management
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">Review and manage club submissions</p>
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
          placeholder="Search by club name..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="input-field w-full"
        />
      </div>

      {/* Clubs Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Leader
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Team Size
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Members
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
              {filteredClubs.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400"
                  >
                    No clubs found
                  </td>
                </tr>
              ) : (
                filteredClubs.map((club) => (
                  <tr
                    key={club._id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                      {club.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="inline-block px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded text-xs">
                        {club.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {club.createdBy?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {club.teamSize}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      👥 {club.members?.length || 0}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(club.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {club.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(club._id, club.name)}
                              disabled={actionLoading === club._id}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-medium transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDeny(club._id, club.name)}
                              disabled={actionLoading === club._id}
                              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded font-medium transition-colors disabled:opacity-50"
                            >
                              Deny
                            </button>
                          </>
                        )}
                        {club.status === 'approved' && (
                          <button
                            onClick={() => handleDeny(club._id, club.name)}
                            disabled={actionLoading === club._id}
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded font-medium transition-colors disabled:opacity-50"
                          >
                            Deny
                          </button>
                        )}
                        {club.status === 'denied' && (
                          <button
                            onClick={() => handleApprove(club._id, club.name)}
                            disabled={actionLoading === club._id}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-medium transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(club._id, club.name)}
                          disabled={actionLoading === club._id}
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
        Showing {filteredClubs.length} of {clubs.length} clubs
      </div>
    </div>
  );
}
