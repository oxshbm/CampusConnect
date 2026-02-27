import { useEffect, useState } from 'react';
import { getAllAdminEvents, approveEvent, denyEvent, deleteAdminEvent } from '../../api/adminApi';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllAdminEvents();
      if (response.data.success) {
        setEvents(response.data.data);
        setFilteredEvents(response.data.data);
      } else {
        setError('Failed to fetch events');
      }
    } catch (err) {
      setError('Error fetching events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleApprove = async (eventId, eventTitle) => {
    if (!window.confirm(`Approve event "${eventTitle}"?`)) return;

    try {
      setActionLoading(eventId);
      const response = await approveEvent(eventId);
      if (response.data.success) {
        fetchEvents();
        alert('Event approved successfully');
      }
    } catch (err) {
      alert('Error approving event');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeny = async (eventId, eventTitle) => {
    if (!window.confirm(`Deny event "${eventTitle}"? This cannot be undone.`)) return;

    try {
      setActionLoading(eventId);
      const response = await denyEvent(eventId);
      if (response.data.success) {
        fetchEvents();
        alert('Event denied successfully');
      }
    } catch (err) {
      alert('Error denying event');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (eventId, eventTitle) => {
    if (!window.confirm(`Delete event "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(eventId);
      const response = await deleteAdminEvent(eventId);
      if (response.data.success) {
        fetchEvents();
        alert('Event deleted successfully');
      }
    } catch (err) {
      alert('Error deleting event');
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
        <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">Events Management</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Review and manage event submissions</p>
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
          placeholder="Search by event title..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="input-field w-full"
        />
      </div>

      {/* Events Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Creator
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Attendees
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No events found
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm font-medium text-zinc-900 dark:text-white">
                      {event.title}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="inline-block px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded text-xs">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {event.createdBy?.name || 'Unknown'}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      👥 {event.attendees?.length || 0}
                      {event.maxAttendees ? ` / ${event.maxAttendees}` : ''}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex gap-2 flex-wrap">
                        {event.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(event._id, event.title)}
                              disabled={actionLoading === event._id}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-medium transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDeny(event._id, event.title)}
                              disabled={actionLoading === event._id}
                              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded font-medium transition-colors disabled:opacity-50"
                            >
                              Deny
                            </button>
                          </>
                        )}
                        {event.status === 'approved' && (
                          <button
                            onClick={() => handleDeny(event._id, event.title)}
                            disabled={actionLoading === event._id}
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded font-medium transition-colors disabled:opacity-50"
                          >
                            Deny
                          </button>
                        )}
                        {event.status === 'denied' && (
                          <button
                            onClick={() => handleApprove(event._id, event.title)}
                            disabled={actionLoading === event._id}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-medium transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(event._id, event.title)}
                          disabled={actionLoading === event._id}
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
        Showing {filteredEvents.length} of {events.length} events
      </div>
    </div>
  );
};

export default AdminEvents;
