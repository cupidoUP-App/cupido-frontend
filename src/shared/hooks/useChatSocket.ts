import { useState, useEffect, useRef, useCallback } from 'react';
import { Message } from './types'; // Importa la interfaz Message
import { buildWsUrl } from '../utils/ws';
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
            setMessages(history); // Carga el historial inicial
        } catch (err: any) {
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

        // Intentar enviar por WebSocket si está disponible
        if (wsStatus === 'open' && socketRef.current) {
            try {
                socketRef.current.send(JSON.stringify({
                    'message': content.trim()
                }));
                return; // Éxito, salimos
            } catch (err) {
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
            const newMessage: Message = {
                ...raw,
                estado: raw.es_mio ? (raw.leido ? 'read' : 'sent') : undefined,
            };
            
            // Agregar el mensaje al estado local
            setMessages((prev) => [...prev, newMessage]);
            setError(null); // Limpiar errores previos
        } catch (err: any) {
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
        
        let token = localStorage.getItem('access_token')?.replace(/"/g, '');

        if (!token) {
            setError("No hay sesión activa.");
            return;
        }

        // 1. Cargar Historial (REST)
        fetchHistory(token);
        
        // 2. Iniciar conexión WS
        setWsStatus('connecting');
        const wsUrl = buildWsUrl({
            baseUrl: WS_BASE_URL,
            fallbackPath: '/ws/chat',
            pathSegments: [chatId],
            query: { token },
        });
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        // Manejo de Eventos WS
        socket.onopen = () => {
            setWsStatus('open');
            setError(null);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if (data.message) {
                    // El backend nos envía el mensaje completo ya guardado
                    const base = data.message;
                    const newMessage: Message = {
                        ...base,
                        estado: base.es_mio ? (base.leido ? 'read' : 'sent') : undefined,
                    }; 
                    
                    // Actualizamos el estado de forma inmutable
                    setMessages((prev) => [...prev, newMessage]);
                    
                    // NOTA: Si necesitas actualizar el conteo de no leídos en la lista
                    // de chats al recibir un mensaje del otro usuario, necesitarías 
                    // un mecanismo de Context/Recoil/Redux para comunicarlo a useChatList.
                }
            } catch (e) { 
            }
        };

        socket.onclose = (e) => {
            setWsStatus('closed');
            // Código 4003 es nuestro "Usuario anónimo/no verificado/no pertenece"
            if (e.code === 4003 || e.code === 1008) { 
                setError("La conversación no está disponible o tu sesión es inválida.");
            }
        };
        
        socket.onerror = (e) => {
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
    }, [chatId, fetchHistory]);

    return { messages, wsStatus, error, loadingHistory, sendMessage, clearHistory };
};
