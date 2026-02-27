import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../api/eventApi';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic',
    date: '',
    time: '',
    locationType: 'virtual',
    locationDetail: '',
    agenda: '',
    maxAttendees: '',
    contactInfo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!formData.title.trim()) {
      setError('Event title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Event description is required');
      return;
    }

    if (!formData.date) {
      setError('Event date is required');
      return;
    }

    if (!formData.time) {
      setError('Event time is required');
      return;
    }

    if (formData.locationType === 'in-person' && !formData.locationDetail.trim()) {
      setError('Location is required for in-person events');
      return;
    }

    if (formData.locationType === 'virtual' && !formData.locationDetail.trim()) {
      setError('Meeting link or details are required for virtual events');
      return;
    }

    // Check if date is in the future
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError('Event date must be in the future');
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        ...formData,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
      };

      await createEvent(submitData);

      setSuccessMessage('✅ Event created successfully! Your event is pending admin approval and will appear on the calendar once approved.');

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Academic',
        date: '',
        time: '',
        locationType: 'virtual',
        locationDetail: '',
        agenda: '',
        maxAttendees: '',
        contactInfo: '',
      });

      // Redirect to events page after 2 seconds
      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
      console.error('Error creating event:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 py-6 md:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
            📅 Create New Event
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Share your event with the campus community
          </p>
        </div>

        <div className="card p-4 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg flex items-start gap-3">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200 rounded-lg flex items-start gap-3">
                <span className="text-lg">✅</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="label">📋 Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Introduction to AI Workshop"
                className="input-field"
                maxLength="200"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {formData.title.length}/200 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="label">📝 Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event in detail..."
                maxLength="1000"
                className="input-field resize-none"
                rows="4"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="label">🏷️ Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Academic">Academic</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Tech">Tech</option>
                <option value="Workshop">Workshop</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">📅 Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">⏰ Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* Location Type */}
            <div>
              <label className="label">📍 Location Type</label>
              <div className="flex gap-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="virtual"
                    name="locationType"
                    value="virtual"
                    checked={formData.locationType === 'virtual'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-purple-600 dark:accent-purple-400 cursor-pointer"
                  />
                  <label htmlFor="virtual" className="ml-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300">
                    🌐 Virtual
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="in-person"
                    name="locationType"
                    value="in-person"
                    checked={formData.locationType === 'in-person'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-purple-600 dark:accent-purple-400 cursor-pointer"
                  />
                  <label htmlFor="in-person" className="ml-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300">
                    📍 In-Person
                  </label>
                </div>
              </div>
            </div>

            {/* Location Detail */}
            <div>
              <label className="label">
                {formData.locationType === 'virtual' ? '🔗 Meeting Link / Details' : '📍 Location Address'}
              </label>
              <input
                type="text"
                name="locationDetail"
                value={formData.locationDetail}
                onChange={handleChange}
                placeholder={
                  formData.locationType === 'virtual'
                    ? 'e.g., https://zoom.us/j/... or Google Meet link'
                    : 'e.g., Building A, Room 101'
                }
                className="input-field"
              />
            </div>

            {/* Agenda */}
            <div>
              <label className="label">📋 Agenda (Optional)</label>
              <textarea
                name="agenda"
                value={formData.agenda}
                onChange={handleChange}
                placeholder="Outline the agenda for your event..."
                maxLength="2000"
                className="input-field resize-none"
                rows="3"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {formData.agenda.length}/2000 characters
              </p>
            </div>

            {/* Max Attendees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">👥 Max Attendees (Optional)</label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  placeholder="Leave blank for unlimited"
                  min="1"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">📞 Contact Info (Optional)</label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  placeholder="e.g., email@example.com or +1234567890"
                  className="input-field"
                />
              </div>
            </div>

            {/* Info Message */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-200 rounded-lg flex items-start gap-3">
              <span className="text-lg">ℹ️</span>
              <span>Your event will be pending admin approval before it appears on the Events Calendar</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? '🔄 Creating event...' : '✨ Post Event'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
