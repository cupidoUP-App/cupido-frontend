/*import { Notification} from "../types/notification.types";

export default function NotificationItem({notification}: {notification: Notification}) {
    return(
        <div className="p-3 border-b bg-white shadow-sm rounded">
            <h4 className="font-semibold">{notification.title}</h4>
            <p className="text-sm text-gray-600">{notification.message}</p>
            <p className="text-xs text-gray-400">{new Date(notification.created_at).toLocaleString()}</p>
        </div>
    )

}*/

import { Notification} from "../types/notification.types";

export default function NotificationItem({notification}: {notification: Notification}) {
    // Clase condicional para cambiar el fondo si no está leída
    const itemClasses = notification.read 
        ? "p-3 bg-white shadow-sm rounded border-b border-gray-100"
        : "p-3 bg-blue-50 shadow rounded border-b border-blue-100"; // Destacar si NO está leída

    return(
        <div className={itemClasses}>
            <h4 className="font-semibold text-blue-800">
                {notification.title}
                {/* Añadir un punto si no está leída */}
                {!notification.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500"></span>}
            </h4>
            <p className="text-sm text-gray-600">{notification.message}</p>
            <p className="text-xs text-gray-400 mt-1">
                {new Date(notification.created_at).toLocaleString()}
            </p>
        </div>
    )
}