// notificationsPage.tsx - Con navegación a chat para notificaciones de chat y match
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
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  // Filtrar notificaciones duplicadas
  const uniqueNotifications = notifications.filter(
    (notification, index, self) => {
      const key = `${notification.id}-${notification.created_at.getTime()}`;
      const firstIndex = self.findIndex(
        (n) => `${n.id}-${n.created_at.getTime()}` === key
      );
      return index === firstIndex;
    }
  );

  // Manejar click en notificación
  const handleNotificationClick = useCallback(
    async (notification: AppNotification) => {
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

        // Navegar al chat si hay chat_id (para notificaciones de chat Y match)
        if (notification.chat_id) {
          console.log("Navegando a chat ID:", notification.chat_id);

          const chatIdToNavigate = notification.chat_id;

          // Cerrar panel si está abierto
          if (onClose) {
            onClose();
          }

          // Navegar después de un pequeño delay para permitir que el panel se cierre
          setTimeout(() => {
            navigate(`/chat?chatId=${chatIdToNavigate}`);
          }, 100);
        } else {
          console.log("ℹ️ Esta notificación no tiene chat_id");
        }
      } catch (err) {
        console.error("❌ Error al manejar notificación:", err);
      }
    },
    [navigate, onClose, markAsRead, lastClickTime]
  );

  // Manejar dismiss
  const handleDismiss = useCallback(
    async (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        await dismissNotification(id);
      } catch (err) {
        console.error("Error al eliminar notificación:", err);
      }
    },
    [dismissNotification]
  );

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
          <button onClick={refresh} type="button">
            Reintentar
          </button>
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
          <p className="empty-notifications">No hay notificaciones</p>
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
                key={`${
                  notification.id
                }-${index}-${notification.created_at.getTime()}`}
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
                  if (e.key === "Enter" || e.key === " ") {
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
                      {notification.read ? "📖 Leída" : "📨 No leída"} |{" "}
                      {formatNotificationTime(notification.created_at)}
                      {notification.chat_id && " | 💬 Click para ir al chat"}
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