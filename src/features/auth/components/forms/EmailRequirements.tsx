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
    const errors: string[] = [];

    // Verificaciones de formato requerido
    if (!email.includes('@')) missing.push('@');
    if (!email.endsWith('@unipamplona.edu.co')) missing.push('@unipamplona.edu.co');

    // Verificaciones de errores comunes
    const localPart = email.split('@')[0]; // Parte antes del @
    
    // 1. Verificar que no esté vacío antes del @
    if (email.includes('@') && (!localPart || localPart.trim().length === 0)) {
      errors.push('texto antes del @');
    }

    // 2. Verificar que no tenga múltiples @
    const atCount = (email.match(/@/g) || []).length;
    if (atCount > 1) {
      errors.push('solo un @ permitido');
    }

    // 3. Verificar que no tenga puntos consecutivos
    if (/\.{2,}/.test(localPart)) {
      errors.push('puntos consecutivos no permitidos');
    }

    // 4. Verificar que no empiece con punto
    if (localPart.startsWith('.')) {
      errors.push('no puede empezar con punto');
    }

    // 5. Verificar que no termine con punto antes del @
    if (localPart.endsWith('.')) {
      errors.push('no puede terminar con punto antes del @');
    }

    // 6. Verificar que no tenga solo números antes del @
    if (/^\d+$/.test(localPart)) {
      errors.push('no puede tener solo números antes del @');
    }

    // 7. Verificar que tenga caracteres válidos (letras, números, puntos, guiones)
    if (!/^[a-zA-Z0-9._-]+$/.test(localPart) && localPart.length > 0) {
      errors.push('caracteres no válidos (solo letras, números, ., -, _)');
    }

    // 8. Verificar longitud mínima antes del @
    if (localPart.length > 0 && localPart.length < 2) {
      errors.push('mínimo 2 caracteres antes del @');
    }

    // 9. Verificar que no tenga espacios
    if (/\s/.test(email)) {
      errors.push('no puede contener espacios');
    }

    // 10. Verificar formato completo del dominio
    if (email.includes('@') && !/^[^@]+@unipamplona\.edu\.co$/.test(email)) {
      errors.push('formato de dominio incorrecto');
    }

    // Si hay errores, mostrarlos primero
    if (errors.length > 0) {
      return {
        text: `✗ ${errors.join(', ')}`,
        className: 'text-red-600 font-medium',
      };
    }

    // Si faltan elementos requeridos
    if (missing.length > 0) {
      return {
        text: `Falta: ${missing.join(', ')}`,
        className: 'text-amber-600',
      };
    }

    // Si pasa todas las validaciones
    return {
      text: '✓ Correo institucional válido',
      className: 'text-green-600 font-medium',
    };
  };

  const { text, className } = getMessage();

  return (
    <div className="text-xs mt-1.5 transition-colors duration-150">
      <p className={className}>{text}</p>

    </div>
  );
};

export default EmailRequirements;