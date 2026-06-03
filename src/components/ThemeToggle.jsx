import React from 'react';
import { useTheme } from '../contexts/useTheme';
import { THEME_MODES } from '../contexts/themeConstants';

const ThemeToggle = () => {
  const { themeMode, setTheme, isLight, isDark } = useTheme();

  const handleThemeChange = () => {
    if (themeMode === THEME_MODES.LIGHT) {
      setTheme(THEME_MODES.DARK);
    } else if (themeMode === THEME_MODES.DARK) {
      setTheme(THEME_MODES.SYSTEM);
    } else {
      setTheme(THEME_MODES.LIGHT);
    }
  };

  const getIcon = () => {
    if (isLight) return '☀️';
    if (isDark) return '🌙';
    return '💻'; // System mode
  };

  const getTooltip = () => {
    if (isLight) return 'Switch to dark mode';
    if (isDark) return 'Switch to system mode';
    return 'Switch to light mode';
  };

  return (
    <button
      className="header-icon-btn theme-toggle"
      onClick={handleThemeChange}
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      <span>{getIcon()}</span>
    </button>
  );
};

export default ThemeToggle;