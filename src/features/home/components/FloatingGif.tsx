import { useState, useEffect } from 'react';
// Poster estático para carga inicial (10KB vs 877KB del GIF animado)
import heroPoster from '@assets/hero-preloader-poster.webp';

interface FloatingGifProps {
  isVisible: boolean;
}

export default function FloatingGif({ isVisible }: FloatingGifProps) {
  // Estado para cargar el GIF animado de forma condicional
  const [heroGifSrc, setHeroGifSrc] = useState<string | null>(null);

  useEffect(() => {
    // Solo carga el GIF pesado si el componente es visible
    if (isVisible) {
      import('@assets/hero-preloader.webp').then((module) => {
        setHeroGifSrc(module.default);
      });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-30 hidden lg:block">
      <div className="w-32 h-32 pulse-gentle">
        {/* Muestra poster primero, luego GIF animado cuando carga */}
        <img
          src={heroGifSrc || heroPoster}
          alt=""
          className="w-full h-full object-contain animate-float"
          role="presentation"
          loading="lazy"
        />
      </div>
    </div>
  );
}