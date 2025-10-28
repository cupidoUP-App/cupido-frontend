import React, { useState, useRef, useEffect } from 'react';
import backgroundImage from '../../../../assets/background_verification.webp';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  onResendCode: () => void;
  userEmail: string;
  isSubmitting?: boolean;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  onResendCode,
  userEmail,
  isSubmitting = false
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60); // 60 segundos para reenviar
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCode(['', '', '', '', '', '']);
      setTimeLeft(60);
      setCanResend(false);
      // Enfocar el primer input cuando se abre el modal
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Temporizador para reenviar código
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // Solo números

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-enfocar siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-enviar cuando todos los dígitos están llenos
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Mover al input anterior al borrar
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/\D/g, '').slice(0, 6).split('');

    if (numbers.length === 6) {
      const newCode = [...code];
      numbers.forEach((num, index) => {
        newCode[index] = num;
      });
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (verificationCode?: string) => {
    const finalCode = verificationCode || code.join('');
    if (finalCode.length === 6) {
      onVerify(finalCode);
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setTimeLeft(60);
      setCanResend(false);
      onResendCode();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#FFF0EC] backdrop-blur-sm">
            {/* Imagen de fondo */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity"
          style={{
            backgroundImage:  `url(${backgroundImage})`
          }}
        />
      <div className="w-[439px] h-[680px] bg-transparent rounded-[40px] shadow-[2px_6px_4px_0px_rgba(0,0,0,0.35)] relative overflow-hidden">

        
        {/* Botón para cerrar */}
        <button
          onClick={onClose}
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
          <div className="flex justify-center mb-4">
            <img 
              src="src/assets/logo-login.webp" 
              alt="CUPIDO Logo" 
              className="w-[70px] h-[65px]"
            />
          </div>

          {/* Header con estilos específicos */}
          <div className="mb-6 text-center">
            {/* Línea única: "Bienvenido a CUPIDO" */}
            <div className="text-black text-xl font-normal font-['Poppins']">
              Bienvenido a{' '}
              <span className="text-[#E93923] font-semibold">CUPIDO</span>
            </div>
            
            {/* Línea 2: "Verificar Email" más grande */}
            <div className="text-black text-2xl font-medium font-['Poppins'] mt-2">
              Verificar Email
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#E93923]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-['Poppins']">
                Verifica tu correo electrónico
              </h3>
              
              <p className="text-gray-700 mb-3 text-xs font-['Poppins']">
                Hemos enviado un código de verificación de 6 dígitos a:
              </p>
              
              <p className="text-[#E93923] font-medium mb-4 text-xs font-['Poppins']">
                {userEmail}
              </p>
              
              <p className="text-xs text-gray-600 font-['Poppins']">
                Ingresa el código que recibiste en tu correo electrónico
              </p>
            </div>

            {/* Código de verificación */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center font-['Poppins']">
                Código de verificación
              </label>
              <div className="flex justify-center space-x-2" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-10 text-center text-base font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E93923] focus:border-transparent bg-white font-['Poppins']"
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>

            {/* Reenviar código */}
            <div className="text-center mb-6">
              <p className="text-xs text-gray-600 font-['Poppins']">
                ¿No recibiste el código?{' '}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={!canResend || isSubmitting}
                  className={`font-medium font-['Poppins'] ${
                    canResend && !isSubmitting
                      ? 'text-[#E93923] hover:text-[#d1321f]'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {canResend ? 'Reenviar código' : `Reenviar en ${timeLeft}s`}
                </button>
              </p>
            </div>

            {/* Botón de verificar */}
            <div className="pt-2">
              <button
                onClick={() => handleSubmit()}
                disabled={code.join('').length !== 6 || isSubmitting}
                className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-sm shadow-md hover:shadow-lg font-['Poppins']"
              >
                {isSubmitting ? 'Verificando...' : 'Verificar Código'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4 pt-4 border-t border-rose-300">
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
    </div>
  );
};

export default EmailVerificationModal;