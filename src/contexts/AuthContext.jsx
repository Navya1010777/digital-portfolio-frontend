import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If token exists, load user profile
    if (token) {
      api.setAuthToken(token);
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await api.get('/users/profile');
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load user', error);
      logout();
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token: newToken } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token: newToken } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    api.setAuthToken(null);
    navigate('/login');
  };

  const isTeacher = () => {
    return user?.role === 'TEACHER';
  };

  const isStudent = () => {
    return user?.role === 'STUDENT';
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isTeacher,
    isStudent,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};