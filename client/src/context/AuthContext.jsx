import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch user data
  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth/current_user', {
          withCredentials: true
      });
      setUser(data || null);
    } catch (error) {
      console.error("Auth check failed", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 1. Initial Load
  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    const apiUrl = import.meta.env?.VITE_API_URL || 'http://localhost:4000';
    const logoutUrl = `${apiUrl}/auth/logout`;
    window.open(logoutUrl, '_self');
  };

  return (
    // 2. Expose 'refreshUser' (which is just fetchUser) to the app
    <AuthContext.Provider value={{ user, loading, logout, refreshUser: fetchUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);