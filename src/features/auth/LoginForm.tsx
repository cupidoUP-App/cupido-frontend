import React, { useState, useEffect } from "react";
import { useToast } from "@hooks/use-toast";
import { useAppStore } from "@store/appStore";
import { useNavigate } from "react-router-dom";

// Constantes para persistencia del flujo de registro (Feature: imageUpload)
const REGISTRATION_STEP_KEY = "cupido_registration_step";
const REGISTRATION_USER_ID_KEY = "current_user_id";

import EmailField from "./components/forms/EmailField";
import PasswordField from "./components/forms/PasswordField"; // ✅ Importar PasswordField
import ReCaptchaModal from "./components/modals/ReCaptchaModal";
import ForgotPasswordModal from "./components/modals/ForgotPasswordModal";
import CompleteRegister, {
  RegistrationData,
} from "./components/modals/CompleteRegister";
import { authAPI } from "@lib/api";
import PreferencesPage from "@preferences/components/PreferencesPage";
import PhotoUploadPage from "@photos/PhotoUploadPage";

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

const LoginForm: React.FC<LoginFormProps> = ({
  onClose,
  onSwitchToRegister,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompleteRegister, setShowCompleteRegister] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string>("");

  const [showPreferences, setShowPreferences] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const { toast } = useToast();
  const { openDashboard, login, setLoading } = useAppStore();

  const [registrationStep, setRegistrationStep] = useState<number>(0);
  const navigate = useNavigate();

  // =========================================================================
  // Feature: imageUpload - Persistencia del flujo de registro
  // Efecto para restaurar el paso de registro si el usuario recarga la página
  // Lógica: Si hay un token válido y un paso guardado, retomar donde estaba
  // =========================================================================
  useEffect(() => {
    const restoreRegistrationState = async () => {
      const savedStep = localStorage.getItem(REGISTRATION_STEP_KEY);
      const savedUserId = localStorage.getItem(REGISTRATION_USER_ID_KEY);
      const accessToken = localStorage.getItem("access_token");

      // Solo restaurar si hay token y paso guardado
      if (!accessToken || !savedStep) return;

      const step = parseInt(savedStep, 10);

      // Validar que el paso sea válido (1-3)
      if (isNaN(step) || step < 1 || step > 3) return;

      console.log(`[LoginForm] Restaurando paso de registro: ${step}`);

      try {
        // Verificar que el token sigue siendo válido obteniendo el perfil
        const userProfile = await authAPI.getUserProfile();

        if (userProfile?.user) {
          setCurrentUserId(savedUserId || userProfile.user.usuario_id?.toString() || "");
          setRegistrationStep(step);

          // Restaurar el modal correspondiente según el paso
          if (step === 1) {
            setShowCompleteRegister(true);
          } else if (step === 2) {
            setShowPreferences(true);
          } else if (step === 3) {
            setShowPhotoUpload(true);
          }

          toast({
            title: "Continuando registro",
            description: "Retomando donde lo dejaste...",
          });
        }
      } catch (error) {
        // Token inválido o expirado, limpiar estado guardado
        console.log("[LoginForm] Token inválido, limpiando estado de registro");
        localStorage.removeItem(REGISTRATION_STEP_KEY);
      }
    };

    restoreRegistrationState();
  }, []); // Solo ejecutar al montar el componente

  // =========================================================================
  // Feature: imageUpload - Persistir el paso actual cuando cambia
  // =========================================================================
  useEffect(() => {
    if (registrationStep > 0) {
      localStorage.setItem(REGISTRATION_STEP_KEY, registrationStep.toString());
    }
  }, [registrationStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validaciones básicas
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    if (isCaptchaVerified) {
      setIsCaptchaVerified(false);
      setRecaptchaToken('');
    }

    if (!isCaptchaVerified) {
      setShowCaptcha(true);
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      // Validar que tenemos un token de reCAPTCHA válido
      if (!recaptchaToken || recaptchaToken.trim() === "") {
        throw new Error("Debes completar la verificación de seguridad");
      }

      console.log("Intentando login con:", { email, recaptchaToken });

      // Llamar al endpoint de login del backend
      const response = await authAPI.login({
        email: email,
        contrasena: password,
        recaptcha_token: recaptchaToken,
      });

      console.log("Login exitoso - Respuesta completa:", response);

      // Verificar el estado de cuenta del usuario
      const estadocuenta = response.estadocuenta;
      console.log("Estado de cuenta recibido:", estadocuenta);

      if (estadocuenta === "1") {
        setRegistrationStep(1);
        setShowCompleteRegister(true);
      } else if (estadocuenta === "2") {
        console.log("Mostrando Preferences - Estado 2");

        try {
          const userData = await authAPI.getUserProfile();
          console.log("Datos del usuario obtenidos:", userData);

          const realUserId =
            userData.id ||
            userData.usuario_id ||
            userData.user?.id ||
            userData.user?.usuario_id ||
            response.user?.id ||
            response.user?.usuario_id;

          console.log("ID encontrado:", realUserId, "en:", {
            userData_id: userData.id,
            userData_usuario_id: userData.usuario_id,
            userData_user_id: userData.user?.id,
            userData_user_usuario_id: userData.user?.usuario_id,
            response_user_id: response.user?.id,
            response_user_usuario_id: response.user?.usuario_id,
          });

          if (realUserId) {
            setCurrentUserId(realUserId);
            localStorage.setItem("current_user_id", realUserId.toString());
            setRegistrationStep(2);
            setShowPreferences(true);

            toast({
              title: "¡Bienvenido de nuevo!",
              description: "Completa tus preferencias para continuar.",
            });
          } else {
            console.error(
              "No se pudo encontrar el ID del usuario. Datos completos:",
              {
                userData,
                response,
              }
            );
            throw new Error("No se pudo obtener el ID del usuario");
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar la información de tu cuenta.",
            variant: "destructive",
          });
        }
      } else if (estadocuenta === "0") {
        console.log("Redirigiendo a match - Estado 0");
        login(response.user);
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        });
        onClose();
        navigate("/match");
      } else if (estadocuenta === "3") {
        toast({
          title: "Elige tus mejores fotos!",
          description: "Tu cuenta no aun no esta completa para iniciar sesión.",
          variant: "destructive",
        });
        setShowPhotoUpload(true);
      } else {
        console.log("Estado de cuenta desconocido:", estadocuenta);
        toast({
          title: "Cuenta no disponible",
          description: "Tu cuenta no está disponible para iniciar sesión.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error completo en login:", error);
      console.error("Error response data:", error.response?.data);

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
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error al iniciar sesión",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCaptchaVerified(false);
      setRecaptchaToken('');
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleCaptchaVerify = (token: string) => {
    console.log("CAPTCHA verificado:", token);
    setIsCaptchaVerified(true);
    setRecaptchaToken(token);
    setShowCaptcha(false);

    // Una vez verificado el CAPTCHA, proceder con el login
    handleSubmit(new Event("submit") as any);
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
    toast({
      title: "All ready",
      description: "Ahora puedes revisar tu correo electrónico.",
    });
  };

  const handleCompleteRegisterSubmit = async (userData: RegistrationData) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      const birthDate = `${userData.birthDate.year
        }-${userData.birthDate.month.padStart(
          2,
          "0"
        )}-${userData.birthDate.day.padStart(2, "0")}`;

      const genderMapping: { [key: string]: number } = {
        male: 1,
        female: 2,
        other: 3,
      };

      const genderId = genderMapping[userData.gender] || 1;

      const response = await authAPI.updateUserProfile({
        nombres: userData.name,
        apellidos: userData.lastName,
        genero_id: genderId,
        fechanacimiento: birthDate,
        descripcion: userData.description,
        estadocuenta: "2",
      });

      console.log("Perfil actualizado:", response);

      toast({
        title: "¡Perfil completado!",
        description: "Tu perfil ha sido completado exitosamente.",
      });

      const userId = response.user_id || response.id || "current-user";
      setCurrentUserId(userId);

      setShowCompleteRegister(false);
      setRegistrationStep(2);
      setShowPreferences(true);
    } catch (error: any) {
      console.error("Error al completar perfil:", error);

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
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handlePreferencesComplete = async () => {
    try {
      console.log(
        "Preferencias completadas, continuando a la subida de fotos..."
      );

      const userProfile = await authAPI.getUserProfile();
      await authAPI.updateUserProfile({
        nombres: userProfile.user.nombres,
        apellidos: userProfile.user.apellidos,
        genero_id: userProfile.user.genero_id,
        fechanacimiento: userProfile.user.fechanacimiento,
        descripcion: userProfile.user.descripcion,
        estadocuenta: "3",
      });

      setShowPreferences(false);
      setRegistrationStep(3);
      setShowPhotoUpload(true);

      toast({
        title: "¡Preferencias guardadas!",
        description: "Ahora, sube tus mejores fotos.",
      });
    } catch (error) {
      console.error("Error al completar preferencias:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar las preferencias.",
        variant: "destructive",
      });
    }
  };

  const handleBackFromPreferences = async () => {
    try {
      if (registrationStep === 2) {
        // Mostrar carga mientras procesamos
        setIsSubmitting(true);

        // 1. Actualizar el estado en el backend a "1"
        // Primero obtenemos los datos actuales para preservarlos
        const userProfile = await authAPI.getUserProfile();

        await authAPI.updateUserProfile({
          nombres: userProfile.user.nombres,
          apellidos: userProfile.user.apellidos,
          genero_id: userProfile.user.genero_id,
          fechanacimiento: userProfile.user.fechanacimiento,
          descripcion: userProfile.user.descripcion,
          estadocuenta: "1", // 🔥 REVERTIR ESTADO A 1
        });

        // 2. Actualizar UI para mostrar el paso anterior
        setShowPreferences(false);
        setRegistrationStep(1);
        setShowCompleteRegister(true);
      } else {
        setShowPreferences(false);
        onClose();
      }
    } catch (error) {
      console.error("Error al regresar:", error);
      toast({
        title: "Error",
        description: "No se pudo regresar al paso anterior.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="w-[439px] h-[680px] bg-[#F2D6CD] rounded-[40px] shadow-[2px_6px_4px_0px_rgba(0,0,0,0.35)] relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 p-1 rounded-full hover:bg-rose-300 transition-colors z-10"
            aria-label="Cerrar login"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="h-full flex flex-col p-5">
            <div className="flex justify-center mb-4">
              <img
                src="https://i.postimg.cc/htWQx7q5/logo-Fix.webp"
                alt="CUPIDO Logo"
                className="w-[87px] h-[80px]"
              />
            </div>

            <div className="mb-6 text-center">
              <div className="text-black text-2xl font-normal font-['Poppins']">
                Bienvenido a{" "}
                <span className="text-[#E93923] font-semibold">CUPIDO</span>
              </div>

              <div className="text-black text-4xl font-medium font-['Poppins'] mt-2">
                Iniciar Sesión
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <EmailField value={email} onChange={setEmail} />

                {/* ✅ Usando el componente PasswordField importado */}
                <PasswordField value={password} onChange={setPassword} />

                {/* Indicador de estado del CAPTCHA */}
                <div className="mb-4">
                  {!isCaptchaVerified && (
                    <div className="flex items-center justify-center text-amber-600 text-xs">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Debes completar la verificación de seguridad
                    </div>
                  )}

                  {isCaptchaVerified && (
                    <div className="flex items-center justify-center text-green-600 text-xs">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verificación de seguridad completada
                    </div>
                  )}
                </div>
              </div>

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

              {/* Botón de iniciar sesión */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 text-sm shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
              </div>
            </form>

            {/* Footer con enlace a registro */}
            <div className="text-center mt-4 pt-3 border-t border-rose-300">
              <p className="text-xs text-gray-600">
                ¿No tienes una cuenta?{" "}
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
          setRecaptchaToken("");
        }}
        onError={() => {
          setIsCaptchaVerified(false);
          setRecaptchaToken("");
          toast({
            title: "Error de verificación",
            description: "Hubo un error con la verificación. Intenta de nuevo.",
            variant: "destructive",
          });
        }}
      />

      {/* Modal de recuperación de contraseña */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSuccess={handleForgotPasswordSuccess}
      />

      {/* Modal de completar registro */}
      <CompleteRegister
        isOpen={showCompleteRegister}
        onSubmit={handleCompleteRegisterSubmit}
        onClose={() => {
          setShowCompleteRegister(false);
        }}
        onComplete={() => {
          setShowCompleteRegister(false);
          setRegistrationStep(2); // ✅ Actualizar el paso a 2
          setShowPreferences(true);
        }}
        isSubmitting={isSubmitting}
      />

      {/* Modal de Subida de Fotos */}
      {showPhotoUpload && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full h-full bg-white">
            <PhotoUploadPage
              onBack={() => {
                // Volver a preferencias
                setShowPhotoUpload(false);
                setRegistrationStep(2);
                setShowPreferences(true);
              }}
              onComplete={async () => {
                try {
                  const userProfile = await authAPI.getUserProfile();
                  await authAPI.updateUserProfile({
                    nombres: userProfile.user.nombres,
                    apellidos: userProfile.user.apellidos,
                    genero_id: userProfile.user.genero_id,
                    fechanacimiento: userProfile.user.fechanacimiento,
                    descripcion: userProfile.user.descripcion,
                    estadocuenta: "0",
                  });

                  // Feature: imageUpload - Limpiar estado de registro al completar
                  localStorage.removeItem(REGISTRATION_STEP_KEY);

                  setShowPhotoUpload(false);
                  onClose();
                  navigate("/match");

                  toast({
                    title: "¡Felicidades!",
                    description:
                      "Has completado tu perfil. ¡Bienvenido a Cupido!",
                  });
                } catch (error) {
                  console.error("Error al finalizar el registro:", error);
                  toast({
                    title: "Error",
                    description:
                      "No pudimos finalizar tu registro. Intenta de nuevo.",
                    variant: "destructive",
                  });
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Modal de Preferences */}
      {showPreferences && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full h-full bg-white">
            <PreferencesPage
              userId={currentUserId}
              onComplete={handlePreferencesComplete}
              onBack={handleBackFromPreferences}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
