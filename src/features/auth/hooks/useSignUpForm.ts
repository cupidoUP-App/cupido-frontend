/**
 * Módulo de hook personalizado para el formulario de registro de usuario.
 * Gestiona el estado del formulario, los pasos del flujo de registro,
 * la verificación de correo electrónico y el envío de datos al backend.
 *
 * @module useSignUpForm
 */

import { useState } from 'react';
import { useToast } from '@hooks/use-toast';
import { useAppStore } from '@store/appStore';
import { useFormSteps } from './useFormSteps';
import { useEmailVerification } from './useEmailVerification';
import { FormData } from '../types';
import { RegistrationData } from '../components/modals/CompleteRegister';

/** Props del hook useSignUpForm. */
interface UseSignUpFormProps {
  onClose: () => void;
}

/**
 * Hook que gestiona el flujo completo de registro de usuario.
 *
 * @param props.onClose - Función para cerrar el modal de registro.
 * @returns Objeto con el estado del formulario, el estado de los pasos y
 *          los manejadores para cada interacción del usuario.
 */
export const useSignUpForm = ({ onClose }: UseSignUpFormProps) => {
  const { toast } = useToast();
  const { openLogin } = useAppStore();

  /** Estado interno: datos del formulario de registro. */
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const {
    stepState,
    setCurrentStep,
    setShowTerms,
    setIsCaptchaVerified,
    setIsSubmitting,
    setIsVerifyingEmail,
    setShowCompleteRegister,
  } = useFormSteps();

  const emailVerification = useEmailVerification({
    email: formData.email,
    onVerifySuccess: () => {
      setCurrentStep('complete-register');
      setShowCompleteRegister(true);
    },
    setSubmitting: setIsSubmitting,
  });

  /** Actualiza un campo del formulario con el nuevo valor proporcionado. */
  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /** Abre el modal de términos y condiciones. */
  const handleOpenTerms = () => {
    setShowTerms(true);
  };

  /** Acepta los términos y condiciones y cierra el modal. */
  const handleAcceptTerms = () => {
    setFormData(prev => ({
      ...prev,
      acceptTerms: true
    }));
    setShowTerms(false);
    toast({
      title: "Términos aceptados",
      description: "Has aceptado los términos y condiciones correctamente.",
    });
  };

  /** Rechaza los términos y condiciones y cierra el modal. */
  const handleRejectTerms = () => {
    setFormData(prev => ({
      ...prev,
      acceptTerms: false
    }));
    setShowTerms(false);
    toast({
      title: "Términos rechazados",
      description: "Debes aceptar los términos y condiciones para registrarte.",
      variant: "destructive"
    });
  };

  /** Maneja la verificación exitosa del CAPTCHA. */
  const handleCaptchaVerify = (token: string) => {
    setIsCaptchaVerified(true);
    setCurrentStep('initial'); // Volver al formulario principal
    
    toast({
      title: "Verificación exitosa",
      description: "Has completado la verificación de seguridad.",
    });
  };

  /** Maneja la expiración del token CAPTCHA. */
  const handleCaptchaExpired = () => {
    setIsCaptchaVerified(false);
    toast({
      title: "Verificación expirada",
      description: "Por favor, completa la verificación de nuevo.",
      variant: "destructive"
    });
  };

  /** Maneja un error durante la verificación CAPTCHA. */
  const handleCaptchaError = () => {
    toast({
      title: "Error de verificación",
      description: "Hubo un error con la verificación. Intenta de nuevo.",
      variant: "destructive"
    });
  };

  /** Cambia del flujo de registro al flujo de inicio de sesión. */
  const handleSwitchToLogin = () => {
    onClose(); // Cerrar el modal de registro
    openLogin(); // Abrir el modal de login directamente
  };

  /** Envía el código de verificación al correo y avanza al paso de verificación. */
  const handleSendVerificationCode = async () => {
    setIsVerifyingEmail(true);
    
    try {
      await emailVerification.sendVerificationCode();
      setCurrentStep('email-verification');
    } catch (error) {
      // Error ya manejado en emailVerification
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  /** Reenvía un nuevo código de verificación al correo del usuario. */
  const handleResendVerificationCode = async () => {
    await emailVerification.resendVerificationCode();
  };

  /** Verifica el código ingresado y avanza al registro completo si es correcto. */
  const handleVerifyEmailCode = async (code: string) => {
    const success = await emailVerification.verifyEmailCode(code);
    if (success) {
      setCurrentStep('complete-register');
      setShowCompleteRegister(true);
    }
  };

  /** Envía los datos restantes del registro al backend y finaliza el flujo. */
  const handleCompleteRegisterSubmit = async (userData: RegistrationData) => {
    setIsSubmitting(true);
    
    try {
      
      
      // Simulación de registro completo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Registro completado",
        description: "Tu cuenta ha sido creada exitosamente. Ahora puedes ingresar a Cupido.",
      });
      
      setCurrentStep('completed');
      setShowCompleteRegister(false);
      
      // Cerrar todo después de un éxito
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Error en el registro",
        description: "No pudimos completar tu registro. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Valida que los campos obligatorios del formulario estén completos. */
  const validateBasicFields = (): boolean => {
    const emptyFields: string[] = [];
    
    if (!formData.email.trim()) emptyFields.push('correo electrónico');
    if (!formData.password.trim()) emptyFields.push('contraseña');
    if (!formData.confirmPassword.trim()) emptyFields.push('confirmar contraseña');
    if (!formData.acceptTerms) emptyFields.push('términos y condiciones');

    if (emptyFields.length > 0) {
      const fieldsText = emptyFields.join(', ');
      toast({
        title: "Campos incompletos",
        description: `Por favor completa los siguientes campos: ${fieldsText}`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  /** Maneja el envío del formulario: valida campos, muestra CAPTCHA o envía código de verificación. */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (stepState.isSubmitting || stepState.isVerifyingEmail) return;

    // Validar campos básicos
    if (!validateBasicFields()) return;

    // PRIMER CLIC: Mostrar CAPTCHA si no está verificado
    if (!stepState.isCaptchaVerified) {
      setCurrentStep('captcha');
      return;
    }

    // SEGUNDO CLIC: CAPTCHA ya verificado, enviar código de verificación
    setIsSubmitting(true);
    try {
      await handleSendVerificationCode();
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Devuelve el texto del botón de envío según el estado actual del formulario. */
  const getButtonText = () => {
    if (stepState.isSubmitting || stepState.isVerifyingEmail) return 'Procesando...';
    if (!stepState.isCaptchaVerified) return 'Continuar';
    return 'Enviar código de verificación';
  };

  return {
    formData,
    stepState,
    handleFieldChange,
    handleOpenTerms,
    handleAcceptTerms,
    handleRejectTerms,
    handleCaptchaVerify,
    handleCaptchaExpired,
    handleCaptchaError,
    handleSwitchToLogin,
    handleResendVerificationCode,
    handleVerifyEmailCode,
    handleCompleteRegisterSubmit,
    handleSubmit,
    getButtonText,
    setShowTerms,
    setCurrentStep,
  };
};

