import { AppNotification } from "../types/notification.types";

/** Propiedades del componente NotificationItem. */
interface NotificationItemProps {
    /** Notificación a renderizar. */
    notification: AppNotification;
    /** Función opcional al hacer clic sobre el elemento. */
    onClick?: () => void;
}

/**
 * Componente que renderiza una notificación individual.
 * Muestra el tipo, mensaje, fecha y un indicador visual
 * (fondo azul + punto rojo) si la notificación no ha sido leída.
 */
export default function NotificationItem({notification, onClick}: NotificationItemProps) {
    // Clase condicional para cambiar el fondo si no está leída
    const itemClasses = notification.read 
        ? "p-3 bg-white shadow-sm rounded border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        : "p-3 bg-blue-50 shadow rounded border-b border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"; // Destacar si NO está leída

    return(
        <div className={itemClasses} onClick={onClick} role="button" tabIndex={0}>
            <h4 className="font-semibold text-blue-800 flex items-center justify-between">
                <span>{notification.tipo.toUpperCase()}</span>
                {/* Añadir un punto si no está leída */}
                {!notification.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500"></span>}
            </h4>
            <p className="text-sm text-gray-600">{notification.mensaje}</p>
            <p className="text-xs text-gray-400 mt-1">
                {new Date(notification.fecha_envio).toLocaleString()}
            </p>
        </div>
    )
}