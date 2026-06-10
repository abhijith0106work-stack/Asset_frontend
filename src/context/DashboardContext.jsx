// src/context/DashboardContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [user, setUser] = useState(storedUser);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('light-mode', !isDark);
    // also set a CSS variable for background etc. – existing styles already use var(--bg-card)
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser({});
    navigate('/login');
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        setUser,
        isDark,
        toggleTheme,
        handleLogout,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
