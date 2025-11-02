import React from 'react';

interface SignUpFlowIndicatorProps {
  isCaptchaVerified: boolean;
}

export const SignUpFlowIndicator: React.FC<SignUpFlowIndicatorProps> = ({ 
  isCaptchaVerified 
}) => {
  return (
    <div className="mb-4">
      {!isCaptchaVerified && (
        <div className="flex items-center justify-center text-amber-600 text-xs">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Primero debes completar la verificación de seguridad
        </div>
      )}
      
      {isCaptchaVerified && (
        <div className="flex items-center justify-center text-green-600 text-xs">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Verificación de seguridad completada - Listo para enviar código
        </div>
      )}
    </div>
  );
};

