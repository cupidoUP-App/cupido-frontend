import React from 'react';

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const getMessage = () => {
    if (password.length === 0) {
      return {
        text: '8+ chars: A-Z, a-z, 0-9, símbolo',
        className: 'text-gray-500',
      };
    }

    const missing: string[] = [];

    if (password.length < 8) missing.push('8+ chars');
    if (!/[A-Z]/.test(password)) missing.push('A-Z');
    if (!/[a-z]/.test(password)) missing.push('a-z');
    if (!/\d/.test(password)) missing.push('0-9');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) missing.push('símbolo');

    if (missing.length === 0) {
      return {
        text: '✓ Segura',
        className: 'text-green-600 font-medium',
      };
    }

    return {
      text: `Falta: ${missing.join(', ')}`,
      className: 'text-amber-600',
    };
  };

  const { text, className } = getMessage();

  return (
    <p className={`${className} text-xs mt-1.5 transition-colors duration-150`}>
      {text}
    </p>
  );
};

export default PasswordRequirements;
