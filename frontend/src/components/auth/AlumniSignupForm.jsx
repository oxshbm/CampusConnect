import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupAlumni } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';

const AlumniSignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passingYear: '',
    currentStatus: '',
    currentCompany: '',
    jobTitle: '',
    location: '',
    linkedIn: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await signupAlumni({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passingYear: parseInt(formData.passingYear),
        currentStatus: formData.currentStatus,
        currentCompany: formData.currentCompany || undefined,
        jobTitle: formData.jobTitle || undefined,
        location: formData.location || undefined,
        linkedIn: formData.linkedIn || undefined,
        bio: formData.bio || undefined,
      });
      if (response.success) {
        // User is now logged in directly, no OTP verification needed
        login(response.data.token, response.data.user);
        navigate('/alumni-portal');
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignupSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Basic Information */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Basic Information</h3>

        <div>
          <label className="label">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="input-field"
          />
        </div>

        <div className="mt-3">
          <label className="label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            className="input-field"
          />
        </div>

        <div className="mt-3">
          <label className="label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="input-field"
          />
        </div>
      </div>

      {/* Alumni Information */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Alumni Information</h3>

        <div>
          <label className="label">Passing Year <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="passingYear"
            value={formData.passingYear}
            onChange={handleChange}
            placeholder="e.g., 2020"
            min="1990"
            max={new Date().getFullYear()}
            required
            className="input-field"
          />
        </div>

        <div className="mt-3">
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

        {/* Show company/job fields if employed or self-employed */}
        {(formData.currentStatus === 'employed' || formData.currentStatus === 'self-employed') && (
          <>
            <div className="mt-3">
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

            <div className="mt-3">
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

      {/* Optional Information */}
      <div>
        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Optional Information</h3>

        <div>
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

        <div className="mt-3">
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

        <div className="mt-3">
          <label className="label">Bio <span className="text-sm text-gray-500 dark:text-gray-400">(max 500 characters)</span></label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            maxLength="500"
            rows="3"
            className="input-field resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formData.bio.length}/500</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? '🔄 Creating account...' : '🎓 Register as Alumni'}
      </button>
    </form>
  );
};

export default AlumniSignupForm;
