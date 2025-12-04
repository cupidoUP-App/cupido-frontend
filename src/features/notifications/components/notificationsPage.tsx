/*import NotificationBell from "./notificationBell";
import NotificationsList from "./notificationsList";
import { useNotification } from "../hooks/useNotification";

export default function NotificationsPage({userId}:{userId:string}) {
    const {notifications, showList, popup, togglelist} = useNotification(userId);
        return (
            <div className="relative w-full h-full" >
                {/* Holi campana }
                <div className = "absolute right-4 top-4"> 
                    <NotificationBell onClick={togglelist}/>

                </div>
                {/* Holi lista }
                <NotificationsList notifications={notifications} visible = {showList} />
                {/* Holi Pop }
                {popup && (
                    <div className="fixed top-5 left-1/2 tranform -translate-x-1/2 bg-white
                                    shadow-xl rounded-xl px-4 py-3 border w-[90%] max-w-md relative">
                        <h4 className="font-bolt">
                            {popup.title}
                        </h4>
                    </div>
                )}
            </div>
        )
}
*/

import NotificationBell from "./notificationBell";
import NotificationsList from "./notificationsList";
import { useNotification } from "../hooks/useNotification";

export default function NotificationsPage({userId}:{userId:string}) {
    const {notifications, showList, popup, togglelist} = useNotification(userId);
    
    // Calcular el número de notificaciones no leídas
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative w-full h-full" >
            {/* Botón de la Campana */}
            <div className = "absolute right-4 top-4"> 
                <NotificationBell onClick={togglelist} unreadCount={unreadCount}/>
            </div>
            
            {/* Lista de Notificaciones */}
            <NotificationsList notifications={notifications} visible = {showList} />
            
            {/* Popup */}
            {popup && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white
                                shadow-xl rounded-xl px-4 py-3 border border-blue-400 w-[90%] max-w-md relative z-50">
                    <h4 className="font-bold text-lg text-blue-700">
                        {popup.title}
                    </h4>
                    <p className="text-sm text-gray-700">{popup.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                        {new Date(popup.created_at).toLocaleTimeString()}
                    </p>
                </div>
            )}
        </div>
    )
}