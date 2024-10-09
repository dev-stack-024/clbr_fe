import React, { createContext, useState, useEffect } from 'react';

// Create context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const login = (token, userData) => {
    localStorage.setItem('authToken', token);
    console.log(userData)
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData); // Store user details
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null); // Clear user details
  };

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('authToken'));
    setUser(JSON.parse(localStorage.getItem('user')) || null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
