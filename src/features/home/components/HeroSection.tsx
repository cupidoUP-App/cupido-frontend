import { Heart, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroPreloaderGif from '@/assets/hero-preloader.webp';
import manGif from '@/assets/man.webp';
import { useAppStore } from '@/store/appStore';
import { useEffect } from 'react';
import { ParticlesComponent } from './Particles';



interface HeroSectionProps {
  onOpenSignup?: () => void;
  openLogin?: () => void;
}

export default function HeroSection() {
  const { theme, openSigUp, openLogin } = useAppStore();
  const currentGif = theme === 'masculino' ? manGif : heroPreloaderGif;

  useEffect(() => { 
    const preloadGifs = [manGif, heroPreloaderGif];
    preloadGifs.forEach((gif) => {
      const img = new Image();
      img.src = gif;
    });
  }, []);

  return (
    <section 
      id="hero-section" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'hsl(var(--hero-bg))' }}
    >
      <ParticlesComponent id="tsparticles" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="font-display font-bold text-display-xl text-foreground leading-tight">
                Conecta con quien comparte tu{' '}
                <span className="text-gradient-primary">
                  campus
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Matches auténticos entre jóvenes verificados por correo universitario.
                Descubre personas afines en tu universidad.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={openSigUp}
                className="btn-hero text-lg px-8 py-4"
              >
                <Heart className="w-5 h-5 mr-2" />
                Crear cuenta
              </Button>
              <Button
                onClick={openLogin}
                variant="outline"
                className="btn-outline text-lg px-8 py-4"
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
                  src={currentGif}
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
