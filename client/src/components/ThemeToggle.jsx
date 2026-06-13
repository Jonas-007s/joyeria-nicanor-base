import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:focus:ring-white"
      aria-label="Toggle theme"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-900 transition-transform ${
          isDark ? 'translate-x-6' : 'translate-x-1'
        }`}
      >
        <span className="flex items-center justify-center h-full w-full text-xs">
          {isDark ? '🌙' : '☀️'}
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;