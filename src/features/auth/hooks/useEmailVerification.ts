/**
 * Módulo de hook personalizado para la verificación de correo electrónico.
 * Proporciona funciones para enviar, reenviar y verificar códigos
 * de verificación enviados al correo del usuario.
 *
 * @module useEmailVerification
 */

import { useToast } from '@hooks/use-toast';

interface UseEmailVerificationProps {
  email: string;
  onVerifySuccess: () => void;
  setSubmitting: (value: boolean) => void;
}

/**
 * Hook que gestiona el envío y verificación de códigos de verificación por correo.
 *
 * @param props.email - Correo electrónico del usuario al que se enviará el código.
 * @param props.onVerifySuccess - Callback ejecutado cuando la verificación es exitosa.
 * @param props.setSubmitting - Función para actualizar el estado de envío.
 * @returns Objeto con funciones para enviar, reenviar y verificar el código.
 */
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

