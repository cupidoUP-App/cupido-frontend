// src/features/preferences/components/LocationSelector.tsx
import React, { useState } from 'react';

interface LocationSelectorProps {
  selectedLocations: string[];
  onChange: (selected: string[]) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ selectedLocations, onChange }) => {
  const locations = ['Pamplona', 'Cúcuta'];

  const toggleLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      onChange(selectedLocations.filter((loc) => loc !== location));
    } else {
      onChange([...selectedLocations, location]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-[#e9ecef]">
      <h3 className="text-lg font-semibold text-[#E93923] mb-4 text-center">Ubicación</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {locations.map((location) => (
          <button
            key={location}
            type="button"
            onClick={() => toggleLocation(location)}
            className={`px-4 py-2 rounded-full border transition-all duration-200 ${
              selectedLocations.includes(location)
                ? 'bg-[#E93923] text-white border-[#E93923]'
                : 'bg-white text-[#333] border-gray-300 hover:bg-gray-100'
            }`}
          >
            {location}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationSelector;
