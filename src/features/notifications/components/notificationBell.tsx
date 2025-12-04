/*import {Bell} from 'lucide-react';

export default function NotificationBell({onClick}: {onClick: () => void}) {
    return (
        <button
            className='p-3 rounded-full shadow bg-white'
            onClick={onClick}
            >
            <Bell size={24} />
        </button>
    );
}   
*/

import {Bell} from 'lucide-react';

export default function NotificationBell({onClick, unreadCount}: {onClick: () => void, unreadCount: number}) {
    return (
        <button
            className='p-3 rounded-full shadow bg-white relative hover:bg-gray-100 transition'
            onClick={onClick}
            >
            <Bell size={24} className={unreadCount > 0 ? "text-red-600" : "text-gray-600"}/>
            {/* Contador de no leídas */}
            {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadCount}
                </span>
            )}
        </button>
    );
}