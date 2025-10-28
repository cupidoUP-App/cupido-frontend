// ReCaptchaV2.tsx - VERSIÓN MEJORADA
import React, { useEffect, useRef, useState } from 'react';

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
  siteKey
}) => {
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Función para renderizar reCAPTCHA
  const renderRecaptcha = React.useCallback(() => {
    if (recaptchaRef.current && window.grecaptcha) {
      try {
        // Limpiar cualquier widget existente
        if (recaptchaRef.current.innerHTML) {
          recaptchaRef.current.innerHTML = '';
        }

        widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          'expired-callback': onExpired,
          'error-callback': onError,
          theme: 'light',
          size: 'normal'
        });
        console.log('reCAPTCHA rendered successfully with widget ID:', widgetId.current);
        setIsLoaded(true);
        setHasError(false);
        setIsLoading(false);
      } catch (error) {
        console.error('Error rendering reCAPTCHA:', error);
        handleLoadError();
      }
    }
  }, [siteKey, onVerify, onExpired, onError]);

  const handleLoadError = React.useCallback(() => {
    const newAttempt = loadAttempt + 1;
    setLoadAttempt(newAttempt);
    setHasError(true);
    setIsLoaded(false);
    setIsLoading(false);
    
    console.warn(`reCAPTCHA load attempt ${newAttempt} failed`);
    
    // Llamar onError después de varios intentos fallidos
    if (newAttempt >= 3) {
      onError();
    }
  }, [loadAttempt, onError]);

  const loadRecaptchaScript = React.useCallback(() => {
    setIsLoading(true);
    
    // Si ya está cargado, renderizar directamente
    if (window.grecaptcha) {
      console.log('reCAPTCHA already loaded, rendering...');
      renderRecaptcha();
      return;
    }

    // Limpiar script existente si hay error previo
    const existingScript = document.querySelector('script[src*="recaptcha"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
    script.async = true;
    script.defer = true;
    
    let scriptLoaded = false;
    
    script.onload = () => {
      scriptLoaded = true;
      console.log('reCAPTCHA script loaded successfully');
      
      // Pequeño delay para asegurar que grecaptcha esté disponible
      setTimeout(() => {
        if (window.grecaptcha) {
          renderRecaptcha();
        } else {
          console.error('reCAPTCHA not available after script load');
          handleLoadError();
        }
      }, 100);
    };
    
    script.onerror = () => {
      console.error('Error loading reCAPTCHA script');
      if (!scriptLoaded) {
        handleLoadError();
      }
    };
    
    // Agregar un timeout como fallback (10 segundos)
    setTimeout(() => {
      if (!window.grecaptcha && !scriptLoaded) {
        console.error('reCAPTCHA script load timeout');
        handleLoadError();
      }
    }, 10000);
    
    document.head.appendChild(script);
  }, [renderRecaptcha, handleLoadError]);

  // Cargar automáticamente cuando el componente se monta
  useEffect(() => {
    // Solo cargar si tenemos una siteKey válida
    if (!siteKey || siteKey.length <= 10) {
      console.error('Invalid reCAPTCHA site key');
      onError();
      return;
    }

    console.log('Auto-loading reCAPTCHA...');
    loadRecaptchaScript();

    // Cleanup function
    return () => {
      if (widgetId.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetId.current);
        } catch (error) {
          console.error('Error resetting reCAPTCHA on unmount:', error);
        }
      }
    };
  }, [siteKey, loadRecaptchaScript, onError]);

  const resetCaptcha = () => {
    if (widgetId.current !== null && window.grecaptcha) {
      try {
        window.grecaptcha.reset(widgetId.current);
        console.log('reCAPTCHA reset successfully');
      } catch (error) {
        console.error('Error resetting reCAPTCHA:', error);
      }
    }
  };

  const retryLoad = () => {
    console.log('Retrying reCAPTCHA load...');
    setHasError(false);
    setLoadAttempt(prev => prev + 1);
    setIsLoaded(false);
    setIsLoading(false);
    
    // Forzar recarga del script
    const existingScript = document.querySelector('script[src*="recaptcha"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Pequeño delay antes de reintentar
    setTimeout(() => {
      loadRecaptchaScript();
    }, 500);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Indicador de carga */}
      {isLoading && (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
            <span className="text-xs text-gray-600">Cargando reCAPTCHA...</span>
          </div>
        </div>
      )}
      
      <div 
        ref={recaptchaRef} 
        key={`recaptcha-${loadAttempt}`}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
      
      {hasError && (
        <div className="text-center">
          <p className="text-xs text-amber-600 mb-2">
            {loadAttempt > 1 
              ? 'Problemas cargando reCAPTCHA. Por favor, intenta de nuevo.' 
              : 'No se pudo cargar reCAPTCHA.'
            }
          </p>
          <button
            type="button"
            onClick={retryLoad}
            className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Reintentar'}
          </button>
        </div>
      )}
      
      {/* Botón de recargar - siempre visible cuando está cargado */}
      {isLoaded && !hasError && (
        <button
          type="button"
          onClick={resetCaptcha}
          className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors mt-2"
        >
          Recargar CAPTCHA
        </button>
      )}
    </div>
  );
};

export default ReCaptchaV2;