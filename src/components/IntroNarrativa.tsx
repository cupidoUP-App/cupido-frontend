import { useState, useEffect } from 'react';
import { User, MessageCircle, Shield } from 'lucide-react';

export default function IntroNarrativa() {
  // This hook can be extracted to a custom hook `useIntersectionObserver` for reusability
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.2 }
    );

    const steps = document.querySelectorAll('[data-timeline-step]');
    steps.forEach((step) => observer.observe(step));

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      icon: User,
      title: 'Deja que el algoritmo te conozca',
      copy: 'Completa un perfil auténtico con intereses y límites claros. Tu personalidad es lo que más importa.',
    },
    {
      icon: MessageCircle,
      title: 'Desliza. Conecta. Conversa.',
      copy: 'Descubre jóvenes afines y conversa en tiempo real cuando haya match. Cada conexión es una oportunidad.',
    },
    {
      icon: Shield,
      title: 'Seguro y verificado',
      copy: 'Acceso solo con correo institucional. Controles de privacidad y bloqueo para tu tranquilidad.',
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
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

        {/* Vertical Timeline Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* The vertical line */}
          <div className="absolute left-4 lg:left-1/2 w-0.5 h-full bg-gradient-to-b from-primary/20 via-accent/20 to-secondary/20 transform -translate-x-1/2"></div>

          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isOdd = index % 2 !== 0;

              return (
                <div 
                  key={index} 
                  data-timeline-step
                  className="relative grid lg:grid-cols-2 gap-8 items-center opacity-0 translate-y-8 transition-all duration-1000"
                >
                  {/* Content Card */}
                  <div className={`card-floating p-8 ${isOdd ? 'lg:order-last' : ''}`}>
                    <h3 className="font-display font-bold text-2xl text-foreground mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.copy}</p>
                  </div>

                  {/* Timeline Node */}
                  <div className={`absolute left-4 lg:left-1/2 top-1/2 w-8 h-8 bg-background border-2 border-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  {/* Spacer for the grid */}
                  <div className={`hidden ${isOdd ? 'lg:block' : 'lg:hidden'}`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}