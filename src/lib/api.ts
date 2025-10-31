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
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        const refreshResponse = await authAPI.refreshToken();
        // Guardar nuevo access token
        localStorage.setItem('access_token', refreshResponse.access);

        // Reintentar la request original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falló - limpiar tokens y estado
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Importar aquí para evitar dependencias circulares
        const { useAppStore } = await import('@/store/appStore');
        useAppStore.getState().logout();

        // Redirigir a login podría hacerse aquí
        return Promise.reject(refreshError);
      }
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

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
  },


 
  // Logout funcional
 /*  logout: async () => {
    const response = await api.post('/auth/logout/');
    return response.data;
  }, */

  //logout cochino
  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token'); // obtiene token guardado
    if (!refreshToken) throw new Error('No refresh token available');
  
    const response = await api.post('/auth/logout/', {
      refresh: refreshToken, // enviar en el body
    });
  
    // opcional: limpiar tokens locales
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  
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
  // Profile update
  updateProfile: async (data: {
    nombres: string;
    apellidos: string;
    genero_id: number;
    fechanacimiento: string;
    descripcion: string;
  }) => {
    const response = await api.patch('/auth/user-update/', data);
    return response.data;
  },

  // Deactivate account
  deactivateAccount: async () => {
    const response = await api.post('/auth/deactivate/');
    return response.data;
  },

  // Get user profile data and status
  getUserProfile: async () => {
    const response = await api.get('/auth/user-get/');
    return response.data;
  },
};

export default api;