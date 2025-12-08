// ChatGeneral.tsx
// Modificado por Jeison Alexis Rodriguez Angarita

import React, { useEffect, useState } from "react";

// Importaciones de Componentes
import ChatListPanel from "./ChatListPanel";
import ChatView from "./ChatView";

// Importaciones de Hooks y Tipos REALES
import { useChatSocket } from "@hooks/useChatSocket";
import { useChatList, ChatListItemReal } from "@hooks/useChatList";

const ChatGeneral: React.FC = () => {
  // Hook para detectar móvil
  const isMobile = window.innerWidth < 901;

  // Estado para guardar el ID del chat seleccionado. Inicializamos en null.
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  // PALETA DE COLORES
  const COLORS = {
    primary: '#E74C3C',
    secondary: '#F2D6CD',
    background: '#FFF6F5',
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      muted: '#94A3B8'
    },
    border: '#F2D6CD'
  };

  // 1. OBTENER LA LISTA DE CHATS REALES
  const {
    chatList,
    loading: listLoading,
    error: listError,
    setChatList,
    refetchChats,
  } = useChatList();

  // 2. BUSCAR LA INFORMACIÓN DEL CONTACTO SELECCIONADO
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
        contactIsOnline = diffMs < 5 * 60 * 1000;
        return lastDate.toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      })()
    : undefined;

  // 3. INTEGRAR LA LÓGICA DEL CHAT SOCKET
  const {
    messages,
    wsStatus,
    error: wsError,
    loadingHistory,
    sendMessage,
    clearHistory,
  } = useChatSocket(selectedChatId);

  // 4. DEFINICIONES DE LÓGICA
  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);
    setChatList((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, no_leidos: 0 } : chat
      )
    );

    if (isMobile) {
      setIsPanelOpen(false);
    }
  };

  // 5. NOTIFICAR AL BACKEND CUANDO SE ABRE/CIERRA UN CHAT
  useEffect(() => {
    if (!selectedChatId) return;

    const token =
      localStorage.getItem("access_token") || localStorage.getItem("token");
    if (!token) return;

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

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

    return () => {
      cerrarChat();
    };
  }, [selectedChatId]);

  const togglePanel = () => {
    if (isMobile) {
      setIsPanelOpen((prev) => !prev);
    } else {
      setIsPanelOpen((prev) => !prev);
    }
  };

  // Estado para rastrear si el usuario cerró intencionalmente el chat
  const [userClosedChat, setUserClosedChat] = useState(false);

  useEffect(() => {
    if (selectedChatId == null && chatList.length > 0 && !userClosedChat) {
      setSelectedChatId(chatList[0].id);
    }
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

  // Acciones del menú de 3 puntos en el encabezado del chat activo
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
        setIsPanelOpen(true);
        setSelectedChatId(null);
        break;
    }

    setIsHeaderMenuOpen(false);
  };

  const isInputDisabled =
    !!wsError &&
    (wsError.includes("No tienes permiso") || wsError.includes("sesión"));

  // Estado para el ancho del panel (redimensionable)
  const [panelWidth, setPanelWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const minWidth = 280;
  const maxWidth = 500;

  // Función para iniciar el redimensionamiento
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // Efecto para manejar el redimensionamiento
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth]);

  // Clases responsive para el panel
  const panelClasses = `
    transition-all duration-300 ease-in-out
    bg-white
    border-r border-[#F2D6CD]
    relative
    ${isMobile
      ? (isPanelOpen 
          ? 'fixed left-0 top-0 h-full z-50 w-full' 
          : 'fixed left-0 top-0 w-0 h-full overflow-hidden opacity-0 z-50')
      : (isPanelOpen ? '' : 'w-0 overflow-hidden')
    }
  `;

  // Obtener URL de la foto del contacto
  const getContactPhotoUrl = (chat: ChatListItemReal) => {
    if (chat.contacto.imagen_principal) {
      return chat.contacto.imagen_principal;
    }
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${chat.contacto.nombres} ${chat.contacto.apellidos}`
    )}&background=ec4899&color=fff&size=200`;
  };

  return (
    <div className="flex h-screen bg-[#FFF6F5] overflow-hidden">
      {/* Panel de la izquierda (Lista de Chats) */}
      <div 
        className={panelClasses}
        style={{
          width: isMobile 
            ? (isPanelOpen ? '100%' : '0px')
            : (isPanelOpen ? `${panelWidth}px` : '0px')
        }}
      >
        <ChatListPanel
          chatList={chatList}
          listLoading={listLoading}
          listError={listError}
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChatId}
          onCloseChat={(chatId: number) => {
            setUserClosedChat(true);
            setSelectedChatId(null);
          }}
        />
        
        {/* Barra de redimensionamiento - Solo visible en desktop cuando el panel está abierto */}
        {!isMobile && isPanelOpen && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-[#E74C3C] transition-colors duration-200 group"
            onMouseDown={startResizing}
          >
            {/* Indicador visual de arrastre */}
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1 h-12 bg-[#E74C3C] opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-l-full"></div>
          </div>
        )}
      </div>

      {/* Panel de la derecha (Vista del Chat Actual) */}
      <div className={`flex-1 flex flex-col overflow-hidden ${isMobile && isPanelOpen ? 'hidden' : 'flex'}`}>
        {/* Contenido principal del Chat */}
        {selectedChatId ? (
          <div className="flex-1 h-full overflow-hidden animate-fadeIn">
            <ChatView
              chatId={selectedChatId}
              contactId={selectedChat?.contacto?.id || 0}
              contactPhotoUrl={
                selectedChat
                  ? getContactPhotoUrl(selectedChat)
                  : '/avatar-default.png'
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
              onCloseChat={() => {
                setUserClosedChat(true);
                setIsPanelOpen(true);
                setSelectedChatId(null);
              }}
              onClearHistory={clearHistory}
            />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center p-4">
            <div className="text-center px-4 sm:px-8 max-w-md">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#F2D6CD] to-[#FFF6F5] flex items-center justify-center shadow-lg">
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-[#E74C3C]"
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
              <h3 className="text-lg sm:text-xl font-bold text-[#1E293B] mb-2">
                {listLoading ? "Cargando chats..." : "Selecciona un chat"}
              </h3>
              <p className="text-[#64748B] text-xs sm:text-sm">
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
        
        /* Prevenir selección de texto durante el redimensionamiento */
        ${isResizing ? `
          * {
            user-select: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            cursor: ew-resize !important;
          }
        ` : ''}
      `}</style>
    </div>
  );
};

export default ChatGeneral;