import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 dark:from-purple-900 dark:via-purple-800 dark:to-purple-900 text-white shadow-lg sticky top-0 z-50 h-16">
      <div className="h-full flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-300 dark:to-purple-400 bg-clip-text text-transparent hover:from-purple-50 hover:to-purple-100 dark:hover:from-purple-200 dark:hover:to-purple-300 transition-all duration-300">
          CampusConnect
        </Link>
        <div className="flex gap-6 items-center">
          {user ? (
            <>
              <button
                onClick={toggleTheme}
                className="bg-purple-500 hover:bg-purple-400 dark:bg-purple-600 dark:hover:bg-purple-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md text-lg"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>

              {/* Profile button */}
              <div className="relative border-l border-purple-400 dark:border-purple-500 pl-6">
                <button
                  onClick={() => setShowProfile(prev => !prev)}
                  className="flex items-center gap-2 text-white hover:text-purple-200 transition-colors"
                >
                  {/* Avatar circle */}
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center
                                  font-bold text-sm text-white flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Name */}
                  <span className="text-sm font-medium text-purple-100">{user.name}</span>
                  {/* Chevron ▼ rotates when open */}
                  <span className={`text-xs text-purple-300 transition-transform duration-200
                                    ${showProfile ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {showProfile && (
                  <ProfileDropdown onClose={() => setShowProfile(false)} />
                )}
              </div>
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
