/** Indicador de requisitos de contraseña. Valida en tiempo real 8+ chars, mayúsculas, minúsculas, dígitos y símbolos. */

import React from 'react';

/** Props del indicador de requisitos. */
interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  /**
   * Evalúa la contraseña y retorna un mensaje con los requisitos faltantes o confirmación.
   * Revisa: longitud >= 8, mayúsculas, minúsculas, dígitos y símbolos especiales.
   */
  const getMessage = (): { text: string; className: string } => {
    if (password.length === 0) {
      return { text: '8+ chars: A-Z, a-z, 0-9, símbolo', className: 'text-gray-500' };
    }
    const missing: string[] = [];
    if (password.length < 8) missing.push('8+ chars');
    if (!/[A-Z]/.test(password)) missing.push('A-Z');
    if (!/[a-z]/.test(password)) missing.push('a-z');
    if (!/\d/.test(password)) missing.push('0-9');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) missing.push('símbolo');
    if (missing.length === 0) return { text: '✓ Segura', className: 'text-green-600 font-semibold' };
    return { text: `Falta: ${missing.join(', ')}`, className: 'text-amber-600 font-medium' };
  };

  const { text, className } = getMessage();
  return <p className={`${className} text-sm mt-2 transition-colors duration-150 font-['Poppins']`}>{text}</p>;
};

export default PasswordRequirements;