import React from 'react';
import EmailRequirements from './EmailRequirements';

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
        maxLength={50}
        className="w-full px-2.5 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent text-xs"
      />
      <EmailRequirements email={value} />
    </div>
  );
};

export default EmailField;