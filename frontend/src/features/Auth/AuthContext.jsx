import { createContext, useContext,  useState } from 'react';
import axios from '../../lib/Axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
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

      // If successful, set user from response and redirect
      setUser(response.data.user || { email: credentials.email });
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

      // If successful, set user from response and redirect
      setUser(response.data.user || { email: credentials.email });
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
      setLoading(true);
      await axios.post('/logout');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);