import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Admin Navbar */}
      <nav className="bg-zinc-900 dark:bg-zinc-950 text-white shadow-lg sticky top-0 z-50 h-16">
        <div className="h-full flex justify-between items-center px-6 py-4">
          <Link
            to="/admin"
            className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent hover:from-red-300 hover:to-red-400 transition-all duration-300"
          >
            🛡️ CampusConnect Admin
          </Link>
          <div className="flex gap-4 items-center">
            <button
              onClick={toggleTheme}
              className="bg-zinc-700 hover:bg-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md text-lg"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <div className="flex items-center gap-3 border-l border-zinc-700 pl-4">
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium text-zinc-200">{user?.name}</span>
                <span className="text-xs text-zinc-400">Administrator</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Tab Navigation */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-0">
          <div className="flex gap-8">
            <Link
              to="/admin"
              className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                isActive('/admin') && location.pathname === '/admin'
                  ? 'border-red-600 text-red-600 dark:text-red-500'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/admin/users"
              className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                isActive('/admin/users')
                  ? 'border-red-600 text-red-600 dark:text-red-500'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              👥 Users
            </Link>
            <Link
              to="/admin/groups"
              className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                isActive('/admin/groups')
                  ? 'border-red-600 text-red-600 dark:text-red-500'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              📚 Groups
            </Link>
            <Link
              to="/admin/projects"
              className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                isActive('/admin/projects')
                  ? 'border-red-600 text-red-600 dark:text-red-500'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              🚀 Projects
            </Link>
            <Link
              to="/admin/events"
              className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                isActive('/admin/events')
                  ? 'border-red-600 text-red-600 dark:text-red-500'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              📅 Events
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
