import { useState, useEffect } from 'react';
import { User, MessageCircle, Shield } from 'lucide-react';

export default function IntroNarrativa() {
  const [visibleStep, setVisibleStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.getAttribute('data-step') || '0');
            setVisibleStep(stepIndex);
          }
        });
      },
      { threshold: 0.5 }
    );

    const steps = document.querySelectorAll('[data-step]');
    steps.forEach((step) => observer.observe(step));

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      icon: User,
      title: 'Deja que el algoritmo te conozca',
      copy: 'Completa un perfil auténtico con intereses y límites claros. Tu personalidad es lo que más importa.',
      delay: '0s'
    },
    {
      icon: MessageCircle,
      title: 'Desliza. Conecta. Conversa.',
      copy: 'Descubre estudiantes afines y conversa en tiempo real cuando haya match. Cada conexión es una oportunidad.',
      delay: '0.2s'
    },
    {
      icon: Shield,
      title: 'Seguro y verificado',
      copy: 'Acceso solo con correo institucional. Controles de privacidad y bloqueo para tu tranquilidad.',
      delay: '0.4s'
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-display-lg text-foreground mb-6">
            Tu historia de amor universitaria{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              comienza aquí
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cada gran conexión empieza con un paso. Te guiamos en cada uno de ellos.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isVisible = visibleStep >= index;
            
            return (
              <div
                key={index}
                data-step={index}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 transition-all duration-800 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                style={{ animationDelay: step.delay }}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
                      <Icon className="w-12 h-12 text-primary" />
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-50" />
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 text-center ${index % 2 === 1 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <h3 className="font-display font-bold text-2xl lg:text-3xl text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                    {step.copy}
                  </p>
                </div>

                {/* Step number */}
                <div className="hidden lg:block flex-shrink-0">
                  <div className="w-16 h-16 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center">
                    <span className="font-display font-bold text-2xl text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Connecting lines for desktop */}
        <div className="hidden lg:block absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent transform -translate-x-1/2" />
      </div>
    </section>
  );
}