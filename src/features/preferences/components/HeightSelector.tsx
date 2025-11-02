import React from 'react';
import RangeSelector from './RangeSelector';

interface HeightSelectorProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const HeightSelector: React.FC<HeightSelectorProps> = ({ 
  value, 
  onChange 
}) => {
  return (
    <RangeSelector
      type="height"
      value={value}
      onChange={onChange}
      minValue={100}
      maxValue={200}
      minLabel="100 cm"
      maxLabel="200 cm"
    />
  );
};

export default HeightSelector;