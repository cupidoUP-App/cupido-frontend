import React, { useState } from 'react';
import { interests } from '../data/interests';

interface InterestSelectorProps {
  isEditing: boolean;
}

const InterestSelector: React.FC<InterestSelectorProps> = ({ isEditing }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    if (!isEditing) return;

    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Intereses</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {interests.map((interest) => (
          <button
            key={interest}
            onClick={() => toggleInterest(interest)}
            disabled={!isEditing}
            className={`p-3 rounded-lg border-2 transition-colors ${
              selectedInterests.includes(interest)
                ? 'bg-[#E93923] text-white border-[#E93923]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#E93923]'
            } ${!isEditing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            {interest}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InterestSelector;