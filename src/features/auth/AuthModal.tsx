/**
 * Componente modal de autenticación que permite alternar entre las vistas
 * de inicio de sesión, registro y cambio de contraseña.
 *
 * @component
 */

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SigUpForm from './SigUpForm';
import ChangePasswordModal from './components/modals/ChangePasswordModal';

/** Props del modal de autenticación. */
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'register' | 'change-password';
}

type AuthView = 'login' | 'register' | 'change-password';

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultView = 'login' 
}) => {
  /** Estado: vista actual mostrada (login, register o change-password). */
  const [currentView, setCurrentView] = useState<AuthView>(defaultView);

  if (!isOpen) return null;

  /** Cambia a la vista de registro. */
  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  /** Cambia a la vista de inicio de sesión. */
  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  /** Cambia a la vista de cambio de contraseña. */
  const handleSwitchToChangePassword = () => {
    setCurrentView('change-password');
  };

  return (
    <>
      {currentView === 'login' && (
        <LoginForm
          onClose={onClose}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}

      {currentView === 'register' && (
        <SigUpForm
          onClose={onClose}
          onSwitchToLogin={handleSwitchToLogin} // ✅ AGREGAR esta prop
        />
      )}

      {currentView === 'change-password' && (
        <ChangePasswordModal
          isOpen={true}
          onClose={onClose}
          onSuccess={() => {
            // Optional: could switch back to login or show success message
          }}
        />
      )}
    </>
  );
};

export default AuthModal;