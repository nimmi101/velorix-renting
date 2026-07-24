import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto load user profile if token exists in localStorage
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('velorix_token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();
        
        if (res.ok && data.status === 'success') {
          setUser({ ...data.data, token });
        } else {
          // Token expired or invalid
          localStorage.removeItem('velorix_token');
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to load user profile on boot:', err);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        localStorage.setItem('velorix_token', data.data.token);
        setUser(data.data);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (err) {
      return { success: false, message: 'Server communication error. Please try again later.' };
    }
  };

  // Register handler
  const register = async (name, email, password, phone) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        localStorage.setItem('velorix_token', data.data.token);
        setUser(data.data);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (err) {
      return { success: false, message: 'Server communication error. Please try again later.' };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('velorix_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
