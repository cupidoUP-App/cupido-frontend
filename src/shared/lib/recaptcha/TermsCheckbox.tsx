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
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={true}
          className="mt-1.5 w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex-1">
          <label className="text-sm text-gray-600 leading-tight font-['Poppins']">
            Acepto los{' '}
            <button
              type="button"
              onClick={onOpenTerms}
              className="text-[#E93923] hover:text-[#d1321f] underline font-semibold inline text-left whitespace-normal break-words"
            >
              Advertencia y autorización de tratamiento de datos personales
            </button>
          </label>
          {!checked && (
            <p className="text-sm text-gray-500 mt-1.5 font-['Poppins']">
              Debes aceptar los términos y condiciones para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsCheckbox;