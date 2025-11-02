// src/features/preferences/components/GenderSelector.tsx
import React, { useState } from 'react';

interface GenderSelectorProps {
  selectedGenders: string[];
  onChange: (selected: string[]) => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ selectedGenders, onChange }) => {
  const options = ['Hombre', 'Mujer', 'Otro'];

  const toggleGender = (gender: string) => {
    if (selectedGenders.includes(gender)) {
      onChange(selectedGenders.filter((g) => g !== gender));
    } else {
      onChange([...selectedGenders, gender]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-[#e9ecef]">
      <h3 className="text-lg font-semibold text-[#E93923] mb-4 text-center">Género</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {options.map((gender) => (
          <button
            key={gender}
            type="button"
            onClick={() => toggleGender(gender)}
            className={`px-4 py-2 rounded-full border transition-all duration-200 ${
              selectedGenders.includes(gender)
                ? 'bg-[#E93923] text-white border-[#E93923]'
                : 'bg-white text-[#333] border-gray-300 hover:bg-gray-100'
            }`}
          >
            {gender}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenderSelector;
