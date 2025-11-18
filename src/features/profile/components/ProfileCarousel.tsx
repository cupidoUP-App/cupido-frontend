import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProfileCarouselProps {
  images: string[];
}

const ProfileCarousel: React.FC<ProfileCarouselProps> = ({ images }) => {
  const fallbackImages = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005318-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop",
  ];

  // 🔥 Usar imágenes reales o fallbacks
  const slides = (images && images.length > 0 ? images : fallbackImages).slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const getImageIndex = (offset: number) => {
    const index = (currentIndex + offset + slides.length) % slides.length;
    return index;
  };

  // 🔥 Función para manejar errores de carga de imágenes
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    console.error(`Error cargando imagen: ${target.src}`);
    // Podrías establecer una imagen de fallback aquí si lo deseas
  };

  return (
    <div className="relative w-full max-w-[500px] h-[460px] md:h-[520px] lg:h-[560px] flex items-center justify-center">
      {/* Imagen izquierda (desvanecida) */}
      {slides.length > 1 && (
        <div
          className="absolute left-0 z-10 w-[45%] h-[85%] rounded-2xl overflow-hidden shadow-xl opacity-30 blur-sm transition-all duration-500 ease-in-out"
          style={{ transform: 'translateX(-20%) scale(0.85)' }}
        >
          <img
            src={slides[getImageIndex(-1)]}
            alt="foto-anterior"
            className="w-full h-full object-cover select-none"
            draggable={false}
            onError={handleImageError} // 🔥 Manejar errores
          />
        </div>
      )}

      {/* Imagen principal (centro) */}
      <div className="relative z-20 w-[75%] md:w-[70%] h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out">
        <img
          src={slides[currentIndex]}
          alt={`foto-principal-${currentIndex}`}
          className="w-full h-full object-cover select-none"
          draggable={false}
          onError={handleImageError} // 🔥 Manejar errores
        />
        
        {/* Controles de navegación */}
        {slides.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} className="text-[#E74C3C]" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={24} className="text-[#E74C3C]" />
            </button>
            
            {/* Indicadores de puntos */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? "w-3 h-3 bg-white shadow-lg"
                      : "w-2.5 h-2.5 bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Imagen derecha (desvanecida) */}
      {slides.length > 1 && (
        <div
          className="absolute right-0 z-10 w-[45%] h-[85%] rounded-2xl overflow-hidden shadow-xl opacity-30 blur-sm transition-all duration-500 ease-in-out"
          style={{ transform: 'translateX(20%) scale(0.85)' }}
        >
          <img
            src={slides[getImageIndex(1)]}
            alt="foto-siguiente"
            className="w-full h-full object-cover select-none"
            draggable={false}
            onError={handleImageError} // 🔥 Manejar errores
          />
        </div>
      )}
    </div>
  );
};

export default ProfileCarousel;