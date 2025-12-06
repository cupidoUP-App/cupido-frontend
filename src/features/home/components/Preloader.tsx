import { useEffect, useState } from 'react';
// Poster estático para carga inicial rápida (5.5KB vs 1.6MB del GIF animado)
import cupidPoster from '@assets/cupid-poster.webp';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  // Estado para cargar el GIF animado de forma diferida
  const [cupidGifSrc, setCupidGifSrc] = useState<string | null>(null);

  useEffect(() => {
    // Carga diferida del GIF animado completo después del montaje
    import('@assets/cupid.webp').then((module) => {
      setCupidGifSrc(module.default);
    });
  }, []);

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
        {/* Muestra poster primero, luego GIF animado cuando carga */}
        <img
          src={cupidGifSrc || cupidPoster}
          alt="Cargando..."
          className="w-64 h-64 object-contain animate-scale-in"
        />
      </div>
    </div>
  );
}