import React from 'react';

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const getMissingRequirements = () => {
    const missing = [];
    
    if (password.length < 8) missing.push('8+ chars');
    if (!/[A-Z]/.test(password)) missing.push('A-Z');
    if (!/[a-z]/.test(password)) missing.push('a-z');
    if (!/\d/.test(password)) missing.push('0-9');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) missing.push('símbolo');
    
    return missing;
  };

  const missing = getMissingRequirements();

  if (password.length === 0) {
    return <p className="text-gray-500 text-xs mt-1.5">8+ chars: A-Z, a-z, 0-9, símbolo</p>;
  }

  if (missing.length === 0) {
    return <p className="text-green-600 text-xs font-medium mt-1.5">✓ Segura</p>;
  }

  return <p className="text-amber-600 text-xs mt-1.5">Falta: {missing.join(', ')}</p>;
};

export default PasswordRequirements;