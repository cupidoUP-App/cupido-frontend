import axios, { AxiosInstance, AxiosResponse } from "axios";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: true,
});

// --------------------------------------------------------
// REQUEST INTERCEPTOR (corregido)
// NO manda "Bearer null" ni "Bearer undefined"
// --------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (
      token &&
      token !== "null" &&
      token !== "undefined" &&
      token.trim() !== ""
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------------------------------------------
// Cliente separado para refresh token (SIN interceptores)
// --------------------------------------------------------
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// --------------------------------------------------------
// RESPONSE INTERCEPTOR (corregido)
// --------------------------------------------------------
api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error) => {
    const originalRequest = error.config;

    // Si la respuesta es 401 y no se reintentó aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await refreshClient.post("/auth/token/refresh/", {
          refresh: localStorage.getItem("refresh_token"),
        });

        const newAccessToken = refreshResponse.data.access;
        const newRefreshToken = refreshResponse.data.refresh;

        // Guardar tokens nuevos
        if (newAccessToken) {
          localStorage.setItem("access_token", newAccessToken);
        }
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        // reintentar request original
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Si falla refresh → logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        const { useAppStore } = await import("@store/appStore");
        useAppStore.getState().logout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// --------------------------------------------------------
// API Endpoints
// --------------------------------------------------------

export const authAPI = {
  register: async (data: {
    email: string;
    contrasena: string;
    recaptcha_token: string;
    tyc: boolean;
    firma: string;
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

  getDegrees: async () => {
    const response = await api.get("/profile/profileManagement/degrees/");
    return response.data;
  },

  getLocations: async () => {
    const response = await api.get("/profile/profileManagement/locations/");
    return response.data;
  },

  updateProfileData: async (data: any) => {
    const response = await api.patch("/profile/profileManagement/update/", data);
    return response.data;
  },

  updateProfileWithPreferences: async (preferencesId: number) => {
    const response = await api.patch("/profile/profileManagement/update/", {
      preferencias: preferencesId,
    });
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
    formData.append("imagen", file);

    const response = await api.post("/profile/photos/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },
  deletePhoto: async (photoId: number) => {
    const response = await api.delete(`/profile/photos/${photoId}/`);
    return response.data;
  },
  setPrincipalPhoto: async (photoId: number) => {
    const response = await api.patch(`/profile/photos/${photoId}/`, {
      es_principal: true,
    });
    return response.data;
  },
};

export default api;
