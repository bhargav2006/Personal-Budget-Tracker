import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="theme-btn relative flex items-center justify-center w-8 h-8 rounded-lg bg-surface hover:bg-surface-sunken text-textSecondary hover:text-textPrimary border border-border transition-all duration-150 active:scale-95 shadow-sm group focus-visible:ring-1 focus-visible:ring-focus shrink-0"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      data-current-theme={theme}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <Sun
          className={`w-3.5 h-3.5 text-tertiary absolute transition-all duration-200 transform ${
            isDark
              ? 'translate-y-0 rotate-0 opacity-100 scale-100'
              : 'translate-y-4 -rotate-90 opacity-0 scale-50'
          }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`w-3.5 h-3.5 text-secondary absolute transition-all duration-200 transform ${
            !isDark
              ? 'translate-y-0 rotate-0 opacity-100 scale-100'
              : '-translate-y-4 rotate-90 opacity-0 scale-50'
          }`}
        />
      </div>
    </button>
  );
}
