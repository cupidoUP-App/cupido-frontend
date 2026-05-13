/**
 * @module presence
 * Utilidad para determinar la presencia en línea de un contacto
 * basándose en su última fecha de inicio de sesión (last_login).
 * Considera en línea si el último login fue hace menos de 5 minutos.
 */

/** Umbral en milisegundos para considerar a un usuario como "en línea" (5 minutos). */
export const ONLINE_THRESHOLD_MS = 5 * 60 * 1000;

/**
 * Información de presencia de un contacto.
 *
 * @param isOnline - Indica si el contacto está en línea.
 * @param lastSeenLabel - Etiqueta formateada de la última vez visto.
 * @param lastLoginDate - Objeto Date con la fecha del último inicio de sesión.
 */
export interface PresenceInfo {
    isOnline: boolean;
    lastSeenLabel: string | null;
    lastLoginDate: Date | null;
}

/**
 * Formatea una fecha al locale español.
 *
 * @param date - Fecha a formatear.
 * @returns Cadena con la fecha formateada o null si la fecha es inválida.
 */
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

/**
 * Determina la presencia de un contacto a partir de su último inicio de sesión.
 * Si la diferencia con la hora actual es menor a ONLINE_THRESHOLD_MS (5 min),
 * se considera que el usuario está en línea.
 *
 * @param lastLogin - Cadena ISO con la fecha del último inicio de sesión.
 * @returns Objeto PresenceInfo con el estado de presencia.
 */
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