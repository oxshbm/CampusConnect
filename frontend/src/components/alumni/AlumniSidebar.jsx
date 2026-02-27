import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AlumniSidebar = ({ mobileOpen = false, onCloseMobile = () => {} }) => {
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem('alumniSidebarOpen') !== 'false';
  });
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(prev => {
      localStorage.setItem('alumniSidebarOpen', !prev);
      return !prev;
    });
  };

  const sidebarItems = [
    { label: 'My Profile', icon: '🎓', path: '/alumni-portal/profile', active: true },
    { label: 'Campus Events', icon: '📅', path: '/alumni-portal/events', active: true },
    { label: 'College Clubs', icon: '🏛️', path: '/alumni-portal/clubs', active: true },
    { label: 'Student Connections', icon: '👥', path: '/alumni-portal/connections', active: true },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-white dark:bg-zinc-900
          border-r border-zinc-200 dark:border-zinc-800
          flex flex-col
          transition-all duration-300
          hidden md:flex
          ${isOpen ? 'w-64' : 'w-16'}
          h-screen
          sticky left-0 top-16
          md:relative md:top-0
          ${mobileOpen ? 'fixed left-0 top-16 z-50 h-[calc(100vh-4rem)]' : ''}
        `}
      >
      {/* Sidebar items container */}
      <nav className="flex-1 py-6 px-0">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={onCloseMobile}
                className={`
                  flex items-center gap-4 px-4 py-3 mx-2
                  rounded-lg transition-all duration-200
                  ${
                    isActive(item.path)
                      ? 'bg-emerald-600 dark:bg-emerald-700 text-white font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                  }
                `}
                title={item.label}
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Toggle button at bottom */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 p-2">
        <button
          onClick={toggleSidebar}
          className={`
            w-full flex items-center justify-center py-3
            text-zinc-700 dark:text-zinc-300
            hover:bg-emerald-50 dark:hover:bg-emerald-900/30
            rounded-lg transition-colors duration-200
          `}
          title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          <span className="text-lg">
            {isOpen ? '◀' : '▶'}
          </span>
        </button>
      </div>
      </div>
    </>
  );
};

export default AlumniSidebar;
