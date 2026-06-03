import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('admin_token', token);
    setIsAuthenticated(true);
    window.dispatchEvent(new Event('auth-change'));
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem('admin_token');
      setIsAuthenticated(!!token);
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};