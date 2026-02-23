import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      console.log('Theme from localStorage:', saved);
      return saved === 'dark';
    }
    // Check system preference
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('System dark mode preference:', systemPreference);
    return systemPreference;
  });

  useEffect(() => {
    console.log('Setting dark mode to:', isDarkMode);
    // Update localStorage and DOM
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // Update HTML element class for Tailwind dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      console.log('Added dark class to html element');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Removed dark class from html element');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    console.log('Toggling theme from', isDarkMode, 'to', !isDarkMode);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
