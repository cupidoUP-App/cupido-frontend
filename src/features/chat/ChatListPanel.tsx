import React, { useState } from 'react';
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

// PALETA DE COLORES - Basada en el segundo código
const COLORS = {
    primary: '#E74C3C',     // Rojo principal
    secondary: '#F2D6CD',   // Rosa claro/beige
    background: '#FFF6F5',  // Fondo rosado muy claro
    text: {
        primary: '#1E293B', // Slate-800 para texto oscuro
        secondary: '#64748B', // Slate-600 para texto secundario
        muted: '#94A3B8',   // Slate-500 para texto atenuado
    },
    border: '#F2D6CD',      // Color de borde
    hover: {
        bg: '#F2D6CD',      // Fondo hover
        border: '#E74C3C',  // Borde hover
    }
};

const ChatListPanel: React.FC<ChatListPanelProps> = ({ onSelectChat, selectedChatId, onCloseChat, chatList, listLoading, listError }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredChats = chatList.filter((chat: ChatListItemReal) => {
        const fullName = `${chat.contacto.nombres} ${chat.contacto.apellidos}`.toLowerCase();
        const term = searchTerm.toLowerCase();
        return fullName.includes(term);
    });

    const handleOpenProfile = (e: React.MouseEvent, chat: ChatListItemReal) => {
        e.stopPropagation();
        console.log("[TODO] Ir al perfil del usuario con id:", chat.contacto.id);
        alert(`Aquí debería ir al perfil de ${chat.contacto.nombres} ${chat.contacto.apellidos}`);
    };

    // 🟢 Renderizado condicional para carga y error
    if (listLoading) {
        return (
            <div className="absolute top-0 left-0 w-full md:relative md:w-80 bg-gradient-to-b from-[#F2D6CD]/50 to-white border-r border-[#F2D6CD] flex flex-col h-full shadow-xl md:shadow-sm z-30">
                <div className="text-center px-8">
                    <div className="mb-4 flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F2D6CD] to-[#F2D6CD]/50 flex items-center justify-center shadow-lg animate-pulse">
                            <svg className="w-8 h-8 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>
                        </div>
                    </div>
                    <p className="text-[#E74C3C] font-medium">Cargando lista de chats...</p>
                    <p className="text-gray-400 text-sm mt-2">Por favor espera un momento</p>
                </div>
            </div>
        );
    }

    if (listError) {
        return (
            <div className="w-80 bg-[#FFF6F5] border-r border-[#F2D6CD] flex flex-col h-full items-center justify-center">
                <div className="text-center px-8">
                    <div className="mb-4 flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-300 to-red-400 flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="w-80 bg-gradient-to-b from-[#F2D6CD]/50 to-white border-r border-[#F2D6CD] flex flex-col h-full shadow-sm">
            {/* Encabezado del panel */}
            <div className="p-5 border-b border-[#F2D6CD] bg-white/90 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-[#1E293B] mb-4">
                    Chats
                </h2>
                {/* Barra de búsqueda */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar conversaciones..."
                        className="w-full px-4 py-2.5 pl-10 border border-[#F2D6CD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E74C3C]/50 focus:border-[#E74C3C] transition-all duration-200 bg-white/90 shadow-sm hover:shadow-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#E74C3C]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Lista de Chats Desplazable */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#E74C3C]/50 scrollbar-track-transparent hover:scrollbar-thumb-[#E74C3C]">
                {filteredChats.map((chat, index) => (
                    <div
                        key={chat.id}
                        className={`flex items-center p-4 border-b border-[#F2D6CD]/50 relative 
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
                        }}
                    >
                        {/* Foto de perfil (clickable para ir al perfil) */}
                        <div className="relative flex-shrink-0">
                            <img
                                src={chat.contacto.foto_url || '/avatar-default.png'}
                                alt={chat.contacto.nombres + ' ' + chat.contacto.apellidos}
                                className="w-14 h-14 rounded-full object-cover mr-3 cursor-pointer ring-2 ring-[#F2D6CD] hover:ring-[#E74C3C]/50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                                onClick={(e) => handleOpenProfile(e, chat)}
                                title="Ver perfil"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <p className="font-semibold text-[#1E293B] truncate text-base">
                                    {chat.contacto.nombres} {chat.contacto.apellidos}
                                </p>
                                <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-2">
                                    <span className="text-xs text-[#64748B] font-medium">
                                        {formatTime(chat.ultimo_mensaje?.fechaHora)}
                                    </span>
                                    {/* 🟢 Notificaciones (Conteo de no leídos REAL) - Debajo de la hora */}
                                    {chat.no_leidos > 0 && (
                                        <span className="bg-gradient-to-r from-[#E74C3C] to-[#C0392B] text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-md animate-pulse">
                                            {chat.no_leidos}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-[#64748B] truncate leading-relaxed">
                                {chat.ultimo_mensaje ? chat.ultimo_mensaje.contenido : "Inicia la conversación"}
                            </p>
                        </div>
                    </div>
                ))}
                {filteredChats.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-16 px-4">
                        <svg className="w-16 h-16 text-[#F2D6CD] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        <p className="text-[#64748B] text-center text-base">No se encontraron chats.</p>
                        <p className="text-[#94A3B8] text-center text-sm mt-1">Intenta con otros términos de búsqueda</p>
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