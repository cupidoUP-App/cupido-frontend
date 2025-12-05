// types/notification.types.ts
export interface AppNotification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    created_at: Date;
    chat_id?: number | null;  // ID del chat para navegación (solo en notificaciones de tipo 'chat')
}

// También exporta otros tipos relacionados
export interface NotificationResponse {
    notifications: AppNotification[];
}

export type NotificationType = 'like' | 'match' | 'chat' | 'reporte';