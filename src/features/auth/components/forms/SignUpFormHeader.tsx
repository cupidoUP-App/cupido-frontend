/** Encabezado del formulario de registro con logo y título "Bienvenido a CUPIDO / Registrarse". */

import React from 'react';

export const SignUpFormHeader: React.FC = () => {
  return (
    <>
      <div className="flex justify-center mb-4">
        <img src="https://i.postimg.cc/htWQx7q5/logo-Fix.webp" alt="CUPIDO Logo" className="w-[87px] h-[80px]" />
      </div>
      <div className="mb-6 text-center">
        <div className="text-black text-2xl font-normal font-['Poppins']">
          Bienvenido a{' '}
          <span className="text-[#E93923] font-semibold">CUPIDO</span>
        </div>
        <div className="text-black text-4xl font-medium font-['Poppins'] mt-2">Registrarse</div>
      </div>
    </>
  );
};

