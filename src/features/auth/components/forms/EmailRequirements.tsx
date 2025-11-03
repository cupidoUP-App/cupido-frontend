import React from 'react';

interface EmailRequirementsProps {
  email: string;
}

const EmailRequirements: React.FC<EmailRequirementsProps> = ({ email }) => {
  const getMessage = () => {
    if (email.length === 0) {
      return {
        text: '@unipamplona.edu.co',
        className: 'text-gray-500',
      };
    }

    const missing: string[] = [];

    if (!email.includes('@')) missing.push('@');
    if (!email.endsWith('@unipamplona.edu.co')) missing.push('@unipamplona.edu.co');

    if (missing.length === 0) {
      return {
        text: '✓ Correo institucional válido',
        className: 'text-green-600 font-medium',
      };
    }

    return {
      text: `Falta: ${missing.join(', ')}`,
      className: 'text-amber-600',
    };
  };

  const { text, className } = getMessage();

  return <p className={`${className} text-xs mt-1.5 transition-colors duration-150`}>{text}</p>;
};

export default EmailRequirements;
