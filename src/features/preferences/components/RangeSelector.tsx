// src/features/preferences/components/RangeSelector.tsx
import React, { useRef, useEffect } from 'react';

interface RangeSelectorProps {
  type: 'age' | 'height';
  value: [number, number];
  onChange: (value: [number, number]) => void;
  minValue: number;
  maxValue: number;
  minLabel: string;
  maxLabel: string;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({
  type,
  value,
  onChange,
  minValue,
  maxValue,
  minLabel,
  maxLabel
}) => {
  const [activeThumb, setActiveThumb] = React.useState<'min' | 'max' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Local state sincronizada para inputs numéricos (evita parpadeos al tipear)
  const [localMin, setLocalMin] = React.useState<number>(value[0]);
  const [localMax, setLocalMax] = React.useState<number>(value[1]);

  useEffect(() => {
    setLocalMin(value[0]);
    setLocalMax(value[1]);
  }, [value]);

  const clamp = (val: number, lower: number, upper: number) => {
    return Math.max(lower, Math.min(upper, val));
  };

  const updateValue = (clientX: number, thumb: 'min' | 'max') => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let percentage = (clientX - rect.left) / rect.width;
    percentage = Math.max(0, Math.min(1, percentage));

    const newValue = Math.round(minValue + percentage * (maxValue - minValue));

    if (thumb === 'min') {
      const clamped = Math.min(newValue, value[1] - 1);
      onChange([clamp(clamped, minValue, maxValue - 1), value[1]]);
    } else {
      const clamped = Math.max(newValue, value[0] + 1);
      onChange([value[0], clamp(clamped, minValue + 1, maxValue)]);
    }
  };

  const handleMouseDown = (thumb: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveThumb(thumb);
    updateValue(e.clientX, thumb);

    const handleMouseMove = (ev: MouseEvent) => updateValue(ev.clientX, thumb);
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setActiveThumb(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Touch handlers
  const handleTouchStart = (thumb: 'min' | 'max') => (e: React.TouchEvent) => {
    setActiveThumb(thumb);
    updateValue(e.touches[0].clientX, thumb);

    const handleTouchMove = (ev: TouchEvent) => updateValue(ev.touches[0].clientX, thumb);
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      setActiveThumb(null);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const minPosition = ((value[0] - minValue) / (maxValue - minValue)) * 100;
  const maxPosition = ((value[1] - minValue) / (maxValue - minValue)) * 100;

  const displayValue = type === 'age'
    ? `${value[0]} - ${value[1]} años`
    : `${value[0]} - ${value[1]} cm`;

  // Handlers para inputs numéricos
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // permitimos vacío para que el usuario borre mientras escribe
    if (raw === '') {
      setLocalMin(NaN as any);
      return;
    }
    const parsed = parseInt(raw.replace(/[^\d-]/g, ''), 10);
    if (Number.isNaN(parsed)) return;
    setLocalMin(parsed);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setLocalMax(NaN as any);
      return;
    }
    const parsed = parseInt(raw.replace(/[^\d-]/g, ''), 10);
    if (Number.isNaN(parsed)) return;
    setLocalMax(parsed);
  };

  const commitMin = () => {
    let newMin = Number.isNaN(localMin) ? value[0] : localMin;
    newMin = clamp(newMin, minValue, maxValue - 1);
    // asegurar separación mínima de 1 con el max actual
    if (newMin >= value[1]) newMin = value[1] - 1;
    setLocalMin(newMin);
    onChange([newMin, value[1]]);
  };

  const commitMax = () => {
    let newMax = Number.isNaN(localMax) ? value[1] : localMax;
    newMax = clamp(newMax, minValue + 1, maxValue);
    if (newMax <= value[0]) newMax = value[0] + 1;
    setLocalMax(newMax);
    onChange([value[0], newMax]);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-[#e9ecef]">
      <div className="bg-[#E93923] text-white p-4 rounded-lg text-center font-semibold text-lg mb-4">
        {displayValue}
      </div>

      {/* Inputs editables */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-xs text-[#666] mb-1">Mínimo</label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={Number.isNaN(localMin) ? '' : localMin}
            onChange={handleMinInputChange}
            onBlur={commitMin}
            min={minValue}
            max={maxValue - 1}
            className="w-full p-2 rounded-lg border border-[#e9ecef] text-sm"
            aria-label={`${type}-min-input`}
          />
          <p className="text-xs text-[#999] mt-1">{minLabel}</p>
        </div>

        <div className="flex-1">
          <label className="block text-xs text-[#666] mb-1">Máximo</label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={Number.isNaN(localMax) ? '' : localMax}
            onChange={handleMaxInputChange}
            onBlur={commitMax}
            min={minValue + 1}
            max={maxValue}
            className="w-full p-2 rounded-lg border border-[#e9ecef] text-sm"
            aria-label={`${type}-max-input`}
          />
          <p className="text-xs text-[#999] mt-1">{maxLabel}</p>
        </div>
      </div>

      {/* Slider visual */}
      <div ref={containerRef} className="relative py-6 px-2 select-none touch-pan-y">
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-3 bg-gray-200 rounded-full"></div>
        <div
          className="absolute top-1/2 transform -translate-y-1/2 h-3 bg-[#E93923] rounded-full"
          style={{ left: `${minPosition}%`, width: `${maxPosition - minPosition}%` }}
        ></div>

        {/* Thumb mínimo */}
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-[#E93923] rounded-full shadow-lg cursor-grab z-30 touch-pan-y ${
            activeThumb === 'min' ? 'scale-125 cursor-grabbing' : 'hover:scale-110'
          }`}
          style={{ left: `${minPosition}%` }}
          onMouseDown={handleMouseDown('min')}
          onTouchStart={handleTouchStart('min')}
        />

        {/* Thumb máximo */}
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-[#E93923] rounded-full shadow-lg cursor-grab z-30 touch-pan-y ${
            activeThumb === 'max' ? 'scale-125 cursor-grabbing' : 'hover:scale-110'
          }`}
          style={{ left: `${maxPosition}%` }}
          onMouseDown={handleMouseDown('max')}
          onTouchStart={handleTouchStart('max')}
        />
      </div>

      <div className="flex justify-between text-sm text-[#666] mt-4">
        <span className="font-medium">{minLabel}</span>
        <span className="font-medium">{maxLabel}</span>
      </div>
    </div>
  );
};

export default RangeSelector;
