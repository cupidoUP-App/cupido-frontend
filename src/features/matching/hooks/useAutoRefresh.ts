/**
 * Hook para regeneración automática periódica de presigned URLs.
 *
 * OPCIÓN 3: Regeneración Periódica Automática
 *
 * Este hook refresca automáticamente las URLs cada cierto tiempo para
 * asegurar que las presigned URLs de MinIO nunca expiren mientras el
 * usuario está activo en la aplicación.
 *
 * @param refreshCallback - Función a ejecutar para refrescar las URLs
 * @param options - Opciones de configuración
 */
import { useEffect, useRef } from 'react';

export interface AutoRefreshOptions {
  /**
   * Intervalo de refresco en MINUTOS (default: 45 minutos)
   * Debe ser menor que el tiempo de expiración de las URLs (60 min)
   */
  intervalMinutes?: number;

  /**
   * Si está habilitado (default: true)
   */
  enabled?: boolean;

  /**
   * Callback cuando se realiza un refresh exitoso
   */
  onRefreshSuccess?: () => void;

  /**
   * Callback cuando falla el refresh
   */
  onRefreshError?: (error: Error) => void;
}

export const useAutoRefresh = (
  refreshCallback: () => Promise<void>,
  options: AutoRefreshOptions = {}
) => {
  const {
    intervalMinutes = 45, // Default: 45 minutos (antes de 1 hora de expiración)
    enabled = true,
    onRefreshSuccess,
    onRefreshError,
  } = options;

  // Usar ref para evitar recrear el intervalo en cada render
  const callbackRef = useRef(refreshCallback);
  const onSuccessRef = useRef(onRefreshSuccess);
  const onErrorRef = useRef(onRefreshError);

  // Actualizar refs cuando cambien
  useEffect(() => {
    callbackRef.current = refreshCallback;
    onSuccessRef.current = onRefreshSuccess;
    onErrorRef.current = onRefreshError;
  }, [refreshCallback, onRefreshSuccess, onRefreshError]);

  useEffect(() => {
    

    const intervalMs = intervalMinutes * 60 * 1000;

   

    const executeRefresh = async () => {
      const startTime = Date.now();

      try {
        await callbackRef.current();

        const duration = Date.now() - startTime;

        onSuccessRef.current?.();
      } catch (error) {
        onErrorRef.current?.(error as Error);
      }
    };

    // Configurar intervalo
    const intervalId = setInterval(executeRefresh, intervalMs);

    // Cleanup: limpiar intervalo cuando el componente se desmonte o cambie enabled
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalMinutes, enabled]);

  return {
    intervalMinutes,
    enabled,
  };
};

/**
 * Configuraciones preestablecidas comunes
 */
export const AutoRefreshPresets = {
  /**
   * Agresivo: Cada 15 minutos
   * Para URLs de 30 minutos o menos
   */
  AGGRESSIVE: { intervalMinutes: 15 },

  /**
   * Estándar: Cada 30 minutos
   * Para URLs de 1 hora
   */
  STANDARD: { intervalMinutes: 30 },

  /**
   * Conservador: Cada 45 minutos
   * Para URLs de 1 hora (recomendado)
   */
  CONSERVATIVE: { intervalMinutes: 45 },

  /**
   * Relajado: Cada 2 horas
   * Para URLs de 6 horas
   */
  RELAXED: { intervalMinutes: 120 },

  /**
   * Muy relajado: Cada 4 horas
   * Para URLs de 6-24 horas
   */
  VERY_RELAXED: { intervalMinutes: 240 },
};
