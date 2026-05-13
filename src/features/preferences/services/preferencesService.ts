/**
 * @fileoverview Servicio para la gestión de preferencias de usuario.
 * Proporciona métodos para guardar, obtener y verificar preferencias
 * mediante llamadas fetch directas a la API.
 */

/**
 * Interfaz que define la estructura de las preferencias de un usuario.
 * @property {number} [id] - ID único de la preferencia (asignado por el backend).
 * @property {string} genero_preferido - Género preferido del usuario.
 * @property {string} hobbies_preferidos - Hobbies en formato string (JSON si es array).
 * @property {string} ubicacion - Ubicación preferida.
 * @property {number} rango_edad_min - Edad mínima del rango de búsqueda.
 * @property {number} rango_edad_max - Edad máxima del rango de búsqueda.
 * @property {number} rango_estatura_min - Estatura mínima del rango de búsqueda.
 * @property {number} rango_estatura_max - Estatura máxima del rango de búsqueda.
 * @property {string} [fecha_creacion] - Fecha de creación del registro.
 * @property {string} [user_id] - ID del usuario asociado.
 */
// services/preferencesService.ts

// Primero define la interfaz
export interface UserPreferences {
    id?: number;
    genero_preferido: string;
    hobbies_preferidos: string;
    ubicacion: string;
    rango_edad_min: number;
    rango_edad_max: number;
    rango_estatura_min: number;
    rango_estatura_max: number;
    fecha_creacion?: string;
    user_id?: string; // Agregar este campo que usa tu backend
  }
  
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;
  
  /**
   * Objeto con métodos para operaciones CRUD de preferencias de usuario.
   */
  export const preferencesService = {
    /**
     * Guarda o actualiza las preferencias de un usuario.
     * Si ya existe una preferencia para el usuario, la actualiza vía PUT.
     * De lo contrario, crea una nueva vía POST.
     * @param userId - ID del usuario.
     * @param preferences - Datos de preferencia (excluyendo id y fecha_creacion).
     * @returns La preferencia guardada según la respuesta del backend.
     */
    async savePreferences(userId: string, preferences: Omit<UserPreferences, 'id' | 'fecha_creacion'>) {
      try {
        
        const hobbiesString = Array.isArray(preferences.hobbies_preferidos) 
          ? JSON.stringify(preferences.hobbies_preferidos)
          : preferences.hobbies_preferidos;
  
        const preferencesData = {
          ...preferences,
          hobbies_preferidos: hobbiesString,
          user_id: userId
        };
  
        // PRIMERO: Buscar si ya existe una preferencia para este usuario
        const existingPrefs = await this.getPreferencesByUserId(userId);
        
        let response;
        
        if (existingPrefs && existingPrefs.id) {
          response = await fetch(`${API_BASE_URL}/preferences/preferences/${existingPrefs.id}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferencesData)
          });
        } else {
          response = await fetch(`${API_BASE_URL}/preferences/preferences/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferencesData)
          });
        }
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
  
        const result = await response.json();
        return result;
  
      } catch (error) {
        throw error;
      }
    },
  
    /**
     * Obtiene las preferencias de un usuario por su ID.
     * Intenta múltiples URLs de búsqueda por si alguna falla.
     * @param userId - ID del usuario.
     * @returns Las preferencias encontradas o null si no existen.
     */
    async getPreferencesByUserId(userId: string): Promise<UserPreferences | null> {
      try {
        
        // Intentar diferentes formas de buscar
        const urlsToTry = [
          `${API_BASE_URL}/preferences/preferences/?user_id=${userId}`,
          `${API_BASE_URL}/preferences/preferences/`
        ];
  
        for (const url of urlsToTry) {
          try {
            const response = await fetch(url);
            
            if (response.ok) {
              const data = await response.json();
              
              if (Array.isArray(data)) {
                // Buscar la preferencia que coincida con el user_id
                const userPreference = data.find((pref: UserPreferences) => pref.user_id === userId);
                if (userPreference) {
                  return userPreference;
                }
              }
            }
          } catch (error) {
            continue;
          }
        }
        
        return null;
      } catch (error) {
        return null;
      }
    },
  
    /**
     * Verifica si un usuario ha completado sus preferencias de búsqueda.
     * Se considera completado si tiene definido un rango de edad (mínimo y máximo no nulos).
     * @param userId - ID del usuario.
     * @returns true si el usuario tiene preferencias completas, false en caso contrario.
     */
    async hasCompletedPreferences(userId: string): Promise<boolean> {
      try {
        const preferences = await this.getPreferencesByUserId(userId);
        // Consideramos completado si tiene rango de edad definido (no el default)
        const hasPreferences = preferences !== null && 
               preferences.rango_edad_min !== null && 
               preferences.rango_edad_max !== null;
        
        return hasPreferences;
      } catch (error) {
        return false;
      }
    }
  };
