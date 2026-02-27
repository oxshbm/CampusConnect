import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateAlumniProfile } from '../../api/alumniApi';

const AlumniProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    passingYear: user?.passingYear || '',
    currentStatus: user?.currentStatus || '',
    currentCompany: user?.currentCompany || '',
    jobTitle: user?.jobTitle || '',
    location: user?.location || '',
    linkedIn: user?.linkedIn || '',
    bio: user?.bio || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        passingYear: user.passingYear || '',
        currentStatus: user.currentStatus || '',
        currentCompany: user.currentCompany || '',
        jobTitle: user.jobTitle || '',
        location: user.location || '',
        linkedIn: user.linkedIn || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await updateAlumniProfile({
        passingYear: parseInt(formData.passingYear),
        currentStatus: formData.currentStatus,
        currentCompany: formData.currentCompany || undefined,
        jobTitle: formData.jobTitle || undefined,
        location: formData.location || undefined,
        linkedIn: formData.linkedIn || undefined,
        bio: formData.bio || undefined,
      });

      if (response.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-zinc-50 to-emerald-50 dark:from-zinc-950 dark:to-zinc-900 min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Your Profile</h1>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200 rounded-lg mb-6">
            ✓ {success}
          </div>
        )}

        <div className="card p-4 md:p-8">
          {!isEditing ? (
            // View Mode
            <div>
              {/* Basic Info */}
              <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-700">
                <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Full Name</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Email</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Alumni Info */}
              <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-700">
                <h2 className="text-2xl font-bold mb-4">Alumni Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Passing Year</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.passingYear || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Current Status</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {user?.currentStatus ? user.currentStatus.replace('-', ' ') : 'Not set'}
                    </p>
                  </div>
                  {user?.currentCompany && (
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Company</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.currentCompany}</p>
                    </div>
                  )}
                  {user?.jobTitle && (
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Job Title</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.jobTitle}</p>
                    </div>
                  )}
                  {user?.location && (
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Location</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.location}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              {(user?.linkedIn || user?.bio) && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
                  {user?.linkedIn && (
                    <div className="mb-4">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">LinkedIn Profile</p>
                      <a
                        href={user.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        View on LinkedIn
                      </a>
                    </div>
                  )}
                  {user?.bio && (
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Bio</p>
                      <p className="text-gray-900 dark:text-white">{user.bio}</p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit}>
              <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-700">
                <h2 className="text-2xl font-bold mb-4">Alumni Information</h2>

                <div className="mb-4">
                  <label className="label">Passing Year <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="passingYear"
                    value={formData.passingYear}
                    onChange={handleChange}
                    min="1990"
                    max={new Date().getFullYear()}
                    required
                    className="input-field"
                  />
                </div>

                <div className="mb-4">
                  <label className="label">Current Status <span className="text-red-500">*</span></label>
                  <select
                    name="currentStatus"
                    value={formData.currentStatus}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select Status</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="masters">Pursuing Masters</option>
                    <option value="phd">Pursuing PhD</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {(formData.currentStatus === 'employed' || formData.currentStatus === 'self-employed') && (
                  <>
                    <div className="mb-4">
                      <label className="label">Company Name</label>
                      <input
                        type="text"
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleChange}
                        placeholder="e.g., Google, Microsoft"
                        className="input-field"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="label">Job Title</label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="e.g., Software Engineer"
                        className="input-field"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-700">
                <h2 className="text-2xl font-bold mb-4">Additional Information</h2>

                <div className="mb-4">
                  <label className="label">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., San Francisco, USA"
                    className="input-field"
                  />
                </div>

                <div className="mb-4">
                  <label className="label">LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/johndoe"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Bio <span className="text-sm text-gray-500 dark:text-gray-400">(max 500 characters)</span></label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    maxLength="500"
                    rows="4"
                    className="input-field resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formData.bio.length}/500</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      passingYear: user?.passingYear || '',
                      currentStatus: user?.currentStatus || '',
                      currentCompany: user?.currentCompany || '',
                      jobTitle: user?.jobTitle || '',
                      location: user?.location || '',
                      linkedIn: user?.linkedIn || '',
                      bio: user?.bio || '',
                    });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniProfilePage;
