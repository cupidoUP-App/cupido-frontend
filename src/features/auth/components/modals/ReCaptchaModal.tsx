// ReCaptchaModal.tsx - ACTUALIZADO para manejar mejor los errores
import React, { useState } from 'react';
import ReCaptchaV2 from '../shared/ReCaptchaV2';

interface ReCaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (token: string) => void;
  onExpired: () => void;
  onError: () => void;
}

const ReCaptchaModal: React.FC<ReCaptchaModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  onExpired,
  onError
}) => {
  const [captchaError, setCaptchaError] = useState(false);

  if (!isOpen) return null;

  // Clave de sitio de reCAPTCHA desde variables de entorno
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleVerify = (token: string) => {
    console.log('reCAPTCHA token:', token);
    setCaptchaError(false);
    onVerify(token);
    onClose();
  };

  const handleExpired = () => {
    console.log('reCAPTCHA expired');
    setCaptchaError(false); // Limpiar error anterior
    onExpired();
  };

  const handleError = () => {
    console.log('reCAPTCHA error');
    setCaptchaError(true);
    onError();
  };

  const handleClose = () => {
    // Limpiar estado de error al cerrar
    setCaptchaError(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-[439px] bg-[#F2D6CD] rounded-[40px] shadow-[2px_6px_4px_0px_rgba(0,0,0,0.35)] relative overflow-hidden">
        
        {/* Botón para cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-rose-300 transition-colors z-10"
          aria-label="Cerrar verificación"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenido */}
        <div className="relative z-10 h-full flex flex-col p-8">
          {/* Logo centrado en la parte superior */}
          <div className="flex justify-center mb-6">
            <img 
              src="src/assets/logo-login.webp" 
              alt="CUPIDO Logo" 
              className="w-[70px] h-[65px]"
            />
          </div>

          {/* Header */}
          <div className="mb-6 text-center">
            <div className="text-black text-xl font-normal font-['Poppins']">
              Bienvenido a{' '}
              <span className="text-[#E93923] font-semibold">CUPIDO</span>
            </div>
            
            <div className="text-black text-2xl font-medium font-['Poppins'] mt-2">
              Verificación de Seguridad
            </div>
          </div>


            {/* Componente reCAPTCHA */}
            <div className="mb-6 flex justify-center">
              <ReCaptchaV2
                siteKey={RECAPTCHA_SITE_KEY}
                onVerify={handleVerify}
                onExpired={handleExpired}
                onError={handleError}
              />
            </div>

            {/* Información adicional */}
            <div className="text-center mb-6">
              <p className="text-xs text-gray-600 font-['Poppins']">
                Si tienes problemas con la verificación, intenta recargar la página o contacta con soporte.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pt-4 border-t border-rose-300">
            <p className="text-xs text-gray-600 font-['Poppins']">
              ¿Problemas con la verificación?{' '}
              <button
                type="button"
                onClick={onClose}
                className="text-[#E93923] hover:text-[#d1321f] font-semibold underline text-xs font-['Poppins']"
              >
                Volver al registro
              </button>
            </p>
          </div>
        </div>
      </div>
  );
};

export default ReCaptchaModal;