
// services/notificationServices.ts
import { AppNotification } from "../types/notification.types";

const mapDjangoToFrontend = (djangoNotif: any): AppNotification => {
    return {
        id: djangoNotif.id.toString(),
        title: djangoNotif.tipo.charAt(0).toUpperCase() + djangoNotif.tipo.slice(1), 
        message: djangoNotif.mensaje,
        read: djangoNotif.estado === 'leido', 
        created_at: new Date(djangoNotif.fecha_envio),
        chat_id: djangoNotif.chat_id || null,  // ID del chat para navegación
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
            console.error('❌ Error decoding token:', e);
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
            console.error('❌ No authentication token found');
            throw new Error('No authentication token found. Please log in.');
        }

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        try {
            console.log('📡 Fetching notifications from:', API_BASE_URL);
            
            const res = await fetch(API_BASE_URL, {
                credentials: 'include',
                headers,
            });

            console.log('📊 Response status:', res.status, res.statusText);
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error('❌ Error response:', errorText);
                throw new Error(`Failed to fetch notifications: ${res.status} ${res.statusText}`);
            }

            const responseData = await res.json();
            console.log('📦 Raw API response:', responseData);
            
            // DRF con paginación devuelve { count, next, previous, results }
            let notificationsArray: any[] = [];
            
            if (responseData.results && Array.isArray(responseData.results)) {
                // Caso con paginación
                notificationsArray = responseData.results;
                console.log(`📄 Paginated response: ${responseData.count} total notifications`);
                console.log(`📄 Current page: ${notificationsArray.length} notifications`);
            } else if (Array.isArray(responseData)) {
                // Caso sin paginación (array directo)
                notificationsArray = responseData;
                console.log(`📄 Direct array: ${notificationsArray.length} notifications`);
            } else {
                console.error('❌ Unexpected response format:', responseData);
                throw new Error('Unexpected response format from server');
            }
            
            console.log(`✅ Parsed ${notificationsArray.length} notifications`);
            
            if (notificationsArray.length > 0) {
                console.log('📋 First notification:', notificationsArray[0]);
            } else {
                console.log('📭 No notifications found');
            }
            
            return notificationsArray.map(mapDjangoToFrontend);
        } catch (error) {
            console.error("❌ Network/API error:", error);
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
            console.log('📝 Marking as read:', markReadUrl);
            
            const res = await fetch(markReadUrl, {
                method: 'POST',
                credentials: 'include',
                headers,
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`❌ Error marking notification ${id} as read:`, res.status, errorText);
                throw new Error(`Failed to mark notification as read: ${res.status}`);
            }
            
            const result = await res.json();
            console.log('✅ Marked as read:', result);
            return result;
        } catch (error) {
            console.error('❌ Error in markAsRead:', error);
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
            console.log('🗑️ Deleting notification:', deleteUrl);
            
            const res = await fetch(deleteUrl, {
                method: 'DELETE',
                credentials: 'include',
                headers,
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`❌ Error deleting notification ${id}:`, res.status, errorText);
                throw new Error(`Failed to delete notification: ${res.status}`);
            }
            
            console.log('✅ Notification deleted:', id);
            return true;
        } catch (error) {
            console.error('❌ Error in deleteNotification:', error);
            throw error;
        }
    },

    // Obtener conteo de no leídas
    async getUnreadCount(): Promise<number> {
        try {
            const notifications = await this.getNotifications();
            const unreadCount = notifications.filter(notif => !notif.read).length;
            console.log(`📊 Unread count: ${unreadCount}`);
            return unreadCount;
        } catch (error) {
            console.error('❌ Error getting unread count:', error);
            return 0;
        }
    },

    // Función para crear una notificación de prueba
    async createTestNotification(): Promise<boolean> {
        const token = getAuthToken();
        
        if (!token) {
            console.error('❌ No token for test');
            return false;
        }

        const userId = getUserIdFromToken(); // Usar la función auxiliar
        if (!userId) {
            console.error('❌ No user ID for test');
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

            console.log('🧪 Creating test notification:', testNotification);
            
            const res = await fetch(API_BASE_URL, {
                method: 'POST',
                credentials: 'include',
                headers,
                body: JSON.stringify(testNotification)
            });

            if (res.ok) {
                const result = await res.json();
                console.log('✅ Test notification created:', result);
                return true;
            } else {
                const errorText = await res.text();
                console.error('❌ Failed to create test notification:', res.status, errorText);
                return false;
            }
        } catch (error) {
            console.error('❌ Error creating test notification:', error);
            return false;
        }
    },

    async sendTestNotification(): Promise<boolean> {
        const token = getAuthToken();
        
        if (!token) {
            console.error('❌ No token for test');
            return false;
        }

        const userId = getUserIdFromToken();
        if (!userId) {
            console.error('❌ No user ID for test');
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

            console.log('🧪 Sending test notification:', testNotification);
            
            const res = await fetch(API_BASE_URL, {
                method: 'POST',
                credentials: 'include',
                headers,
                body: JSON.stringify(testNotification)
            });

            if (res.ok) {
                const result = await res.json();
                console.log('✅ Test notification sent:', result);
                return true;
            } else {
                const errorText = await res.text();
                console.error('❌ Failed to send test notification:', res.status, errorText);
                return false;
            }
        } catch (error) {
            console.error('❌ Error sending test notification:', error);
            return false;
        }
    },

    // Función para probar la API manualmente
    testApi(): Promise<any> {
        return new Promise(async (resolve) => {
            try {
                const token = getAuthToken();
                
                if (!token) {
                    console.error('❌ No token found');
                    resolve({ error: 'No token' });
                    return;
                }

                console.log('🧪 Testing API...');
                console.log('🔗 URL:', API_BASE_URL);
                console.log('🔑 Token (first 30 chars):', token.substring(0, 30) + '...');
                
                const res = await fetch(API_BASE_URL, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                console.log('📊 Response status:', res.status, res.statusText);
                
                const data = await res.json();
                console.log('📦 Response data:', data);
                
                if (res.ok) {
                    console.log('✅ API test successful!');
                    console.log(`📊 Total notifications in DB: ${data.count}`);
                    console.log(`📋 Notifications in this page: ${data.results?.length || 0}`);
                } else {
                    console.error('❌ API test failed');
                }
                
                resolve(data);
            } catch (error) {
                console.error('❌ API test error:', error);
                resolve({ error: error instanceof Error ? error.message : 'Unknown error' });
            }
        });
    }
};