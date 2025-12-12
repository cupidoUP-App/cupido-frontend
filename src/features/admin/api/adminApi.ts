/**
 * Admin Panel API functions
 * Calls to admin-only backend endpoints
 */
import api from '@lib/api';

export interface AdminUser {
  usuario_id: number;
  nombres: string;
  apellidos: string;
  email: string;
  estadocuenta: string;
  is_superuser: boolean;
}

export const adminAPI = {
  /**
   * Buscar usuario por email
   */
  getUserByEmail: async (email: string): Promise<AdminUser> => {
    const response = await api.get('/admin-panel/user-by-email/', {
      params: { email }
    });
    return response.data;
  },

  /**
   * Banear usuario
   */
  banUser: async (usuarioId: number, confirmar: boolean = true): Promise<{ message: string; resultado: any }> => {
    const response = await api.post('/admin-panel/ban-user/', {
      usuario_id: usuarioId,
      confirmar
    });
    return response.data;
  },

  /**
   * Eliminar usuario
   */
  deleteUser: async (usuarioId: number, confirmar: boolean = true): Promise<{ message: string; resultado: any }> => {
    const response = await api.post('/admin-panel/delete-user/', {
      usuario_id: usuarioId,
      confirmar
    });
    return response.data;
  },

  /**
   * Actualizar género preferido
   */
  updateGenderPreference: async (email: string, generoPreferido: string): Promise<{ message: string; resultado: any }> => {
    const response = await api.post('/admin-panel/update-gender-pref/', {
      email,
      genero_preferido: generoPreferido
    });
    return response.data;
  },
};
