import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ConfirmPasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  originalPassword: string;
}

const ConfirmPasswordField: React.FC<ConfirmPasswordFieldProps> = ({ 
  value, 
  onChange, 
  originalPassword 
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const showMatchIndicator = value.length > 0 && originalPassword.length > 0;
  const passwordsMatch = value === originalPassword;

  return (
    <div className="w-full">
      <label className="block text-base font-semibold text-gray-700 mb-2.5 font-['Poppins']">
        Confirmar Contraseña
      </label>
      <div className="relative">
        <input
          type={showConfirm ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Repite tu contraseña"
          maxLength={50}
          className="w-full px-2.5 py-2 pr-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E93923] focus:border-transparent text-base font-['Poppins']"
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
        </button>
      </div>
      
      {showMatchIndicator && (
        <div className="flex items-center mt-2 text-sm font-['Poppins']">
          <div
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              passwordsMatch ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className={passwordsMatch ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
            {passwordsMatch ? 'Contraseñas coinciden' : 'No coinciden'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ConfirmPasswordField;