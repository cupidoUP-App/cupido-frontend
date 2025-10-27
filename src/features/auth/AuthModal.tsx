import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SigUpForm from './SigUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'register';
}

type AuthView = 'login' | 'register';

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
    </>
  );
};

export default AuthModal;