import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    course: '',
    year: '',
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
      const response = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.course,
        parseInt(formData.year)
      );
      if (response.success) {
        // User is now logged in directly, no OTP verification needed
        login(response.data.token, response.data.user);
        navigate('/');
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

      <div>
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

      <div>
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

      <div>
        <label className="label">Course</label>
        <input
          type="text"
          name="course"
          value={formData.course}
          onChange={handleChange}
          placeholder="e.g., Computer Science"
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
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
          <option value="5">5th Year</option>
          <option value="6">6th Year</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? '🔄 Creating account...' : '✨ Sign Up'}
      </button>
    </form>
  );
};

export default SignupForm;
