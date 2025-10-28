import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/appStore';
import { useFormSteps } from './useFormSteps';
import { useEmailVerification } from './useEmailVerification';
import { FormData } from '../types';
import { RegistrationData } from '../components/CompleteRegister';

interface UseSignUpFormProps {
  onClose: () => void;
}

export const useSignUpForm = ({ onClose }: UseSignUpFormProps) => {
  const { toast } = useToast();
  const { openLogin } = useAppStore();

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

  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenTerms = () => {
    setShowTerms(true);
  };

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

  const handleCaptchaVerify = (token: string) => {
    console.log('CAPTCHA verificado con token:', token);
    setIsCaptchaVerified(true);
    setCurrentStep('initial'); // Volver al formulario principal
    
    toast({
      title: "Verificación exitosa",
      description: "Has completado la verificación de seguridad.",
    });
  };

  const handleCaptchaExpired = () => {
    setIsCaptchaVerified(false);
    toast({
      title: "Verificación expirada",
      description: "Por favor, completa la verificación de nuevo.",
      variant: "destructive"
    });
  };

  const handleCaptchaError = () => {
    toast({
      title: "Error de verificación",
      description: "Hubo un error con la verificación. Intenta de nuevo.",
      variant: "destructive"
    });
  };

  const handleSwitchToLogin = () => {
    onClose(); // Cerrar el modal de registro
    openLogin(); // Abrir el modal de login directamente
  };

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

  const handleResendVerificationCode = async () => {
    await emailVerification.resendVerificationCode();
  };

  const handleVerifyEmailCode = async (code: string) => {
    const success = await emailVerification.verifyEmailCode(code);
    if (success) {
      setCurrentStep('complete-register');
      setShowCompleteRegister(true);
    }
  };

  const handleCompleteRegisterSubmit = async (userData: RegistrationData) => {
    setIsSubmitting(true);
    
    try {
      // Aquí irías el registro completo con todos los datos
      console.log('Datos completos del usuario:', {
        ...formData, // email, password del formulario inicial
        ...userData  // datos personales del CompleteRegister
      });
      
      // Simulación de registro completo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "¡Registro completado!",
        description: "Tu cuenta ha sido creada exitosamente.",
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

