import { useEffect, useState } from 'react';
import cupidGif from '@/assets/cupid.webp';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade animation to complete before calling onComplete
      setTimeout(onComplete, 600);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className="preloader"
      style={{ backgroundColor: 'hsl(359, 100%, 92%)' }}
      role="status"
      aria-label="Cargando cUPido"
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <img
          src={cupidGif}
          alt="Cargando..."
          className="w-64 h-64 object-contain animate-scale-in"
        />
      </div>
    </div>
  );
}