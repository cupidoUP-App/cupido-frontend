import React from 'react';

interface SignUpFormFooterProps {
  onSwitchToLogin: () => void;
}

export const SignUpFormFooter: React.FC<SignUpFormFooterProps> = ({ onSwitchToLogin }) => {
  return (
    <div className="text-center mt-4 pt-3 border-t border-rose-300">
      <p className="text-xs text-gray-600">
        ¿Tienes una cuenta?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[#E93923] hover:text-[#d1321f] font-semibold underline text-xs"
        >
          Iniciar Sesión
        </button>
      </p>
    </div>
  );
};

