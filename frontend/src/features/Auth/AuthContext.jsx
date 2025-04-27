import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../../lib/Axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const clearError = () => setError(null);

  const login = async (credentials) => {
    try {
      setLoading(true);
      clearError();

      // First get CSRF cookie
      await axios.get('/sanctum/csrf-cookie');

      // Then attempt login
      const response = await axios.post('/api/login', credentials);

      // Store the token and user data
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));

      // Set user in context
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials) => {
    try {
      setLoading(true);
      clearError();

      // First get CSRF cookie
      await axios.get('/sanctum/csrf-cookie');

      // Then attempt registration
      const response = await axios.post('/api/register', {
        ...credentials,
        password_confirmation: credentials.password
      });

      // Store the token and user data
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));

      // Set user in context
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setUser(null);
      navigate('/login');
    }
  };

  // Check if user is already logged in
  const checkAuth = async () => {
    const storedToken = localStorage.getItem('auth_token');

    if (storedToken) {
      try {
        // Validate token with the server
        const response = await axios.get('/api/user');
        setUser(response.data.user);
      } catch (err) {
        console.error('Token validation error:', err);
        // If token is invalid, clear it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
      }
    }

    setLoading(false);
  };

  // Call checkAuth when component mounts
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
