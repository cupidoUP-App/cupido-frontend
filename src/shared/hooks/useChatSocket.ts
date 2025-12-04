import { useState, useEffect, useRef, useCallback } from 'react';
import { Message } from './types'; // Importa la interfaz Message

// Define tu endpoint base de WS
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/chat/`;

type WsStatus = 'connecting' | 'open' | 'closed' | 'error';

export const useChatSocket = (chatId: number | null) => {
    // ESTADOS
    const [messages, setMessages] = useState<Message[]>([]);
    const [wsStatus, setWsStatus] = useState<WsStatus>('closed');
    const [error, setError] = useState<string | null>(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // NUEVA FUNCIÓN: Limpia el historial en el estado del hook
    const clearMessages = useCallback(() => {
        setMessages([]); // Vacía el estado de mensajes
    }, []);

    // REF para mantener la instancia del socket sin re-renderizar
    const socketRef = useRef<WebSocket | null>(null);

    // ==========================================================
    // FUNCIONES DE CARGA Y ENVÍO
    // ==========================================================

    const fetchHistory = useCallback(async (token: string) => {
        if (!chatId) return;
        try {
            setLoadingHistory(true);
            const response = await fetch(`${API_BASE_URL}${chatId}/mensajes/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                // Aquí el backend devuelve 403 si el usuario no pertenece
                throw new Error(`Error ${response.status}: No tienes permiso para ver este chat.`);
            }
            
            const raw: any[] = await response.json();
            // Mapear el historial para calcular el estado del mensaje (chulitos)
            const history: Message[] = raw.map((m) => ({
                ...m,
                estado: m.es_mio ? (m.leido ? 'read' : 'sent') : undefined,
            }));
            
            //Preservar mensajes optimistas (ID negativo) que aún están "enviándose"
            setMessages((prev) => {
                // Filtrar mensajes optimistas que aún no han sido confirmados
                const pendingOptimistic = prev.filter(
                    m => typeof m.id === 'number' && m.id < 0 && m.estado === 'sending'
                );
                
                // Si hay mensajes optimistas pendientes, agregarlos al final del historial
                if (pendingOptimistic.length > 0) {
                    return [...history, ...pendingOptimistic];
                }
                
                return history;
            });
        } catch (err: any) {
            console.error("❌ Error cargando historial:", err);
            setError(err.message);
        } finally {
            setLoadingHistory(false);
        }
    }, [chatId]);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;
        if (!chatId) {
            setError("No hay chat seleccionado.");
            return;
        }

        const token = localStorage.getItem('access_token')?.replace(/"/g, '') || '';
        if (!token) {
            setError("No hay sesión activa.");
            return;
        }

        // OPTIMISTIC UPDATE: Agregar mensaje inmediatamente a la UI
        const tempId = -Date.now(); // ID temporal negativo (nunca colisiona con IDs reales)
        const optimisticMessage: Message = {
            id: tempId,
            contenido: content.trim(),
            es_mio: true,
            fecha: new Date().toISOString(),
            estado: 'sending', // Estado "enviando"
            remitente_email: '', // Se actualizará cuando llegue del servidor
            leido: false,
        };
        
        // Agregar el mensaje optimista inmediatamente
        setMessages((prev) => [...prev, optimisticMessage]);

        // Intentar enviar por WebSocket si está disponible
        if (wsStatus === 'open' && socketRef.current) {
            try {
                socketRef.current.send(JSON.stringify({
                    'message': content.trim()
                }));
                return; // Éxito, el mensaje llegará por WS y actualizará el estado
            } catch (err) {
                console.warn("Error enviando por WebSocket, intentando REST...", err);
                // Continuar al fallback REST
            }
        }

        // Fallback: Enviar por REST API si WebSocket no está disponible
        try {
            const response = await fetch(`${API_BASE_URL}${chatId}/enviar/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contenido: content.trim() })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Error ${response.status} al enviar mensaje`);
            }

            const raw: any = await response.json();
            
            // 🟢 Reemplazar el mensaje optimista con el mensaje real del servidor
            setMessages((prev) => prev.map(msg => 
                msg.id === tempId 
                    ? { ...raw, estado: 'sent' }
                    : msg
            ));
            setError(null);
        } catch (err: any) {
            console.error("Error enviando mensaje por REST:", err);
            // 🔴 Marcar el mensaje como fallido
            setMessages((prev) => prev.map(msg => 
                msg.id === tempId 
                    ? { ...msg, estado: 'failed' }
                    : msg
            ));
            setError(err.message || "Error al enviar el mensaje. Intenta de nuevo.");
        }
    }, [wsStatus, chatId]);

    const clearHistory = useCallback(async () => {
        if (!chatId) return;
        try {
            const token = localStorage.getItem('access_token')?.replace(/"/g, '') || '';
            const response = await fetch(`${API_BASE_URL}${chatId}/vaciar/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }
            setMessages([]);
        } catch (err: any) {
            setError(err.message || 'Error al vaciar el chat');
        }
    }, [chatId]);

    // NUEVA FUNCIÓN: Llamada a la API de bloquear chat
    const bloquearChatAPI = useCallback(async (): Promise<boolean> => {
        if (!chatId) {
            setError("No hay chat seleccionado para bloquear.");
            return false;
        }
        const token = localStorage.getItem('access_token')?.replace(/"/g, '') || '';
        if (!token) {
            setError("No hay sesión activa.");
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${chatId}/bloquear/`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Error ${response.status} al bloquear el chat.`);
            }
            
            setError(null);
            // Cierra el WebSocket inmediatamente, ya que el chat está inactivo
            if (socketRef.current) socketRef.current.close();
            setWsStatus('closed'); 
            
            return true; // Éxito
        } catch (err: any) {
            console.error("Error bloqueando chat:", err);
            setError(err.message || "Error al bloquear el chat. Intenta de nuevo.");
            return false;
        }
    }, [chatId]);

    // NUEVA FUNCIÓN: Llamada a la API de desbloquear chat
    const desbloquearChatAPI = useCallback(async (): Promise<boolean> => {
        if (!chatId) {
            setError("No hay chat seleccionado para desbloquear.");
            return false;
        }
        const token = localStorage.getItem('access_token')?.replace(/"/g, '') || '';
        if (!token) {
            setError("No hay sesión activa.");
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${chatId}/desbloquear/`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Error ${response.status} al desbloquear el chat.`);
            }
        
            setError(null);
            // NOTA: No cerramos el WS, esperamos que el useEffect lo reabra si es necesario
        
            return true; // Éxito
        } catch (err: any) {
            console.error("Error desbloqueando chat:", err);
            setError(err.message || "Error al desbloquear el chat. Intenta de nuevo.");
            return false;
        }
    }, [chatId]);

    // ==========================================================
    // LÓGICA DE CONEXIÓN WS (useEffect principal)
    // ==========================================================

    useEffect(() => {
        if (chatId === null) {
            setMessages([]);
            if (socketRef.current) socketRef.current.close();
            setWsStatus('closed');            
            return;
        }
        
        // NUEVO: Limpiar los mensajes del chat anterior inmediatamente.
        // Esto asegura que la pantalla se vacíe al cambiar de un chat (1) a otro (2).
        clearMessages();
        
        let token = localStorage.getItem('access_token')?.replace(/"/g, '');

        if (!token) {
            setError("No hay sesión activa.");
            return;
        }

        // 1. Cargar Historial (REST)
        fetchHistory(token);
        
        // 2. Iniciar conexión WS
        setWsStatus('connecting');
        const wsUrl = `${WS_BASE_URL}${chatId}/?token=${token}`;
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        // Manejo de Eventos WS
        socket.onopen = () => {
            console.log("WS Conexión exitosa.");
            setWsStatus('open');
            setError(null);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if (data.message) {
                    const base = data.message;
                    const newMessage: Message = {
                        ...base,
                        estado: base.es_mio ? (base.leido ? 'read' : 'sent') : undefined,
                    }; 
                    
                    // 🟢 Evitar duplicados: Si es mi mensaje, reemplazar el optimista
                    setMessages((prev) => {
                        // Verificar que no exista ya por ID (evita duplicados del polling)
                        if (prev.some(m => m.id === newMessage.id)) {
                            return prev; // Ya existe, no agregar
                        }
                        
                        // Si es mi mensaje, buscar y reemplazar el mensaje temporal (optimista)
                        if (newMessage.es_mio) {
                            // Buscar mensaje temporal: ID negativo + mismo contenido
                            const tempIndex = prev.findIndex(
                                m => typeof m.id === 'number' && 
                                     m.id < 0 && 
                                     m.contenido === newMessage.contenido
                            );
                            if (tempIndex !== -1) {
                                // Reemplazar el mensaje temporal con el real
                                const updated = [...prev];
                                updated[tempIndex] = newMessage;
                                return updated;
                            }
                        }
                        
                        // Si no es duplicado ni reemplazo, agregar normalmente
                        return [...prev, newMessage];
                    });
                }
            } catch (e) { 
                console.error("Error al procesar mensaje WS:", e); 
            }
        };

        socket.onclose = (e) => {
            setWsStatus('closed');
            // Código 4003 es nuestro "Usuario anónimo/no verificado/no pertenece"
            if (e.code === 4003 || e.code === 1008) { 
                setError("La conversación no está disponible o tu sesión es inválida.");
            }
            //console.log(`🔴 Desconectado. Código: ${e.code}`);
        };
        
        socket.onerror = (e) => {
            //console.error("⚠️ Error en WebSocket:", e);
            setError("Error de conexión en tiempo real.");
            setWsStatus('error');
        };

        // 3. Fallback: polling periódico del historial para asegurar que llegan mensajes aunque falle WS
        const intervalId = window.setInterval(() => {
            fetchHistory(token);
        }, 5000); // cada 5 segundos

        // Función de limpieza al desmontar o al cambiar de chatId
        return () => {
            if (socketRef.current) {
                socketRef.current.close(); 
            }
            socketRef.current = null;
            window.clearInterval(intervalId);
        };
    }, [chatId, fetchHistory, clearMessages]);

    return {
        messages,
        wsStatus,
        error,
        loadingHistory,
        sendMessage,
        clearHistory,
        bloquearChatAPI,
        desbloquearChatAPI,
        clearMessages
    };
};