import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem('sidebarOpen') !== 'false';
  });
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(prev => {
      localStorage.setItem('sidebarOpen', !prev);
      return !prev;
    });
  };

  const sidebarItems = [
    { label: 'Study Groups', icon: '📚', path: '/', active: true },
    { label: 'Project Partner', icon: '🚀', path: '/projects', active: true },
    { label: 'Events Calendar', icon: '📅', path: '/events', active: true },
    { label: 'College Clubs', icon: '🏛️', path: '/clubs', active: true },
    { label: 'Feature 3', icon: '📊', path: '/feature3', active: false },
    { label: 'Feature 4', icon: '⚡', path: '/feature4', active: false },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={`
        bg-white dark:bg-zinc-900
        border-r border-zinc-200 dark:border-zinc-800
        flex flex-col
        transition-all duration-300
        ${isOpen ? 'w-64' : 'w-16'}
        min-h-screen
        sticky left-0 top-16
      `}
    >
      {/* Sidebar items container */}
      <nav className="flex-1 py-6 px-0">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              {item.active ? (
                // Active feature - clickable
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-4 px-4 py-3 mx-2
                    rounded-lg transition-all duration-200
                    ${
                      isActive(item.path)
                        ? 'bg-purple-600 dark:bg-purple-700 text-white font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                    }
                  `}
                  title={item.label}
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
                </Link>
              ) : (
                // Inactive feature - greyed out, non-clickable
                <div
                  className={`
                    flex items-center gap-4 px-4 py-3 mx-2
                    rounded-lg cursor-not-allowed opacity-50
                    text-zinc-500 dark:text-zinc-500
                  `}
                  title={`${item.label} - Coming Soon`}
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  {isOpen && (
                    <span className="whitespace-nowrap text-sm italic">
                      {item.label}
                    </span>
                  )}
                </div>
              )}
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
            hover:bg-purple-50 dark:hover:bg-purple-900/30
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
  );
};

export default Sidebar;
