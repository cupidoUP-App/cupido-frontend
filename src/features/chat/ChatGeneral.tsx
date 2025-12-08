// ChatGeneral.tsx

import React, { useEffect, useState } from "react";

// 🟢 Importaciones de Componentes
import ChatListPanel from "./ChatListPanel"; // Este componente debe recibir chatList y listLoading
import ChatView from "./ChatView";

// 🟢 Importaciones de Hooks y Tipos REALES

import { useChatSocket } from "@hooks/useChatSocket";
import { useChatList, ChatListItemReal } from "@hooks/useChatList"; // Hook para la lista real
// Importamos Message y WsStatus si no están ya en useChatSocket (depende de tu estructura)

const ChatGeneral: React.FC = () => {
  // Estado para guardar el ID del chat seleccionado. Inicializamos en null.
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true); // Controla la visibilidad del panel lateral
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false); // Menú de 3 puntos del encabezado del chat activo

  // 🟢 1. OBTENER LA LISTA DE CHATS REALES (Mover la lógica desde ChatListPanel)
  const {
    chatList,
    loading: listLoading,
    error: listError,
    setChatList,
    refetchChats,
  } = useChatList(); // Asumimos que useChatList se encarga de actualizar/recargar si es necesario

  // 🟢 2. BUSCAR LA INFORMACIÓN DEL CONTACTO SELECCIONADO
  // Usamos la lista REAL para obtener el objeto completo, eliminando la dependencia a mock-chat-data
  const selectedChat: ChatListItemReal | undefined = chatList.find(
    (chat) => chat.id === selectedChatId
  );

  // Formatear la última vez en línea del contacto (last_login) y estimar si está "En línea"
  const rawLastLogin = selectedChat?.contacto?.last_login;
  let contactIsOnline: boolean | undefined;
  const contactLastSeen = rawLastLogin
    ? (() => {
        const lastDate = new Date(rawLastLogin);
        const diffMs = Date.now() - lastDate.getTime();
        // Si se conectó en los últimos 5 minutos, lo consideramos "En línea"
        contactIsOnline = diffMs < 5 * 60 * 1000;
        return lastDate.toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true, // Formato de 12 horas (con a. m. / p. m.)
        });
      })()
    : undefined;

  // 🟢 3. INTEGRAR LA LÓGICA DEL CHAT SOCKET (Para la vista activa)
  const {
    messages,
    wsStatus,
    error: wsError,
    loadingHistory,
    sendMessage,
    clearHistory,
  } = useChatSocket(selectedChatId);

  // 🟢 4. DEFINICIONES DE LÓGICA
  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);
    // Al abrir un chat, marcamos sus notificaciones como leídas en el frontend
    setChatList((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, no_leidos: 0 } : chat
      )
    );

    //setIsPanelOpen(false);
    // Opcional: setIsMenuOpen(false); si tienes un estado de menú desplegable aquí
  };

  // 🟢 5. NOTIFICAR AL BACKEND CUANDO SE ABRE/CIERRA UN CHAT
  // Esto evita notificaciones mientras el usuario está viendo el chat
  useEffect(() => {
    if (!selectedChatId) return;

    const token =
      localStorage.getItem("access_token") || localStorage.getItem("token");
    if (!token) return;

    const API_BASE =
      import.meta.env.VITE_API_BASE_URL

    // Marcar chat como abierto
    const abrirChat = async () => {
      try {
        await fetch(`${API_BASE}/chat/${selectedChatId}/abrir/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(`✅ Chat ${selectedChatId} marcado como abierto`);
      } catch (error) {
        console.error("Error al marcar chat como abierto:", error);
      }
    };

    // Marcar chat como cerrado
    const cerrarChat = async () => {
      try {
        await fetch(`${API_BASE}/chat/${selectedChatId}/cerrar/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(`✅ Chat ${selectedChatId} marcado como cerrado`);
      } catch (error) {
        console.error("Error al marcar chat como cerrado:", error);
      }
    };

    abrirChat();

    // Cleanup: cerrar el chat cuando el componente se desmonta o cambia de chat
    return () => {
      cerrarChat();
    };
  }, [selectedChatId]);

  const togglePanel = () => {
    setIsPanelOpen((prev) => !prev);
  };

  // Estado para rastrear si el usuario cerró intencionalmente el chat
  const [userClosedChat, setUserClosedChat] = useState(false);

  useEffect(() => {
    // Solo auto-seleccionar el primer chat si el usuario no cerró intencionalmente el chat
    // y si no hay un chat seleccionado
    if (selectedChatId == null && chatList.length > 0 && !userClosedChat) {
      setSelectedChatId(chatList[0].id);
    }
    // Resetear el flag cuando se selecciona un chat manualmente
    if (selectedChatId !== null) {
      setUserClosedChat(false);
    }
  }, [chatList, selectedChatId, userClosedChat]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("chatId");
    if (idParam && !selectedChatId) {
      const idNum = Number(idParam);
      if (!Number.isNaN(idNum)) {
        setSelectedChatId(idNum);
      }
    }
  }, [selectedChatId]);

  // 🟢 Acciones del menú de 3 puntos en el encabezado del chat activo
  const handleHeaderMenuAction = (
    action: "Bloquear" | "Reportar" | "Vaciar" | "Cerrar"
  ) => {
    if (!selectedChat) {
      setIsHeaderMenuOpen(false);
      return;
    }

    const chatName = `${selectedChat.contacto.nombres} ${selectedChat.contacto.apellidos}`;

    switch (action) {
      case "Bloquear":
        alert(`Bloqueando a ${chatName}...`);
        break;
      case "Reportar":
        alert(`Reportando a ${chatName}...`);
        break;
      case "Vaciar":
        if (
          window.confirm(
            `¿Estás seguro de que quieres eliminar todos los mensajes de la conversación con ${chatName}? Esta acción no se puede deshacer.`
          )
        ) {
          alert(
            `Todos los mensajes de ${chatName} han sido eliminados (pendiente integrar API real).`
          );
        }
        break;
      case "Cerrar":
        setUserClosedChat(true);
        // Al cerrar conversación, volvemos a mostrar la lista de chats
        setIsPanelOpen(true);
        setSelectedChatId(null);
        break;
    }

    setIsHeaderMenuOpen(false);
  };

  // Solo deshabilitar el input si hay un error crítico (permiso / sesión).
  // Ya NO lo bloqueamos mientras carga historial o hace polling.
  const isInputDisabled =
    !!wsError &&
    (wsError.includes("No tienes permiso") || wsError.includes("sesión"));
  // Clases para el panel izquierdo (Lista de Chats)
  // Móvil: w-full, oculto si hay chat seleccionado
  // Desktop (md): w-80, siempre visible (o controlado por isPanelOpen)
  const leftPanelClasses = `
    transition-all duration-300 ease-in-out
    ${isPanelOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden'}
    ${selectedChatId ? 'hidden md:block' : 'w-full'} 
    md:w-80 md:relative absolute inset-0 z-20 bg-white
  `;

  // Obtener URL de la foto del contacto (Real o Fallback)
  const getContactPhotoUrl = (chat: ChatListItemReal) => {
    // 1. Usar imagen real del backend si existe
    if (chat.contacto.imagen_principal) {
      return chat.contacto.imagen_principal;
    }
    
    // 2. Fallback: Generar avatar con iniciales usando ui-avatars
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${chat.contacto.nombres} ${chat.contacto.apellidos}`
    )}&background=ec4899&color=fff&size=200`;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 relative overflow-hidden">
      {/* ⬅️ Panel de la izquierda (Lista de Chats) */}
      <div className={leftPanelClasses}>
        <ChatListPanel
          // 🟢 Pasar la lista REAL
          chatList={chatList}
          listLoading={listLoading}
          listError={listError}
          // 🟢 Props de Control
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChatId}
          onCloseChat={(chatId: number) => {
            setUserClosedChat(true);
            setSelectedChatId(null);
          }}
        />
      </div>

      {/* ➡️ Panel de la derecha (Vista del Chat Actual) */}
      <div className={`flex-1 flex flex-col overflow-hidden relative ${!selectedChatId ? 'hidden md:flex' : 'w-full'}`}>
        {/* Contenido principal del Chat */}
        {selectedChatId ? (
          <div className="flex-1 overflow-hidden animate-fadeIn w-full">
            <ChatView
              chatId={selectedChatId}
              contactPhotoUrl={
                selectedChat
                  ? getContactPhotoUrl(selectedChat)
                  : `https://ui-avatars.com/api/?name=User&background=random`
              }
              contactName={
                selectedChat
                  ? `${selectedChat.contacto.nombres} ${selectedChat.contacto.apellidos}`
                  : `Conversación #${selectedChatId}`
              }
              contactLastSeen={contactLastSeen}
              contactIsOnline={contactIsOnline}
              onTogglePanel={togglePanel}
              mensajes={messages}
              sendMessage={sendMessage}
              wsStatus={wsStatus}
              isInputDisabled={isInputDisabled}
              contactId={selectedChat?.contacto.id || 0}
              onCloseChat={() => {
                setUserClosedChat(true);
                // Al cerrar conversación desde el header del chat, mostrar la lista
                setIsPanelOpen(true);
                setSelectedChatId(null);
              }}
              onClearHistory={clearHistory}
            />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center px-8">
              <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-12 h-12 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {listLoading ? "Cargando chats..." : "Selecciona un chat"}
              </h3>
              <p className="text-gray-500 text-sm">
                {listLoading
                  ? "Por favor espera..."
                  : "Elige una conversación para empezar a chatear"}
              </p>
            </div>
          </div>
        )}
      </div>
      <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
    </div>
  );
};

export default ChatGeneral;
