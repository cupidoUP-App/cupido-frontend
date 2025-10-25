import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import LoginForm from './LoginForm';
import SignupForm from './SigupForm';
import PasswordRecovery from './PasswordRecovery';
import Recaptcha from './Recaptcha';
import { motion, AnimatePresence } from 'framer-motion';


// --- Main Component ---

export default function AuthModals() {
  const { authModal, closeModals, pendingFormData, setPendingFormData, pendingLoginData, setPendingLoginData, openLogin } = useAppStore();
  const [formKey, setFormKey] = useState(0);
  const [currentView, setCurrentView] = useState(authModal);
  const [isFirstOpen, setIsFirstOpen] = useState(true);

  useEffect(() => {
    if (authModal !== 'closed') {
      // Si es la primera vez que se abre o es login/signup inicial, no aplicar animación
      if (isFirstOpen || (authModal === 'login' && currentView === 'closed') || (authModal === 'signup' && currentView === 'closed')) {
        setCurrentView(authModal);
        setIsFirstOpen(false);
        return;
      }
      
      // Espera a que termine la animación de salida antes de cambiar de vista
      const timeout = setTimeout(() => {
        setCurrentView(authModal);
        setFormKey((prev) => prev + 1);
      }, 300); // debe coincidir con transition.duration
      return () => clearTimeout(timeout);
    }
  }, [authModal, isFirstOpen, currentView]);

  if (authModal === 'closed') return null;

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm key={`login-${formKey}`} />;
      case 'signup':
        return <SignupForm key={`signup-${formKey}`} />;
      case 'recovery':
        return <PasswordRecovery key={`recovery-${formKey}`} />;
      case 'recaptcha':
        return (
          <Recaptcha 
            key={`recaptcha-${formKey}`}
            onClose={() => {
              setPendingFormData(null);
              setPendingLoginData(null);
              closeModals();
            }}
            onVerify={async (token) => {
              if (token) {
                console.log('reCAPTCHA token:', token);
                
                // Verificar si es login o signup
                if (pendingLoginData) {
                  console.log('Login data:', pendingLoginData);
                  // Aquí puedes hacer tu llamada a la API de login con el token
                  setPendingLoginData(null);
                  closeModals();
                } else if (pendingFormData) {
                  console.log('Signup data:', pendingFormData);
                  
                  try {
                    const response = await fetch('http://localhost:8000/api/v1/auth/register/', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email: pendingFormData.email,
                        password: pendingFormData.password,
                        recaptcha: token,
                      }),
                    });

                    if (!response.ok) {
                      const errorData = await response.json();
                      console.error('Error en registro:', errorData);
                      alert(errorData.message || 'Ocurrió un error al registrarse');
                      return;
                    }

                    const result = await response.json();
                    console.log('Registro exitoso:', result);
                    setPendingFormData(null);
                    closeModals();
                    openLogin();
                  } catch (error) {
                    console.error('Error de conexión:', error);
                    alert('No se pudo conectar con el servidor');
                  }
                }
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 
                 bg-black/40 backdrop-blur-sm transition-all duration-300"
      onClick={closeModals}
    >
      <div
        className="w-full max-w-md mx-auto relative bg-transparent rounded-3xl perspective"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative w-full h-[600px] flex items-center justify-center">
          <AnimatePresence mode="wait" onExitComplete={() => setFormKey((prev) => prev + 1)}>
            <motion.div
              key={currentView}
              initial={isFirstOpen ? { opacity: 0 } : { rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{
                duration: isFirstOpen ? 0.2 : 0.4,
                ease: [0.4, 0.2, 0.2, 1],
              }}
              className="absolute w-full h-full flex items-center justify-center [transform-style:preserve-3d]"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}