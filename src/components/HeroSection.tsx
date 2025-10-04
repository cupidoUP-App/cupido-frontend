import { Heart, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroPreloaderGif from '@/assets/hero-preloader.gif';
import manGif from '@/assets/man.gif';

interface HeroSectionProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  theme: string;
}

export default function HeroSection({ onLoginClick, onSignupClick, theme }: HeroSectionProps) {
  const currentGif = theme === 'masculino' ? manGif : heroPreloaderGif;

  return (
    <section 
      id="hero-section" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'hsl(var(--hero-bg))' }}
    >
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="font-display font-bold text-display-xl text-foreground leading-tight">
                Conecta con quien comparte tu{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  campus
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Matches auténticos entre estudiantes verificados por correo universitario.
                Descubre personas afines en tu universidad.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={onSignupClick}
                className="btn-hero text-lg px-8 py-4"
              >
                <Heart className="w-5 h-5 mr-2" />
                Crear cuenta
              </Button>
              <Button
                onClick={onLoginClick}
                variant="outline"
                className="btn-outline text-lg px-8 py-4"
              >
                Ingresar
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Solo estudiantes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Verificado</span>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative mx-auto max-w-md lg:max-w-lg">
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
