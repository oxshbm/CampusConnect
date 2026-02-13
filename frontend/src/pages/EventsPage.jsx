import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApprovedEvents, rsvpEvent, cancelRsvp } from '../api/eventApi';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [rsvpLoading, setRsvpLoading] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getApprovedEvents();
      if (response.data.success) {
        setEvents(response.data.data);
        applyFilters(response.data.data, 'all', 'all');
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

  const applyFilters = (eventList, category, location) => {
    let filtered = eventList;

    if (category !== 'all') {
      filtered = filtered.filter((e) => e.category === category);
    }
    if (location !== 'all') {
      filtered = filtered.filter((e) => e.locationType === location);
    }

    setFilteredEvents(filtered);
  };

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    applyFilters(events, cat, locationFilter);
  };

  const handleLocationChange = (loc) => {
    setLocationFilter(loc);
    applyFilters(events, categoryFilter, loc);
  };

  const handleRsvp = async (eventId) => {
    try {
      setRsvpLoading(eventId);
      const response = await rsvpEvent(eventId);
      if (response.data.success) {
        fetchEvents();
      }
    } catch (err) {
      alert('Error RSVPing to event');
      console.error(err);
    } finally {
      setRsvpLoading(null);
    }
  };

  const handleCancelRsvp = async (eventId) => {
    try {
      setRsvpLoading(eventId);
      const response = await cancelRsvp(eventId);
      if (response.data.success) {
        fetchEvents();
      }
    } catch (err) {
      alert('Error cancelling RSVP');
      console.error(err);
    } finally {
      setRsvpLoading(null);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Academic: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200',
      Cultural: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200',
      Sports: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200',
      Tech: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-200',
      Workshop: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200',
      Other: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200',
    };
    return colors[category] || 'bg-zinc-100 dark:bg-zinc-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent mb-3">
              Events Calendar
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Discover and attend campus events
            </p>
          </div>
          <Link to="/events/create" className="btn-primary bg-gradient-to-r from-purple-600 to-purple-700">
            ➕ Post Event
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="card p-8 mb-12 border-l-4 border-l-purple-600 dark:border-l-purple-500">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">🔍 Filter Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">📂 Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="input-field"
              >
                <option value="all">All Categories</option>
                <option value="Academic">Academic</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Tech">Tech</option>
                <option value="Workshop">Workshop</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">📍 Location Type</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="all"
                    checked={locationFilter === 'all'}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="accent-purple-600"
                  />
                  <span className="text-zinc-700 dark:text-zinc-300">All</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="virtual"
                    checked={locationFilter === 'virtual'}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="accent-purple-600"
                  />
                  <span className="text-zinc-700 dark:text-zinc-300">🌐 Virtual</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="in-person"
                    checked={locationFilter === 'in-person'}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="accent-purple-600"
                  />
                  <span className="text-zinc-700 dark:text-zinc-300">📍 In-Person</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 card">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium">No events found</p>
            <p className="text-zinc-500 dark:text-zinc-500 mt-2">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredEvents.map((event) => {
                const isAttending = user && event.attendees.some((a) => a._id === user.id);
                const isFull = event.maxAttendees && event.attendees.length >= event.maxAttendees;

                return (
                  <div key={event._id} className="card p-6 hover:shadow-lg transition-shadow">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                        🏷️ {event.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{event.title}</h3>

                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                      <span>⏰ {event.time}</span>
                    </div>

                    {/* Location */}
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                      {event.locationType === 'virtual' ? (
                        <div>🌐 Virtual {event.locationDetail && `- ${event.locationDetail}`}</div>
                      ) : (
                        <div>📍 {event.locationDetail || 'Location to be confirmed'}</div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Attendees */}
                    <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">
                      👥{' '}
                      {event.maxAttendees
                        ? `${event.attendees.length} / ${event.maxAttendees} attending`
                        : `${event.attendees.length} attending`}
                    </div>

                    {/* Creator */}
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      By: <span className="font-medium">{event.createdBy.name}</span>
                    </div>

                    {/* RSVP Button */}
                    {user && (
                      <button
                        onClick={() => (isAttending ? handleCancelRsvp(event._id) : handleRsvp(event._id))}
                        disabled={rsvpLoading === event._id || (isFull && !isAttending)}
                        className={`w-full py-2 rounded-lg font-medium text-sm transition-colors ${
                          isAttending
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                            : isFull
                              ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed'
                              : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800'
                        } disabled:opacity-50`}
                      >
                        {rsvpLoading === event._id
                          ? '🔄 Loading...'
                          : isFull && !isAttending
                            ? '❌ Event Full'
                            : isAttending
                              ? '✅ Attending'
                              : '📌 RSVP'}
                      </button>
                    )}
                    {!user && (
                      <Link
                        to="/login"
                        className="block w-full py-2 text-center rounded-lg font-medium text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                      >
                        Login to RSVP
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Showing <span className="font-bold text-purple-600 dark:text-purple-400">{filteredEvents.length}</span> of{' '}
              <span className="font-bold text-purple-600 dark:text-purple-400">{events.length}</span> events
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
