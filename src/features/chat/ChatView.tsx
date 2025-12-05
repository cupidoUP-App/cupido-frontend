// ChatView.tsx

import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 🟢 ASUNCIÓN DE IMPORTS DE TIPOS
import { Message } from '@hooks/types'; 

// 🟢 INTERFAZ COMPLETA DE PROPS (Soluciona el error de tipado)
interface ChatViewProps {
    chatId: number;
    contactPhotoUrl: string;
    contactName: string; // Asumo que también necesitas el nombre
    contactLastSeen?: string; // Última vez en línea del contacto
    contactIsOnline?: boolean; // Estado aproximado del contacto
    mensajes: Message[];                 // <--- ¡Propiedad Requerida!
    sendMessage: (content: string) => void; // <--- ¡Propiedad Requerida!
    wsStatus: string;                    // <--- ¡Propiedad Requerida!
    isInputDisabled: boolean;            // <--- ¡Propiedad Requerida!
    onTogglePanel?: () => void;          // Mostrar/ocultar lista de chats
    onCloseChat?: () => void;
    onClearHistory?: () => void;
    contactId: number;
}

const MessageStatusIcon: React.FC<{ leido: boolean }> = ({ leido }) => {
    // Corazón Leído (corazón completo rojo/rosa)
    if (leido) {
        return (
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        );
    }
    
    // Corazón Enviado/Entregado (corazón contorneado o gris)
    return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
    );
};

const ChatView: React.FC<ChatViewProps> = ({
    chatId,
    contactPhotoUrl, // Se mantiene por compatibilidad, aunque el encabezado principal está en ChatGeneral
    contactName,     // Idem: el nombre se muestra en el header de ChatGeneral
    contactLastSeen,
    contactIsOnline,
    mensajes,
    sendMessage,
    wsStatus,
    isInputDisabled,
    onTogglePanel,
    onCloseChat,
    onClearHistory,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputMessage, setInputMessage] = useState('');
    const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

    // Placeholder para abrir el perfil del contacto al tocar la imagen
    const handleOpenProfile = () => {
        // Aquí se podría usar useNavigate de react-router-dom, por ejemplo:
        // navigate(`/perfil/${chatId}?userId=${...}`);
        // Por ahora solo mostramos un aviso para que el equipo de perfil lo conecte luego.
        alert(`Aquí debería ir al perfil de ${contactName}`);
        console.log("[TODO] Ir al perfil del contacto del chat:", contactName);
    };

    // Función para desplazarse al final de los mensajes
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Efecto para desplazarse al final cada vez que llegan nuevos mensajes
    useEffect(() => {
        scrollToBottom();
    }, [mensajes]);


    const handleSend = () => {
        if (inputMessage.trim() !== '') {
            sendMessage(inputMessage.trim()); // Usamos la prop de la función
            setInputMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isInputDisabled) {
            handleSend();
        }
    };

    // 🟢 Mensaje de estado de la conexión
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

    const handleHeaderMenuAction = (action: 'Bloquear' | 'Reportar' | 'Vaciar' | 'Cerrar') => {
        switch (action) {
            case 'Bloquear':
                alert(`Bloqueando a ${contactName}...`);
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
        <div className="flex flex-col h-full bg-gradient-to-br from-pink-50 via-white to-pink-50">
            <div className="flex items-center justify-between p-4 bg-white/95 backdrop-blur-sm border-b border-pink-100 shadow-md relative z-10">
                <div className="flex items-center flex-1 min-w-0 gap-3">
                    {/* Botón hamburguesa moderno para mostrar/ocultar lista de chats */}
                    {onTogglePanel && (
                        <button
                            type="button"
                            onClick={onTogglePanel}
                            className="inline-flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-pink-50 border border-pink-200 text-pink-600 shadow-sm hover:bg-gradient-to-br hover:from-pink-200 hover:to-pink-100 hover:border-pink-400 hover:shadow-md transition-all duration-300 flex-shrink-0 group"
                            aria-label="Mostrar/ocultar lista de chats"
                        >
                            <span className="block w-5 h-0.5 bg-pink-600 rounded-full transition-all duration-300 mb-1 group-hover:bg-pink-700"></span>
                            <span className="block w-5 h-0.5 bg-pink-600 rounded-full transition-all duration-300 mb-1 group-hover:bg-pink-700"></span>
                            <span className="block w-5 h-0.5 bg-pink-600 rounded-full transition-all duration-300 group-hover:bg-pink-700"></span>
                        </button>
                    )}

                    <div className="relative flex-shrink-0">
                        <img 
                            src={contactPhotoUrl}
                            alt="Contacto" 
                            className="w-12 h-12 rounded-full object-cover border-2 border-pink-300 flex-shrink-0 cursor-pointer hover:ring-4 hover:ring-pink-200 hover:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                            onClick={handleOpenProfile}
                            title="Ver perfil"
                        />
                        {contactIsOnline && (
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
                        )}
                    </div>
                    <div className="ml-2 min-w-0">
                        <h3 className="text-lg font-bold text-gray-800 truncate">
                            {contactName}
                        </h3>
                        <p className={`text-xs truncate flex items-center gap-1 ${
                            contactIsOnline ? 'text-green-600 font-medium' : 'text-gray-500'
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
                        className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
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
                        <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-pink-100 z-40 py-2 animate-fadeIn">
                            <div className="px-4 py-3 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-white">
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                    {contactName}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">Opciones de conversación</p>
                            </div>

                            <button
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 transition-all duration-200"
                                onClick={() => handleHeaderMenuAction('Bloquear')}
                            >
                                <svg className="w-4 h-4 mr-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>
                                Bloquear usuario
                            </button>

                            <button
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 transition-all duration-200"
                                onClick={() => handleHeaderMenuAction('Reportar')}
                            >
                                <svg className="w-4 h-4 mr-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                                Reportar usuario
                            </button>

                            <button
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 transition-all duration-200"
                                onClick={() => handleHeaderMenuAction('Vaciar')}
                            >
                                <svg className="w-4 h-4 mr-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                Vaciar chat
                            </button>

                            <div className="border-t border-pink-100 my-1" />

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

            {/* Cuerpo de Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-transparent hover:scrollbar-thumb-pink-400">
                {mensajes.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex items-end gap-2 ${msg.es_mio ? 'justify-end' : 'justify-start'}`}
                        style={{
                            animation: `messageSlideIn 0.3s ease-out ${index * 0.05}s both`
                        }}
                    >
                        {/* Avatar solo para los mensajes que me envían (no son míos) */}
                        {!msg.es_mio && (
                            <img
                                src={contactPhotoUrl}
                                alt={contactName}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0 shadow-md border-2 border-pink-200"
                            />
                        )}

                        <div 
                            className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                                msg.es_mio 
                                    ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-br-sm' 
                                    : 'bg-white text-gray-800 border border-pink-100 rounded-tl-sm'
                            }`}
                        >
                            <span className="block break-words text-sm leading-relaxed">
                                {msg.contenido}
                            </span>
                            <div className="flex items-center justify-end gap-1.5 mt-1.5">
                                <span className={`text-[10px] font-medium ${
                                    msg.es_mio ? 'text-white/70' : 'text-gray-400'
                                }`}>
                                    {new Date(msg.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>

                                {/* Chulitos tipo WhatsApp solo para mis mensajes */}
                                {msg.es_mio && (
                                    <span className="inline-flex items-center gap-[2px]">
                                        {msg.estado === 'sending' && (
                                            // Relojito: mensaje pendiente de envío
                                            <svg className="w-3.5 h-3.5 text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                                                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {msg.estado === 'failed' && (
                                            // Error: mensaje no enviado
                                            <svg className="w-3.5 h-3.5 text-red-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                                                <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                <circle cx="12" cy="15.5" r="0.8" fill="currentColor" />
                                            </svg>
                                        )}
                                        {(!msg.estado || msg.estado === 'sent') && (
                                            // Un chulito: mensaje enviado (almacenado en el servidor)
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 13l3 3 8-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {msg.estado === 'read' && (
                                            // Dos chulitos: mensaje leído (dos tonos de azul, muy juntos)
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
            <div className="p-4 border-t border-pink-100 bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        className={`flex-1 px-5 py-3 rounded-2xl border-2 focus:outline-none transition-all duration-200 text-sm ${
                            isInputDisabled
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                : inputMessage.trim() === ''
                                    ? 'bg-white border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-400 shadow-sm hover:shadow-md'
                                    : 'bg-white border-pink-400 focus:ring-2 focus:ring-pink-400 focus:border-pink-500 shadow-md'
                        }`}
                        placeholder={isInputDisabled ? "Cargando..." : "Escribe un mensaje..."}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isInputDisabled}
                    />
                    <button
                        className={`flex items-center justify-center w-12 h-12 rounded-2xl text-white font-semibold transition-all duration-200 shadow-md ${
                            isInputDisabled || inputMessage.trim() === ''
                                ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
                        }`}
                        onClick={handleSend}
                        disabled={isInputDisabled || inputMessage.trim() === ''}
                        aria-label="Enviar mensaje"
                    >
                        {/* Icono tipo WhatsApp (avión de papel) */}
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
