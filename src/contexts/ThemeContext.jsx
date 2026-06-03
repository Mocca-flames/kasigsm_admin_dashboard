import React, { useEffect, useState, useCallback } from 'react';

import { THEME_MODES } from './themeConstants';
import { ThemeContext } from './ThemeContext';

export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or default to system
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || THEME_MODES.SYSTEM;
  });

  // Get the actual theme (light/dark) based on mode
  const getActualTheme = useCallback(() => {
    if (themeMode === THEME_MODES.SYSTEM) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEME_MODES.DARK
        : THEME_MODES.LIGHT;
    }
    return themeMode;
  }, [themeMode]);

  const [actualTheme, setActualTheme] = useState(getActualTheme());

  // Update actual theme when mode changes
  useEffect(() => {
    const newActualTheme = getActualTheme();
    setActualTheme(newActualTheme);

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', newActualTheme);

    // Save to localStorage
    localStorage.setItem('theme', themeMode);
  }, [themeMode, getActualTheme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (themeMode === THEME_MODES.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = () => {
        const newActualTheme = getActualTheme();
        setActualTheme(newActualTheme);
        document.documentElement.setAttribute('data-theme', newActualTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode, getActualTheme]);

  // Set theme mode
  const setTheme = (mode) => {
    if (Object.values(THEME_MODES).includes(mode)) {
      setThemeMode(mode);
    }
  };

  // Toggle between light and dark (ignoring system mode)
  const toggleTheme = () => {
    setTheme(actualTheme === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT);
  };

  const value = {
    themeMode,
    actualTheme,
    setTheme,
    toggleTheme,
    isLight: actualTheme === THEME_MODES.LIGHT,
    isDark: actualTheme === THEME_MODES.DARK,
    isSystem: themeMode === THEME_MODES.SYSTEM
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};