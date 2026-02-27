import { useEffect, useState } from 'react';
import { getApprovedEvents } from '../../api/eventApi';
import Spinner from '../../components/common/Spinner';

const AlumniEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getApprovedEvents();
      if (response.data.success) {
        setEvents(response.data.data);
        applyFilters(response.data.data, 'all');
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

  const applyFilters = (eventList, category) => {
    let filtered = eventList;
    if (category !== 'all') {
      filtered = filtered.filter((e) => e.category === category);
    }
    setFilteredEvents(filtered);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategoryFilter(newCategory);
    applyFilters(events, newCategory);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Academic: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      Cultural: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      Sports: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
      Tech: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      Workshop: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200',
      Other: 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200',
    };
    return colors[category] || colors.Other;
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 min-h-screen py-6 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent mb-2">
          Campus Events
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">Stay connected with campus activities</p>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Filter Card */}
        <div className="card p-4 md:p-8 mb-12 border-l-4 border-l-purple-600">
          <label className="label">Filter by Category</label>
          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
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

        {/* Events List */}
        <div className="space-y-6">
          {filteredEvents.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">No events found</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event._id} className="card p-6 hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        📅 {new Date(event.date).toLocaleDateString()} at {event.time}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>

                    <p className="text-zinc-700 dark:text-zinc-300 mb-4 line-clamp-2">{event.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      <span>
                        {event.locationType === 'virtual' ? '💻 Virtual' : '📍 ' + event.locationDetail}
                      </span>
                      <span>👥 {event.attendees?.length || 0} attending</span>
                      {event.maxAttendees && <span>Capacity: {event.maxAttendees}</span>}
                    </div>

                    {event.contactInfo && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">📧 {event.contactInfo}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>
    </div>
  );
};

export default AlumniEventsPage;
