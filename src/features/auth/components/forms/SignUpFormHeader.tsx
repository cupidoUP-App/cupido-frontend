import React from 'react';

export const SignUpFormHeader: React.FC = () => {
  return (
    <>
      {/* Logo centrado en la parte superior */}
      <div className="flex justify-center mb-4">
        <img 
          src="src/assets/logo-login.webp" 
          alt="CUPIDO Logo" 
          className="w-[87px] h-[80px]"
        />
      </div>

      {/* Header con estilos específicos - EN UNA SOLA LÍNEA */}
      <div className="mb-6 text-center">
        {/* Línea única: "Bienvenido a CUPIDO" */}
        <div className="text-black text-2xl font-normal font-['Poppins']">
          Bienvenido a{' '}
          <span className="text-[#E93923] font-semibold">CUPIDO</span>
        </div>
        
        {/* Línea 2: "Registrarse" más grande */}
        <div className="text-black text-4xl font-medium font-['Poppins'] mt-2">
          Registrarse
        </div>
      </div>
    </>
  );
};

