import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SigUpForm from './SigUpForm';
import ChangePasswordModal from './components/modals/ChangePasswordModal';

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
  const [currentView, setCurrentView] = useState<AuthView>(defaultView);

  if (!isOpen) return null;

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

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