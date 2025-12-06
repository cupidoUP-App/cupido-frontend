import { Heart, Sparkles, Users } from 'lucide-react';
import { Button } from '@ui/button';
import { useAppStore } from '@store/appStore';
import { useEffect, useState } from 'react';
import { ParticlesComponent } from './Particles';
// Poster estático para LCP rápido (10KB vs 877KB del animado)
import heroPoster from '@assets/hero-preloader-poster.webp';

interface HeroSectionProps {
  onOpenSignup?: () => void;
  openLogin?: () => void;
}

export default function HeroSection() {
  const { openSigUp, openLogin } = useAppStore();
  const [heroGifSrc, setHeroGifSrc] = useState<string | null>(null);

  useEffect(() => {
    // Cargar GIF animado después del LCP inicial (deferred 1.5s)
    const timer = setTimeout(() => {
      import('@assets/hero-preloader.webp').then((module) => {
        setHeroGifSrc(module.default);
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero-section"
      className="relative min-h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden pt-16 md:pt-14 pb-8"
      style={{ backgroundColor: 'hsl(var(--hero-bg))' }}
    >
      <ParticlesComponent id="tsparticles" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">

          <div className="text-center lg:text-left space-y-6 sm:space-y-8 animate-fade-in">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="font-display font-extrabold leading-[1.05] space-y-0">
                <span 
                  className="block text-foreground" 
                  style={{ 
                    fontSize: 'clamp(2rem, 6.5vw, 3.75rem)',
                    letterSpacing: '-0.025em'
                  }}
                >
                  Conecta con quien
                </span>
                <span 
                  className="block relative" 
                  style={{ 
                    fontSize: 'clamp(2rem, 6.5vw, 3.75rem)',
                    letterSpacing: '-0.025em'
                  }}
                >
                  comparte tu{' '}
                  <span className="relative inline-block ml-1 sm:ml-2">
                    {/* Rectángulo rotado atrás - más compacto verticalmente */}
                    <span 
                      className="absolute -inset-x-1 top-[0.3rem] bottom-[-0.3rem] bg-accent/30 -rotate-3 -z-10"
                      aria-hidden="true"
                    />

                    {/* Texto principal rotado */}
                    <span className="text-primary font-black inline-block rotate-2 px-1">
                      campus
                    </span>
                    {/* Mini texto rotado superior derecha */}
                    <span 
                      className="absolute -top-3 sm:-top-4 -right-4 sm:-right-5 text-[0.6rem] sm:text-xs 
                                 font-black text-foreground uppercase rotate-12
                                 bg-primary text-primary-foreground px-1.5 sm:px-2 py-0.5"
                      aria-hidden="true"
                    >
                      UP
                    </span>
                  </span>
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Matches auténticos entre jóvenes verificados por correo universitario.
                Descubre personas afines en tu universidad.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button
                onClick={openSigUp}
                className="btn-hero text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"                                                      
              >
                <Heart className="w-5 h-5 mr-2" />
                Crear cuenta
              </Button>
              <Button
                onClick={openLogin}
                variant="outline"
                className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
              >
                Ingresar
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Solo jóvenes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Verificado</span>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative mx-auto max-w-lg lg:max-w-xl">
              <div className="relative">
                {/* Poster estático inicial para LCP rápido, luego reemplaza con animado */}
                <img
                  src={heroGifSrc || heroPoster}
                  alt="cUPido visual"
                  className="relative w-full h-auto"
                  // fetchpriority high para el LCP
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
