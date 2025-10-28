import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Enable sending cookies and credentials
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear local storage and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // You might want to redirect to login page here
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const authAPI = {
  // Register endpoint - sends basic info and receives verification code via email
  register: async (data: {
    email: string;
    contrasena: string;
    recaptcha_token: string;
    tyc: boolean;
  }) => {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  // Verify email with code
  verifyEmail: async (data: { email: string; code: string }) => {
    const response = await api.post('/auth/verify-email/', {
      email: data.email,
      codigo: data.code  // Backend expects 'codigo', not 'code'
    });
    return response.data;
  },

  // Resend verification code
  resendCode: async (data: { email: string }) => {
    const response = await api.post('/auth/resend-code/', data);
    return response.data;
  },

  // Login
  login: async (data: { email: string; contrasena: string; recaptcha_token: string }) => {
    const response = await api.post('/auth/login/', data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout/');
    return response.data;
  },

  // Logout from all devices
  logoutAll: async () => {
    const response = await api.post('/auth/logout-all/');
    return response.data;
  },

  // Get session info
  getSession: async () => {
    const response = await api.get('/auth/session/');
    return response.data;
  },

  // Password change
  changePassword: async (data: {
    contrasena_actual: string;
    nueva_contrasena: string;
  }) => {
    const response = await api.post('/auth/password-change/', data);
    return response.data;
  },

  // Password reset request
  resetPasswordRequest: async (data: { email: string }) => {
    const response = await api.post('/auth/password-reset/', data);
    return response.data;
  },

  // Password reset confirm
  resetPasswordConfirm: async (data: {
    email: string;
    token: string;
    nueva_contrasena: string;
  }) => {
    const response = await api.post('/auth/password-reset-confirm/', data);
    return response.data;
  },

  // Deactivate account
  deactivateAccount: async () => {
    const response = await api.post('/auth/deactivate/');
    return response.data;
  },
};

export default api;