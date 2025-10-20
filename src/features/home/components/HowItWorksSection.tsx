import { CheckCircle, UserCheck, MessageSquare } from 'lucide-react';
import { useAnimateOnScroll } from '@/hooks/useAnimateOnScroll';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: UserCheck,
      title: 'Verificación .edu',
      description: 'Garantizamos que todos los usuarios sean jóvenes reales mediante verificación de correo.',
      step: '01'
    },
    {
      icon: CheckCircle,
      title: 'Perfil real',
      description: 'Preferencias y límites claros desde el inicio. Sé auténtico y encuentra personas afines.',
      step: '02'
    },
    {
      icon: MessageSquare,
      title: 'Match & chat',
      description: 'Conversación en tiempo real cuando haya match. Sin límites artificiales, conexiones reales.',
      step: '03'
    }
  ];

  const animationRef = useAnimateOnScroll({ triggerOnce: true });

  return (
    <section id="how" className="py-20 lg:py-32 bg-background" ref={animationRef}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0" data-animate="animate-fade-in">
          <h2 className="font-display font-bold text-display-lg text-foreground mb-6">
            ¿Cómo funciona{' '}
            <span className="text-gradient-primary">
              cUPido?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tres pasos simples para encontrar conexiones auténticas en tu universidad
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              
              return (
                <div
                  key={index}
                  className="relative text-center opacity-0"
                  data-animate="animate-fade-in"
                  data-animate-delay={`${index * 200}ms`}
                >
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.step}
                  </div>

                  {/* Card */}
                  <div className="card-floating pt-12 pb-8 px-6 mt-8 group">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    
                    <h3 className="font-display font-bold text-xl text-foreground mb-4">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Connector line for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-px bg-gradient-to-r from-primary/50 to-accent/50" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Timeline visualization */}
          <div className="relative mt-16 hidden lg:block opacity-0" data-animate="animate-fade-in" data-animate-delay="500ms">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-primary/20 via-accent/20 to-primary/20"></div>
            </div>
            <div className="relative flex justify-center text-center">
              <span className="bg-white px-4 py-2 text-sm text-muted-foreground font-medium rounded-full border border-primary/20">
                Tu historia comienza aquí
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
