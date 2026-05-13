/**
 * Servicio de notificaciones para Cupido.
 * Proporciona métodos para obtener, marcar como leídas, eliminar
 * y crear notificaciones desde la API REST de Django.
 */

import { AppNotification } from "../types/notification.types";

/**
 * Mapea una notificación del formato de Django (snake_case) al
 * formato interno de la aplicación (camelCase).
 * @param djangoNotif Objeto de notificación proveniente del backend.
 */
const mapDjangoToFrontend = (djangoNotif: any): AppNotification => {
    return {
        id: djangoNotif.id.toString(),
        tipo: djangoNotif.tipo.charAt(0).toUpperCase() + djangoNotif.tipo.slice(1), 
        mensaje: djangoNotif.mensaje,
        read: djangoNotif.estado === 'leido', 
        fecha_envio: new Date(djangoNotif.fecha_envio),
        chat_id: djangoNotif.chat_id || null,
        from_user_id: djangoNotif.from_user_id || null,
        usuario_match_id: djangoNotif.usuario_match_id || null,
    };
};

/** Obtiene el token de autenticación desde localStorage. */
const getAuthToken = (): string | null => {
    return localStorage.getItem('access_token') || localStorage.getItem('token');
};

/**
 * Extrae el ID del usuario desde el token JWT almacenado en localStorage.
 * Función auxiliar independiente del objeto NotificationsServices.
 */
const getUserIdFromToken = (): string | null => {
    const token = getAuthToken();
    if (token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const payload = JSON.parse(jsonPayload);
            return payload.user_id || payload.usuario_id || payload.id;
        } catch (e) {
            return null;
        }
    }
    return null;
};

const VITE_API_BASE = import.meta.env.VITE_API_BASE_URL;  
let API_BASE_URL = `${VITE_API_BASE}/notificaciones/`;

/**
 * Servicio de notificaciones que agrupa las operaciones CRUD
 * contra la API REST de notificaciones del backend Django.
 */
export const NotificationsServices = {
    /**
     * Obtiene todas las notificaciones del usuario autenticado.
     * Soporta tanto respuestas paginadas como arrays directos.
     * @throws Error si no hay token o el formato de respuesta es inesperado.
     */
    async getNotifications(): Promise<AppNotification[]> {
        const token = getAuthToken();
        
        if (!token) {
            throw new Error('No authentication token found. Please log in.');
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        try {
            
            const res = await fetch(API_BASE_URL, {
                credentials: 'include',
                headers,
            });

            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch notifications: ${res.status} ${res.statusText}`);
            }

            const responseData = await res.json();
            
            // DRF con paginación devuelve { count, next, previous, results }
            let notificationsArray: any[] = [];
            
            if (responseData.results && Array.isArray(responseData.results)) {
                // Caso con paginación
                notificationsArray = responseData.results;
            } else if (Array.isArray(responseData)) {
                // Caso sin paginación (array directo)
                notificationsArray = responseData;
            } else {
                throw new Error('Unexpected response format from server');
            }
            
            
            
            
            return notificationsArray.map(mapDjangoToFrontend);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Marca una notificación como leída en el servidor.
     * @param id Identificador único de la notificación.
     * @throws Error si no hay token o la solicitud falla.
     */
    async markAsRead(id: string) {
        const token = getAuthToken();
        
        if (!token) {
            throw new Error('No authentication token found');
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        try {
            const markReadUrl = `${API_BASE_URL}${id}/mark_read/`;
            
            const res = await fetch(markReadUrl, {
                method: 'POST',
                credentials: 'include',
                headers,
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to mark notification as read: ${res.status}`);
            }
            
            const result = await res.json();
            return result;
        } catch (error) {
            throw error;
        }
    },


    /**
     * Elimina una notificación del servidor.
     * @param id Identificador único de la notificación a eliminar.
     * @returns true si la eliminación fue exitosa.
     * @throws Error si no hay token o la solicitud falla.
     */
    async deleteNotification(id: string): Promise<boolean> {
        const token = getAuthToken();
        
        if (!token) {
            throw new Error('No authentication token found');
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        try {
            const deleteUrl = `${API_BASE_URL}${id}/`;
            
            const res = await fetch(deleteUrl, {
                method: 'DELETE',
                credentials: 'include',
                headers,
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to delete notification: ${res.status}`);
            }
            
            return true;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Calcula la cantidad de notificaciones no leídas.
     * @returns Número de notificaciones sin leer. Retorna 0 si hay error.
     */
    async getUnreadCount(): Promise<number> {
        try {
            const notifications = await this.getNotifications();
            const unreadCount = notifications.filter(notif => !notif.read).length;
            return unreadCount;
        } catch (error) {
            return 0;
        }
    },

    /**
     * Crea una notificación de prueba en el servidor.
     * Utiliza el ID del usuario extraído del token JWT.
     * @returns true si la notificación se creó correctamente, false en caso contrario.
     */
    async createTestNotification(): Promise<boolean> {
        const token = getAuthToken();
        
        if (!token) {
            return false;
        }

        const userId = getUserIdFromToken(); // Usar la función auxiliar
        if (!userId) {
            return false;
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        try {
            const testNotification = {
                tipo: 'test',
                mensaje: 'Esta es una notificación de prueba creada desde el frontend',
                usuario_destino: userId,
                estado: 'enviado'
            };

            
            const res = await fetch(API_BASE_URL, {
                method: 'POST',
                credentials: 'include',
                headers,
                body: JSON.stringify(testNotification)
            });

            if (res.ok) {
                const result = await res.json();
                return true;
            } else {
                const errorText = await res.text();
                return false;
            }
        } catch (error) {
            return false;
        }
    },

    /**
     * Envía una notificación de prueba al servidor.
     * Funcionalmente idéntica a createTestNotification.
     * @returns true si la notificación se envió correctamente, false en caso contrario.
     */
    async sendTestNotification(): Promise<boolean> {
        const token = getAuthToken();
        
        if (!token) {
            return false;
        }

        const userId = getUserIdFromToken();
        if (!userId) {
            return false;
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        try {
            const testNotification = {
                tipo: 'test',
                mensaje: 'Esta es una notificación de prueba creada desde el frontend',
                usuario_destino: userId,
                estado: 'enviado'
            };

            
            const res = await fetch(API_BASE_URL, {
                method: 'POST',
                credentials: 'include',
                headers,
                body: JSON.stringify(testNotification)
            });

            if (res.ok) {
                const result = await res.json();
                return true;
            } else {
                const errorText = await res.text();
                return false;
            }
        } catch (error) {
            return false;
        }
    },

    /**
     * Función de utilidad para probar la conectividad con la API de notificaciones.
     * @returns Una promesa que resuelve con los datos de la respuesta o un objeto de error.
     */
    testApi(): Promise<any> {
        return new Promise(async (resolve) => {
            try {
                const token = getAuthToken();
                
                if (!token) {
                    resolve({ error: 'No token' });
                    return;
                }
                
                const res = await fetch(API_BASE_URL, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                
                const data = await res.json();
                
                
                resolve(data);
            } catch (error) {
                resolve({ error: error instanceof Error ? error.message : 'Unknown error' });
            }
        });
    }
};