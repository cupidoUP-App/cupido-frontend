// ChatGeneral.tsx
import React, { useEffect, useState } from 'react';

//Importaciones de Componentes
import ChatListPanel from './ChatListPanel';
import ChatView from './ChatView'; 

//Importaciones de Hooks y Tipos REALES
import { useChatSocket } from "@hooks/useChatSocket";
import { useChatList, ChatListItemReal } from "@hooks/useChatList";
import { useAppStore } from "@store/appStore";

const ChatGeneral: React.FC = () => {
    //hook para detectar móvil
    const isMobile = window.innerWidth < 901;
    
    // Obtener el ID del usuario actual desde el store
    const currentUserId = useAppStore((state) => state.user?.usuario_id ?? null);

    // Estado para guardar el ID del chat seleccionado. Inicializamos en null.
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(true); // Controla la visibilidad del panel lateral
    const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false); // Menú de 3 puntos del encabezado del chat activo

    //PALETA DE COLORES
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

    //1. OBTENER LA LISTA DE CHATS REALES (Mover la lógica desde ChatListPanel)
    const { 
        chatList, 
        loading: listLoading, 
        error: listError, 
        setChatList,
        refetchChats,
    } = useChatList();

    //2. BUSCAR LA INFORMACIÓN DEL CONTACTO SELECCIONADO
    const selectedChat: ChatListItemReal | undefined = chatList.find(chat => chat.id === selectedChatId);

    // Formatear la última vez en línea del contacto (last_login) y estimar si está "En línea"
    const rawLastLogin = selectedChat?.contacto?.last_login;
    let contactIsOnline: boolean | undefined;
    const contactLastSeen = rawLastLogin
        ? (() => {
            const lastDate = new Date(rawLastLogin);
            const diffMs = Date.now() - lastDate.getTime();
            // Si se conectó en los últimos 5 minutos, lo consideramos "En línea"
            contactIsOnline = diffMs < 5 * 60 * 1000;
            return lastDate.toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        })()
        : undefined;

    //3. INTEGRAR LA LÓGICA DEL CHAT SOCKET (Para la vista activa)
    const { 
        messages, 
        wsStatus, 
        error: wsError, 
        loadingHistory, 
        sendMessage,
        clearHistory,
        bloquearChatAPI,//  ¡AÑADIR ESTA LÍNEA!
        desbloquearChatAPI,//  ¡AÑADIR ESTA LÍNEA!
        clearMessages,//  ¡AÑADIR ESTA LÍNEA!
    } = useChatSocket(selectedChatId);

    //4. DEFINICIONES DE LÓGICA
    const handleSelectChat = (chatId: number) => {
        setSelectedChatId(chatId);
        // Al abrir un chat, marcamos sus notificaciones como leídas en el frontend
        setChatList(prev => prev.map(chat =>
            chat.id === chatId ? { ...chat, no_leidos: 0 } : chat
        ));

        if (isMobile) {
            setIsPanelOpen(false);
        }
    };

    const togglePanel = () => {
        if (isMobile) {
            setIsPanelOpen(prev => !prev);
        } else {
            setIsPanelOpen(prev => !prev);
        }
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
        const idParam = params.get('chatId');
        if (idParam && !selectedChatId) {
            const idNum = Number(idParam);
            if (!Number.isNaN(idNum)) {
                setSelectedChatId(idNum);
            }
        }
    }, [selectedChatId]);

    //Acciones del menú de 3 puntos en el encabezado del chat activo
    const handleHeaderMenuAction = (action: 'Bloquear' | 'Reportar' | 'Vaciar' | 'Cerrar') => {
        if (!selectedChat) {
            setIsHeaderMenuOpen(false);
            return;
        }

        const chatName = `${selectedChat.contacto.nombres} ${selectedChat.contacto.apellidos}`;

        switch (action) {
            case 'Bloquear':
                alert(`Bloqueando a ${chatName}...`);
                break;
            case 'Reportar':
                alert(`Reportando a ${chatName}...`);
                break;
            case 'Vaciar':
                if (window.confirm(
                    `¿Estás seguro de que quieres eliminar todos los mensajes de la conversación con ${chatName}? Esta acción no se puede deshacer.`
                )) {
                    alert(`Todos los mensajes de ${chatName} han sido eliminados (pendiente integrar API real).`);
                }
                break;
            case 'Cerrar':
                setUserClosedChat(true);
                // Al cerrar conversación, volvemos a mostrar la lista de chats
                setIsPanelOpen(true);
                setSelectedChatId(null);
                break;
        }

        setIsHeaderMenuOpen(false);
    };

    // Solo deshabilitar el input si hay un error crítico (permiso / sesión).
    const isInputDisabled = !!wsError && (wsError.includes("No tienes permiso") || wsError.includes("sesión"));
    
    const panelClasses = `
    transition-all duration-300 ease-in-out
    bg-white
    border-r border-[#F2D6CD]
    ${isMobile
        ? (isPanelOpen ? 'absolute left-0 top-0 w-72 h-full z-50' : 'absolute left-0 top-0 w-0 h-full overflow-hidden opacity-0 z-50')
        : (isPanelOpen ? 'w-80' : 'w-0 overflow-hidden')
    }
`;
    
    // URL de la foto del contacto - Usa la foto real del backend
    const getContactPhotoUrl = (chat: ChatListItemReal) => {
        // Usar la foto real del backend, con fallback si no existe
        return chat.contacto.foto_url || '/avatar-default.png';
    };

    // FUNCIÓN DE BLOQUEO (Ahora limpia los mensajes antes de cerrar)  #CAMBIO REALIZADOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO nueva funcion
    const bloquearChat = async (chatId: number) => {
        if (!selectedChat) return;
        const chatName = `${selectedChat.contacto.nombres} ${selectedChat.contacto.apellidos}`;

        if (!window.confirm(`¿Estás seguro de que quieres bloquear a ${chatName}? Esto cerrará la conversación.`)) {
            return;
        }

        // Llama a la API a través del hook
        const success = await bloquearChatAPI();

        if (success) {
            //SOLUCIÓN: Limpiar el historial de mensajes del hook inmediatamente
            clearMessages();

            //MODIFICACIÓN CLAVE: Actualiza el estado 'activo' a false y guarda quién bloqueó
            setChatList(prev => prev.map(chat => 
                chat.id === chatId 
                    ? { ...chat, activo: false, no_leidos: 0, bloqueado_por_id: currentUserId } // Marcar como inactivo
                    : chat
            ));

            // El chat sigue seleccionado pero la vista se cerrará porque messages está vacío.
            // Forzamos a null para desmontar el ChatView y evitar que muestre mensajes incorrectos.
            if (selectedChatId === chatId) {
                setSelectedChatId(null);
            }

            alert(`Chat con ${chatName} bloqueado. Ahora podrás ver la opción para desbloquearlo.`);
        } else {
            alert("No se pudo bloquear el chat. Revisa los detalles del error en la vista del chat.");
        }
    };

    // FUNCIÓN DE DESBLOQUEO (NUEVA)    
    const desbloquearChat = async (chatId: number) => {
        if (!selectedChat) return;
        const chatName = `${selectedChat.contacto.nombres} ${selectedChat.contacto.apellidos}`;

        if (!window.confirm(`¿Estás seguro de que quieres desbloquear a ${chatName} y reanudar la conversación?`)) {
            return;
        }

        const success = await desbloquearChatAPI();

        if (success) {
            //🟢 Actualiza el estado 'activo' a true y limpia quién bloqueó
            setChatList(prev => prev.map(chat => 
                chat.id === chatId 
                    ? { ...chat, activo: true, bloqueado_por_id: null } // Mark as active
                    : chat
            ));

            alert(`Chat con ${chatName} desbloqueado. Ahora podrás ver la conversación.`);

            // Opcional: Seleccionar el chat automáticamente
            setSelectedChatId(chatId);
            setIsPanelOpen(false);
        } else {
            alert("No se pudo desbloquear el chat. Revisa los detalles del error en la vista del chat.");
        }
    };


    const handleReportUser = (contactId: number) => {
        // Placeholder para integración con módulo de reportes
        alert(`Reportando usuario con ID: ${contactId}`);
    };

    return (
        <div className="flex h-screen bg-[#FFF6F5]">
            
            {/* Panel de la izquierda (Lista de Chats) */}
            <div className={panelClasses}>
                <ChatListPanel 
                    // Pasar la lista REAL
                    chatList={chatList}
                    listLoading={listLoading}
                    listError={listError}
                    //Props de Control
                    onSelectChat={handleSelectChat} 
                    selectedChatId={selectedChatId} 
                    onCloseChat={(chatId: number) => {
                        setUserClosedChat(true);
                        setSelectedChatId(null);
                    }}
                />
            </div>

            {/*Panel de la derecha (Vista del Chat Actual) */}
            <div className={`flex-1 flex flex-col overflow-hidden relative ${isMobile ? 'w-full' : ''}`}>

                {/* Contenido principal del Chat */}
                {selectedChatId ? ( 
                    <div className="flex-1 h-full overflow-hidden animate-fadeIn">
                        <ChatView 
                            chatId={selectedChatId}
                            contactId={selectedChat?.contacto?.id || 0}
                            contactPhotoUrl={selectedChat ? getContactPhotoUrl(selectedChat) : '/avatar-default.png'} 
                            contactName={selectedChat ? `${selectedChat.contacto.nombres} ${selectedChat.contacto.apellidos}` : `Conversación #${selectedChatId}`}
                            contactLastSeen={contactLastSeen}
                            contactIsOnline={contactIsOnline}
                            onTogglePanel={togglePanel}
                            mensajes={messages}
                            sendMessage={sendMessage}
                            wsStatus={wsStatus}
                            isInputDisabled={isInputDisabled}
                            onCloseChat={() => {
                                setUserClosedChat(true);
                                // Al cerrar conversación desde el header del chat, mostrar la lista
                                setIsPanelOpen(true);
                                setSelectedChatId(null);
                            }}
                            onClearHistory={clearHistory}
                            onReportUser={handleReportUser}
                            bloquearChat={bloquearChat} //nuevo bloquear chat  
                            desbloquearChat={desbloquearChat} //nuevo desbloquear chat  
                            isChatActive={selectedChat?.activo ?? true}//nuevo para saber si esta bloqueado
                            bloqueadoPorId={selectedChat?.bloqueado_por_id ?? null} // ID de quien bloqueó
                            currentUserId={currentUserId} // ID del usuario actual
                        />
                    </div>
                ) : (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="text-center px-8">
                            <div className="mb-6 flex justify-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F2D6CD] to-[#FFF6F5] flex items-center justify-center shadow-lg">
                                    <svg className="w-12 h-12 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#1E293B] mb-2">
                                {listLoading ? "Cargando chats..." : "Selecciona un chat"}
                            </h3>
                            <p className="text-[#64748B] text-sm">
                                {listLoading ? "Por favor espera..." : "Elige una conversación para empezar a chatear"}
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