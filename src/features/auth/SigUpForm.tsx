import React, { useState } from 'react';
import { useToast } from '@hooks/use-toast';
import EmailField from './components/forms/EmailField';
import PasswordField from './components/forms/PasswordField';
import ConfirmPasswordField from './components/forms/ConfirmPasswordField';
import TermsCheckbox from '@lib/recaptcha/TermsCheckbox';
import TermsAndConditions from '@modals/TermsAndConditions';
import ReCaptchaModal from './components/modals/ReCaptchaModal';
import EmailVerificationModal from './components/modals/EmailVerificationModal';
import { FormData, FormErrors, validateForm } from './utils/Validations';
import { useAppStore } from '@store/appStore';
import { authAPI } from '@lib/api';

interface RegistroProps {
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

// Estados para controlar el flujo
type FormStep = 'initial' | 'captcha' | 'email-verification' | 'completed';

const SigUpForm: React.FC<RegistroProps> = ({ onClose }) => {
  const { openLogin } = useAppStore();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    firma: ''
  });

  const [currentStep, setCurrentStep] = useState<FormStep>('initial');
  const [showTerms, setShowTerms] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  const { toast } = useToast();

  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenTerms = () => {
    setShowTerms(true);
  };

  const handleAcceptTerms = (firma: string) => {
    setFormData(prev => ({
      ...prev,
      acceptTerms: true,
      firma: firma
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

    setIsCaptchaVerified(true);
    setRecaptchaToken(token);
    setCurrentStep('initial');

    toast({
      title: "Verificación exitosa",
      description: "Has completado la verificación de seguridad.",
    });
  };

  const handleCaptchaExpired = () => {
    setIsCaptchaVerified(false);
    setRecaptchaToken('');
    toast({
      title: "Verificación expirada",
      description: "Por favor, completa la verificación de nuevo.",
      variant: "destructive"
    });
  };

  const handleSwitchToLogin = () => {
    onClose();
    openLogin();
  };

  const handleCaptchaError = () => {
    setIsCaptchaVerified(false);
    setRecaptchaToken('');
    toast({
      title: "Error de verificación",
      description: "Hubo un error con la verificación. Intenta de nuevo.",
      variant: "destructive"
    });
  };

  const handleSendVerificationCode = async () => {
    setIsVerifyingEmail(true);

    try {
      if (!formData.email || !formData.password || !formData.acceptTerms) {
        throw new Error('Faltan campos requeridos');
      }

      if (!recaptchaToken || recaptchaToken.trim() === '') {
        throw new Error('Debes completar la verificación de seguridad');
      }


      const response = await authAPI.register({
        email: formData.email,
        contrasena: formData.password,
        recaptcha_token: recaptchaToken,
        tyc: formData.acceptTerms,
        firma: formData.firma
      });

      toast({
        title: "Código enviado",
        description: "Hemos enviado un código de verificación a tu correo electrónico.",
      });

      setCurrentStep('email-verification');
    } catch (error: any) {

      let errorMessage = "No pudimos enviar el código de verificación. Intenta de nuevo.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.email) {
        errorMessage = Array.isArray(error.response.data.email)
          ? error.response.data.email[0]
          : error.response.data.email;
      } else if (error.response?.data?.contrasena) {
        errorMessage = Array.isArray(error.response.data.contrasena)
          ? error.response.data.contrasena[0]
          : error.response.data.contrasena;
      } else if (error.response?.data?.recaptcha_token) {
        errorMessage = Array.isArray(error.response.data.recaptcha_token)
          ? error.response.data.recaptcha_token[0]
          : error.response.data.recaptcha_token;
      } else if (error.response?.data?.tyc) {
        errorMessage = Array.isArray(error.response.data.tyc)
          ? error.response.data.tyc[0]
          : error.response.data.tyc;
      }

      toast({
        title: "Error en el registro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsCaptchaVerified(false);
      setRecaptchaToken('');
      setIsVerifyingEmail(false);
    }
  };

  const handleResendVerificationCode = async () => {
    try {
      const response = await authAPI.resendCode({
        email: formData.email
      });


      toast({
        title: "Código reenviado",
        description: "Hemos enviado un nuevo código de verificación a tu correo.",
      });
    } catch (error: any) {

      let errorMessage = "No pudimos reenviar el código. Intenta de nuevo.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleVerifyEmailCode = async (code: string) => {
    setIsSubmitting(true);

    try {
      const response = await authAPI.verifyEmail({
        email: formData.email,
        code: code
      });


      toast({
        title: "¡Registro completado!",
        description: "Tu cuenta ha sido creada exitosamente. Ahora puedes ingresar a Cupido.",
      });

      setCurrentStep('completed');
      onClose();

    } catch (error: any) {

      let errorMessage = "El código de verificación es incorrecto. Intenta de nuevo.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast({
        title: "Código inválido",
        description: errorMessage,
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
    if (!formData.firma.trim()) emptyFields.push('firma');

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

    if (isSubmitting || isVerifyingEmail) return;

    if (!validateBasicFields()) return;
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error de Contraseña",
        description: "Las contraseñas no coinciden. Por favor, verifica.",
        variant: "destructive"
      });
      setIsCaptchaVerified(false);
      setRecaptchaToken('');
      return;
    }

    if (!isCaptchaVerified) {
      setCurrentStep('captcha');
      return;
    }

    if (!formData.email || !formData.password || !formData.acceptTerms) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }

    if (!recaptchaToken || recaptchaToken.trim() === '') {
      toast({
        title: "Verificación requerida",
        description: "Debes completar la verificación de seguridad antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await handleSendVerificationCode();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonText = () => {
    if (isSubmitting || isVerifyingEmail) return 'Procesando...';
    if (!isCaptchaVerified) return 'Continuar';
    return 'Enviar código de verificación';
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        {/* Contenedor principal - Reducido de 800px a 700px */}
        <div className="w-[460px] h-[700px] bg-[#F2D6CD] rounded-[40px] shadow-[2px_6px_4px_0px_rgba(0,0,0,0.35)] relative overflow-hidden">

          {/* Botón para cerrar */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-700 hover:text-gray-900 p-1.5 rounded-full hover:bg-rose-300 transition-colors z-10"
            aria-label="Cerrar registro"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Contenido del formulario con distribución más compacta */}
          <div className="h-full flex flex-col p-5">
            {/* Logo con menos margen inferior */}
            <div className="flex justify-center mb-1">
              <img
                src="https://i.postimg.cc/htWQx7q5/logo-Fix.webp"
                alt="CUPIDO Logo"
                className="w-[80px] h-[73px]"
              />
            </div>

            {/* Header con menos margen */}
            <div className="mb-1 text-center">
              <div className="text-black text-xl font-normal font-['Poppins']">
                Bienvenido a{' '}
                <span className="text-[#E93923] font-semibold">CUPIDO</span>
              </div>

              <div className="text-black text-3xl font-medium font-['Poppins']">
                Registrarse
              </div>
            </div>

            {/* Formulario con distribución más compacta */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center">
              <div className="space-y-1.5">
                <EmailField
                  value={formData.email}
                  onChange={(value) => handleFieldChange('email', value)}
                />

                <PasswordField
                  value={formData.password}
                  onChange={(value) => handleFieldChange('password', value)}
                />

                <ConfirmPasswordField
                  value={formData.confirmPassword}
                  onChange={(value) => handleFieldChange('confirmPassword', value)}
                  originalPassword={formData.password}
                />

                <div className="pt-0.5">
                  <TermsCheckbox
                    checked={formData.acceptTerms}
                    onChange={(value) => handleFieldChange('acceptTerms', value)}
                    onOpenTerms={handleOpenTerms}
                  />
                </div>
              </div>

              {/* Indicador de estado del flujo - menos margen */}
              <div className="my-2">
                {!isCaptchaVerified && (
                  <div className="flex items-center justify-center text-amber-600 text-xs">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Debes completar la verificación de seguridad
                  </div>
                )}

                {isCaptchaVerified && (
                  <div className="flex items-center justify-center text-green-600 text-xs">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verificación completada - Listo para enviar código
                  </div>
                )}
              </div>

              {/* Botón de continuar - ajustado */}
              <div className="pt-0.5">
                <button
                  type="submit"
                  disabled={isSubmitting || isVerifyingEmail}
                  className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 text-sm shadow-md hover:shadow-lg"
                >
                  {getButtonText()}
                </button>
              </div>

              {/* Footer con menos margen */}
              <div className="text-center mt-3 pt-3 border-t border-rose-300">
                <p className="text-xs text-gray-600">
                  ¿Tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={openLogin}
                    className="text-[#E93923] hover:text-[#d1321f] font-semibold underline text-xs"
                  >
                    Iniciar Sesión
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de Términos y Condiciones */}
      <TermsAndConditions
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleAcceptTerms}
        onReject={handleRejectTerms}
      />

      {/* Modal de reCAPTCHA */}
      <ReCaptchaModal
        isOpen={currentStep === 'captcha'}
        onClose={() => setCurrentStep('initial')}
        onVerify={handleCaptchaVerify}
        onExpired={handleCaptchaExpired}
        onError={handleCaptchaError}
      />

      {/* Modal de verificación de email */}
      <EmailVerificationModal
        isOpen={currentStep === 'email-verification'}
        onClose={() => setCurrentStep('initial')}
        onVerify={handleVerifyEmailCode}
        onResendCode={handleResendVerificationCode}
        userEmail={formData.email}
        isSubmitting={isSubmitting}
      />

    </>
  );
};

export default SigUpForm;