import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppNotification } from "../types/notification.types";
import "./notificationsPage.css";

interface NotificationsPageProps {
  onClose?: () => void;
  notifications: AppNotification[];
  markAsRead: (id: string) => Promise<void>;
  dismissNotification: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  loading: boolean;
  error: string | null;
  connected: boolean;
}

export default function NotificationsPage({
  onClose,
  notifications,
  markAsRead,
  dismissNotification,
  refresh,
  loading,
  error,
  connected,
}: NotificationsPageProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Estado para evitar duplicados
  const [processedNotifications, setProcessedNotifications] = useState<Set<string>>(new Set());
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  // SOLUCIÓN 1: Filtrar notificaciones duplicadas
  const uniqueNotifications = notifications.filter((notification, index, self) => {
    // Usar id + created_at para identificar duplicados únicos
    const key = `${notification.id}-${notification.created_at.getTime()}`;
    const firstIndex = self.findIndex(n => 
      `${n.id}-${n.created_at.getTime()}` === key
    );
    return index === firstIndex;
  });

  // SOLUCIÓN 2: Navegación corregida - SIN setTimeout
  const handleNotificationClick = useCallback(async (notification: AppNotification) => {
    console.log("🖱️ Click en notificación ID:", notification.id);
    
    // Prevenir clics rápidos (debounce)
    const now = Date.now();
    if (now - lastClickTime < 300) {
      console.log("⏱️ Click demasiado rápido, ignorando");
      return;
    }
    setLastClickTime(now);
    
    try {
      // Marcar como leído si no lo está
      if (!notification.read) {
        await markAsRead(notification.id);
      }
      
      // SOLUCIÓN CRÍTICA: Navegar siempre que haya chat_id
      if (notification.chat_id) {
        console.log("🚀 Navegando a chat ID:", notification.chat_id);
        
        // Si hay función onClose, cerrar primero PERO SIN TIMEOUT
        if (onClose) {
          // Guardar el chat_id antes de cerrar
          const chatIdToNavigate = notification.chat_id;
          
          // Cerrar el panel
          onClose();
          
          // Navegar inmediatamente después del cierre
          // Usar un microtask para asegurar que el panel se cerró
          Promise.resolve().then(() => {
            console.log("📍 Navegando después de cerrar panel");
            navigate(`/chat?id=${chatIdToNavigate}`);
          });
        } else {
          // Si no hay panel que cerrar, navegar directamente
          navigate(`/chat?id=${notification.chat_id}`);
        }
      } else {
        console.log("ℹ️ Esta notificación no tiene chat_id");
      }
    } catch (error) {
      console.error("❌ Error al manejar notificación:", error);
    }
  }, [navigate, onClose, markAsRead, lastClickTime]);

  // SOLUCIÓN 3: Manejar dismiss
  const handleDismiss = useCallback(async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await dismissNotification(id);
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  }, [dismissNotification]);

  // Debug: mostrar info de notificaciones
  useEffect(() => {
    if (notifications.length > 0) {
      console.log("📊 Notificaciones recibidas:", notifications.length);
      console.log("✅ Notificaciones únicas:", uniqueNotifications.length);
      
      // Verificar duplicados
      const duplicateIds = notifications
        .map(n => n.id)
        .filter((id, index, arr) => arr.indexOf(id) !== index);
      
      if (duplicateIds.length > 0) {
        console.warn("⚠️ IDs duplicados detectados:", duplicateIds);
      }
    }
  }, [notifications, uniqueNotifications]);

  const unreadCount = uniqueNotifications.filter((n) => !n.read).length;

  if (error) {
    return (
      <div className="notifications-panel-container" ref={containerRef}>
        <div className="panel-header">
          <h2>Notificaciones</h2>
          {onClose && (
            <button 
              className="close-btn" 
              onClick={onClose}
              type="button"
              aria-label="Cerrar"
            >
              ✖
            </button>
          )}
        </div>
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={refresh} type="button">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-panel-container" ref={containerRef}>
      <div className="panel-header">
        <h2>Notificaciones</h2>

        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} sin leer</span>
        )}

        {onClose && (
          <button 
            className="close-btn" 
            onClick={onClose}
            type="button"
            aria-label="Cerrar panel"
          >
            ✖
          </button>
        )}
      </div>

      <div className="notifications-list-panel">
        {loading ? (
          <div className="loading-notifications">
            <p>
              Cargando notificaciones...{" "}
              {uniqueNotifications.length > 0
                ? `(${uniqueNotifications.length} cargadas)`
                : ""}
            </p>
          </div>
        ) : uniqueNotifications.length === 0 ? (
          <p className="empty-notifications">
            No hay notificaciones
          </p>
        ) : (
          <>
            <div
              style={{
                textAlign: "center",
                padding: "10px",
                background: "#10b981",
                color: "white",
                fontWeight: "bold",
              }}
            >
              ¡Notificaciones! ({uniqueNotifications.length})
            </div>

            {uniqueNotifications.map((notification, index) => (
              <div
                key={`${notification.id}-${index}-${notification.created_at.getTime()}`}
                className={`notification-card ${
                  !notification.read ? "unread" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
                style={{
                  cursor: "pointer",
                  border: "3px solid #3b82f6",
                  margin: "10px",
                  padding: "15px",
                  borderRadius: "10px",
                  background: "#f0f9ff",
                  position: "relative",
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleNotificationClick(notification);
                  }
                }}
              >
                <button
                  onClick={(e) => handleDismiss(e, notification.id)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "-12px",
                    transform: "translateY(-50%)",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    zIndex: 10,
                  }}
                  title="Eliminar notificación"
                  type="button"
                  aria-label="Eliminar notificación"
                >
                  ✕
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <div style={{ fontSize: "24px" }}>
                    {notification.title.toLowerCase().includes("like") && "❤️"}
                    {notification.title.toLowerCase().includes("match") && "✨"}
                    {notification.title.toLowerCase().includes("chat") && "💬"}
                    {notification.title.toLowerCase().includes("reporte") &&
                      "⚠️"}
                    {!["like", "match", "chat", "reporte"].some((t) =>
                      notification.title.toLowerCase().includes(t)
                    ) && "🔔"}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        margin: "0 0 5px 0",
                        color: "#1e40af",
                        fontSize: "16px",
                      }}
                    >
                      {notification.title} {!notification.read && "🔵"}
                      {uniqueNotifications.filter(n => n.id === notification.id).length > 1 && " ⚠️DUP"}
                    </h3>
                    <p
                      style={{
                        margin: "0 0 5px 0",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {notification.message}
                    </p>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {notification.read ? "📖 Leída" : "📨 No leída"} |
                      {formatNotificationTime(notification.created_at)} |
                      {notification.chat_id ? ` Chat ID: ${notification.chat_id}` : " Sin chat"} |
                      ID: {notification.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function formatNotificationTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Ahora";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays < 7) return `Hace ${diffDays} d`;

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}