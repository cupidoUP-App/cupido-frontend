// ReCaptchaV2.tsx - VERSIÓN CON LOGS DETALLADOS
import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback': () => void;
        'error-callback': () => void;
        theme?: 'light' | 'dark';
        size?: 'normal' | 'compact';
      }) => number;
      reset: (widgetId: number) => void;
      getResponse: (widgetId: number) => string;
    };
  }
}

interface ReCaptchaV2Props {
  onVerify: (token: string) => void;
  onExpired: () => void;
  onError: () => void;
  siteKey: string;
}

const ReCaptchaV2: React.FC<ReCaptchaV2Props> = ({
  onVerify,
  onExpired,
  onError,
  siteKey,
}) => {
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const logState = (msg: string) => {
    console.log(`[ReCAPTCHA DEBUG] ${msg}`, {
      loadAttempt,
      isLoaded,
      hasError,
      isLoading,
      siteKey,
      widgetId: widgetId.current,
    });
  };

  const renderRecaptcha = React.useCallback(() => {
    console.group("[ReCAPTCHA DEBUG] renderRecaptcha()");
    logState("Intentando renderizar reCAPTCHA...");

    if (recaptchaRef.current && window.grecaptcha) {
      try {
        if (widgetId.current !== null) {
          console.log("[ReCAPTCHA DEBUG] Reset widget existente:", widgetId.current);
          window.grecaptcha.reset(widgetId.current);
        }

        recaptchaRef.current.innerHTML = "";
        console.log("[ReCAPTCHA DEBUG] Contenedor HTML limpiado.");

        setTimeout(() => {
          console.log("[ReCAPTCHA DEBUG] Renderizando nuevo widget...");
          widgetId.current = window.grecaptcha.render(recaptchaRef.current!, {
            sitekey: siteKey,
            callback: (token) => {
              console.log("[ReCAPTCHA DEBUG] TOKEN recibido:", token);
              onVerify(token);
            },
            'expired-callback': () => {
              console.warn("[ReCAPTCHA DEBUG] TOKEN expirado");
              onExpired();
            },
            'error-callback': () => {
              console.error("[ReCAPTCHA DEBUG] Error en widget");
              onError();
            },
            theme: "light",
            size: "normal",
          });

          console.log("[ReCAPTCHA DEBUG] Render exitoso con ID:", widgetId.current);
          setIsLoaded(true);
          setHasError(false);
          setIsLoading(false);
          console.groupEnd();
        }, 200);
      } catch (error) {
        console.error("[ReCAPTCHA DEBUG] Error durante render:", error);
        handleLoadError();
        console.groupEnd();
      }
    } else {
      console.error("[ReCAPTCHA DEBUG] grecaptcha o contenedor no disponible.");
      handleLoadError();
      console.groupEnd();
    }
  }, [siteKey, onVerify, onExpired, onError]);

  const handleLoadError = React.useCallback(() => {
    const newAttempt = loadAttempt + 1;
    console.warn(`[ReCAPTCHA DEBUG] Error en carga (intento ${newAttempt})`);
    setLoadAttempt(newAttempt);
    setHasError(true);
    setIsLoaded(false);
    setIsLoading(false);

    if (newAttempt >= 3) {
      console.error("[ReCAPTCHA DEBUG] 3 intentos fallidos, ejecutando onError()");
      onError();
    }
  }, [loadAttempt, onError]);

  const loadRecaptchaScript = React.useCallback(() => {
    console.group("[ReCAPTCHA DEBUG] loadRecaptchaScript()");
    logState("Cargando script...");
    setIsLoading(true);

    if (window.grecaptcha) {
      console.log("[ReCAPTCHA DEBUG] grecaptcha ya disponible, renderizando...");
      renderRecaptcha();
      console.groupEnd();
      return;
    }

    const existingScript = document.querySelector('script[src*="recaptcha"]');
    if (existingScript) {
      console.log("[ReCAPTCHA DEBUG] Eliminando script previo...");
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;

    let scriptLoaded = false;

    script.onload = () => {
      scriptLoaded = true;
      console.log("[ReCAPTCHA DEBUG] Script cargado correctamente.");
      setTimeout(() => {
        if (window.grecaptcha) {
          console.log("[ReCAPTCHA DEBUG] grecaptcha disponible, renderizando widget...");
          renderRecaptcha();
        } else {
          console.error("[ReCAPTCHA DEBUG] grecaptcha no disponible tras carga.");
          handleLoadError();
        }
      }, 200);
    };

    script.onerror = () => {
      console.error("[ReCAPTCHA DEBUG] Error al cargar el script de Google.");
      if (!scriptLoaded) handleLoadError();
    };

    setTimeout(() => {
      if (!window.grecaptcha && !scriptLoaded) {
        console.error("[ReCAPTCHA DEBUG] Timeout al cargar script (10s).");
        handleLoadError();
      }
    }, 10000);

    document.head.appendChild(script);
    console.groupEnd();
  }, [renderRecaptcha, handleLoadError]);

  useEffect(() => {
    console.group("[ReCAPTCHA DEBUG] useEffect -> montaje del componente");
    if (!siteKey || siteKey.length <= 10) {
      console.error("[ReCAPTCHA DEBUG] Clave de sitio inválida:", siteKey);
      onError();
      console.groupEnd();
      return;
    }

    console.log("[ReCAPTCHA DEBUG] Clave válida. Iniciando carga...");
    loadRecaptchaScript();

    return () => {
      console.log("[ReCAPTCHA DEBUG] Desmontando componente...");
      if (widgetId.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetId.current);
          console.log("[ReCAPTCHA DEBUG] Widget reseteado correctamente.");
        } catch (error) {
          console.warn("[ReCAPTCHA DEBUG] Error al resetear:", error);
        }
      }
      widgetId.current = null;
      console.groupEnd();
    };
  }, [siteKey, loadRecaptchaScript, onError]);

  const resetCaptcha = () => {
    console.log("[ReCAPTCHA DEBUG] Forzando reset manual...");
    if (widgetId.current !== null && window.grecaptcha) {
      try {
        window.grecaptcha.reset(widgetId.current);
        console.log("[ReCAPTCHA DEBUG] Reset exitoso.");
      } catch (error) {
        console.error("[ReCAPTCHA DEBUG] Error al resetear:", error);
        setTimeout(() => renderRecaptcha(), 500);
      }
    } else {
      renderRecaptcha();
    }
  };

  const retryLoad = () => {
    console.warn("[ReCAPTCHA DEBUG] Reintentando carga...");
    setHasError(false);
    setLoadAttempt((prev) => prev + 1);
    setIsLoaded(false);
    setIsLoading(false);

    const existingScript = document.querySelector('script[src*="recaptcha"]');
    if (existingScript) existingScript.remove();

    setTimeout(() => {
      loadRecaptchaScript();
    }, 500);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {isLoading && (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-xs text-gray-600">Cargando reCAPTCHA...</span>
          </div>
        </div>
      )}

      <div
        ref={recaptchaRef}
        key={`recaptcha-${loadAttempt}-${siteKey}`}
        className={`${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        style={{ minHeight: "78px" }}
      />

      {hasError && (
        <div className="text-center">
          <p className="text-xs text-red-600 mb-2">
            No se pudo cargar reCAPTCHA. Intenta nuevamente.
          </p>
          <button
            type="button"
            onClick={retryLoad}
            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            disabled={isLoading}
          >
            Reintentar
          </button>
        </div>
      )}

      {isLoaded && !hasError && (
        <button
          type="button"
          onClick={resetCaptcha}
          className="text-xs text-gray-500 hover:text-gray-700 underline mt-2"
        >
          Recargar CAPTCHA
        </button>
      )}
    </div>
  );
};

export default ReCaptchaV2;
