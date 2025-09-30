import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTAFinalSectionProps {
  onSignupClick: () => void;
}

export default function CTAFinalSection({ onSignupClick }: CTAFinalSectionProps) {
  const scrollToHow = () => {
    document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h2 className="font-display font-bold text-display-lg text-foreground mb-6">
              ¿Listo para conocer a alguien compatible{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                en tu campus?
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
              Únete a cientos de estudiantes que ya están conectando de manera auténtica. 
              Tu próxima gran historia puede comenzar hoy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button
                onClick={onSignupClick}
                className="btn-hero text-xl px-10 py-5"
                data-action="click->auth#openSignup"
              >
                <Heart className="w-6 h-6 mr-3" />
                Crear cuenta gratis
              </Button>
              
              <Button
                onClick={scrollToHow}
                className="btn-outline text-xl px-10 py-5"
                data-action="click->scroll#scrollToHow"
              >
                Saber más
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl mb-2">🎓</div>
                <div className="text-sm text-muted-foreground">Solo estudiantes verificados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <div className="text-sm text-muted-foreground">100% seguro y privado</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💝</div>
                <div className="text-sm text-muted-foreground">Gratis para estudiantes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}