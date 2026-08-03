import api from './api';

export const authService = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const token = response.data.token;
    localStorage.setItem('authToken', token);
    return token;
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  verifyEmail: async (email, otp) => {
    const response = await api.post('/auth/verify-email', { email, otp });
    return response.data;
  },

  resendOtp: async (email) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  getUserFromToken: () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  
};