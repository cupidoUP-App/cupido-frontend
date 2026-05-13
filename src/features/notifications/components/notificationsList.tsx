import NotificationItem from "./notificationItem";
import { Notification } from "../types/notification.types";

interface NotificationsListProps {
  notifications: Notification[];
  visible: boolean;
}

/**
 * Componente que renderiza un panel desplegable con la lista de notificaciones.
 * Solo se muestra cuando la prop `visible` es true.
 * Muestra un mensaje de "No hay notificaciones" si el listado está vacío.
 */
export default function NotificationsList({notifications, visible}: NotificationsListProps) {
    if (!visible) {
        return null;
    }
    return (
        <div className="absolute right-4 top-16 w-80 bg-white rounded-xl shadow-lg max-h-96 overflow-y-auto p-2">
            {notifications.length === 0 ? (
                <p className="text-center text-blue-500 p-4">No hay notificaciones</p>
            ) : (
                notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))
            )}
            
        </div>
    )
}