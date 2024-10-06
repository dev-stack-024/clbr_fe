// src/hooks/useAuth.js
import { useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('authToken')
  );

  const login = (token) => {
    localStorage.setItem('authToken', token); // Store the token

    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // Clear the authToken
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    logout,
  };
};
