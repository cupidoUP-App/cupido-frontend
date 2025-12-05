// types/notification.types.ts
export interface AppNotification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    created_at: Date;
}

// También exporta otros tipos relacionados
export interface NotificationResponse {
    notifications: AppNotification[];
}

export type NotificationType = 'like' | 'match' | 'chat' | 'reporte';