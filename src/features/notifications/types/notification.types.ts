/* export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: Date;
}

export interface NotificationResponse {
  notifications: Notification[];
}
*/

export interface Notification {
  id: string;
  // Mapeamos 'tipo' del backend a 'title' y 'mensaje' a 'message'
  title: string; // Corresponde al campo 'tipo' (p. ej., 'like', 'match') del backend
  message: string; // Corresponde al campo 'mensaje' del backend
  read: boolean; // Corresponde al campo 'estado' == 'leido' del backend
  created_at: Date;
}

// Interfaz para la respuesta de la API de Django (lista de notificaciones)
export interface NotificationResponse {
  // El backend de DRF devuelve una lista de objetos directamente, no un campo 'notifications'.
  // Esta interfaz podría no ser estrictamente necesaria si la tipamos directamente como Notification[]
  // Pero la mantenemos para consistencia o si la API cambiara.
  notifications: Notification[];
} 