// ForgotPasswordModal.tsx
import React, { useState } from 'react';
import { useToast } from '@hooks/use-toast';
import EmailField from '../forms/EmailField';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  // Resetear el estado cuando se abre el modal
  React.useEffect(() => {
    if (isOpen) {
      setEmail('');
    }
  }, [isOpen]);

  const handleSendVerificationCode = async () => {
    if (!email.trim()) {
      toast({
        title: "Correo requerido",
        description: "Por favor ingresa tu correo electrónico",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Correo inválido",
        description: "Por favor ingresa un correo electrónico válido",
        variant: "destructive"
      });
      return;
    }

    // Check if it's an institutional email
    if (!email.endsWith('@unipamplona.edu.co')) {
      toast({
        title: "Correo institucional requerido",
        description: "Debe usar un correo institucional @unipamplona.edu.co",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { authAPI } = await import('@lib/api');
      await authAPI.resetPasswordRequest({ email });

      toast({
        title: "Correo enviado",
        description: "Si el correo es correcto, te hemos enviado un enlace de verificación.",
      });
      onSuccess();
      onClose();

    } catch (error: any) {
      console.error('Error sending reset code:', error);

      let errorMessage = "No pudimos enviar el correo. Intenta de nuevo.";

      if (error.response?.data) {
        const data = error.response.data;
        if (data.email) {
          errorMessage = data.email[0] || "Error con el correo electrónico.";
        } else if (data.detail) {
          errorMessage = data.detail;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerificationCode = async () => {
    try {
      const { authAPI } = await import('@lib/api');
      await authAPI.resetPasswordRequest({ email });

      toast({
        title: "Código reenviado",
        description: "Hemos enviado un nuevo código a tu correo.",
      });
    } catch (error: any) {
      console.error('Error resending reset code:', error);

      let errorMessage = "No pudimos reenviar el código. Intenta de nuevo.";

      if (error.response?.data) {
        const data = error.response.data;
        if (data.email) {
          errorMessage = data.email[0] || "Error con el correo electrónico.";
        } else if (data.detail) {
          errorMessage = data.detail;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="w-[439px] h-[600px] bg-[#F2D6CD] rounded-[40px] shadow-[2px_6px_4px_0px_rgba(0,0,0,0.35)] relative overflow-hidden">

          {/* Botón para cerrar */}
          <button
            onClick={() => {
              // Reset form fields when closing
              setEmail('');
              onClose();
            }}
            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 p-1 rounded-full hover:bg-rose-300 transition-colors z-10"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Contenido del modal */}
          <div className="h-full flex flex-col p-5">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img
                src="https://i.postimg.cc/htWQx7q5/logo-Fix.webp"
                alt="CUPIDO Logo"
                className="w-[70px] h-[65px]"
              />
            </div>

            {/* Header */}
            <div className="mb-6 text-center">
              <div className="text-black text-xl font-normal font-['Poppins']">
                Recuperar Contraseña
              </div>
            </div>

            {/* Contenido según el paso actual */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-gray-700 text-sm">
                    Ingresa tu correo institucional para enviarte un enlace de recuperación
                  </p>
                </div>

                <EmailField
                  value={email}
                  onChange={setEmail}
                />

                <div className="pt-4">
                  <button
                    onClick={handleSendVerificationCode}
                    disabled={isSubmitting || !email.trim()}
                    className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 text-sm"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
                  </button>
                </div>
              </div>

              {/* Botón para volver atrás */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                  }}
                  className="text-[#E93923] hover:text-[#d1321f] text-sm underline"
                >
                  ← Volver atrás
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordModal;