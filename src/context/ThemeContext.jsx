import React, { createContext, useState, useMemo, useContext } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const themeValues = useMemo(() => ({
    theme: "dark",
    isDarkMode: true,
    toggleTheme: () => {}, // No-op
  }), []);

  return (
    <ThemeContext.Provider value={themeValues}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
