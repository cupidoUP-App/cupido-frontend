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
  
  export const preferencesService = {
    async savePreferences(userId: string, preferences: Omit<UserPreferences, 'id' | 'fecha_creacion'>) {
      try {
        console.log('Guardando preferencias para userId:', userId);
        
        const hobbiesString = Array.isArray(preferences.hobbies_preferidos) 
          ? JSON.stringify(preferences.hobbies_preferidos)
          : preferences.hobbies_preferidos;
  
        const preferencesData = {
          ...preferences,
          hobbies_preferidos: hobbiesString,
          user_id: userId
        };
  
        console.log('Datos a enviar:', preferencesData);
  
        // PRIMERO: Buscar si ya existe una preferencia para este usuario
        const existingPrefs = await this.getPreferencesByUserId(userId);
        
        let response;
        
        if (existingPrefs && existingPrefs.id) {
          // ACTUALIZAR preferencia existente
          console.log('Actualizando preferencia existente ID:', existingPrefs.id);
          response = await fetch(`${API_BASE_URL}/preferences/preferences/${existingPrefs.id}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferencesData)
          });
        } else {
          // CREAR nueva preferencia
          console.log('Creando nueva preferencia');
          response = await fetch(`${API_BASE_URL}/preferences/preferences/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferencesData)
          });
        }
  
        console.log('Respuesta del servidor:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
  
        const result = await response.json();
        console.log('Preferencias guardadas exitosamente:', result);
        return result;
  
      } catch (error) {
        console.error('Error completo saving preferences:', error);
        throw error;
      }
    },
  
    async getPreferencesByUserId(userId: string): Promise<UserPreferences | null> {
      try {
        console.log('Buscando preferencias para userId:', userId);
        
        // Intentar diferentes formas de buscar
        const urlsToTry = [
          `${API_BASE_URL}/preferences/preferences/?user_id=${userId}`,
          `${API_BASE_URL}/preferences/preferences/`
        ];
  
        for (const url of urlsToTry) {
          try {
            console.log('Intentando URL:', url);
            const response = await fetch(url);
            
            if (response.ok) {
              const data = await response.json();
              console.log('Datos recibidos:', data);
              
              if (Array.isArray(data)) {
                // Buscar la preferencia que coincida con el user_id
                const userPreference = data.find((pref: UserPreferences) => pref.user_id === userId);
                if (userPreference) {
                  console.log('Preferencia encontrada:', userPreference);
                  return userPreference;
                }
              }
            }
          } catch (error) {
            console.log(`URL ${url} falló:`, error);
            continue;
          }
        }
        
        console.log('No se encontraron preferencias para el usuario:', userId);
        return null;
      } catch (error) {
        console.error('Error getting preferences:', error);
        return null;
      }
    },
  
    async hasCompletedPreferences(userId: string): Promise<boolean> {
      try {
        const preferences = await this.getPreferencesByUserId(userId);
        // Consideramos completado si tiene rango de edad definido (no el default)
        const hasPreferences = preferences !== null && 
               preferences.rango_edad_min !== null && 
               preferences.rango_edad_max !== null;
        
        console.log('¿Usuario tiene preferencias completadas?', hasPreferences);
        return hasPreferences;
      } catch (error) {
        console.error('Error checking preferences:', error);
        return false;
      }
    }
  };
