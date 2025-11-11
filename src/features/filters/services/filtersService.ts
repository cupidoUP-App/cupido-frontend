// src/features/filters/services/filtersService.ts

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export interface UserFilters {
  id?: number;
  usuario: number;
  filter_types: string[];
  filter_values: string[];
}

export const filtersService = {
  async saveFilters(userId: string, filters: Omit<UserFilters, 'id' | 'usuario'>) {
    try {
      console.log('🔄 Creando nuevos filtros para userId:', userId);

      const usuarioId = parseInt(userId, 10);
      if (isNaN(usuarioId)) {
        throw new Error('El ID de usuario no es válido');
      }

      // ✅ Crear cuerpo de envío
      const bodyToSend = {
        usuario: usuarioId,
        filter_types: filters.filter_types,
        filter_values: filters.filter_values,
      };

      console.log('📦 Enviando datos para crear filtros:', bodyToSend);

      // SOLO CREAR - No verificar existencia
      const response = await fetch(`${API_BASE_URL}/preferences/filters/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor al crear filtros:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Filtros creados exitosamente:', result);
      return result;

    } catch (error) {
      console.error('❌ Error al crear filtros:', error);
      throw error;
    }
  },

  // ❌ ELIMINAMOS getFiltersByUserId - No necesitamos cargar filtros existentes
};
