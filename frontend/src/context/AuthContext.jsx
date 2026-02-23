import React, { createContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken } from '../utils/tokenStorage';
import { getMe } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if token exists and validate it
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = getToken();
      if (savedToken) {
        try {
          setTokenState(savedToken);
          const response = await getMe();
          if (response.success) {
            setUser(response.data);
          } else {
            removeToken();
            setTokenState(null);
          }
        } catch (error) {
          console.error('Auth init error:', error);
          removeToken();
          setTokenState(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (newToken, userData) => {
    setToken(newToken);
    setTokenState(newToken);
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
