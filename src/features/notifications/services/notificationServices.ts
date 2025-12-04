/*const API_URL = 'https://localhost:5173/api/v1';

export const NotificationsServices =  {
    async getNotifications(userId: string) {
        const res = await fetch(`${API_URL}/notifications/${userId}`);
    //return res.json();
    return {
        notifications: [
            {
                id: '1',
                title: 'Welcome',
                message: 'Welcome to our service!',
                read: false,
                created_at: new Date(),
            }
        ]
    };
},

async markAsRead(id: string) {
    await fetch(`${API_URL}/notifications/read/${id}`, {
        method: 'PUT',
    });
},
};*/

import { Notification, NotificationResponse } from "../types/notification.types.ts";


// Asumo que tu backend de Django se está ejecutando en http://localhost:8000
const API_BASE_URL = 'http://localhost:8000/api/notifications/';
const WEBSOCKET_URL = 'ws://localhost:8000/ws/notificaciones/';

// Función auxiliar para mapear el objeto de Django al objeto de React/TS
const mapDjangoToFrontend = (djangoNotif: any): Notification => {
    return {
        id: djangoNotif.id,
        // Usamos 'tipo' del backend como 'title' en el frontend
        title: djangoNotif.tipo.charAt(0).toUpperCase() + djangoNotif.tipo.slice(1), 
        message: djangoNotif.mensaje, // Usamos 'mensaje' del backend como 'message'
        // Mapeamos 'estado' del backend a 'read' booleano en el frontend
        read: djangoNotif.estado === 'leido', 
        created_at: new Date(djangoNotif.fecha_envio),
    };
};

export const NotificationsServices = {
    // 1. Obtener la lista de notificaciones (API REST)
    async getNotifications(userId: string): Promise<Notification[]> {
        // En el backend de DRF, el `get_queryset` de NotificacionViewSet ya filtra por el 
        // usuario autenticado (request.user). El `userId` no es usado en la URL por seguridad.
        // Asumimos que el usuario está autenticado mediante sesión/token en el frontend.
        const res = await fetch(API_BASE_URL, {
            // Es crucial incluir credenciales para que la sesión de Django funcione
            credentials: 'include', 
        });

        if (!res.ok) {
            console.error("Error fetching notifications:", res.statusText);
            throw new Error(`Failed to fetch notifications: ${res.statusText}`);
        }

        // DRF devuelve un array de objetos
        const djangoNotifications: any[] = await res.json();
        
        // Mapeamos cada objeto
        const notifications = djangoNotifications.map(mapDjangoToFrontend);

        // Devolvemos el array directamente (eliminando la necesidad de NotificationResponse.notifications)
        return notifications; 
    },

    // 2. Marcar como leído (API REST - Acción personalizada)
    async markAsRead(id: string) {
        // El endpoint es /api/notifications/{id}/mark_read/
        const res = await fetch(`${API_BASE_URL}${id}/mark_read/`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!res.ok) {
            console.error(`Error marking notification ${id} as read:`, res.statusText);
            throw new Error(`Failed to mark notification as read: ${res.statusText}`);
        }
        // No necesitamos el cuerpo, solo confirmamos el éxito (res.ok)
    },

    // 3. Conexión WebSocket
    connectWebSocket(
        onNewNotification: (notification: Notification) => void, 
        onError: (error: Event) => void
    ): WebSocket {
        const socket = new WebSocket(WEBSOCKET_URL);

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // El payload del backend ya es un objeto de notificación con 'tipo', 'mensaje', etc.
                const newNotification = mapDjangoToFrontend(data);
                onNewNotification(newNotification);
            } catch (e) {
                console.error("Error parsing WebSocket message:", e);
            }
        };

        socket.onerror = (error) => {
            onError(error);
        };
        
        // No necesitamos manejar onopen o onclose aquí, pero es buena práctica.

        return socket;
    }
};