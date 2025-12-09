// Modificado por Jeison Alexis Rodriguez Angarita

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatList, ChatListItemReal } from '@hooks/useChatList';
import { getPresenceFromLastLogin } from './utils/presence';

interface ChatListPanelProps {
    onSelectChat: (chatId: number) => void;
    selectedChatId: number | null;
    onCloseChat: (chatId: number) => void;

    // NUEVAS PROPIEDADES RECIBIDAS DEL PADRE (ChatGeneral)
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

const ChatListPanel: React.FC<ChatListPanelProps> = ({ onSelectChat, selectedChatId, onCloseChat, chatList, listLoading, listError }) => {
    const navigate = useNavigate();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const filteredChats = chatList.filter((chat: ChatListItemReal) => {
        const fullName = `${chat.contacto.nombres} ${chat.contacto.apellidos}`.toLowerCase();
        const term = searchTerm.toLowerCase();
        return fullName.includes(term);
    });

    // Función para manejar las acciones del menú
    const handleMenuAction = (action: string, chatId: number, chatName: string) => {
        setOpenMenuId(null);

        switch (action) {
            case 'Bloquear':
                alert(`Bloqueando a ${chatName}...`);
                break;
            case 'Reportar':
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
                }
                break;
            default:
                break;
        }
    };

    // Función para la URL de la foto
    const getContactPhotoUrl = (chat: ChatListItemReal) => {
        if (chat.contacto.imagen_principal) {
            return chat.contacto.imagen_principal;
        }
        
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            `${chat.contacto.nombres} ${chat.contacto.apellidos}`
        )}&background=ec4899&color=fff&size=200`;
    };

    // Navegar al perfil del contacto
    const handleOpenProfile = (e: React.MouseEvent, chat: ChatListItemReal) => {
        e.stopPropagation();
        navigate(`/other-user-profile/${chat.contacto.id}`, { state: { allowed: true } });
    };

    // Renderizado condicional para carga y error
    if (listLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#F2D6CD]/50 to-white border-r border-[#F2D6CD]">
                <div className="text-center px-4 sm:px-8">
                    <div className="mb-4 flex justify-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#F2D6CD] to-[#FFF6F5] flex items-center justify-center shadow-lg animate-pulse">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>
                        </div>
                    </div>
                    <p className="text-[#E74C3C] font-medium text-sm sm:text-base">Cargando lista de chats...</p>
                    <p className="text-[#94A3B8] text-xs sm:text-sm mt-2">Por favor espera un momento</p>
                </div>
            </div>
        );
    }

    if (listError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#FFF6F5] border-r border-[#F2D6CD]">
                <div className="text-center px-4 sm:px-8">
                    <div className="mb-4 flex justify-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                        </div>
                    </div>
                    <p className="text-red-600 font-semibold mb-2 text-sm sm:text-base">Error al cargar chats</p>
                    <p className="text-[#64748B] text-xs sm:text-sm">{listError}</p>
                </div>
            </div>
        );
    }    

    return (
        <div className="w-full h-full bg-gradient-to-b from-[#F2D6CD]/50 to-white border-r border-[#F2D6CD] flex flex-col shadow-sm">
            {/* Encabezado del panel */}
            <div className="p-3 sm:p-5 border-b border-[#F2D6CD] bg-white/80 backdrop-blur-sm flex-shrink-0">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1E293B] mb-3 sm:mb-4">
                    Chats
                </h2>
                {/* Barra de búsqueda */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar conversaciones..."
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pl-9 sm:pl-10 border border-[#F2D6CD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E74C3C]/50 focus:border-[#E74C3C] transition-all duration-200 bg-white/90 shadow-sm hover:shadow-md text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E74C3C]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Lista de Chats Desplazable */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#E74C3C]/50 scrollbar-track-transparent hover:scrollbar-thumb-[#E74C3C]">
                {filteredChats.map((chat, index) => (
                    <div
                        key={chat.id}
                        className={`flex items-center p-3 sm:p-4 border-b border-[#F2D6CD]/50 relative 
                                    transition-all duration-300 ease-out cursor-pointer
                                    hover:bg-gradient-to-r hover:from-[#F2D6CD]/50 hover:to-white hover:shadow-sm
                                    ${selectedChatId === chat.id 
                                        ? 'bg-gradient-to-r from-[#F2D6CD] to-white border-l-4 border-[#E74C3C] shadow-md' 
                                        : 'hover:border-l-2 hover:border-[#E74C3C]/50'
                                    }`}
                        style={{
                            animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                        }}
                        onClick={() => {
                            onSelectChat(chat.id);
                            setOpenMenuId(null);
                        }}
                    >
                        {/* Foto de perfil */}
                        <div className="relative flex-shrink-0">
                            <img
                                src={getContactPhotoUrl(chat)}
                                alt={chat.contacto.nombres + ' ' + chat.contacto.apellidos}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover mr-2 sm:mr-3 cursor-pointer ring-2 ring-[#F2D6CD] hover:ring-[#E74C3C] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                                onClick={(e) => handleOpenProfile(e, chat)}
                                title="Ver perfil"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <p className="font-semibold text-[#1E293B] truncate text-sm sm:text-base">
                                    {chat.contacto.nombres} {chat.contacto.apellidos}
                                </p>
                                <div className="flex flex-col items-end gap-1 sm:gap-1.5 flex-shrink-0 ml-2">
                                    <span className="text-[10px] sm:text-xs text-[#64748B] font-medium">
                                        {formatTime(chat.ultimo_mensaje?.fechaHora)}
                                    </span>
                                    {chat.no_leidos > 0 && (
                                        <span className="bg-gradient-to-r from-[#E74C3C] to-[#C0392B] text-white text-[10px] sm:text-xs font-bold rounded-full min-w-[18px] sm:min-w-[20px] h-4 sm:h-5 flex items-center justify-center px-1 sm:px-1.5 shadow-md animate-pulse">
                                            {chat.no_leidos}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm text-[#64748B] truncate leading-relaxed">
                                {chat.ultimo_mensaje ? chat.ultimo_mensaje.contenido : "Inicia la conversación"}
                            </p>
                        </div>


                    </div>
                ))}
                {filteredChats.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-12 sm:mt-16 px-4">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-[#F2D6CD] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        <p className="text-[#64748B] text-center text-sm sm:text-base">No se encontraron chats.</p>
                        <p className="text-[#94A3B8] text-center text-xs sm:text-sm mt-1">Intenta con otros términos de búsqueda</p>
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