import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // Essential for Sanctum cookies
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // For Sanctum, we don't need Bearer token in header
    // CSRF token is automatically handled via cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {};

    if (status === 401) {
      // Clear user data and redirect to login
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }

    if (status === 419) {
      // CSRF token mismatch - refresh the page
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;