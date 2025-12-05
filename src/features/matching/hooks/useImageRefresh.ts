/**
 * Hook personalizado para manejar la regeneración automática de presigned URLs.
 *
 * Detecta cuando una imagen falla por URL expirada y automáticamente
 * solicita nuevas URLs al backend.
 */
import { useState, useCallback } from 'react';
import { refreshProfileImages, isExpiredURLError, cacheURL } from '../services/imageRefreshService';

export interface ImageURLs {
  main_image: string | null;
  secondary_images: string[];
}

export const useImageRefresh = () => {
  const [refreshing, setRefreshing] = useState<Set<number>>(new Set());

  /**
   * Maneja el error de carga de imagen.
   * Si la URL expiró, regenera automáticamente.
   */
  const handleImageError = useCallback(
    async (
      error: React.SyntheticEvent<HTMLImageElement, Event>,
      usuarioId: number,
      onRefresh: (newUrls: ImageURLs) => void
    ) => {
      // Evitar múltiples requests simultáneos para el mismo usuario
      if (refreshing.has(usuarioId)) {
        return;
      }

      // Verificar si es un error por URL expirada
      if (isExpiredURLError(error.nativeEvent)) {
        console.log(`🔄 URL expirada detectada para usuario ${usuarioId}. Regenerando...`);

        setRefreshing((prev) => new Set(prev).add(usuarioId));

        try {
          const newUrls = await refreshProfileImages(usuarioId);

          if (newUrls.main_image || newUrls.secondary_images.length > 0) {
            console.log(`✅ URLs regeneradas para usuario ${usuarioId}`);
            onRefresh(newUrls);
          } else {
            console.warn(`⚠️  No se pudieron regenerar URLs para usuario ${usuarioId}`);
          }
        } catch (error) {
          console.error(`❌ Error regenerando URLs para usuario ${usuarioId}:`, error);
        } finally {
          setRefreshing((prev) => {
            const next = new Set(prev);
            next.delete(usuarioId);
            return next;
          });
        }
      }
    },
    [refreshing]
  );

  /**
   * Cachea las URLs cuando se cargan por primera vez.
   */
  const cacheImageURL = useCallback((url: string, expirationSeconds: number = 3600) => {
    cacheURL(url, expirationSeconds);
  }, []);

  return {
    handleImageError,
    cacheImageURL,
    isRefreshing: (usuarioId: number) => refreshing.has(usuarioId),
  };
};
