import axios, { AxiosInstance, AxiosResponse } from "axios";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Enable sending cookies and credentials
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors (e.g., expired access token)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token
        const refreshResponse = await api.post("/auth/token/refresh/", {
          refresh: localStorage.getItem("refresh_token"),
        });
        const newAccessToken = refreshResponse.data.access;
        const newRefreshToken = refreshResponse.data.refresh;

        // Store new tokens
        localStorage.setItem("access_token", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        // Retry original request with new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Token refresh failed - clear tokens and logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // Import dynamically to avoid circular dependencies
        const { useAppStore } = await import("@/store/appStore");
        useAppStore.getState().logout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Endpoints
export const authAPI = {
  register: async (data: {
    email: string;
    contrasena: string;
    recaptcha_token: string;
    tyc: boolean;
  }) => {
    const response = await api.post("/auth/register/", data);
    return response.data;
  },

  verifyEmail: async (data: { email: string; code: string }) => {
    const response = await api.post("/auth/verify-email/", {
      email: data.email,
      codigo: data.code,
    });
    return response.data;
  },

  resendCode: async (data: { email: string }) => {
    const response = await api.post("/auth/resend-code/", data);
    return response.data;
  },

  login: async (data: {
    email: string;
    contrasena: string;
    recaptcha_token: string;
  }) => {
    const response = await api.post("/auth/login/", data);
    const { access, refresh } = response.data;

    if (access && refresh) {
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
    }

    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token available");

    try {
      const response = await api.post("/auth/logout/", {
        refresh: refreshToken,
      });
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return response.data;
    } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      throw error;
    }
  },

  logoutAll: async () => {
    const response = await api.post("/auth/logout-all/");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return response.data;
  },

  getSession: async () => {
    const response = await api.get("/auth/session/");
    return response.data;
  },

  changePassword: async (data: {
    contrasena_actual: string;
    nueva_contrasena: string;
  }) => {
    const response = await api.post("/auth/password-change/", data);
    return response.data;
  },

  resetPasswordRequest: async (data: { email: string }) => {
    const response = await api.post("/auth/password-reset/", data);
    return response.data;
  },

  resetPasswordConfirm: async (data: {
    email: string;
    token: string;
    nueva_contrasena: string;
  }) => {
    const response = await api.post("/auth/password-reset-confirm/", data);
    return response.data;
  },

  updateUserProfile: async (data: {
    nombres: string;
    apellidos: string;
    genero_id: number;
    fechanacimiento: string;
    descripcion: string;
    estadocuenta: string;
  }) => {
    const response = await api.patch("/auth/user-update/", data);
    return response.data;
  },

  updateUserProfileDescription: async (data: {
    descripcion: string;
    numerotelefono: string;
  }) => {
    const response = await api.patch("/auth/user-update/", data);
    return response.data;
  },


  deactivateAccount: async () => {
    const response = await api.post("/auth/deactivate/");
    return response.data;
  },

  getUserProfile: async () => {
    const response = await api.get("/auth/user-get/");
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/profile/profileManagement/update/");
    return response.data;
  },

  // Catalogs
  getDegrees: async () => {
    // GET /profile/profileManagement/degrees/
    const response = await api.get("/profile/profileManagement/degrees/");
    return response.data;
  },

  getLocations: async () => {
    // GET /profile/profileManagement/locations/
    const response = await api.get("/profile/profileManagement/locations/");
    return response.data;
  },

  updateProfileData: async (data: any) => {
    const response = await api.patch("/profile/profileManagement/update/", data);
    return response.data;
  },

  getPreferences: async () => {
    const response = await api.get("/preferences/preferences/");
    return response.data;
  },

  updatePreferences: async (data: any) => {
    const response = await api.post("/preferences/preferences/", data);
    return response.data;
  },

  getFilters: async (userId: string) => {
    const response = await api.get(`/preferences/filters/?usuario=${userId}`);
    return response.data;
  },

  updateFilters: async (data: any) => {
    const response = await api.post("/preferences/filters/", data);
    return response.data;
  },

};

export const photoAPI = {
  getPhotos: async () => {
    const response = await api.get("/profile/photos/");
    return response.data;
  },
  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append('imagen', file);
    const response = await api.post("/profile/photos/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  deletePhoto: async (photoId: number) => {
    const response = await api.delete(`/profile/photos/${photoId}/`);
    return response.data;
  },
  setPrincipalPhoto: async (photoId: number) => {
    const response = await api.patch(`/profile/photos/${photoId}/`, { es_principal: true });
    return response.data;
  },
};

export default api;
