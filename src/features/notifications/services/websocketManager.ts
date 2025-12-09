// services/websocketManager.ts
import { AppNotification } from "../types/notification.types";
import { buildWsUrl } from "../../../shared/utils/ws";

const WS_NOTI_BASE_URL = import.meta.env.VITE_WSNOTI_BASE_URL;

class WebSocketManager {
    private static instance: WebSocketManager;
    private socket: WebSocket | null = null;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private isConnecting = false;
    private listeners: Set<(notification: AppNotification) => void> = new Set();
    private errorListeners: Set<(error: Event | string) => void> = new Set();
    private connectionListeners: Set<(connected: boolean) => void> = new Set();

    private constructor() {
        // Constructor privado para singleton
    }

    static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }

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

    private getAuthToken(): string | null {
        return localStorage.getItem('access_token') || localStorage.getItem('token');
    }

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

    // Métodos para suscribirse a eventos
    addNotificationListener(listener: (notification: AppNotification) => void) {
        this.listeners.add(listener);
    }

    removeNotificationListener(listener: (notification: AppNotification) => void) {
        this.listeners.delete(listener);
    }

    addErrorListener(listener: (error: Event | string) => void) {
        this.errorListeners.add(listener);
    }

    removeErrorListener(listener: (error: Event | string) => void) {
        this.errorListeners.delete(listener);
    }

    addConnectionListener(listener: (connected: boolean) => void) {
        this.connectionListeners.add(listener);
    }

    removeConnectionListener(listener: (connected: boolean) => void) {
        this.connectionListeners.delete(listener);
    }

    // Métodos para notificar a los listeners
    private notifyListeners(notification: AppNotification) {
        this.listeners.forEach(listener => listener(notification));
    }

    private notifyError(error: Event | string) {
        this.errorListeners.forEach(listener => listener(error));
    }

    private notifyConnection(connected: boolean) {
        this.connectionListeners.forEach(listener => listener(connected));
    }

    // Estado actual
    isConnected(): boolean {
        return this.socket?.readyState === WebSocket.OPEN;
    }
}

export const websocketManager = WebSocketManager.getInstance();
