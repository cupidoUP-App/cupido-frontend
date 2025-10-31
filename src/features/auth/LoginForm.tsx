import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/appStore';
import EmailField from './components/forms/EmailField';
import ReCaptchaModal from './components/modals/ReCaptchaModal';
import ForgotPasswordModal from './components/modals/ForgotPasswordModal';
import CompleteRegister, { RegistrationData } from './components/modals/CompleteRegister';
import { authAPI } from '@/lib/api';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Validaciones básicas
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos",
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
      // Validar que tenemos un token de reCAPTCHA válido
      if (!recaptchaToken || recaptchaToken.trim() === '') {
        throw new Error('Debes completar la verificación de seguridad');
      }

      // Llamar al endpoint de login del backend
      const response = await authAPI.login({
        email: email,
        contrasena: password,
        recaptcha_token: recaptchaToken,
      });

      console.log('Login exitoso:', response);

      // Verificar el estado de cuenta del usuario
      const estadocuenta = response.estadocuenta;
      if(estadocuenta === '1'){
        setShowCompleteRegister(true);
      }
      else if (estadocuenta === '0') {
        login(response.user);
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        });
        onClose();
        openDashboard();
      } else if (estadocuenta === '2') {
        onClose();
        openDashboard();
      } else {
        console.log("cuenta con estos diferentes a 0,1,2");
        toast({
          title: "Cuenta no disponible",
          description: "Tu cuenta no está disponible para iniciar sesión.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error en login:', error);

      let errorMessage = "Verifica tus credenciales e intenta de nuevo.";

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
      }

      toast({
        title: "Error al iniciar sesión",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptchaVerify = (token: string) => {
    console.log('CAPTCHA verificado:', token);
    setIsCaptchaVerified(true);
    setRecaptchaToken(token); // Guardar el token real
    setShowCaptcha(false);

    // Una vez verificado el CAPTCHA, proceder con el login
    handleSubmit(new Event('submit') as any);
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
    toast({
      title: "Contraseña actualizada",
      description: "Ahora puedes iniciar sesión con tu nueva contraseña.",
    });
  };

  const handleCompleteRegisterSubmit = async (userData: RegistrationData) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      // Formatear fecha de nacimiento
      const birthDate = `${userData.birthDate.year}-${userData.birthDate.month.padStart(2, '0')}-${userData.birthDate.day.padStart(2, '0')}`;

      // Mapear género a ID (asumiendo que el backend espera IDs numéricos)
      const genderMapping: { [key: string]: number } = {
        'male': 1,    // Asumiendo que 1 es masculino
        'female': 2,  // Asumiendo que 2 es femenino
        'other': 3    // Asumiendo que 3 es otro
      };

      const genderId = genderMapping[userData.gender] || 1;

      // Llamar al endpoint real del backend
      const response = await authAPI.updateProfile({
        nombres: userData.name,
        apellidos: userData.lastName,
        genero_id: genderId,
        fechanacimiento: birthDate,
        descripcion: userData.description
      });

      console.log('Perfil actualizado:', response);

      toast({
        title: "¡Perfil completado!",
        description: "Tu perfil ha sido completado exitosamente.",
      });

      setShowCompleteRegister(false);

      // Guardar tokens después de completar el perfil
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);

      // Actualizar estado global de autenticación
      login(response.user);

      // En lugar de cerrar, abrir el dashboard
      setTimeout(() => {
        onClose(); // Cerrar el modal de CompleteRegister
        openDashboard(); // Abrir el dashboard
      }, 1000);

    } catch (error: any) {
      console.error('Error al completar perfil:', error);

      let errorMessage = "No pudimos completar tu perfil. Intenta de nuevo.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.nombres) {
        errorMessage = Array.isArray(error.response.data.nombres)
          ? error.response.data.nombres[0]
          : error.response.data.nombres;
      } else if (error.response?.data?.apellidos) {
        errorMessage = Array.isArray(error.response.data.apellidos)
          ? error.response.data.apellidos[0]
          : error.response.data.apellidos;
      } else if (error.response?.data?.genero_id) {
        errorMessage = Array.isArray(error.response.data.genero_id)
          ? error.response.data.genero_id[0]
          : error.response.data.genero_id;
      } else if (error.response?.data?.fechanacimiento) {
        errorMessage = Array.isArray(error.response.data.fechanacimiento)
          ? error.response.data.fechanacimiento[0]
          : error.response.data.fechanacimiento;
      } else if (error.response?.data?.descripcion) {
        errorMessage = Array.isArray(error.response.data.descripcion)
          ? error.response.data.descripcion[0]
          : error.response.data.descripcion;
      }

      toast({
        title: "Error al completar perfil",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
          setRecaptchaToken(''); // Limpiar token expirado
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