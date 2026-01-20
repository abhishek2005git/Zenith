import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch user data
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/auth/current_user', {
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
    window.open('http://localhost:4000/auth/logout', '_self');
  };

  return (
    // 2. Expose 'refreshUser' (which is just fetchUser) to the app
    <AuthContext.Provider value={{ user, loading, logout, refreshUser: fetchUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);