import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 dark:from-purple-900 dark:via-purple-800 dark:to-purple-900 text-white shadow-lg sticky top-0 z-50 h-16">
      <div className="h-full flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-300 dark:to-purple-400 bg-clip-text text-transparent hover:from-purple-50 hover:to-purple-100 dark:hover:from-purple-200 dark:hover:to-purple-300 transition-all duration-300">
          CampusConnect
        </Link>
        <div className="flex gap-6 items-center">
          {user ? (
            <>
              <div className="border-l border-purple-400 dark:border-purple-500 pl-6">
                <span className="text-purple-100 dark:text-purple-200 text-sm">{user.name}</span>
              </div>
              <button
                onClick={toggleTheme}
                className="bg-purple-500 hover:bg-purple-400 dark:bg-purple-600 dark:hover:bg-purple-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md text-lg"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleTheme}
                className="bg-purple-500 hover:bg-purple-400 dark:bg-purple-600 dark:hover:bg-purple-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md text-lg"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <Link to="/login" className="text-purple-100 dark:text-purple-200 hover:text-white dark:hover:text-white font-medium transition-colors duration-200">
                Login
              </Link>
              <Link to="/signup" className="bg-purple-500 hover:bg-purple-400 dark:bg-purple-600 dark:hover:bg-purple-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
