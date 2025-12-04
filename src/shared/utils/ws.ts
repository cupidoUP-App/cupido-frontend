export interface BuildWsUrlOptions {
    baseUrl?: string | null;
    fallbackPath?: string;
    pathSegments?: Array<string | number | null | undefined>;
    query?: Record<string, string | number | null | undefined>;
}

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

export const resolveWsBaseUrl = (
    baseUrl?: string | null,
    fallbackPath = ""
): string => {
    const hasWindow = typeof window !== "undefined";
    let candidate = baseUrl?.trim();

    if (!candidate) {
        if (!hasWindow) {
            throw new Error("Unable to infer WebSocket base URL without browser context");
        }
        const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        const normalizedFallback = fallbackPath
            ? `/${trimSlashes(fallbackPath)}`
            : "";
        candidate = `${protocol}${window.location.host}${normalizedFallback}`;
    }

    // Si llega como ruta relativa (ej. /ws/chat), completar con host actual
    if (!candidate.startsWith("ws://") && !candidate.startsWith("wss://")) {
        if (!hasWindow) {
            throw new Error("WebSocket base URL must be absolute in non-browser contexts");
        }
        const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        const normalizedPath = candidate.startsWith("/") ? candidate : `/${candidate}`;
        candidate = `${protocol}${window.location.host}${normalizedPath}`;
    }

    // Forzar wss si la página está en HTTPS
    if (hasWindow && window.location.protocol === "https:" && candidate.startsWith("ws://")) {
        candidate = `wss://${candidate.slice(5)}`;
    }

    return candidate.replace(/\/+$/, "");
};

export const buildWsUrl = ({
    baseUrl,
    fallbackPath = "",
    pathSegments = [],
    query = {},
}: BuildWsUrlOptions): string => {
    const base = resolveWsBaseUrl(baseUrl, fallbackPath);
    const sanitizedSegments = pathSegments
        .filter((segment): segment is string | number => segment !== null && segment !== undefined)
        .map((segment) => trimSlashes(String(segment)))
        .filter(Boolean);

    const pathSuffix = sanitizedSegments.length ? `/${sanitizedSegments.join("/")}` : "";
    const fullPath = `${base}${pathSuffix}`;
    const normalizedFullPath = fullPath.endsWith("/") ? fullPath : `${fullPath}/`;
    const url = new URL(normalizedFullPath);

    Object.entries(query).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            url.searchParams.set(key, String(value));
        }
    });

    return url.toString();
};
