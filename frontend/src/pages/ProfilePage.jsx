import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateMe } from '../api/authApi';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    course: user?.course || '',
    year: user?.year || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await updateMe(formData.name, formData.course, parseInt(formData.year));
      if (response.success) {
        setMessage('Profile updated successfully ✓');
        setIsEditing(false);
      }
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
            👤 My Profile
          </h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
            message.includes('successfully')
              ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200'
          }`}>
            <span className="text-lg">{message.includes('successfully') ? '✓' : '⚠️'}</span>
            <span>{message}</span>
          </div>
        )}

        {!isEditing ? (
          <div className="card p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">Name</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">Email</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">Course</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{user?.course}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">Year</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{user?.year}</p>
              </div>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">Groups Joined</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">{user?.groupsJoined?.length || 0}</span>
                <span className="text-lg">📚</span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Course</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Year of Study</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                  <option value="6">6th Year</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? '🔄 Saving...' : '💾 Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
