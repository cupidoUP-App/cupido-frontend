// notificationsPage.tsx
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

  // Convertir fecha y filtrar duplicados
  const uniqueNotifications = notifications.filter((notification, index, self) => {
    // Validar fecha
    const date = new Date(notification.fecha_envio);
    const time = isNaN(date.getTime()) ? 0 : date.getTime();
    
    const key = `${notification.id}-${time}`;

    const firstIndex = self.findIndex((n) => {
      const d = new Date(n.fecha_envio);
      const t = isNaN(d.getTime()) ? 0 : d.getTime();
      return `${n.id}-${t}` === key;
    });

    return index === firstIndex;
  });

  // Click en notificación (marcar como leída + navegar)
const handleNotificationClick = useCallback(
  async (notification: AppNotification) => {
    console.log("🖱️ Click en notificación:", notification);
    console.log("Datos de notificación:", JSON.stringify(notification, null, 2));

    const now = Date.now();
    if (now - lastClickTime < 300) return;
    setLastClickTime(now);

    try {
      // Marcar como leída
      if (!notification.read) await markAsRead(notification.id);

      const closeAndGo = (path: string, state?: any) => {
        if (onClose) onClose();
        setTimeout(() => navigate(path, { state }), 50);
      };

      const type = notification.tipo.toLowerCase();

      // ❤️ LIKE → ir al perfil
      // ❤️ LIKE → ir al perfil
      if (type === "like") {
        const targetUserId = notification.from_user_id || 
                             (notification as any).user_id || 
                             (notification as any).userId || 
                             (notification as any).sender_id ||
                             (notification as any).related_user_id;

        if (targetUserId) {
          return closeAndGo(`/other-user-profile/${targetUserId}`, { allowed: true });
        }
        console.warn("⚠️ LIKE sin ID de usuario válido", notification);
      }

      // ✨ MATCH
      if (type === "match") {

        // Prioridad 1: ir al chat si existe
        if (notification.chat_id) {
          return closeAndGo(`/chat?chatId=${notification.chat_id}`);
        }

        // Prioridad 2: ir al perfil del match
        if (notification.usuario_match_id) {
          return closeAndGo(`/other-user-profile/${notification.usuario_match_id}`, { allowed: true });
        }
        
        // Fallback: Si no hay ID específico, intentar con from_user_id si existe
        // También intentar buscar otras propiedades comunes de ID por si el backend envía algo diferente
        const targetUserId = notification.usuario_match_id || 
                             notification.from_user_id || 
                             (notification as any).user_id || 
                             (notification as any).userId || 
                             (notification as any).sender_id ||
                             (notification as any).related_user_id;

        if (targetUserId) {
             return closeAndGo(`/other-user-profile/${targetUserId}`, { allowed: true });
        }

        console.warn("⚠️ MATCH sin chat_id ni usuario_match_id válido. Keys disponibles:", Object.keys(notification), notification);
        return;
      }

      // 💬 CHAT (notificaciones de mensajes)
      if (notification.chat_id || type === 'chat') {
         if (notification.chat_id) {
            return closeAndGo(`/chat?chatId=${notification.chat_id}`);
         }
         // Si es tipo chat pero no tiene chat_id, intentar ir al chat general
         return closeAndGo('/chat');
      }

      console.log("ℹ️ Notificación sin acción asignada.", notification);
      
    } catch (err) {
      console.error("❌ Error:", err);
    }
  },
  [navigate, onClose, markAsRead, lastClickTime]
);

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
            <button className="close-btn" onClick={onClose} type="button">
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
    <div className="notifications-panel-container" ref={containerRef}>
      <div className="panel-header">
        <h2>Notificaciones</h2>

        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} sin leer</span>
        )}

        {onClose && (
          <button className="close-btn" onClick={onClose} type="button">
            ✖
          </button>
        )}
      </div>

      <div className="notifications-list-panel">
        {loading ? (
          <div className="loading-notifications">
            <p>Cargando notificaciones...</p>
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
              Notificaciones ({uniqueNotifications.length})
            </div>

            {uniqueNotifications.map((notification, index) => {
              const dateObj = new Date(notification.fecha_envio);
              const key = `${notification.id}-${index}-${dateObj.getTime()}`;

              return (
                <div
                  key={key}
                  className={`notification-card ${!notification.read ? "unread" : ""}`}
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
                    }}
                  >
                    ✕
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <div style={{ fontSize: "24px" }}>
                      {notification.tipo.toLowerCase() === "like" && "❤️"}
                      {notification.tipo.toLowerCase() === "match" && "✨"}
                      {notification.tipo.toLowerCase() === "chat" && "💬"}
                      {notification.tipo.toLowerCase() === "reporte" && "⚠️"}
                      {!["like", "match", "chat", "reporte"].includes(notification.tipo.toLowerCase()) &&
                        "🔔"}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          margin: "0 0 5px 0",
                          color: "#1e40af",
                          fontSize: "16px",
                        }}
                      >
                        {notification.tipo.toUpperCase()} {!notification.read && "🔵"}
                      </h3>

                      <p
                        style={{
                          margin: "0 0 5px 0",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {notification.mensaje}
                      </p>

                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {notification.read ? "Leída" : "No leída"} |{" "}
                        {formatNotificationTime(dateObj)}
                        {notification.chat_id && " | Ir al chat"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

function formatNotificationTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  if (hours < 24) return `Hace ${hours} h`;
  if (days < 7) return `Hace ${days} d`;

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}
