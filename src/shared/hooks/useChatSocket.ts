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
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectAttempts = 3;

    // ==========================================================
    // FUNCIONES AUXILIARES
    // ==========================================================

    const getValidToken = useCallback((): string | null => {
        let token = localStorage.getItem('access_token');
        
        if (!token) {
            console.error('❌ No hay token en localStorage');
            return null;
        }

        // Limpiar comillas si existen
        token = token.replace(/"/g, '').trim();
        
        // Verificar si el token está expirado
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expDate = new Date(payload.exp * 1000);
            const now = new Date();
            
            if (now > expDate) {
                console.log('⚠️ Token expirado:', expDate.toLocaleString());
                // Intentar renovar token automáticamente
                return renewToken();
            }
            
            return token;
        } catch (e) {
            console.error('Error decodificando token:', e);
            return token; // Devolver el token aunque no se pueda decodificar
        }
    }, []);

    const renewToken = (): string | null => {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
            console.error('❌ No hay refresh token disponible');
            setError('Sesión expirada. Por favor inicia sesión nuevamente.');
            // Aquí podrías redirigir al login
            return null;
        }

        console.log('🔄 Intentando renovar token...');
        
        // IMPORTANTE: Esta función debería ser síncrona o manejar la renovación
        // de manera que no bloquee. En una app real, tendrías un sistema de cola
        // o manejarías la renovación fuera del WebSocket.
        
        // Por ahora, devolvemos null para forzar el fallback a REST
        return null;
    };

    // ==========================================================
    // FUNCIONES DE CARGA Y ENVÍO
    // ==========================================================

    const fetchHistory = useCallback(async (token: string | null = null) => {
        if (!chatId) return;
        
        try {
            setLoadingHistory(true);
            const effectiveToken = token || getValidToken();
            
            if (!effectiveToken) {
                setError('No autenticado. Por favor inicia sesión.');
                return;
            }

            const response = await fetch(`${API_BASE_URL}${chatId}/mensajes/`, {
                headers: { 
                    'Authorization': `Bearer ${effectiveToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 403) {
                throw new Error('Acceso denegado. No tienes permiso para ver este chat.');
            }
            
            if (response.status === 401) {
                throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
            }
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo cargar el historial.`);
            }
            
            const raw: any[] = await response.json();
            const history: Message[] = raw.map((m) => ({
                ...m,
                estado: m.es_mio ? (m.leido ? 'read' : 'sent') : undefined,
            }));
            
            console.log("✅ Historial cargado:", history.length, "mensajes");
            setMessages(history);
            setError(null);
        } catch (err: any) {
            console.error("❌ Error cargando historial:", err);
            setError(err.message);
            
            // Si el error es de autenticación, detener reconexiones
            if (err.message.includes('denegado') || err.message.includes('Sesión')) {
                reconnectAttemptsRef.current = maxReconnectAttempts;
            }
        } finally {
            setLoadingHistory(false);
        }
    }, [chatId, getValidToken]);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;
        if (!chatId) {
            setError("No hay chat seleccionado.");
            return;
        }

        const token = getValidToken();
        if (!token) {
            setError("No hay sesión activa o ha expirado.");
            return;
        }

        // 1. Intentar enviar por WebSocket si está disponible
        if (wsStatus === 'open' && socketRef.current?.readyState === WebSocket.OPEN) {
            try {
                socketRef.current.send(JSON.stringify({
                    'message': content.trim()
                }));
                console.log("📤 Mensaje enviado por WebSocket:", content.substring(0, 50) + "...");
                return; // Éxito, salimos
            } catch (err) {
                console.warn("Error enviando por WebSocket, intentando REST...", err);
            }
        }

        // 2. Fallback: Enviar por REST API
        try {
            console.log("📤 Enviando mensaje por REST API...");
            const response = await fetch(`${API_BASE_URL}${chatId}/enviar/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contenido: content.trim() })
            });

            if (response.status === 403) {
                throw new Error('Acceso denegado. No tienes permiso para enviar mensajes en este chat.');
            }
            
            if (response.status === 401) {
                throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
            }

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
            setError(null);
            console.log("✅ Mensaje enviado exitosamente por REST");
        } catch (err: any) {
            console.error("❌ Error enviando mensaje por REST:", err);
            setError(err.message || "Error al enviar el mensaje. Intenta de nuevo.");
        }
    }, [wsStatus, chatId, getValidToken]);

    const clearHistory = useCallback(async () => {
        if (!chatId) return;
        try {
            const token = getValidToken();
            if (!token) {
                setError("No hay sesión activa.");
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}${chatId}/vaciar/`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 403) {
                throw new Error('Acceso denegado. No tienes permiso para vaciar este chat.');
            }
            
            if (!response.ok) {
                throw new Error(`Error ${response.status} al vaciar el chat`);
            }
            
            setMessages([]);
            console.log("✅ Historial vaciado");
        } catch (err: any) {
            console.error("❌ Error al vaciar el chat:", err);
            setError(err.message || 'Error al vaciar el chat');
        }
    }, [chatId, getValidToken]);

    const connectWebSocket = useCallback((token: string) => {
        if (!chatId || !token) return;
        
        // Cerrar conexión anterior si existe
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        setWsStatus('connecting');
        console.log(`🔄 Conectando WebSocket al chat ${chatId}...`);

        try {
            const wsUrl = buildWsUrl({
                baseUrl: WS_BASE_URL,
                fallbackPath: '/ws/chat',
                pathSegments: [chatId],
                query: { token },
            });
            
            console.log('🔗 URL WebSocket:', wsUrl.replace(token, '***TOKEN***'));
            
            const socket = new WebSocket(wsUrl);
            socketRef.current = socket;

            socket.onopen = () => {
                console.log("🟢 WebSocket conectado exitosamente");
                setWsStatus('open');
                setError(null);
                reconnectAttemptsRef.current = 0; // Resetear intentos
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
                        
                        setMessages((prev) => [...prev, newMessage]);
                        console.log("📩 Mensaje recibido vía WebSocket");
                    }
                } catch (e) { 
                    console.error("❌ Error al procesar mensaje WS:", e); 
                }
            };

            socket.onclose = (e) => {
                console.log(`🔴 WebSocket cerrado. Código: ${e.code}, Razón: ${e.reason}`);
                setWsStatus('closed');
                
                // Manejar diferentes códigos de cierre
                if (e.code === 1008 || e.code === 4003) { 
                    // 1008 = Policy Violation, 4003 = Código personalizado de auth
                    setError("Acceso denegado. La conversación no está disponible o tu sesión es inválida.");
                    reconnectAttemptsRef.current = maxReconnectAttempts; // No reconectar
                } else if (e.code === 1006) {
                    // 1006 = Abnormal closure (puede ser CORS o error de red)
                    console.warn("Conexión anormalmente cerrada. Verifica CORS y red.");
                    setError("Error de conexión. Verifica tu red.");
                } else {
                    // Otros cierres (normales o de red)
                    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                        setTimeout(() => {
                            const newToken = getValidToken();
                            if (newToken) {
                                reconnectAttemptsRef.current += 1;
                                console.log(`🔄 Reintento ${reconnectAttemptsRef.current}/${maxReconnectAttempts}...`);
                                connectWebSocket(newToken);
                            }
                        }, 3000);
                    }
                }
            };
            
            socket.onerror = (event) => {
                console.error("⚠️ Error en WebSocket:", event);
                setError("Error de conexión en tiempo real.");
                setWsStatus('error');
            };

        } catch (error) {
            console.error("❌ Error creando WebSocket:", error);
            setError("No se pudo establecer la conexión en tiempo real.");
            setWsStatus('error');
        }
    }, [chatId, getValidToken]);

    // ==========================================================
    // LÓGICA DE CONEXIÓN WS (useEffect principal)
    // ==========================================================

    useEffect(() => {
        // Limpiar estado si no hay chatId
        if (chatId === null) {
            setMessages([]);
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
            setWsStatus('closed');
            setError(null);
            reconnectAttemptsRef.current = 0;
            return;
        }

        console.log(`🎯 Configurando chat ${chatId}...`);
        
        // Obtener token válido
        const token = getValidToken();
        
        if (!token) {
            setError("No autenticado. Por favor inicia sesión.");
            // Cargar historial de todos modos (puede funcionar sin WebSocket)
            fetchHistory(null);
            return;
        }

        // 1. Cargar historial inicial
        fetchHistory(token);
        
        // 2. Conectar WebSocket
        connectWebSocket(token);
        
        // 3. Configurar polling periódico como fallback
        const pollingInterval = setInterval(() => {
            // Solo hacer polling si WebSocket no está conectado
            if (wsStatus !== 'open') {
                console.log('🔄 Polling de mensajes...');
                fetchHistory(token);
            }
        }, 10000); // Cada 10 segundos

        // 4. Limpieza
        return () => {
            console.log(`🧹 Limpiando chat ${chatId}...`);
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
            clearInterval(pollingInterval);
            reconnectAttemptsRef.current = 0;
        };
    }, [chatId, fetchHistory, connectWebSocket, wsStatus, getValidToken]);

    return { 
        messages, 
        wsStatus, 
        error, 
        loadingHistory, 
        sendMessage, 
        clearHistory 
    };
};