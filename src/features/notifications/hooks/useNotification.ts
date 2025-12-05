// hooks/useNotifications.ts - Con flag mejorado
import { useEffect, useState, useCallback, useRef } from 'react';
import { AppNotification } from '../types/notification.types';
import { NotificationsServices } from '../services/notificationServices';
import { websocketManager } from '../services/websocketManager';

export const useNotification = (autoConnect = true) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);
    const componentMounted = useRef(true);

    useEffect(() => {
        componentMounted.current = true;
        return () => {
            componentMounted.current = false;
        };
    }, []);

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

    const markAsRead = useCallback(async (id: string) => {
        try {
            await NotificationsServices.markAsRead(id);
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === id ? { ...notif, read: true } : notif
                )
            );
        } catch (err) {
            console.error('Error marking as read:', err);
            throw err;
        }
    }, []);

    // Setup WebSocket listeners
    useEffect(() => {
        if (!autoConnect) return;

        const handleNewNotification = (notification: AppNotification) => {
            if (componentMounted.current) {
                setNotifications(prev => [notification, ...prev]);
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

    const refresh = useCallback(async () => {
        await loadNotifications();
    }, [loadNotifications]);

    const connectWebSocket = useCallback(() => {
        websocketManager.connect();
    }, []);

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
        connectWebSocket,
        disconnectWebSocket,
    };
};