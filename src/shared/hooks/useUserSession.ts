/**
 * @module useUserSession
 * @description Hook para gestionar la sesión del usuario autenticado.
 * Obtiene el perfil del usuario desde la API y lo sincroniza con el store global (Zustand).
 * Utiliza react-query para caching, reintentos y actualización en segundo plano.
 */

import { useQuery } from '@tanstack/react-query';
import { authAPI } from '@lib/api';
import { useAppStore } from '@store/appStore';
import { useEffect } from 'react';

/**
 * @function useUserSession
 * @description Obtiene y sincroniza los datos de la sesión del usuario.
 * Prioriza los datos frescos de react-query; si falla, usa los datos almacenados en el store.
 * @returns {{ user: object | null, estado: string | undefined, isLoading: boolean, isError: boolean, refetchUser: () => void }}
 * Un objeto con el usuario, su estado, indicadores de carga/error y una función para recargar.
 */
export const useUserSession = () => {
  const { login, user: storedUser } = useAppStore();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      // Only fetch if we have a token.
      if (!localStorage.getItem('access_token')) {
        return null;
      }
      try {
        const profileData = await authAPI.getUserProfile();
        return profileData;
      } catch (error) {
        // This might happen if the token is invalid/expired.
        // The API interceptor should handle logging out.
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 1, // Retry once on failure
  });

  // Effect to synchronize the fresh data from react-query into the zustand store.
  useEffect(() => {
    if (data?.user) {
      login(data.user);
    }
  }, [data, login]);

  // The hook returns a consistent user object, prioritizing fresh data.
  return { 
    user: data?.user || storedUser, 
    estado: data?.estado,
    isLoading,
    isError,
    refetchUser: refetch,
  };
};
