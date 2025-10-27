import React, { useState, useEffect, useRef } from 'react';
import { ParticlesComponent } from '../../home/components/Particles';

interface PhoneVerificationProps {
  isOpen: boolean;
  onSubmit: (code: string) => void;
  onClose: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  isOpen,
  onSubmit,
  onClose,
  onBack,
  isSubmitting = false
}) => {
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resetear form cuando se abre
  useEffect(() => {
    if (isOpen) {
      setCode(['', '', '', '']);
      setPhone('');
      setError('');
      setShowCodeInput(false);
    }
  }, [isOpen]);

  const handleCodeChange = (index: number, value: string) => {
    // Solo permitir números
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');

    // Auto-enfocar siguiente input
    if (value !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/\D/g, '').split('').slice(0, 4);
    
    const newCode = [...code];
    numbers.forEach((num, index) => {
      if (index < 4) {
        newCode[index] = num;
      }
    });
    
    setCode(newCode);
    
    // Enfocar el último input con datos o el último input
    const lastFilledIndex = numbers.length - 1;
    const focusIndex = Math.min(lastFilledIndex, 3);
    inputRefs.current[focusIndex]?.focus();
  };

  const validatePhone = (): boolean => {
    if (!phone.trim()) {
      setError('El número de teléfono es requerido');
      return false;
    }
    if (!/^\d+$/.test(phone)) {
      setError('El número de teléfono debe contener solo dígitos');
      return false;
    }
    return true;
  };

  const validateCode = (): boolean => {
    if (code.some(digit => digit === '')) {
      setError('Por favor, completa todos los dígitos del código');
      return false;
    }
    return true;
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePhone()) {
      // Simular envío de código
      setShowCodeInput(true);
      setError('');
      console.log('Enviando código al teléfono:', phone);
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateCode()) {
      const verificationCode = code.join('');
      onSubmit(verificationCode);
    }
  };

  const RightSideWithParticles = () => (
    <div className="absolute right-0 top-0 bottom-0 w-1/2 h-full overflow-hidden">
      {/* Efecto de partículas en toda la mitad derecha */}
      <div className="absolute inset-0 z-0">
        <ParticlesComponent id="phone-verification-particles" />
      </div>
      
      {/* Imagen más grande */}
      <div className="absolute right-0 bottom-0 h-[85vh] max-w-[45vw] flex items-end z-10"> 
        <img 
          src="src\assets\flat-valentine-s-day-photocall-template-Photoroom 1.webp" 
          alt="Decoración" 
          className="h-full w-auto object-right-bottom object-contain"
        />
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm">
      {/* Contenedor principal */}
      <div className="w-full h-full bg-[#F2D6CD] relative">
        
        {/* Componente de mitad derecha con partículas */}
        <RightSideWithParticles />

        {/* Botón para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-rose-300 transition-colors z-30"
          aria-label="Cerrar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Botón para volver (opcional) */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-rose-300 transition-colors z-30"
            aria-label="Volver"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Contenedor del formulario */}
        <div className="h-full flex items-center justify-start pl-10 lg:pl-20 xl:pl-28 z-20">
          <div className="w-full max-w-md">
            
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img 
                src="src/assets/logo-login.webp" 
                alt="CUPIDO Logo" 
                className="w-16 h-14"
              />
            </div>

            {/* Header */}
            <div className="mb-6">
              <div className="text-black text-base font-normal font-['Poppins'] text-center">
                Verificación de teléfono
              </div>
              <div className="text-black text-lg font-medium font-['Poppins'] mt-1 text-center">
                {showCodeInput ? 'Ingresa el código' : 'Ingresa tu número'}
              </div>
              <p className="text-gray-700 text-xs mt-1 font-['Poppins'] max-w-md leading-relaxed text-center mx-auto">
                {showCodeInput 
                  ? 'Ingresa el código que enviamos a tu teléfono para verificar tu identidad.'
                  : 'Ingresa tu número de teléfono para enviarte un código de verificación.'
                }
              </p>
            </div>

            {/* Formulario de teléfono */}
            {!showCodeInput ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 font-['Poppins']">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (error) setError('');
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#E93923] focus:border-transparent bg-white font-['Poppins'] text-xs ${
                      error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingresa tu número de teléfono"
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p className="text-red-500 text-xs mt-1 font-['Poppins']">{error}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-1 font-['Poppins']">
                    Ingresa tu número de teléfono para recibir el código
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !phone.trim()}
                    className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-xs shadow hover:shadow-md font-['Poppins']"
                  >
                    Enviar Código
                  </button>
                </div>
              </form>
            ) : (
              /* Formulario de verificación de código */
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div className="mb-4">
                  <div className="text-black text-sm font-medium font-['Poppins'] text-center mb-2">
                    Ingresa el código que enviamos a tu teléfono
                  </div>
                  <p className="text-gray-700 text-xs text-center font-['Poppins']">
                    El código fue enviado a: <span className="font-semibold">{phone}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2 font-['Poppins'] text-center">
                    Código de verificación *
                  </label>
                  <div className="flex justify-center space-x-2">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className={`w-12 h-12 text-center border rounded-md focus:ring-2 focus:ring-[#E93923] focus:border-transparent bg-white font-['Poppins'] text-lg font-semibold ${
                          error ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                      />
                    ))}
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs mt-2 text-center font-['Poppins']">{error}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-xs shadow hover:shadow-md font-['Poppins']"
                  >
                    {isSubmitting ? 'Verificando...' : 'Continuar'}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-[#E93923] text-xs font-['Poppins'] hover:underline"
                    onClick={() => {
                      setCode(['', '', '', '']);
                      setError('');
                      // Lógica para reenviar código
                      console.log('Reenviando código a:', phone);
                    }}
                  >
                    Reenviar código
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-gray-600 text-xs font-['Poppins'] hover:underline"
                    onClick={() => {
                      setShowCodeInput(false);
                      setError('');
                    }}
                  >
                    Cambiar número de teléfono
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;