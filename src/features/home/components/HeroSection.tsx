import { Heart, Sparkles, Users } from 'lucide-react';
import { Button } from '@ui/button';
import heroPreloaderGif from '@assets/hero-preloader.webp';
//import manGif from '@/assets/man.webp';
import { useAppStore } from '@store/appStore';
import { useEffect } from 'react';
import { ParticlesComponent } from './Particles';



interface HeroSectionProps {
  onOpenSignup?: () => void;
  openLogin?: () => void;
}

export default function HeroSection() {
  //theme,
  const { openSigUp, openLogin } = useAppStore();
  //const currentGif = theme === 'masculino' ? manGif : heroPreloaderGif;

  useEffect(() => {
    const preloadGifs = [heroPreloaderGif];
    preloadGifs.forEach((gif) => {
      const img = new Image();
      img.src = gif;
    });
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
              <h1 
                className="font-display font-bold text-foreground leading-tight"
                style={{ fontSize: 'clamp(1.75rem, 6vw, 3.5rem)' }}
              >
                Conecta con quien comparte tu{' '}
                <span className="text-primary">
                  campus
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
                <img
                  src={heroPreloaderGif}
                  alt="cUPido animated visual"
                  className="relative w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
