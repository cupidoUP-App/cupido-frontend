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
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        Confirmar Contraseña
      </label>
      <div className="relative">
        <input
          type={showConfirm ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Repite tu contraseña"
          maxLength={50}
          className="w-full px-2.5 py-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent text-xs"
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      
      {showMatchIndicator && (
        <div className="flex items-center mt-0.5 text-xs">
          <div
            className={`w-1 h-1 rounded-full mr-1 ${
              passwordsMatch ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className={passwordsMatch ? 'text-green-600' : 'text-red-500'}>
            {passwordsMatch ? 'Contraseñas coinciden' : 'No coinciden'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ConfirmPasswordField;