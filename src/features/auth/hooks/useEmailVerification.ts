import { useToast } from '@hooks/use-toast';

interface UseEmailVerificationProps {
  email: string;
  onVerifySuccess: () => void;
  setSubmitting: (value: boolean) => void;
}

export const useEmailVerification = ({
  email,
  onVerifySuccess,
  setSubmitting,
}: UseEmailVerificationProps) => {
  const { toast } = useToast();

  const sendVerificationCode = async () => {
    setSubmitting(true);
    
    try {
      
      // Simulación de envío de código
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Código enviado",
        description: "Hemos enviado un código de verificación a tu correo electrónico.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No pudimos enviar el código de verificación. Intenta de nuevo.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const resendVerificationCode = async () => {
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Código reenviado",
        description: "Hemos enviado un nuevo código de verificación a tu correo.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No pudimos reenviar el código. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  const verifyEmailCode = async (code: string): Promise<boolean> => {
    setSubmitting(true);
    
    try {
      
      // Simulación de verificación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular verificación exitosa
      if (code.length === 6) {
        toast({
          title: "¡Correo verificado!",
          description: "Ahora completa tu información personal.",
        });
        
        return true;
      } else {
        throw new Error('Código inválido');
      }
    } catch (error) {
      toast({
        title: "Código inválido",
        description: "El código de verificación es incorrecto. Intenta de nuevo.",
        variant: "destructive"
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    sendVerificationCode,
    resendVerificationCode,
    verifyEmailCode,
  };
};

