import { useState, useEffect } from 'react';
import { Preferences } from '../types/Filters.types';

export const usePreferences = (userId: string) => {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      // Datos de prueba temporales
      const mockPreferences: Preferences = {
        genero_preferido: '',
        hobbies_preferidos: '',
        ubicacion: '',
        rango_edad_min: 20,
        rango_edad_max: 35,
        rango_estatura_min: 165,
        rango_estatura_max: 185
      };
      setPreferences(mockPreferences);
    } catch (err) {
      setError('Error cargando preferencias');
      console.error('Error loading preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: Preferences) => {
    try {
      console.log('Guardando preferencias:', newPreferences);
      // Simulación temporal - reemplazar con API real
      setPreferences(newPreferences);
      return newPreferences;
    } catch (err) {
      setError('Error guardando preferencias');
      throw err;
    }
  };

  useEffect(() => {
    if (userId) {
      loadPreferences();
    }
  }, [userId]);

  return { preferences, loading, error, savePreferences };
};