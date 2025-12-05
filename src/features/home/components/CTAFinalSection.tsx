import { Heart, ArrowRight } from 'lucide-react';
import { GraduationCap, ShieldCheck, HeartStraight } from '@phosphor-icons/react';
import { Button } from '@ui/button';
import { useAnimateOnScroll } from '@hooks/useAnimateOnScroll';

interface CTAFinalSectionProps {
  onSignupClick: () => void;
}

export default function CTAFinalSection({ onSignupClick }: CTAFinalSectionProps) {
  const scrollToHow = () => {
    document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
  };

  const animationRef = useAnimateOnScroll({ triggerOnce: true });

  return (
    <section className="py-12 sm:py-20 lg:py-32 bg-primary/5 backdrop-blur-sm relative overflow-hidden" ref={animationRef}>
      {/* Background decorations - círculos sólidos con blur - ocultos en móvil */}
      <div className="absolute inset-0 opacity-40 hidden sm:block">
        <div className="absolute top-20 left-10 sm:left-20 w-32 sm:w-64 h-32 sm:h-64 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 sm:right-20 w-32 sm:w-64 h-32 sm:h-64 bg-accent/15 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="opacity-0" data-animate="animate-fade-in">
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-display-lg text-foreground mb-4 sm:mb-6 px-2">
              ¿Listo para conocer a alguien compatible{' '}
              <span className="text-primary">
                en tu campus?
              </span>
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto px-2">
              Únete a cientos de jóvenes que ya están conectando de manera auténtica. 
              Tu próxima gran historia puede comenzar hoy.
            </p>

            {/* CTA Buttons - responsive */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 px-4">
              <Button
                onClick={onSignupClick}
                className="btn-hero text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 w-full sm:w-auto"
                data-action="click->auth#openSignup"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Crear cuenta gratis
              </Button>
              
              <Button
                onClick={scrollToHow}
                className="btn-outline text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 w-full sm:w-auto"
                data-action="click->scroll#scrollToHow"
              >
                Saber más
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
              </Button>
            </div>

            {/* Trust indicators con estilo divertido - responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-2xl mx-auto px-4 sm:px-0">
              <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-primary/20 shadow-[3px_3px_0px_0px_hsl(var(--primary)/0.15)] hover:shadow-[5px_5px_0px_0px_hsl(var(--primary)/0.2)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <GraduationCap size={36} weight="duotone" className="text-primary" />
                </div>
                <div className="text-sm text-muted-foreground font-medium">Solo jóvenes verificados</div>
              </div>
              <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-primary/20 shadow-[3px_3px_0px_0px_hsl(var(--primary)/0.15)] hover:shadow-[5px_5px_0px_0px_hsl(var(--primary)/0.2)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <ShieldCheck size={36} weight="duotone" className="text-primary" />
                </div>
                <div className="text-sm text-muted-foreground font-medium">100% seguro y privado</div>
              </div>
              <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-primary/20 shadow-[3px_3px_0px_0px_hsl(var(--primary)/0.15)] hover:shadow-[5px_5px_0px_0px_hsl(var(--primary)/0.2)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <HeartStraight size={36} weight="duotone" className="text-primary" />
                </div>
                <div className="text-sm text-muted-foreground font-medium">Gratis para jóvenes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}