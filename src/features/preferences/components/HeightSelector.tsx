/**
 * Componente selector de rango de estatura.
 * Wrapper sobre RangeSelector con valores predefinidos para estatura (100-200 cm).
 *
 * @interface HeightSelectorProps
 * @property {[number, number]} value - Tupla [mínimo, máximo] del rango seleccionado.
 * @property {(value: [number, number]) => void} onChange - Callback al cambiar el rango.
 */
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