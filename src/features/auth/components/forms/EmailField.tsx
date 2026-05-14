/**
 * Componente de campo de entrada para correo electrónico institucional.
 * Valida el formato y muestra los requisitos del correo electrónico
 * en tiempo real mediante el subcomponente EmailRequirements.
 *
 * @component
 */

import React from 'react';
import EmailRequirements from './EmailRequirements';

/** Props del campo de correo electrónico. */
interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const EmailField: React.FC<EmailFieldProps> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <label className="block text-base font-semibold text-gray-700 mb-2.5 font-['Poppins']">
        Correo Electrónico
      </label>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="tu.correo@unipamplona.edu.co"
        maxLength={50}
        className="w-full px-2.5 py-1.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E93923] focus:border-transparent text-base font-['Poppins']"
      />
      <EmailRequirements email={value} />
    </div>
  );
};

export default EmailField;