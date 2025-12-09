/**
 * Servicio para manejar la regeneración automática de presigned URLs.
 *
 * Las presigned URLs de MinIO expiran después de 1 hora. Este servicio
 * detecta URLs expiradas y las regenera automáticamente sin que el usuario
 * lo note.
 */
import api from "@lib/api";

// Tipo para el caché de URLs
interface URLCacheEntry {
  url: string;
  expiresAt: number; // timestamp en milisegundos
}

// Caché de URLs con tiempo de expiración
const urlCache = new Map<string, URLCacheEntry>();

// Constantes de tiempo
const URL_EXPIRATION_TIME = 3600 * 1000; // 1 hora en milisegundos
const REFRESH_BUFFER = 5 * 60 * 1000; // Refrescar 5 minutos antes de expirar

/**
 * Verifica si una URL ha expirado o está por expirar.
 *
 * @param url - URL a verificar
 * @returns true si la URL expiró o está por expirar
 */
export const isURLExpiredOrExpiring = (url: string): boolean => {
  // Si la URL no está en caché, asumimos que es nueva
  const cached = urlCache.get(url);
  if (!cached) {
    return false;
  }

  const now = Date.now();
  // Refrescar si está a menos de 5 minutos de expirar
  return cached.expiresAt - now < REFRESH_BUFFER;
};

/**
 * Guarda una URL en el caché con su tiempo de expiración.
 *
 * @param url - URL a guardar
 * @param expirationSeconds - Segundos hasta que expire (default: 3600)
 */
export const cacheURL = (url: string, expirationSeconds: number = 3600): void => {
  const expiresAt = Date.now() + (expirationSeconds * 1000);
  urlCache.set(url, { url, expiresAt });
};

/**
 * Refresca las presigned URLs para imágenes de un usuario específico.
 *
 * @param usuarioId - ID del usuario
 * @returns Nuevas URLs (main_image y secondary_images)
 */
export const refreshProfileImages = async (usuarioId: number): Promise<{
  main_image: string | null;
  secondary_images: string[];
}> => {
  try {
    const response = await api.post("/match/refresh-profile-images/", {
      usuario_id: usuarioId
    });

    // Cachear las nuevas URLs
    if (response.data.main_image) {
      cacheURL(response.data.main_image);
    }
    response.data.secondary_images?.forEach((url: string) => {
      if (url) cacheURL(url);
    });

    return response.data;
  } catch (error) {
    return { main_image: null, secondary_images: [] };
  }
};

/**
 * Detecta si una imagen falló por URL expirada.
 *
 * @param error - Error del evento de carga de imagen
 * @returns true si el error es por URL expirada
 */
export const isExpiredURLError = (error: Event): boolean => {
  const img = error.target as HTMLImageElement;

  // Si la URL contiene parámetros de presigned URL y falló, probablemente expiró
  if (img.src.includes('X-Amz-Signature')) {
    return true;
  }

  return false;
};

/**
 * Limpia el caché de URLs expiradas.
 * Ejecutar periódicamente para liberar memoria.
 */
export const cleanExpiredURLsFromCache = (): void => {
  const now = Date.now();

  for (const [url, entry] of urlCache.entries()) {
    if (entry.expiresAt < now) {
      urlCache.delete(url);
    }
  }
};

// Limpiar caché cada 10 minutos
setInterval(cleanExpiredURLsFromCache, 10 * 60 * 1000);

/**
 * Hook para manejar automáticamente la regeneración de URLs.
 * Uso en componentes React.
 */
export const useImageRefresh = () => {
  const handleImageError = async (
    error: Event,
    usuarioId: number,
    onRefresh: (newUrls: { main_image: string | null; secondary_images: string[] }) => void
  ) => {
    if (isExpiredURLError(error)) {

      const newUrls = await refreshProfileImages(usuarioId);

      if (newUrls.main_image || newUrls.secondary_images.length > 0) {
        onRefresh(newUrls);
      }
    }
  };

  return { handleImageError };
};
