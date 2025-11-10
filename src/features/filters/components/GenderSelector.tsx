import React from "react";

interface GenderSelectorProps {
  selectedGenders: string | null;
  onGendersChange: (genero: string) => void;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({
  selectedGenders,
  onGendersChange,
}) => {
  const generos = ["Masculino", "Femenino", "Otro"];

  return (
    <div className="flex gap-4 justify-center">
      {generos.map((genero) => (
        <button
          key={genero}
          onClick={() => onGendersChange(genero)}
          className={`px-6 py-2 rounded-full border transition-all duration-200 font-medium ${
            selectedGenders === genero
              ? "bg-[#E93923] text-white border-[#E93923]"
              : "bg-white text-gray-700 border-gray-300 hover:bg-[#E93923]/20"
          }`}
        >
          {genero}
        </button>
      ))}
    </div>
  );
};

export default GenderSelector;
