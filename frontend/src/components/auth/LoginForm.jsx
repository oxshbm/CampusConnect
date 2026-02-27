import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAs, setLoginAs] = useState('student');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      if (response.success) {
        // Check if selected mode matches actual role
        if (loginAs === 'admin' && response.data.user.role !== 'admin') {
          setError('This account does not have admin privileges');
          setLoading(false);
          return;
        }
        if (loginAs === 'alumni' && response.data.user.role !== 'alumni') {
          setError('This account does not have alumni privileges');
          setLoading(false);
          return;
        }

        authLogin(response.data.token, response.data.user);
        // Role-based redirect
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else if (response.data.user.role === 'alumni') {
          navigate('/alumni-portal');
        } else {
          navigate('/');
        }
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Student/Alumni/Admin Toggle */}
      <div className="flex gap-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
        <button
          type="button"
          onClick={() => setLoginAs('student')}
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
            loginAs === 'student'
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          👤 Student
        </button>
        <button
          type="button"
          onClick={() => setLoginAs('alumni')}
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
            loginAs === 'alumni'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          🎓 Alumni
        </button>
        <button
          type="button"
          onClick={() => setLoginAs('admin')}
          className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
            loginAs === 'admin'
              ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          🔐 Admin
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="label">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="input-field"
        />
      </div>

      <div>
        <label className="label">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="input-field"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-md disabled:opacity-50 text-white ${
          loginAs === 'admin'
            ? 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 dark:from-slate-800 dark:to-slate-900'
            : loginAs === 'alumni'
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-700 dark:to-emerald-800'
            : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-purple-700 dark:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700'
        }`}
      >
        {loading ? '🔄 Logging in...' : loginAs === 'admin' ? '🔐 Login as Admin' : loginAs === 'alumni' ? '🎓 Login as Alumni' : '✨ Login as Student'}
      </button>
    </form>
  );
};

export default LoginForm;
