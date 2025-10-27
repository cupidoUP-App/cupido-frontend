// ForgotPasswordModal.tsx
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import ConfirmPasswordField from './ConfirmPasswordField';
import EmailVerificationModal from './EmailVerificationModal';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ForgotPasswordStep = 'email' | 'verification' | 'new-password';

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const { toast } = useToast();

  // Resetear el estado cuando se abre el modal
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep('email');
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
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

    setIsSubmitting(true);
    
    try {
      // Aquí iría la llamada a tu API para enviar código de recuperación
      console.log('Enviando código de recuperación a:', email);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Código enviado",
        description: "Hemos enviado un código de verificación a tu correo.",
      });
      
      setCurrentStep('verification');
    } catch (error) {
      toast({
        title: "Error",
        description: "No pudimos enviar el código. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerificationCode = async () => {
    try {
      // Aquí iría la llamada a tu API para reenviar el código
      console.log('Reenviando código de recuperación a:', email);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Código reenviado",
        description: "Hemos enviado un nuevo código a tu correo.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No pudimos reenviar el código. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  const handleVerifyCode = async (code: string) => {
    setIsVerifying(true);
    
    try {
      // Aquí iría la llamada a tu API para verificar el código
      console.log('Verificando código de recuperación:', code);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular verificación exitosa
      if (code.length === 6) {
        toast({
          title: "Código verificado",
          description: "Ahora puedes crear tu nueva contraseña.",
        });
        
        setCurrentStep('new-password');
      } else {
        throw new Error('Código inválido');
      }
    } catch (error) {
      toast({
        title: "Código inválido",
        description: "El código de verificación es incorrecto.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa ambos campos de contraseña",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Contraseñas no coinciden",
        description: "Las contraseñas deben ser iguales",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Aquí iría la llamada a tu API para resetear la contraseña
      console.log('Reseteando contraseña para:', email);
      console.log('Nueva contraseña:', newPassword);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "¡Contraseña actualizada!",
        description: "Tu contraseña ha sido cambiada exitosamente.",
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No pudimos actualizar tu contraseña. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="w-[439px] h-[600px] bg-[#F2D6CD] rounded-[40px] shadow-[2px_6px_4px_0px_rgba(0,0,0,0.35)] relative overflow-hidden">
          
          {/* Botón para cerrar */}
          <button
            onClick={onClose}
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
                src="src/assets/logo-login.webp" 
                alt="CUPIDO Logo" 
                className="w-[70px] h-[65px]"
              />
            </div>

            {/* Header */}
            <div className="mb-6 text-center">
              <div className="text-black text-xl font-normal font-['Poppins']">
                Recuperar Contraseña
              </div>
              
              <div className="text-black text-2xl font-medium font-['Poppins'] mt-2">
                {currentStep === 'email' && 'Ingresa tu correo'}
                {currentStep === 'verification' && 'Verifica tu identidad'}
                {currentStep === 'new-password' && 'Nueva contraseña'}
              </div>
            </div>

            {/* Contenido según el paso actual */}
            <div className="flex-1 flex flex-col justify-between">
              {currentStep === 'email' && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-gray-700 text-sm">
                      Ingresa tu correo institucional para enviarte un código de verificación
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
                      {isSubmitting ? 'Enviando...' : 'Enviar Código'}
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'new-password' && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-gray-700 text-sm">
                      Crea una nueva contraseña segura para tu cuenta
                    </p>
                  </div>
                  
                  <PasswordField
                    value={newPassword}
                    onChange={setNewPassword}
                  />

                  <ConfirmPasswordField
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    originalPassword={newPassword}
                  />

                  <div className="pt-4">
                    <button
                      onClick={handleResetPassword}
                      disabled={isSubmitting || newPassword !== confirmPassword}
                      className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 text-sm"
                    >
                      {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </button>
                  </div>
                </div>
              )}

              {/* Botón para volver atrás */}
              {(currentStep === 'verification' || currentStep === 'new-password') && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep === 'verification') {
                        setCurrentStep('email');
                      } else if (currentStep === 'new-password') {
                        setCurrentStep('verification');
                      }
                    }}
                    className="text-[#E93923] hover:text-[#d1321f] text-sm underline"
                  >
                    ← Volver atrás
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de verificación de email */}
      <EmailVerificationModal
        isOpen={currentStep === 'verification'}
        onClose={() => setCurrentStep('email')}
        onVerify={handleVerifyCode}
        onResendCode={handleResendVerificationCode}
        userEmail={email}
        isSubmitting={isVerifying}
      />
    </>
  );
};

export default ForgotPasswordModal;