import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (email, password) => {
    let userToStore = null;

    if (email === 'sall@gmail.com' && password === 'sall123') {
      userToStore = {
        email,
        name: 'Sall',
        role: 'admin',
      };
    } else if (email === 'conde@gmail.com' && password === 'conde123') {
      userToStore = {
        email,
        name: 'Organisateur',
        role: 'organisateur',
      };
    }

    if (userToStore) {
      localStorage.setItem('user', JSON.stringify(userToStore));
      setUser(userToStore);
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
