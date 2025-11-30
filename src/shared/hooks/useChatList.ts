import { useState, useEffect, useCallback } from 'react';
// Importa la función para obtener el token, asumiendo que es global
// import { getAccessToken } from '../auth/authService'; 

// Ajusta esta interfaz para que coincida con la salida de ChatListSerializer
export interface ContactoData {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    last_login?: string; // Para mostrar "última vez en línea"
}

export interface MensajeData {
    contenido: string;
    fechaHora: string;
}

export interface ChatListItemReal {
    id: number; // ID del Chat
    activo: boolean;
    contacto: ContactoData;
    ultimo_mensaje: MensajeData | null;
    no_leidos: number; // Conteo de mensajes no leídos (desde el Backend)
}

const API_BASE_URL = 'http://localhost:8000/api/v1/chat/'; // Ruta principal del módulo de chat

export const useChatList = () => {
    const [chatList, setChatList] = useState<ChatListItemReal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchChats = useCallback(async (silent: boolean = false) => {
        try {
            if (!silent) {
                setLoading(true);
            }
            const token = localStorage.getItem('access_token')?.replace(/"/g, '') || '';
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData?.detail || errorData?.error || `Error ${response.status}`);
            }
            const data: ChatListItemReal[] = await response.json();
            setChatList(data);
            setError(null);
        } catch (err: any) {
            console.error('❌ Error al cargar la lista de chats:', err);
            setError(err.message || 'Fallo en la conexión con el servidor.');
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, []);

    // Carga inicial con indicador de loading
    useEffect(() => {
        fetchChats(false);
    }, [fetchChats]);

    // Polling ligero para mantener presencia (last_login) y conteos actualizados,
    // sin mostrar el estado de "Cargando lista..." en la UI.
    useEffect(() => {
        const id = window.setInterval(() => {
            fetchChats(true);
        }, 15000); // cada 15 segundos
        return () => window.clearInterval(id);
    }, [fetchChats]);

    return {
        chatList,
        loading,
        error,
        setChatList,
        refetchChats: () => fetchChats(true),
    };
};
