import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check localStorage for saved theme, default to 'light'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('civiclens_theme');
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('civiclens_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    console.log('🌓 Theme changed to:', theme); // Debug log
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};