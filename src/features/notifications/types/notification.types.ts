// types/notification.types.ts
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

// También exporta otros tipos relacionados
export interface NotificationResponse {
    notifications: AppNotification[];
}

export type NotificationType = 'like' | 'match' | 'chat' | 'reporte';
