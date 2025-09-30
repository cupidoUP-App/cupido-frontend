import { useEffect, useState } from 'react';
import heroPreloaderGif from '@/assets/hero-preloader.gif';

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
      role="status"
      aria-label="Cargando cUPido"
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <img
          src={heroPreloaderGif}
          alt="Cargando..."
          className="w-70 h-70 object-contain animate-scale-in"
        />
      </div>
    </div>
  );
}