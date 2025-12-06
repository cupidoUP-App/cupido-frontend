import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatList, ChatListItemReal } from '@hooks/useChatList';
import { getPresenceFromLastLogin } from './utils/presence';
//import { MOCK_CHAT_LIST } from './mock-chat-data';

interface ChatListPanelProps {
    onSelectChat: (chatId: number) => void;
    selectedChatId: number | null;
    onCloseChat: (chatId: number) => void;

        // 🟢 NUEVAS PROPIEDADES RECIBIDAS DEL PADRE (ChatGeneral)
    chatList: ChatListItemReal[];
    listLoading: boolean;
    listError: string | null;
}

// Helper para formatear la fecha/hora
const formatTime = (isoString: string | undefined): string => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '---';
    }
}

const ChatListPanel: React.FC<ChatListPanelProps> = ({ onSelectChat, selectedChatId, onCloseChat, chatList, listLoading, listError }) => {
    // 🟢 REEMPLAZO CLAVE: Usar el hook para obtener datos reales
    //const { chatList, loading, error } = useChatList();
    const navigate = useNavigate();
    
    const [searchTerm, setSearchTerm] = useState('');
    // 🟢 Nuevo estado: Almacena el ID del chat cuyo menú de opciones está abierto.
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const filteredChats = chatList.filter((chat: ChatListItemReal) =>
        chat.contacto.nombres.toLowerCase().includes(searchTerm.toLowerCase()) // Filtrar por el nombre del contacto
    );
    //const filteredChats = MOCK_CHAT_LIST.filter(chat =>
    //    chat.nombreContacto.toLowerCase().includes(searchTerm.toLowerCase())
    //);

    // 🟢 Función para manejar las acciones del menú
    const handleMenuAction = (action: string, chatId: number, chatName: string) => {
        console.log(`Acción: ${action} realizada en el Chat ID: ${chatId} (${chatName})`);
        setOpenMenuId(null); // Cierra el menú después de la acción

        // Aquí iría la lógica real
        switch (action) {
            case 'Bloquear':
                alert(`Bloqueando a ${chatName}...`);
                break;
            case 'Reportar':
                // Placeholder: integración futura con módulo de reportes
                console.log("[TODO] Abrir flujo de reporte para usuario:", chatName, "en chat", chatId);
                alert(`Aquí debería abrirse la pantalla de reporte para ${chatName}`);
                break;
            case 'Cerrar':
                onCloseChat(chatId);
                break;
            case 'Vaciar':
                const confirmClear = window.confirm(
                `¿Estás seguro de que quieres eliminar todos los mensajes de la conversación con ${chatName}? Esta acción no se puede deshacer.`
                );
                if (confirmClear) {
                    alert(`Todos los mensajes de ${chatName} han sido eliminados.`);
                    // En una implementación real, llamaríamos a la API aquí
                }
                break;
            default:
                break;
        }
    };

    // Función para la URL de la foto (Real o Fallback)
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

    // Navegar al perfil del contacto
    const handleOpenProfile = (e: React.MouseEvent, chat: ChatListItemReal) => {
        // Evita que al hacer clic en la foto también se seleccione el chat
        e.stopPropagation();
        // Navegar al perfil del usuario
        navigate(`/other-user-profile/${chat.contacto.id}`, { state: { allowed: true } });
    };

    // 🟢 Renderizado condicional para carga y error
    if (listLoading) {
        return (
            <div className="absolute top-0 left-0 w-full md:relative md:w-80 bg-gradient-to-b from-pink-50 to-white border-r border-pink-100 flex flex-col h-full shadow-xl md:shadow-sm z-30">
                <div className="text-center px-8">
                    <div className="mb-4 flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center shadow-lg animate-pulse">
                            <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>
                        </div>
                    </div>
                    <p className="text-pink-600 font-medium">Cargando lista de chats...</p>
                    <p className="text-gray-400 text-sm mt-2">Por favor espera un momento</p>
                </div>
            </div>
        );
    }

    if (listError) {
        return (
            <div className="w-80 bg-gradient-to-b from-pink-50 to-white border-r border-pink-100 flex flex-col h-full items-center justify-center">
                <div className="text-center px-8">
                    <div className="mb-4 flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                        </div>
                    </div>
                    <p className="text-red-600 font-semibold mb-2">Error al cargar chats</p>
                    <p className="text-gray-500 text-sm">{listError}</p>
                </div>
            </div>
        );
    }    

    return (
        <div className="w-80 bg-gradient-to-b from-pink-50 to-white border-r border-pink-100 flex flex-col h-full shadow-sm">
            {/* Encabezado del panel */}
            <div className="p-5 border-b border-pink-100 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent mb-4">
                    Chats
                </h2>
                {/* Barra de búsqueda */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar conversaciones..."
                        className="w-full px-4 py-2.5 pl-10 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all duration-200 bg-white/90 shadow-sm hover:shadow-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Lista de Chats Desplazable */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-transparent hover:scrollbar-thumb-pink-400">
                {filteredChats.map((chat, index) => (
                
                    // 🟢 Se hace click en todo el div para seleccionar el chat, 
                    //    pero se ignora si el click es en el botón de menú
                    <div
                        key={chat.id}
                        className={`flex items-center p-4 border-b border-pink-100/50 relative 
                                    transition-all duration-300 ease-out cursor-pointer
                                    hover:bg-gradient-to-r hover:from-pink-50/80 hover:to-pink-100/50 hover:shadow-sm
                                    ${selectedChatId === chat.id 
                                        ? 'bg-gradient-to-r from-pink-100 to-pink-50 border-l-4 border-pink-500 shadow-md' 
                                        : 'hover:border-l-2 hover:border-pink-300'
                                    }`}
                        style={{
                            animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                        }}
                        onClick={() => {
                            onSelectChat(chat.id);
                            setOpenMenuId(null); // Cierra cualquier menú abierto al seleccionar otro chat
                        }}
                    >
                        {/* Foto de perfil (clickable para ir al perfil) */}
                        <div className="relative flex-shrink-0">
                            <img
                                src={getContactPhotoUrl(chat)}
                                alt={chat.contacto.nombres + ' ' + chat.contacto.apellidos}
                                className="w-14 h-14 rounded-full object-cover mr-3 cursor-pointer ring-2 ring-pink-200 hover:ring-pink-400 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                                onClick={(e) => handleOpenProfile(e, chat)}
                                title="Ver perfil"
                            />

                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <p className="font-semibold text-gray-800 truncate text-base">
                                    {chat.contacto.nombres} {chat.contacto.apellidos}
                                </p>
                                <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-2">
                                    <span className="text-xs text-gray-500 font-medium">
                                        {formatTime(chat.ultimo_mensaje?.fechaHora)}
                                    </span>
                                    {/* 🟢 Notificaciones (Conteo de no leídos REAL) - Debajo de la hora */}
                                    {chat.no_leidos > 0 && (
                                        <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-md animate-pulse">
                                            {chat.no_leidos}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 truncate leading-relaxed">
                                {chat.ultimo_mensaje ? chat.ultimo_mensaje.contenido: "Inicia la conversación"}
                            </p>
                        </div>

                        {/* 🎯 Menú de 3 puntos - Posición y diseño mejorado */}
                        <div className="relative flex-shrink-0 ml-2">
                            <button
                                className="flex items-center justify-center w-9 h-9 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all duration-200 hover:scale-110"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(openMenuId === chat.id ? null : chat.id);
                                }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                                </svg>
                            </button>
                            
                            {/* 🎯 Menú desplegable - Diseño mejorado */}
                            {openMenuId === chat.id && (
                                <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-2xl border border-pink-100 z-30 py-2 animate-fadeIn">
                                    {/* Header del menú */}
                                    <div className="px-4 py-3 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-white">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{chat.contacto.nombres} {chat.contacto.apellidos}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Opciones de chat</p>
                                    </div>
                                    
                                    <button 
                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 transition-all duration-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMenuAction('Bloquear', chat.id, chat.contacto.nombres);
                                        }}
                                    >
                                        <svg className="w-4 h-4 mr-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                        </svg>
                                        Bloquear usuario
                                    </button>
                                    
                                    <button 
                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 transition-all duration-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMenuAction('Reportar', chat.id, chat.contacto.nombres);
                                        }}
                                    >
                                        <svg className="w-4 h-4 mr-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z"/>
                                        </svg>
                                        Reportar usuario
                                    </button>
                                    
                                    <button 
                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 transition-all duration-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMenuAction('Vaciar', chat.id, chat.contacto.nombres);
                                        }}
                                    >
                                        <svg className="w-4 h-4 mr-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                        Vaciar chat
                                    </button>
                                    
                                    <div className="border-t border-pink-100 my-1"></div>
                                    
                                    <button 
                                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMenuAction('Cerrar', chat.id, chat.contacto.nombres);
                                        }}
                                    >
                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                        Cerrar conversación
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {filteredChats.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-16 px-4">
                        <svg className="w-16 h-16 text-pink-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        <p className="text-gray-500 text-center text-base">No se encontraron chats.</p>
                        <p className="text-gray-400 text-center text-sm mt-1">Intenta con otros términos de búsqueda</p>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ChatListPanel;
