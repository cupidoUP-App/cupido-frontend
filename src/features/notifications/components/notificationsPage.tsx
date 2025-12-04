import { useNotification } from "../hooks/useNotification";
import "./notificationsPage.css"; // o usa Tailwind inline

interface NotificationsPageProps {
  userId: string;
  onClose?: () => void; // Añadimos prop para cerrar desde sidebar
}

export default function NotificationsPage({ userId, onClose }: NotificationsPageProps) {
  const { notifications, showList, popup, togglelist } = useNotification(userId);
  
  // Calcular el número de notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Si se llama desde sidebar, mostramos el panel completo siempre
  // Si se usa independiente, mantenemos togglelist
  
  return (
    <div className="notifications-panel-container">
      {/* Encabezado del panel */}
      <div className="panel-header">
        <h2>Notificaciones</h2>
        
        {/* Contador de no leídas */}
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} sin leer</span>
        )}
        
        {/* Botón de cerrar (si viene de sidebar) */}
        {onClose && (
          <button className="close-btn" onClick={onClose}>✖</button>
        )}
        
        {/* Botón de campana para vista independiente */}
        {!onClose && (
          <div className="bell-container">
            <button className="bell-btn" onClick={togglelist}>
              🔔
              {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
            </button>
          </div>
        )}
      </div>

      {/* Lista de notificaciones (siempre visible en panel) */}
      <div className="notifications-list-panel">
        {notifications.length === 0 ? (
          <p className="empty-notifications">No hay notificaciones</p>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-card ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-icon">
                {notification.title === 'like' && '❤️'}
                {notification.title === 'match' && '✨'}
                {notification.title === 'message' && '💬'}
                {notification.title === 'reminder' && '⏰'}
              </div>
              
              <div className="notification-content">
                <h3 className="notification-title">
                  {notification.title || getDefaultTitle(notification.title)}
                </h3>
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              
              {!notification.read && <div className="unread-dot"></div>}
            </div>
          ))
        )}
      </div>

      {/* Popup para nuevas notificaciones (se mantiene) */}
      {popup && !onClose && ( // Solo mostrar popup si no está en panel
        <div className="popup-notification">
          <h4>{popup.title}</h4>
          <p>{popup.message}</p>
          <span className="popup-time">
            {new Date(popup.created_at).toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
}

// Función helper para títulos por defecto
function getDefaultTitle(type: string): string {
  const titles: Record<string, string> = {
    'like': '¡Nuevo like!',
    'match': '¡Tienes un match!',
    'message': 'Nuevo mensaje',
    'reminder': 'Recordatorio',
  };
  return titles[type] || 'Nueva notificación';
}