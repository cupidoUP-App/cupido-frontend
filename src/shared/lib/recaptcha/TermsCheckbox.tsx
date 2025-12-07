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
      <div className="flex items-start justify-center space-x-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={true} 
          className="mt-0.5 w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <label className="text-sm text-gray-600 leading-tight text-center font-['Poppins']">
          Acepto los{' '}
          <button
            type="button"
            onClick={onOpenTerms}
            className="text-[#E93923] hover:text-[#d1321f] underline font-semibold"
          >
            términos y condiciones
          </button>
        </label>
      </div>
      {!checked && (
        <p className="text-sm text-gray-500 mt-1.5 text-center font-['Poppins']">
          Debes aceptar los términos y condiciones para continuar
        </p>
      )}
    </div>
  );
};

export default TermsCheckbox;