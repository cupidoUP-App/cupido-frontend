import React from 'react';

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const EmailField: React.FC<EmailFieldProps> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        Correo Electrónico
      </label>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="tu.correo@unipamplona.edu.co"
        className="w-full px-2.5 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent text-xs"
      />
      <p className="text-xs text-gray-500 mt-0.5">
        Ingresa tu correo institucional
      </p>
    </div>
  );
};

export default EmailField;