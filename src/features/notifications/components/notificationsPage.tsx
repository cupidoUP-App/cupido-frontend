// notificationsPage.tsx - Versión simplificada para debugging
import { useState, useEffect, useRef } from "react";
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
  const [renderKey, setRenderKey] = useState(0);
  const prevNotificationsRef = useRef<number>(0);

  // Forzar re-render cuando cambien las notificaciones
  useEffect(() => {
    if (notifications.length !== prevNotificationsRef.current) {
      console.log("🔄 Component: Notifications changed, forcing re-render");
      console.log("📊 Previous count:", prevNotificationsRef.current);
      console.log("📊 New count:", notifications.length);
      console.log("📊 Notifications:", notifications);

      prevNotificationsRef.current = notifications.length;
      setRenderKey((prev) => prev + 1);
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  console.log("🎨 Component render - key:", renderKey, {
    notificationsCount: notifications.length,
    loading,
    error,
    connected,
    unreadCount,
  });

  if (error) {
    return (
      <div className="notifications-panel-container">
        <div className="panel-header">
          <h2>Notificaciones</h2>
          {onClose && (
            <button className="close-btn" onClick={onClose}>
              ✖
            </button>
          )}
        </div>
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={refresh}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-panel-container" key={renderKey}>
      <div className="panel-header">
        <h2>Notificaciones</h2>

        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} sin leer</span>
        )}

        {onClose && (
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        )}
      </div>

      <div className="notifications-list-panel">
        {loading ? (
          <div className="loading-notifications">
            <p>
              Cargando notificaciones...{" "}
              {notifications.length > 0
                ? `(Tengo ${notifications.length} en estado)`
                : ""}
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <p className="empty-notifications">
            No hay notificaciones{" "}
            {notifications.length > 0
              ? `(Pero tengo ${notifications.length} en estado 🤔)`
              : ""}
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
              ¡SÍ HAY NOTIFICACIONES! ({notifications.length})
            </div>

            {notifications.map((notification, index) => (
              <div
                key={`${notification.id}-${index}`}
                className={`notification-card ${
                  !notification.read ? "unread" : ""
                }`}
                onClick={() => {
                  console.log("Click en:", notification);
                  markAsRead(notification.id);

                  // Si es una notificación de chat, navegar al chat
                  if (
                    notification.title.toLowerCase().includes("chat") &&
                    notification.chat_id
                  ) {
                    onClose?.(); // Cerrar el panel de notificaciones
                    navigate(/chat?id=${notification.chat_id});
                  }
                }}
                style={{
                  cursor: "pointer",
                  border: "3px solid #3b82f6",
                  margin: "10px",
                  padding: "15px",
                  borderRadius: "10px",
                  background: "#f0f9ff",
                  position: "relative",
                }}
              >
                {/* X button to dismiss - positioned at far right */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(notification.id);
                  }}
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
                      {notification.read ? "📖 Leída" : "📨 No leída"} |
                      {formatNotificationTime(notification.created_at)}
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
