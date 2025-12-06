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
// UTILIDAD: Decodificar JWT sin verificar firma
// --------------------------------------------------------
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}

// --------------------------------------------------------
// UTILIDAD: Verificar si el token está próximo a expirar
// --------------------------------------------------------
function isTokenExpiringSoon(token: string, bufferMinutes: number = 5): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const expirationTime = decoded.exp * 1000; // Convertir a milisegundos
  const currentTime = Date.now();
  const bufferTime = bufferMinutes * 60 * 1000;

  return expirationTime - currentTime < bufferTime;
}

// --------------------------------------------------------
// Variable para evitar múltiples refreshes simultáneos
// --------------------------------------------------------
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

// --------------------------------------------------------
// REQUEST INTERCEPTOR (mejorado con refresh proactivo)
// --------------------------------------------------------
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("access_token");

    // Verificar si el token está válido
    if (
      token &&
      token !== "null" &&
      token !== "undefined" &&
      token.trim() !== ""
    ) {
      // Refresh proactivo: si el token expira pronto, renovarlo antes
      if (isTokenExpiringSoon(token, 5)) {
        console.log('🔄 Token próximo a expirar, refrescando proactivamente...');

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            const refreshResponse = await refreshClient.post("/auth/token/refresh/", {
              refresh: refreshToken,
            });

            const newAccessToken = refreshResponse.data.access;
            const newRefreshToken = refreshResponse.data.refresh;

            if (newAccessToken) {
              localStorage.setItem("access_token", newAccessToken);
              token = newAccessToken;
            }
            if (newRefreshToken) {
              localStorage.setItem("refresh_token", newRefreshToken);
            }

            console.log('✅ Token refrescado proactivamente');
            onTokenRefreshed(newAccessToken);
            isRefreshing = false;
          } catch (error) {
            console.error('❌ Error al refrescar token proactivamente:', error);
            isRefreshing = false;

            // Si falla el refresh proactivo, limpiar y hacer logout
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            const { useAppStore } = await import("@store/appStore");
            useAppStore.getState().logout();

            return Promise.reject(error);
          }
        } else {
          // Si ya hay un refresh en progreso, esperar a que termine
          token = await new Promise<string>((resolve) => {
            subscribeTokenRefresh((newToken: string) => {
              resolve(newToken);
            });
          });
        }
      }

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
// RESPONSE INTERCEPTOR (mejorado con manejo de race conditions)
// --------------------------------------------------------
api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error) => {
    const originalRequest = error.config;

    // Si la respuesta es 401 y no se reintentó aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Si ya hay un refresh en progreso, esperar a que termine
      if (isRefreshing) {
        try {
          const newToken = await new Promise<string>((resolve, reject) => {
            subscribeTokenRefresh((token: string) => {
              resolve(token);
            });

            // Timeout de 10 segundos para evitar espera infinita
            setTimeout(() => {
              reject(new Error('Token refresh timeout'));
            }, 10000);
          });

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (err) {
          console.error('❌ Error esperando refresh de token:', err);
          return Promise.reject(err);
        }
      }

      // Iniciar proceso de refresh
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const refreshResponse = await refreshClient.post("/auth/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = refreshResponse.data.access;
        const newRefreshToken = refreshResponse.data.refresh;

        // Guardar tokens nuevos
        if (newAccessToken) {
          localStorage.setItem("access_token", newAccessToken);
          console.log('✅ Token refrescado reactivamente (401)');
        }
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        // Notificar a todas las requests en espera
        onTokenRefreshed(newAccessToken);
        isRefreshing = false;

        // Reintentar request original
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        isRefreshing = false;
        onTokenRefreshed(''); // Liberar subscribers con error

        // Si falla refresh → logout
        console.error('❌ Error al refrescar token reactivamente:', refreshError);
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
    const response = await api.get("/profile/profileManagement/degrees/",{
      params: { limit : 500 }
    });
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

export const likeAPI = {
  /**
   * Enviar un like a un usuario
   * @param receptorId - ID del usuario receptor
   */
  sendLike: async (receptorId: string): Promise<{
    match_found: boolean;
    message: string;
    usuario_match?: string;
  }> => {
    const response = await api.post("/like/interaction/", {
      receptor_id: receptorId,
      accion: "LIKE",
    });
    return response.data;
  },

  /**
   * Enviar un dislike a un usuario
   * @param receptorId - ID del usuario receptor
   */
  sendDislike: async (receptorId: string): Promise<{
    message: string;
  }> => {
    const response = await api.post("/like/interaction/", {
      receptor_id: receptorId,
      accion: "DISLIKE",
    });
    return response.data;
  },
};


export default api;
