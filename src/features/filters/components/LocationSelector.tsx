import React from "react";

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (ubicacion: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onLocationChange,
}) => {
  const locations = ["Pamplona", "Cúcuta"];

  return (
    <div className="flex gap-4 justify-center">
      {locations.map((loc) => (
        <button
          key={loc}
          onClick={() => onLocationChange(loc)}
          className={`px-6 py-2 rounded-full border transition-all duration-200 font-medium ${
            selectedLocation === loc
              ? "bg-[#E93923] text-white border-[#E93923]"
              : "bg-white text-gray-700 border-gray-300 hover:bg-[#E93923]/20"
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
};

export default LocationSelector;
