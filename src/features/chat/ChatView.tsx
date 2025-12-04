// ChatView.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ASUNCIÓN DE IMPORTS DE TIPOS
import { Message } from '@hooks/types'; 

//INTERFAZ COMPLETA DE PROPS (Soluciona el error de tipado)
interface ChatViewProps {
    chatId: number;
    contactId: number;
    contactPhotoUrl: string;
    contactName: string;
    contactLastSeen?: string;
    contactIsOnline?: boolean;
    mensajes: Message[];
    sendMessage: (content: string) => void;
    wsStatus: string;
    isInputDisabled: boolean;
    onTogglePanel?: () => void;
    onCloseChat?: () => void;
    onClearHistory?: () => void;
    onReportUser: (contactId: number) => void;
    bloquearChat: (chatId: number) => void; //bloquear chat     
    desbloquearChat: (chatId: number) => void;//desbloquer chat
    isChatActive: boolean;//nuevo para saber si esta bloqueado
    bloqueadoPorId: number | null; // ID del usuario que bloqueó el chat
    currentUserId: number | null; // ID del usuario actual
}

// PALETA DE COLORES
const COLORS = {
    primary: '#E74C3C',           // Rojo principal
    secondary: '#F2D6CD',         // Rosa claro/beige
    background: '#FFF6F5',        // Fondo rosado muy claro
    border: '#F2D6CD',            // Color de borde
    text: {
        primary: '#1E293B',       // Texto oscuro
        secondary: '#64748B',     // Texto secundario
        muted: '#94A3B8',         // Texto atenuado
    },
    button: {
        gradientFrom: '#F2D6CD',
        gradientTo: '#FFF6F5',
        hoverFrom: 'red-100',
        hoverTo: 'pink-100',
    }
};

const MessageStatusIcon: React.FC<{ leido: boolean }> = ({ leido }) => {
    if (leido) {
        return (
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        );
    }
    
    return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
    );
};

const ChatView: React.FC<ChatViewProps> = ({
    chatId,
    contactId,
    contactPhotoUrl,
    contactName,
    contactLastSeen,
    contactIsOnline,
    mensajes,
    sendMessage,
    wsStatus,
    isInputDisabled,
    onTogglePanel,
    onCloseChat,
    onClearHistory,
    onReportUser,
    bloquearChat, //nuevo bloquear 
    desbloquearChat, //nuevo desbloquer 
    isChatActive, //nuevo para saber si esta bloqueado
    bloqueadoPorId, // ID del usuario que bloqueó
    currentUserId, // ID del usuario actual
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [inputMessage, setInputMessage] = useState('');
    const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const navigate = useNavigate();

    //FINAL INPUT DISABLED
    const finalInputDisabled = isInputDisabled || !isChatActive;

    const handleOpenProfile = () => {
        if (contactId) {
            navigate(`/other-user-profile/${contactId}`);
        } else {
            console.error("ID de contacto no disponible para la redirección.");
        }
    };

    // Función que detecta si el usuario está cerca del fondo del chat
    // Evita que baje automáticamente mientras el usuario está leyendo mensajes viejos
    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const isBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < 50;
        setIsAtBottom(isBottom);
    };

    // Función para hacer scroll al final del chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Efecto que baja el chat solo si el usuario está en el fondo
    useEffect(() => {
        if (isAtBottom) {
            scrollToBottom();
        }
    }, [mensajes]);

    const handleSend = () => {
        // 1. Evita enviar si el chat está inactivo (bloqueado)     
        if (!isChatActive) return;//se agrego el !isChatActive para saber si esta bloqueado o no  

        if (inputMessage.trim() !== '') {
            sendMessage(inputMessage.trim());
            setInputMessage('');
            setIsAtBottom(true);   // Fuerza el scroll al enviar
            scrollToBottom();      // Baja inmediatamente
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isInputDisabled) {
            handleSend();
        }
    };

    const getConnectionStatusMessage = () => {
        switch (wsStatus) {
            case 'open':
                return <span className="text-green-500">Conectado</span>;
            case 'connecting':
                return <span className="text-yellow-500">Conectando...</span>;
            case 'closed':
            case 'error':
                return <span className="text-red-500">Desconectado</span>;
            default:
                return null;
        }
    }

    const handleHeaderMenuAction = (action: 'Bloquear' | 'Reportar' | 'Vaciar' | 'Cerrar' | 'Desbloquear') => { //SE AGREGO DESBLOQUEAR 
        switch (action) {
            case 'Bloquear':
                bloquearChat(chatId); //SE MODIFICO ESTA PARTE 
                //alert(`Bloqueando a ${contactName}...`);
                break;
            case 'Desbloquear': //  CASO NUEVO     
                desbloquearChat(chatId); //SE MODIFICO ESTA PARTE 
                break;
            case 'Reportar':
                // Placeholder: integración futura con módulo de reportes
                console.log("[TODO] Abrir flujo de reporte para:", contactName);
                alert(`Aquí debería abrirse la pantalla de reporte para ${contactName}`);
                break;
            case 'Vaciar':
                if (window.confirm(
                    `¿Estás seguro de que quieres eliminar todos los mensajes de la conversación con ${contactName}? Esta acción no se puede deshacer.`
                )) {
                    onClearHistory && onClearHistory();
                }
                break;
            case 'Cerrar':
                onCloseChat && onCloseChat();
                break;
        }
        setIsHeaderMenuOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#FFF6F5] pb-24 [@media(min-width:901px)]:pb-0">
            <div className="flex items-center justify-between p-4 bg-white/95 backdrop-blur-sm border-b border-[#F2D6CD] shadow-md relative z-20">
                <div className="flex items-center flex-1 min-w-0 gap-3">
                    {onTogglePanel && (
                        <button
                            type="button"
                            onClick={onTogglePanel}
                            className="inline-flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#F2D6CD] to-[#FFF6F5] border border-gray-300 text-[#E74C3C] shadow-sm hover:bg-gradient-to-br hover:from-red-100 hover:to-pink-100 hover:border-[#E74C3C] hover:shadow-md transition-all duration-300 flex-shrink-0 group"
                            aria-label="Mostrar/ocultar lista de chats"
                        >
                            <span className="block w-5 h-0.5 bg-[#E74C3C] rounded-full transition-all duration-300 mb-1 group-hover:bg-red-700"></span>
                            <span className="block w-5 h-0.5 bg-[#E74C3C] rounded-full transition-all duration-300 mb-1 group-hover:bg-red-700"></span>
                            <span className="block w-5 h-0.5 bg-[#E74C3C] rounded-full transition-all duration-300 group-hover:bg-red-700"></span>
                        </button>
                    )}

                    <div className="relative flex-shrink-0">
                        <img 
                            src={contactPhotoUrl}
                            alt="Contacto" 
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#E74C3C]/50 flex-shrink-0 cursor-pointer hover:ring-4 hover:ring-[#F2D6CD] hover:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                            onClick={handleOpenProfile}
                            title="Ver perfil"
                        />
                        {contactIsOnline && (
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
                        )}
                    </div>
                    <div className="ml-2 min-w-0">
                        <h3 className="text-lg font-bold text-[#1E293B] truncate">
                            {contactName}
                        </h3>
                        <p className={`text-xs truncate flex items-center gap-1 ${
                            contactIsOnline ? 'text-green-600 font-medium' : 'text-[#64748B]'
                        }`}>
                            {contactIsOnline && (
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            )}
                            {contactIsOnline
                                ? 'En línea'
                                : contactLastSeen
                                    ? `Últ. vez: ${contactLastSeen}`
                                    : 'Desconectado'}
                        </p>
                    </div>
                </div>

                <div className="relative ml-2">
                    <button
                        className="flex items-center justify-center w-10 h-10 text-[#64748B] hover:text-[#E74C3C] hover:bg-[#F2D6CD]/50 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
                        onClick={() => setIsHeaderMenuOpen(prev => !prev)}
                        title="Opciones de conversación"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                        </svg>
                    </button>

                    {isHeaderMenuOpen && (
                        <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-[#F2D6CD] z-80 py-2 animate-fadeIn">
                            <div className="px-4 py-3 border-b border-[#F2D6CD] bg-gradient-to-r from-[#FFF6F5] to-white">
                                <p className="text-sm font-semibold text-[#1E293B] truncate">
                                    {contactName}
                                </p>
                                <p className="text-xs text-[#64748B] mt-0.5">Opciones de conversación</p>
                            </div>

                            {/*  LÓGICA CONDICIONAL DE BLOQUEO / DESBLOQUEO */}   
                            {isChatActive ? (
                                // Chat activo: mostrar opción de bloquear
                                <button
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#F2D6CD]/50 hover:to-[#FFF6F5] transition-all duration-200"
                                    onClick={() => handleHeaderMenuAction('Bloquear')}
                                >
                                    <svg className="w-4 h-4 mr-3 text-[#E74C3C]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                    Bloquear usuario
                                </button>
                            ) : bloqueadoPorId === currentUserId ? (
                                // Chat bloqueado por MÍ: mostrar opción de desbloquear
                                <button
                                    className="flex items-center w-full px-4 py-3 text-sm text-green-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-pink-100 transition-all duration-200"
                                    onClick={() => handleHeaderMenuAction('Desbloquear')}
                                >
                                    <svg className="w-4 h-4 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                    </svg>
                                    Desbloquear usuario
                                </button>
                            ) : (
                                // Chat bloqueado por EL OTRO usuario: mostrar mensaje informativo
                                <div className="flex items-center w-full px-4 py-3 text-sm text-gray-400 bg-gray-50">
                                    <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                    Bloqueado por {contactName}
                                </div>
                            )}  

                            {/* BOTÓN REPORTAR - AGREGAR ESTO */}
                            <button
                                className="flex items-center w-full px-4 py-3 text-sm text-[#1E293B] hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 transition-all duration-200"
                                onClick={() => handleHeaderMenuAction('Reportar')}
                            >
                                <svg className="w-4 h-4 mr-3 text-[#E74C3C]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                                Reportar usuario
                            </button>

                            <button
                                className="flex items-center w-full px-4 py-3 text-sm text-[#1E293B] hover:bg-gradient-to-r hover:from-[#F2D6CD]/50 hover:to-white transition-all duration-200"
                                onClick={() => handleHeaderMenuAction('Vaciar')}
                            >
                                <svg className="w-4 h-4 mr-3 text-[#E74C3C]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                Vaciar chat
                            </button>

                            <div className="border-t border-[#F2D6CD] my-1" />

                            <button
                                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200"
                                onClick={() => handleHeaderMenuAction('Cerrar')}
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

            {/* BANNER DE CHAT BLOQUEADO */}
            {!isChatActive && (
                <div className="p-4 text-center bg-red-100/80 text-red-700 font-semibold border-b border-red-200 shadow-inner sticky top-0 z-10">
                    Chat Bloqueado. No se pueden enviar ni recibir mensajes. Desbloquea para reanudar. 
                </div>
            )}

            {/* Cuerpo de Mensajes */}
            <div 
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-[#E74C3C]/50 scrollbar-track-transparent hover:scrollbar-thumb-[#E74C3C] bg-gradient-to-b from-[#FFF6F5] to-white">
                
                {/* Banner de advertencia */}
                <div className="text-center mb-4 px-4">
                    <div className="inline-block bg-gray-200 text-gray-600 text-xs px-3 py-2 rounded-lg shadow-sm max-w-xs">
                        Para el uso de este chat se recomienda: precaución y sentido común.
                        <strong> cUPido </strong> no se hace responsable por la información privada que los usuarios decidan compartir voluntariamente.
                    </div>
                </div>

                {mensajes.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex items-end gap-2 ${msg.es_mio ? 'justify-end' : 'justify-start'}`}
                        style={{
                            animation: `messageSlideIn 0.3s ease-out ${index * 0.05}s both`
                        }}
                    >
                        {!msg.es_mio && (
                            <img
                                src={contactPhotoUrl}
                                alt={contactName}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0 shadow-md border-2 border-[#F2D6CD]"
                            />
                        )}

                        <div 
                            className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                                msg.es_mio 
                                    ? 'bg-gradient-to-br from-[#E74C3C] to-[#C0392B] text-white rounded-br-sm' 
                                    : 'bg-white text-[#1E293B] border border-[#F2D6CD] rounded-tl-sm'
                            }`}
                        >
                            <span className="block break-words text-sm leading-relaxed">
                                {msg.contenido}
                            </span>
                            <div className="flex items-center justify-end gap-1.5 mt-1.5">
                                <span className={`text-[10px] font-medium ${
                                    msg.es_mio ? 'text-white/70' : 'text-[#64748B]'
                                }`}>
                                    {new Date(msg.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>

                                {msg.es_mio && (
                                    <span className="inline-flex items-center gap-[2px]">
                                        {msg.estado === 'sending' && (
                                            <svg className="w-3.5 h-3.5 text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                                                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {msg.estado === 'failed' && (
                                            <svg className="w-3.5 h-3.5 text-red-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                                                <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                <circle cx="12" cy="15.5" r="0.8" fill="currentColor" />
                                            </svg>
                                        )}
                                        {(!msg.estado || msg.estado === 'sent') && (
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 13l3 3 8-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {msg.estado === 'read' && (
                                            <span className="inline-flex items-center">
                                                <svg className="w-4 h-4 text-sky-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5 13l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <svg className="w-4 h-4 text-sky-400 -ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 13l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input del Chat */}
            <div className="p-4 border-t border-[#F2D6CD] bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        className={`flex-1 px-5 py-3 rounded-2xl border-2 focus:outline-none transition-all duration-200 text-sm ${
                            finalInputDisabled //USAR FINAL INPUT DISABLED  
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                : inputMessage.trim() === ''
                                    ? 'bg-white border-[#F2D6CD] focus:ring-2 focus:ring-[#E74C3C]/50 focus:border-[#E74C3C] shadow-sm hover:shadow-md'
                                    : 'bg-white border-[#E74C3C] focus:ring-2 focus:ring-[#E74C3C] focus:border-red-600 shadow-md'
                        }`} 
                        placeholder={finalInputDisabled ? (!isChatActive ? "Chat bloqueado" : "Error de sesión/permiso") : "Escribe un mensaje..."}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isInputDisabled} // USAR FINAL INPUT DISABLED
                    />
                    <button
                        className={`flex items-center justify-center w-12 h-12 rounded-2xl text-white font-semibold transition-all duration-200 shadow-md ${
                            finalInputDisabled || inputMessage.trim() === ''// usar final input disabled
                                ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                : 'bg-[#E74C3C] hover:bg-[#C0392B] hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
                        }`}
                        onClick={handleSend}
                        disabled={finalInputDisabled || inputMessage.trim() === ''}
                        aria-label="Enviar mensaje"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes messageSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
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

export default ChatView;