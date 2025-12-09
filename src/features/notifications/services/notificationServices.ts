
// services/notificationServices.ts
import { AppNotification } from "../types/notification.types";

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

const getAuthToken = (): string | null => {
    return localStorage.getItem('access_token') || localStorage.getItem('token');
};

// Función auxiliar para obtener user_id del token (fuera del objeto)
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

export const NotificationsServices = {
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

    // Obtener conteo de no leídas
    async getUnreadCount(): Promise<number> {
        try {
            const notifications = await this.getNotifications();
            const unreadCount = notifications.filter(notif => !notif.read).length;
            return unreadCount;
        } catch (error) {
            return 0;
        }
    },

    // Función para crear una notificación de prueba
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

    // Función para probar la API manualmente
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