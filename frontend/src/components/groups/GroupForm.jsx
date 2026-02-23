import { useState } from 'react';

const GroupForm = ({ initialData, onSubmit, loading }) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    subject: initialData?.subject || '',
    description: initialData?.description || '',
    semester: initialData?.semester || '',
    tags: initialData?.tags?.join(', ') || '',
    visibility: initialData?.visibility || 'public',
    maxMembers: initialData?.maxMembers || '30',
    meetingType: initialData?.meetingType || 'virtual',
    location: initialData?.location || '',
    scheduleDays: initialData?.scheduleDays || [],
    startTime: initialData?.startTime || '',
    duration: initialData?.duration || '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => {
        const days = prev.scheduleDays.includes(value)
          ? prev.scheduleDays.filter((d) => d !== value)
          : [...prev.scheduleDays, value];
        return { ...prev, scheduleDays: days };
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.subject) {
      setError('Name and subject are required');
      return;
    }

    if (formData.meetingType === 'in-person' && !formData.location) {
      setError('Location is required for in-person meetings');
      return;
    }

    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    onSubmit({
      ...formData,
      tags,
      maxMembers: parseInt(formData.maxMembers),
      scheduleDays: formData.scheduleDays,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="label">📝 Group Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Advanced Python Developers"
          required
          className="input-field"
        />
      </div>

      <div>
        <label className="label">📚 Subject</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="e.g., Data Structures"
          required
          className="input-field"
        />
      </div>

      <div>
        <label className="label">📖 Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength="500"
          placeholder="Describe your group, goals, and what members can expect..."
          className="input-field resize-none"
          rows="4"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{formData.description.length}/500 characters</p>
      </div>

      <div>
        <label className="label">🗓️ Semester</label>
        <input
          type="text"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          placeholder="e.g., Spring 2024"
          className="input-field"
        />
      </div>

      <div>
        <label className="label">🏷️ Tags (comma-separated)</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g., dsa, algorithms, cpp"
          className="input-field"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Separate tags with commas to help people find your group</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">🔐 Visibility</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="input-field"
          >
            <option value="public">🌐 Public (anyone can find)</option>
            <option value="private">🔒 Private (invite only)</option>
          </select>
        </div>

        <div>
          <label className="label">👥 Max Members</label>
          <input
            type="number"
            name="maxMembers"
            value={formData.maxMembers}
            onChange={handleChange}
            min="1"
            max="100"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="label">💻 Meeting Type</label>
        <div className="flex gap-6">
          <div className="flex items-center">
            <input
              type="radio"
              id="virtual"
              name="meetingType"
              value="virtual"
              checked={formData.meetingType === 'virtual'}
              onChange={handleChange}
              className="w-4 h-4 accent-purple-600 dark:accent-purple-400 cursor-pointer"
            />
            <label htmlFor="virtual" className="ml-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300">
              💻 Virtual
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="in-person"
              name="meetingType"
              value="in-person"
              checked={formData.meetingType === 'in-person'}
              onChange={handleChange}
              className="w-4 h-4 accent-purple-600 dark:accent-purple-400 cursor-pointer"
            />
            <label htmlFor="in-person" className="ml-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300">
              📍 In-Person
            </label>
          </div>
        </div>
      </div>

      {formData.meetingType === 'in-person' && (
        <div>
          <label className="label">📍 Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Building A, Room 101"
            className="input-field"
          />
        </div>
      )}

      <div>
        <label className="label">📅 Schedule (Days of Week)</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center">
              <input
                type="checkbox"
                id={day}
                name="scheduleDays"
                value={day}
                checked={formData.scheduleDays.includes(day)}
                onChange={handleChange}
                className="w-4 h-4 accent-purple-600 dark:accent-purple-400 cursor-pointer"
              />
              <label htmlFor={day} className="ml-2 cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {day.substring(0, 3)}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">⏰ Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="label">⏱️ Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 1 hour, 90 minutes"
            className="input-field"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? '🔄 Creating group...' : '✨ Create Group'}
      </button>
    </form>
  );
};

export default GroupForm;
