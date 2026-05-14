/**
 * Hook personalizado para la gestión de notificaciones en Cupido.
 * Proporciona el listado de notificaciones, estado de carga/error,
 * estado de conexión WebSocket y funciones para marcar como leídas,
 * eliminar, refrescar y controlar la conexión.
 *
 * @param autoConnect Si es true (por defecto), conecta automáticamente
 *                    el WebSocket y carga las notificaciones iniciales.
 * @returns notifications - Lista de notificaciones del usuario.
 * @returns loading - Indica si las notificaciones están cargando.
 * @returns error - Mensaje de error si ocurrió alguno.
 * @returns connected - Estado de la conexión WebSocket.
 * @returns refresh - Recarga las notificaciones desde el servidor.
 * @returns markAsRead - Marca una notificación como leída por ID.
 * @returns dismissNotification - Elimina una notificación por ID.
 * @returns connectWebSocket - Conecta manualmente el WebSocket.
 * @returns disconnectWebSocket - Desconecta manualmente el WebSocket.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { AppNotification } from '../types/notification.types';
import { NotificationsServices } from '../services/notificationServices';
import { websocketManager } from '../services/websocketManager';

export const useNotification = (autoConnect = true) => {
    /** Estado interno: lista de notificaciones del usuario. */
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    /** Estado interno: indica si las notificaciones están cargando. */
    const [loading, setLoading] = useState(true);
    /** Estado interno: mensaje de error si ocurrió un fallo. */
    const [error, setError] = useState<string | null>(null);
    /** Estado interno: indica si la conexión WebSocket está activa. */
    const [connected, setConnected] = useState(false);
    /** Ref que indica si el componente sigue montado para evitar actualizaciones después del desmontaje. */
    const componentMounted = useRef(true);

    useEffect(() => {
        componentMounted.current = true;
        return () => {
            componentMounted.current = false;
        };
    }, []);

    /** Carga la lista de notificaciones desde el servidor. */
    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await NotificationsServices.getNotifications();
            
            if (componentMounted.current) {
                setNotifications(data);
            }
        } catch (err) {
            if (componentMounted.current) {
                setError(err instanceof Error ? err.message : 'Error loading notifications');
            }
        } finally {
            if (componentMounted.current) {
                setLoading(false);
            }
        }
    }, []);

    /** Marca una notificación como leída por su ID. */
    const markAsRead = useCallback(async (id: string) => {
        try {
            await NotificationsServices.markAsRead(id);
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === id ? { ...notif, read: true } : notif
                )
            );
        } catch (err) {
            throw err;
        }
    }, []);
    /** Elimina una notificación por su ID. */
    const dismissNotification = useCallback(async (id: string) => {
        try {
            await NotificationsServices.deleteNotification(id);
            setNotifications(prev => prev.filter(notif => notif.id !== id));
        } catch (err) {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
        }
    }, []);



    // Setup WebSocket listeners
    useEffect(() => {
        if (!autoConnect) return;

        const handleNewNotification = (notification: AppNotification) => {
            if (componentMounted.current) {
                setNotifications(prev => {
                    // If this is a chat notification, update existing one instead of adding duplicate
                    if (notification.chat_id) {
                        const existingIndex = prev.findIndex(n => n.chat_id === notification.chat_id);
                        if (existingIndex !== -1) {
                            // Replace existing notification with the new one (updated message)
                            const updated = [...prev];
                            updated[existingIndex] = notification;
                            return updated;
                        }
                    }
                    // Otherwise, add as new notification
                    return [notification, ...prev];
                });
            }
        };

        const handleError = (error: Event | string) => {
            if (componentMounted.current) {
                setError(typeof error === 'string' ? error : 'WebSocket connection error');
            }
        };

        const handleConnection = (isConnected: boolean) => {
            if (componentMounted.current) {
                setConnected(isConnected);
                if (isConnected) {
                    setError(null);
                }
            }
        };

        websocketManager.addNotificationListener(handleNewNotification);
        websocketManager.addErrorListener(handleError);
        websocketManager.addConnectionListener(handleConnection);

        websocketManager.connect();

        return () => {
            websocketManager.removeNotificationListener(handleNewNotification);
            websocketManager.removeErrorListener(handleError);
            websocketManager.removeConnectionListener(handleConnection);
        };
    }, [autoConnect]);

    // Cargar notificaciones iniciales
    useEffect(() => {
        if (autoConnect) {
            loadNotifications();
        }
    }, [autoConnect, loadNotifications]);

    /** Recarga manualmente las notificaciones desde el servidor. */
    const refresh = useCallback(async () => {
        await loadNotifications();
    }, [loadNotifications]);

    /** Conecta manualmente el WebSocket de notificaciones. */
    const connectWebSocket = useCallback(() => {
        websocketManager.connect();
    }, []);

    /** Desconecta manualmente el WebSocket de notificaciones. */
    const disconnectWebSocket = useCallback(() => {
        websocketManager.disconnect();
    }, []);

    return {
        notifications,
        loading,
        error,
        connected,
        refresh,
        markAsRead,
        dismissNotification,
        connectWebSocket,
        disconnectWebSocket,
    };
};