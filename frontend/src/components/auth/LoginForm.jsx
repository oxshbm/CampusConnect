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

    // Testing bypass: admin mode skips all auth
    if (loginAs === 'admin') {
      navigate('/admin');
      return;
    }

    // Normal student login flow
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      if (response.success) {
        authLogin(response.data.token, response.data.user);
        navigate('/');
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
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Login Mode Toggle */}
      <div className="flex rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 mb-6">
        <button
          type="button"
          onClick={() => setLoginAs('student')}
          className={`flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            loginAs === 'student'
              ? 'bg-purple-600 text-white'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          🎓 Student
        </button>
        <button
          type="button"
          onClick={() => setLoginAs('admin')}
          className={`flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            loginAs === 'admin'
              ? 'bg-zinc-900 dark:bg-zinc-950 text-white'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          🛡️ Admin
        </button>
      </div>

      <div>
        <label className="label">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required={loginAs === 'student'}
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
          required={loginAs === 'student'}
          className="input-field"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-md disabled:opacity-50 ${
          loginAs === 'admin'
            ? 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-white'
            : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 dark:from-purple-700 dark:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700'
        }`}
      >
        {loading
          ? '🔄 Logging in...'
          : loginAs === 'admin'
            ? '🛡️ Login as Admin'
            : '✨ Login as Student'}
      </button>
    </form>
  );
};

export default LoginForm;
