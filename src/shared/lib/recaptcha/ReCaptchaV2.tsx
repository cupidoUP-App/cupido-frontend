import React, { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
          theme?: "light" | "dark";
          size?: "normal" | "compact";
        }
      ) => number;
      reset: (widgetId: number) => void;
      getResponse: (widgetId: number) => string;
    };
  }
}

interface Props {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpired: () => void;
  onError: () => void;
}

const ReCaptchaV2: React.FC<Props> = ({
  siteKey,
  onVerify,
  onExpired,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const scriptLoadedRef = useRef(false);

  const log = (...args: any[]) => console.log("[ReCAPTCHA]", ...args);

  /** -------- Cargar script -------- */
  const loadScript = useCallback(() => {
    if (scriptLoadedRef.current) {
      log("Script ya cargado. No se vuelve a cargar.");
      return;
    }

    log("Inyectando script...");
    setLoading(true);
    setFailed(false);

    const script = document.createElement("script");
    script.src =
      "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;

    script.onload = () => {
      scriptLoadedRef.current = true;
      log("Script cargado correctamente.");
      setLoading(false);
      renderWidget();
    };

    script.onerror = () => {
      log("Error al cargar el script.");
      setFailed(true);
      setLoading(false);
      onError();
    };

    document.head.appendChild(script);
  }, [onError]);

  /** -------- Renderizar widget -------- */
  const renderWidget = useCallback(() => {
    const el = containerRef.current;

    if (!el) {
      log("Contenedor no disponible.");
      return;
    }

    if (!window.grecaptcha) {
      log("grecaptcha no está listo.");
      return;
    }

    if (widgetIdRef.current !== null) {
      log("Widget ya está renderizado.");
      return;
    }

    window.grecaptcha.ready(() => {
      try {
        log("Renderizando widget...");
        widgetIdRef.current = window.grecaptcha.render(el, {
          sitekey: siteKey,
          callback: onVerify,
          "expired-callback": onExpired,
          "error-callback": () => {
            log("Error interno reCAPTCHA.");
            onError();
          },
        });
      } catch (err) {
        log("Error en render:", err);
        setFailed(true);
        onError();
      }
    });
  }, [siteKey, onVerify, onExpired, onError]);

  /** -------- Montaje -------- */
  useEffect(() => {
    if (!siteKey) {
      log("SiteKey inválida.");
      onError();
      return;
    }

    loadScript();
  }, [siteKey, loadScript, onError]);

  /** -------- Reset seguro -------- */
  const reset = () => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      log("Haciendo reset del widget.");
      try {
        window.grecaptcha.reset(widgetIdRef.current);
      } catch (e) {
        log("Error en reset:", e);
      }
    } else {
      log("Reset solicitado antes de renderizar.");
    }
  };

  /** -------- Retry (solo si nunca cargó el script) -------- */
  const retry = () => {
    log("Reintentando carga...");
    setFailed(false);
    loadScript();
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {loading && (
        <div className="text-gray-600 text-xs">
          Cargando reCAPTCHA...
        </div>
      )}

      <div
        ref={containerRef}
        style={{ minHeight: "78px" }}
        className={`transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      />

      {failed && (
        <button
          onClick={retry}
          className="bg-red-500 text-white px-3 py-1 text-xs rounded"
        >
          Reintentar
        </button>
      )}

      {!failed && !loading && (
        <button
          onClick={reset}
          className="text-xs text-gray-600 underline"
        >
          Reset CAPTCHA
        </button>
      )}
    </div>
  );
};

export default ReCaptchaV2;
