import axios from 'axios';
import authService from './authService';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true, // Important for cookies/session
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const dashboardApi = {
  // Get financial summary
  getSummary: async () => {
    const response = await api.get('/api/dashboard/summary');
    return response.data;
  },

  // Get recent transactions
  getRecentTransactions: async () => {
    const response = await api.get('/api/dashboard/recent');
    return response.data;
  },

  // Get spending by category
  getSpendingByCategory: async () => {
    const response = await api.get('/api/dashboard/spending');
    return response.data;
  },

  // Get monthly trend
  getMonthlyTrend: async () => {
    const response = await api.get('/api/dashboard/trend');
    return response.data;
  }
};

export default dashboardApi;
