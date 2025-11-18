import React from 'react';

interface InterestsSelectorProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
  maxSelection?: number;
}

const InterestsSelector: React.FC<InterestsSelectorProps> = ({ 
  selectedInterests, 
  onInterestsChange,
  maxSelection = 3 
}) => {
  // Lista de 16 intereses
  const interests = [
    'Deportes', 'Música', 'Arte', 'Tecnología', 
    'Viajes', 'Lectura', 'Cine', 'Gastronomía',
    'Fotografía', 'Moda', 'Videojuegos', 'Naturaleza',
    'Animales', 'Cocina', 'Baile', 'Yoga'
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      // Deseleccionar
      onInterestsChange(selectedInterests.filter(item => item !== interest));
    } else {
      // Seleccionar (hasta máximo 3)
      if (selectedInterests.length < maxSelection) {
        onInterestsChange([...selectedInterests, interest]);
      }
    }
  };

  const isDisabled = (interest: string) => {
    return selectedInterests.length >= maxSelection && !selectedInterests.includes(interest);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-[#e9ecef]">
      {/* CONTADOR DE SELECCIONES */}
      <div className="mb-4 p-3 bg-[#f8f9fa] rounded-lg border border-[#e9ecef]">
        <p className="text-sm text-[#333] font-medium">
          {selectedInterests.length} de {maxSelection} intereses seleccionados
        </p>
        {selectedInterests.length >= maxSelection && (
          <p className="text-xs text-[#1a1a1a] mt-1">
            Has alcanzado el máximo de selecciones
          </p>
        )}
      </div>

      {/* Grid de intereses */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {interests.map((interest) => (
          <button
            key={interest}
            onClick={() => toggleInterest(interest)}
            disabled={isDisabled(interest)}
            className={`
              p-3 rounded-lg border-2 text-sm font-medium transition duration-200
              ${selectedInterests.includes(interest)
                ? 'border-[#E93923] bg-[#fff5f5] text-[#E93923]'
                : 'border-[#e9ecef] bg-white text-[#333] hover:border-[#1a1a1a] hover:bg-[#f5f5f5]'
              }
              ${isDisabled(interest) 
                ? 'opacity-50 cursor-not-allowed hover:border-[#e9ecef] hover:bg-white' 
                : 'cursor-pointer'
              }
            `}
          >
            {interest}
          </button>
        ))}
      </div>

      {/* Intereses seleccionados */}
      {selectedInterests.length > 0 && (
        <div className="mt-4 p-3 bg-[#f0f8ff] rounded-lg border border-[#d1e7ff]">
          <p className="text-xs text-[#E93923] mt-1">Tus intereses seleccionados:</p>
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map((interest) => (
              <span 
                key={interest}
                className="px-3 py-1 bg-[#E93923] text-white text-sm rounded-full font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestsSelector;