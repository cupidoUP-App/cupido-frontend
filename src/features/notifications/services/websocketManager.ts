/**
 * Módulo de gestión de conexiones WebSocket para notificaciones en tiempo real.
 * Implementa el patrón Singleton para mantener una única conexión activa
 * y expone un sistema de listeners para notificaciones, errores y estado de conexión.
 */

import { AppNotification } from "../types/notification.types";
import { buildWsUrl } from "../../../shared/utils/ws";

const WS_NOTI_BASE_URL = import.meta.env.VITE_WSNOTI_BASE_URL;

/**
 * Administrador de conexiones WebSocket.
 * Gestiona el ciclo de vida de la conexión, reconexión automática ante errores
 * y la distribución de eventos a los listeners registrados.
 */
class WebSocketManager {
    private static instance: WebSocketManager;
    private socket: WebSocket | null = null;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private isConnecting = false;
    private listeners: Set<(notification: AppNotification) => void> = new Set();
    private errorListeners: Set<(error: Event | string) => void> = new Set();
    private connectionListeners: Set<(connected: boolean) => void> = new Set();

    /** Constructor privado para forzar el uso del singleton. */
    private constructor() {
        // Constructor privado para singleton
    }

    /**
     * Retorna la única instancia de WebSocketManager.
     * La crea si aún no ha sido inicializada.
     */
    static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }

    /**
     * Extrae el ID del usuario desde el token JWT almacenado en localStorage.
     * Intenta distintas claves comunes (user_id, usuario_id, id, userId, sub).
     */
    private getUserId(): string | null {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                
                const payload = JSON.parse(jsonPayload);
                return payload.user_id || payload.usuario_id || payload.id || payload.userId || payload.sub;
            } catch (e) {
            }
        }
        return null;
    }

    /** Obtiene el token de autenticación desde localStorage. */
    private getAuthToken(): string | null {
        return localStorage.getItem('access_token') || localStorage.getItem('token');
    }

    /**
     * Inicia la conexión WebSocket hacia el servidor de notificaciones.
     * Si ya hay una conexión abierta o una en progreso, la operación se omite.
     * En caso de cierre anormal, se programa una reconexión automática a los 3 segundos.
     */
    connect() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            return;
        }

        if (this.isConnecting) {
            return;
        }

        const userId = this.getUserId();
        const token = this.getAuthToken();

        if (!userId) {
            this.notifyError('No user ID found');
            return;
        }

        this.isConnecting = true;

        // Limpiar conexión anterior
        if (this.socket) {
            this.socket.close(1000, "Reconnecting");
            this.socket = null;
        }

        // Limpiar timeout de reconexión
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        // Construir URL
        const wsUrl = buildWsUrl({
            baseUrl: WS_NOTI_BASE_URL,
            fallbackPath: '/ws/notificaciones',
            pathSegments: [userId],
            query: { token },
        });

        try {
            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = () => {
                this.isConnecting = false;
                this.notifyConnection(true);
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.tipo && data.mensaje) {
                         const notification: AppNotification = {
                            id: data.id?.toString() || Date.now().toString(),
                            tipo: data.tipo,
                            mensaje: data.mensaje,
                            read: data.estado === "leido",
                            fecha_envio: data.fecha_envio || new Date().toISOString(),
                            from_user_id: data.from_user_id || null,
                            chat_id: data.chat_id || null,
                        };
                        this.notifyListeners(notification);
                    }
                } catch (e) {
                }
            };

            this.socket.onerror = (error) => {
                this.isConnecting = false;
                this.notifyError(error);
                this.notifyConnection(false);
            };

            this.socket.onclose = (event) => {
                this.isConnecting = false;
                this.notifyConnection(false);
                
                // Reconectar automáticamente solo para errores anormales
                if (event.code !== 1000 && event.code !== 1001) {
                    this.reconnectTimeout = setTimeout(() => {
                        this.connect();
                    }, 3000);
                }
            };

        } catch (error) {
            this.isConnecting = false;
            this.notifyError('Failed to create WebSocket');
        }
    }

    /**
     * Cierra la conexión WebSocket de forma controlada.
     * Cancela cualquier reconexión pendiente y notifica a los listeners.
     */
    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.socket) {
            this.socket.close(1000, "User initiated disconnect");
            this.socket = null;
        }

        this.notifyConnection(false);
    }

    /**
     * Registra un listener que se invocará al recibir una nueva notificación.
     * @param listener Función callback que recibe la notificación entrante.
     */
    addNotificationListener(listener: (notification: AppNotification) => void) {
        this.listeners.add(listener);
    }

    /**
     * Elimina un listener de notificaciones previamente registrado.
     * @param listener La misma referencia de función usada al registrarlo.
     */
    removeNotificationListener(listener: (notification: AppNotification) => void) {
        this.listeners.delete(listener);
    }

    /**
     * Registra un listener para errores de la conexión WebSocket.
     * @param listener Función callback que recibe el error (Event o string).
     */
    addErrorListener(listener: (error: Event | string) => void) {
        this.errorListeners.add(listener);
    }

    /**
     * Elimina un listener de errores previamente registrado.
     * @param listener La misma referencia de función usada al registrarlo.
     */
    removeErrorListener(listener: (error: Event | string) => void) {
        this.errorListeners.delete(listener);
    }

    /**
     * Registra un listener para cambios en el estado de conexión.
     * @param listener Función callback que recibe true si está conectado, false en caso contrario.
     */
    addConnectionListener(listener: (connected: boolean) => void) {
        this.connectionListeners.add(listener);
    }

    /**
     * Elimina un listener de conexión previamente registrado.
     * @param listener La misma referencia de función usada al registrarlo.
     */
    removeConnectionListener(listener: (connected: boolean) => void) {
        this.connectionListeners.delete(listener);
    }

    /** Notifica a todos los listeners registrados sobre una nueva notificación. */
    private notifyListeners(notification: AppNotification) {
        this.listeners.forEach(listener => listener(notification));
    }

    /** Notifica a todos los listeners registrados sobre un error. */
    private notifyError(error: Event | string) {
        this.errorListeners.forEach(listener => listener(error));
    }

    /** Notifica a todos los listeners registrados sobre el estado de la conexión. */
    private notifyConnection(connected: boolean) {
        this.connectionListeners.forEach(listener => listener(connected));
    }

    /**
     * Indica si actualmente hay una conexión WebSocket activa.
     * @returns true si el socket está en estado OPEN.
     */
    isConnected(): boolean {
        return this.socket?.readyState === WebSocket.OPEN;
    }
}

export const websocketManager = WebSocketManager.getInstance();
