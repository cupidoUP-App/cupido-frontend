import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/appStore';
import { authAPI } from '@/lib/api';

import EmailField from './components/forms/EmailField';
import ReCaptchaModal from './components/modals/ReCaptchaModal';
import ForgotPasswordModal from './components/modals/ForgotPasswordModal';
import CompleteRegister, { RegistrationData } from './components/modals/CompleteRegister';

interface User {
  usuario_id: number;
  email: string;
  nombres?: string;
  apellidos?: string;
  estadocuenta: string;
}

interface LoginFormProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompleteRegister, setShowCompleteRegister] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');

  const { toast } = useToast();
  const { openDashboard, login, setLoading } = useAppStore();

  /** --- Efecto: verificar si el usuario ya está autenticado --- */
  useEffect(() => {
    const initCheck = async () => {
      try {
        const userData = await checkExistingUserStatus();
        if (userData) handleUserState(userData);
      } catch (error) {
        console.log('Error al verificar estado del usuario al cargar:', error);
      }
    };
    initCheck();
  }, []);

  /** --- Manejo del envío del formulario --- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos.",
        variant: "destructive"
      });
      return;
    }

    if (!isCaptchaVerified) {
      setShowCaptcha(true);
      return;
    }

    setIsSubmitting(true);
    try {
      if (!recaptchaToken.trim()) throw new Error('Debes completar la verificación de seguridad.');

      console.log('=== ENVIANDO LOGIN AL BACKEND ===');
      console.log('Email:', email);
      console.log('Token CAPTCHA a enviar:', recaptchaToken);
      console.log('==================================');

      const response = await authAPI.login({
        email,
        contrasena: password,
        recaptcha_token: recaptchaToken,
      });

      console.log('Login exitoso:', response);

      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      login(response.user);

      await verifyUserStatusAndRedirect();
    } catch (error: any) {
      console.error('Error en login:', error);
      handleLoginError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /** --- Verifica si ya hay sesión activa --- */
  const checkExistingUserStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;

      const userData = await authAPI.getUserProfile();
      console.log('Estado del usuario existente:', userData);
      return userData;
    } catch (error) {
      console.log('Token inválido o expirado:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return null;
    }
  };

  /** --- Verifica el estado del usuario después del login --- */
  const verifyUserStatusAndRedirect = async () => {
    try {
      const userData = await authAPI.getUserProfile();
      handleUserState(userData);
    } catch (error) {
      console.error('Error al verificar estado del usuario:', error);
      toast({
        title: "Error de verificación",
        description: "No pudimos verificar el estado de tu cuenta.",
        variant: "destructive"
      });
    }
  };

  /** --- Control del estado del usuario --- */
  const handleUserState = (userData: any) => {
    const { estado, should_complete_profile } = userData;

    if ((estado === '1') || should_complete_profile) {
      toast({
        title: "Perfil incompleto",
        description: "Necesitas completar tu perfil para continuar.",
      });
      setShowCompleteRegister(true);
      return;
    }

    if (estado === 3 && !should_complete_profile) {
      // lógica para otro componente
      return;
    }

    if ((estado === 2 || estado === 0) && !should_complete_profile) {
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      });
      onClose();
      openDashboard();
      return;
    }

    /* toast({
      title: "Cuenta no disponible",
      description: "Tu cuenta no está disponible para iniciar sesión.",
      variant: "destructive",
    }); */
  };

  /** --- CAPTCHA verificado correctamente --- */
  const handleCaptchaVerify = (token: string) => {
    console.log('=== LOGIN CAPTCHA VERIFICADO ===');
    console.log('Token de CAPTCHA:', token);
    console.log('Longitud del token:', token.length);
    console.log('Timestamp:', new Date().toISOString());
    console.log('================================');

    setIsCaptchaVerified(true);
    setRecaptchaToken(token);
    setShowCaptcha(false);

    handleSubmit(new Event('submit') as any);
  };

  /** --- Manejo de error de login --- */
  const handleLoginError = (error: any) => {
    let msg = "Verifica tus credenciales e intenta de nuevo.";

    if (error.response?.data) {
      const data = error.response.data;
      msg =
        data.error ||
        data.email?.[0] ||
        data.contrasena?.[0] ||
        data.recaptcha_token?.[0] ||
        msg;
    }

    toast({
      title: "Error al iniciar sesión",
      description: msg,
      variant: "destructive",
    });
  };

  /** --- Éxito al recuperar contraseña --- */
  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
    toast({
      title: "Contraseña actualizada",
      description: "Ahora puedes iniciar sesión con tu nueva contraseña.",
    });
  };

  /** --- Completar registro (perfil incompleto) --- */
  const handleCompleteRegisterSubmit = async (userData: RegistrationData) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      const birthDate = `${userData.birthDate.year}-${userData.birthDate.month.padStart(2, '0')}-${userData.birthDate.day.padStart(2, '0')}`;
      const genderMapping: Record<string, number> = { male: 1, female: 2, other: 3 };
      const genderId = genderMapping[userData.gender] || 1;

      const response = await authAPI.updateProfile({
        nombres: userData.name,
        apellidos: userData.lastName,
        genero_id: genderId,
        fechanacimiento: birthDate,
        descripcion: userData.description,
      });

      console.log('Perfil actualizado:', response);
      await verifyUserStatusAfterCompleteRegister();
    } catch (error: any) {
      console.error('Error al completar perfil:', error);
      handleProfileError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /** --- Verifica estado del usuario después de completar registro --- */
  const verifyUserStatusAfterCompleteRegister = async () => {
    try {
      const userData = await authAPI.getUserProfile();
      console.log('Datos del usuario después de completar registro:', userData);

      const { estado, should_complete_profile } = userData;

      if ((estado === 2 || estado === 3) && !should_complete_profile) {
        toast({
          title: "¡Perfil completado!",
          description: "Tu perfil ha sido completado exitosamente.",
        });

        setShowCompleteRegister(false);
        setTimeout(() => {
          onClose();
          openDashboard();
        }, 1000);
      } else {
        toast({
          title: "Perfil parcialmente completado",
          description: "Aún faltan datos en tu perfil.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error al verificar estado del usuario después del registro:', error);
      toast({
        title: "Error de verificación",
        description: "No pudimos verificar el estado de tu perfil.",
        variant: "destructive",
      });
    }
  };

  /** --- Manejo de errores al completar perfil --- */
  const handleProfileError = (error: any) => {
    let msg = "No pudimos completar tu perfil. Intenta de nuevo.";
    if (error.response?.data) {
      const data = error.response.data;
      msg =
        data.error ||
        data.nombres?.[0] ||
        data.apellidos?.[0] ||
        data.genero_id?.[0] ||
        data.fechanacimiento?.[0] ||
        data.descripcion?.[0] ||
        msg;
    }
    toast({
      title: "Error al completar perfil",
      description: msg,
      variant: "destructive",
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="w-[439px] h-[680px] bg-[#F2D6CD] rounded-[40px] shadow-[2px_6px_4px_0px_rgba(0,0,0,0.35)] relative overflow-hidden">
          
          {/* Botón para cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 p-1 rounded-full hover:bg-rose-300 transition-colors z-10"
            aria-label="Cerrar login"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>  
          
          {/* Contenido del formulario */}
          <div className="h-full flex flex-col p-5">
            {/* Logo centrado en la parte superior */}
            <div className="flex justify-center mb-4">
              <img 
                src="src/assets/logo-login.webp" 
                alt="CUPIDO Logo" 
                className="w-[87px] h-[80px]"
              />
            </div>

            {/* Header */}
            <div className="mb-6 text-center">
              <div className="text-black text-2xl font-normal font-['Poppins']">
                Bienvenido a{' '}
                <span className="text-[#E93923] font-semibold">CUPIDO</span>
              </div>
              
              <div className="text-black text-4xl font-medium font-['Poppins'] mt-2">
                Iniciar Sesión
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <EmailField
                  value={email}
                  onChange={setEmail}
                />

                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    maxLength={50}
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent text-xs"
                  />
                  
                  {/* Enlace para recuperar contraseña */}
                  <div className="text-right mt-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[#E93923] hover:text-[#d1321f] text-xs underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>

                {/* Indicador de estado del CAPTCHA */}
                <div className="mb-4">
                  {!isCaptchaVerified && (
                    <div className="flex items-center justify-center text-amber-600 text-xs">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Debes completar la verificación de seguridad
                    </div>
                  )}
                  
                  {isCaptchaVerified && (
                    <div className="flex items-center justify-center text-green-600 text-xs">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verificación de seguridad completada
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de iniciar sesión */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 text-sm shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </div>
            </form>

            {/* Footer con enlace a registro */}
            <div className="text-center mt-4 pt-3 border-t border-rose-300">
              <p className="text-xs text-gray-600">
                ¿No tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-[#E93923] hover:text-[#d1321f] font-semibold underline text-xs"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de reCAPTCHA */}
      <ReCaptchaModal
        isOpen={showCaptcha}
        onClose={() => setShowCaptcha(false)}
        onVerify={handleCaptchaVerify}
        onExpired={() => {
          setIsCaptchaVerified(false);
          setRecaptchaToken(''); // Limpiar tokezn expirado
        }}
        onError={() => {
          setIsCaptchaVerified(false);
          setRecaptchaToken(''); // Limpiar token en caso de error
          toast({
            title: "Error de verificación",
            description: "Hubo un error con la verificación. Intenta de nuevo.",
            variant: "destructive"
          });
        }}
      />

      {/* Modal de recuperación de contraseña */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSuccess={handleForgotPasswordSuccess}
      />

      {/* Modal de completar registro después del login */}
      <CompleteRegister
        isOpen={showCompleteRegister}
        onSubmit={handleCompleteRegisterSubmit}
        onClose={() => {
          setShowCompleteRegister(false);
          // Volver al formulario de login si se cierra sin completar
        }}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default LoginForm;