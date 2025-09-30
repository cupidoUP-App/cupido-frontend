import { Heart, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroPreloaderGif from '@/assets/hero-preloader.gif';

interface HeroSectionProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export default function HeroSection({ onLoginClick, onSignupClick }: HeroSectionProps) {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Animated background particles */}
      <div className="particles-bg">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-particle-float" />
        <div className="absolute top-40 right-32 w-3 h-3 bg-accent/20 rounded-full animate-particle-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-primary/40 rounded-full animate-particle-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-20 w-2.5 h-2.5 bg-accent/30 rounded-full animate-particle-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content Column */}
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

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={onSignupClick}
                className="btn-hero text-lg px-8 py-4"
                data-action="click->auth#openSignup"
              >
                <Heart className="w-5 h-5 mr-2" />
                Crear cuenta
              </Button>
              
              <Button
                onClick={onLoginClick}
                className="btn-outline text-lg px-8 py-4"
                data-action="click->auth#openLogin"
              >
                Ingresar
              </Button>
            </div>

            {/* Trust indicators */}
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

          {/* Visual Column */}
          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative mx-auto max-w-md lg:max-w-lg">
              {/* Main logo with glow effect */}
              <div className="relative">
                {/* Glow effect removed */}
                <img
                  src={heroPreloaderGif}
                  alt="cUPido animated visual"
                  className="relative w-full h-auto"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-primary/10 rounded-full blur-xl animate-pulse" />
              <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-accent/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}