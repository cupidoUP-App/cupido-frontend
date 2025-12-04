// services/websocketManager.ts
import { AppNotification } from "../types/notification.types";

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
                console.error("❌ Error decoding token:", e);
            }
        }
        return null;
    }

    private getAuthToken(): string | null {
        return localStorage.getItem('access_token') || localStorage.getItem('token');
    }

    connect() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('⚠️ WebSocket already connected');
            return;
        }

        if (this.isConnecting) {
            console.log('⚠️ WebSocket connection already in progress');
            return;
        }

        const userId = this.getUserId();
        const token = this.getAuthToken();

        if (!userId) {
            console.error('❌ No user ID found');
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
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        let wsUrl = `${protocol}://${window.location.host}/ws/notificaciones/${userId}/`;
        
        if (token) {
            wsUrl += `?token=${encodeURIComponent(token)}`;
        }

        console.log('🌐 Connecting WebSocket:', wsUrl);

        try {
            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = () => {
                console.log('✅ WebSocket connected');
                this.isConnecting = false;
                this.notifyConnection(true);
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.tipo && data.mensaje) {
                        const notification: AppNotification = {
                            id: data.id?.toString() || Date.now().toString(),
                            title: data.tipo.charAt(0).toUpperCase() + data.tipo.slice(1),
                            message: data.mensaje,
                            read: data.estado === 'leido',
                            created_at: new Date(data.fecha_envio || Date.now())
                        };
                        this.notifyListeners(notification);
                    }
                } catch (e) {
                    console.error('❌ Error parsing message:', e);
                }
            };

            this.socket.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                this.isConnecting = false;
                this.notifyError(error);
                this.notifyConnection(false);
            };

            this.socket.onclose = (event) => {
                console.log(`🔌 WebSocket closed: ${event.code} ${event.reason}`);
                this.isConnecting = false;
                this.notifyConnection(false);
                
                // Reconectar automáticamente solo para errores anormales
                if (event.code !== 1000 && event.code !== 1001) {
                    console.log('🔄 Will reconnect in 3 seconds...');
                    this.reconnectTimeout = setTimeout(() => {
                        this.connect();
                    }, 3000);
                }
            };

        } catch (error) {
            console.error('❌ Failed to create WebSocket:', error);
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