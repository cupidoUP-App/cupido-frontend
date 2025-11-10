import React from 'react';

interface EmailRequirementsProps {
  email: string;
}

const EmailRequirements: React.FC<EmailRequirementsProps> = ({ email }) => {
  const getMissingRequirements = () => {
    const missing = [];

    if (!email.includes('@')) missing.push('@');
    if (!email.endsWith('@unipamplona.edu.co')) missing.push('@unipamplona.edu.co');

    return missing;
  };

  const missing = getMissingRequirements();

  if (email.length === 0) {
    return <p className="text-gray-500 text-xs mt-1.5">@unipamplona.edu.co</p>;
  }

  if (missing.length === 0) {
    return <p className="text-green-600 text-xs font-medium mt-1.5">✓ Correo institucional válido</p>;
  }

  return <p className="text-amber-600 text-xs mt-1.5">Falta: {missing.join(', ')}</p>;
};

export default EmailRequirements;