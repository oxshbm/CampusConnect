import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProfileDropdown = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleViewProfile = () => {
    navigate('/profile');
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900
                 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700
                 z-[60] overflow-hidden"
    >
      {/* Header: avatar + name + email */}
      <div className="p-5 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center
                          text-white font-bold text-2xl flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">{user.name}</p>
            <p className="text-purple-200 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="p-4 space-y-3 border-b border-zinc-100 dark:border-zinc-700">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">📚 Course</span>
          <span className="font-medium text-zinc-900 dark:text-white">{user.course || 'Not set'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">🎓 Year</span>
          <span className="font-medium text-zinc-900 dark:text-white">{user.year || 'Not set'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">👥 Groups</span>
          <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300
                           text-xs font-bold px-2 py-1 rounded-full">
            {user.groupsJoined?.length || 0} joined
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2">
        <button onClick={handleViewProfile} className="btn-primary w-full text-sm py-2">
          👤 View Profile
        </button>
        <button onClick={handleLogout} className="btn-secondary w-full text-sm py-2">
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
