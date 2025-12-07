import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import PasswordRequirements from './PasswordRequirements';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      <label className="block text-base font-semibold text-gray-700 mb-2.5 font-['Poppins']">
        Contraseña
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          maxLength={50}
          className="w-full px-2.5 py-1.5 pr-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E93923] focus:border-transparent text-base font-['Poppins']"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
        </button>
      </div>

      <PasswordRequirements password={value} />
    </div>
  );
};

export default PasswordField;