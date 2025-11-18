import React from 'react';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  onOpenTerms: () => void;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ 
  checked, 
  onChange, 
  onOpenTerms 
}) => {
  return (
    <div className="w-full">
      <div className="flex items-start justify-center space-x-1.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={true} // Deshabilitado hasta que se acepten los términos
          className="mt-0.5 w-3.5 h-3.5 text-pink-600 border-gray-300 rounded focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label className="text-xs text-gray-600 leading-tight text-center">
          Acepto los{' '}
          <button
            type="button"
            onClick={onOpenTerms}
            className="text-[#E93923] hover:text-[#d1321f] underline font-medium"
          >
            términos y condiciones
          </button>
        </label>
      </div>
      {!checked && (
        <p className="text-xs text-gray-500 mt-1 text-center">
          Debes aceptar los términos y condiciones para continuar
        </p>
      )}
    </div>
  );
};

export default TermsCheckbox;