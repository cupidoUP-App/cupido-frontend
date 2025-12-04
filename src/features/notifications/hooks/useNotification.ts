/*import { useEffect, useState } from "react";
import { Notification } from "../types/notification.types";
import { NotificationsServices } from "../services/notificationServices";

export const useNotification = (userId: string) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showList, setShowList] = useState(false);
    const [popup, setPopup] = useState<Notification | null>(null);

    const loadNotifications = async () => {
        const data = await NotificationsServices.getNotifications(userId);
        setNotifications(data.notifications);
    };
*/
   /* useEffect(() => {
        const intervals = setInterval(async () => {
            const data = await NotificationsServices.getNotifications(userId);
            const latestNotification = data.notifications[0];
            const previousNotification = notifications[0];
                
            if (latestNotification && (!previousNotification || latestNotification.id !== previousNotification.id)) {
                setPopup(latestNotification);
                setTimeout(() => setPopup(null), 4000);
            }

            setNotifications(data.notifications);
        }, 5000);
        return () => clearInterval(intervals);
    }, [notifications]);
*/
/*
useEffect(( ) =>{
    const  demo = {
        id:"1",
        title: 'Welcome',
        message: 'Welcome to our service!',
        read:false,
        created_at: new Date(),
    };
    setNotifications([demo]);
    setPopup(demo);
    setTimeout(() => setPopup(null), 60000);
}, []);
    return {notifications, showList, popup, togglelist: () => setShowList(!showList)}; 
};
*/

import { useEffect, useState, useCallback } from "react";
import { Notification } from "../types/notification.types";
import { NotificationsServices } from "../services/notificationServices";

export const useNotification = (userId: string) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showList, setShowList] = useState(false);
    const [popup, setPopup] = useState<Notification | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    // Función para cargar las notificaciones de la API REST
    const loadNotifications = useCallback(async () => {
        try {
            // El userId se ignora por seguridad en el service, pero se mantiene aquí
            // para cumplir con la interfaz del componente padre.
            const data = await NotificationsServices.getNotifications(userId);
            setNotifications(data);
        } catch (error) {
            console.error("Failed to load notifications:", error);
        }
    }, [userId]); // Depende de userId

    // Función para manejar nuevas notificaciones del WebSocket
    const handleNewNotification = useCallback((newNotification: Notification) => {
        // 1. Mostrar como popup
        setPopup(newNotification);
        setTimeout(() => setPopup(null), 4000); // Popup desaparece después de 4 segundos
        
        // 2. Insertar en la lista (al inicio)
        setNotifications(prev => [newNotification, ...prev]);

    }, []);

    // Conexión inicial (y recarga) de la lista de notificaciones
    useEffect(() => {
        loadNotifications();
        
        // Establecer la conexión WebSocket
        const ws = NotificationsServices.connectWebSocket(
            handleNewNotification,
            (error) => console.error("WebSocket error:", error)
        );
        setSocket(ws);

        // Limpiar la conexión al desmontar
        return () => {
            ws.close();
        };
    }, [loadNotifications, handleNewNotification]);

    // Función para alternar la visibilidad de la lista y marcar como leídas
    const togglelist = () => {
        setShowList(prev => {
            const nextShowList = !prev;
            if (nextShowList === true) {
                // Lógica de marcar como leídas las notificaciones no leídas
                const unreadNotifications = notifications.filter(n => !n.read);
                if (unreadNotifications.length > 0) {
                    // Para simplificar, asumimos que al abrir la lista, el usuario "lee" las primeras
                    // 10 notificaciones no leídas. Podrías marcar solo al hacer click.
                    unreadNotifications.slice(0, 10).forEach(async (notif) => {
                         try {
                            await NotificationsServices.markAsRead(notif.id);
                         } catch (error) {
                             // Manejar error
                         }
                    });
                    // Recargar la lista para reflejar el estado 'leído'
                    loadNotifications(); 
                }
            }
            return nextShowList;
        });
    };

    // Exportamos la función de recarga en caso de que un componente la necesite.
    return { notifications, showList, popup, togglelist, loadNotifications }; 
};

