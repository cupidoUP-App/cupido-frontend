export const ONLINE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutos

export interface PresenceInfo {
    isOnline: boolean;
    lastSeenLabel: string | null;
    lastLoginDate: Date | null;
}

const formatLastSeen = (date: Date | null): string | null => {
    if (!date) return null;
    return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

export const getPresenceFromLastLogin = (lastLogin?: string | null): PresenceInfo => {
    if (!lastLogin) {
        return {
            isOnline: false,
            lastSeenLabel: null,
            lastLoginDate: null,
        };
    }

    try {
        const parsedDate = new Date(lastLogin);
        const diffMs = Date.now() - parsedDate.getTime();
        const isOnline = diffMs < ONLINE_THRESHOLD_MS;

        return {
            isOnline,
            lastSeenLabel: formatLastSeen(parsedDate),
            lastLoginDate: parsedDate,
        };
    } catch {
        return {
            isOnline: false,
            lastSeenLabel: null,
            lastLoginDate: null,
        };
    }
};