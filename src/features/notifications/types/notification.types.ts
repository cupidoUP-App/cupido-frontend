/**
 * Representa una notificación dentro de la aplicación Cupido.
 * Contiene la información necesaria para mostrar y gestionar
 * notificaciones de tipo like, match, chat o reporte.
 */
export interface AppNotification {
   id: string;
   tipo: 'like' | 'match' | 'chat' | 'reporte';
   mensaje: string;
   read: boolean;
   fecha_envio: string | Date;
   from_user_id?: number | null;
   from_username?: string | null;
   usuario_match_id?: number | null;
   chat_id?: number | null;
}

/** Respuesta del servidor que contiene un listado de notificaciones. */
export interface NotificationResponse {
    notifications: AppNotification[];
}

/** Tipos válidos de notificación en el sistema. */
export type NotificationType = 'like' | 'match' | 'chat' | 'reporte';
