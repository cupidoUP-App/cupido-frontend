import { useCountUp } from '@/hooks/useCountUp';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedStatProps {
  value: string;
  label: string;
  className?: string;
}

export default function AnimatedStat({ value, label, className }: AnimatedStatProps) {
  // Memoize parsing logic to avoid re-calculating on every render
  const { target, suffix } = useMemo(() => {
    // Remove commas for parsing, but keep other symbols for suffix
    const num = parseFloat(value.replace(/,/g, ''));
    // Find the first non-numeric character to use as a suffix (e.g., +, %, ⭐)
    const suffixMatch = value.match(/(\+?|%|⭐)/);
    const suf = suffixMatch ? suffixMatch[0] : '';
    return { target: isNaN(num) ? 0 : num, suffix: suf };
  }, [value]);

  const { count, ref } = useCountUp(target);

  // Format the number with locale-specific thousands separators (e.g., 1,200)
  const formattedCount = new Intl.NumberFormat('es-ES').format(count);

  return (
    <div ref={ref} className="text-center">
      <div className={cn("font-display font-bold text-3xl lg:text-4xl mb-2", className)}>
        {/* Render the formatted number and its suffix */}
        {formattedCount}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
