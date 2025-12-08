import { useState } from 'react';
import { Shield, UserX, BookOpen, Eye } from 'lucide-react';
import { Button } from '@ui/button';
import { useAnimateOnScroll } from '@hooks/useAnimateOnScroll';

export default function SafetySection() {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const safetyFeatures = [
    {
      icon: Shield,
      title: 'Verificación por email institucional',
      description: 'Solo jóvenes con correos universitarios activos pueden acceder a la plataforma.'
    },
    {
      icon: UserX,
      title: 'Reportes y bloqueo de usuarios',
      description: 'Sistema robusto para reportar comportamiento inapropiado y bloquear usuarios problemáticos.'
    },
    {
      icon: BookOpen,
      title: 'Guía de seguridad en citas',
      description: 'Recursos y consejos para citas seguras, tanto en línea como en persona.'
    },
    {
      icon: Eye,
      title: 'Moderación futura',
      description: 'Sistema de moderación inteligente en desarrollo para mantener un ambiente seguro.'
    }
  ];

  const animationRef = useAnimateOnScroll({ triggerOnce: true });

  return (
    <section id="safety" className="py-12 sm:py-20 lg:py-32 bg-white/80" ref={animationRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

          {/* Content */}
          <div className="opacity-0 order-2 lg:order-1" data-animate="animate-slide-in-left">
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-display-lg text-foreground mb-4 sm:mb-6">
              Tu seguridad es{' '}
              <span className="text-primary">
                nuestra prioridad
              </span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-prose">
              Creamos un ambiente seguro y respetuoso donde puedas conectar con confianza.
              Cada característica está diseñada pensando en tu bienestar.
            </p>

            <div className="space-y-6 mb-8">
              {safetyFeatures.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-success/15 border-2 border-success/30 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[3px_3px_0px_0px_hsl(var(--success)/0.3)]">
                      <Icon className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button className="btn-outline">
              <a href="https://drive.google.com/file/d/1mYLWA-KEx1WMhFpsEw2T740d8plZhQEG/view?usp=sharing" target="_blank">Conoce nuestras prácticas</a>
            </Button>
          </div>

          {/* Visual - ahora primero en móvil */}
          <div className="relative opacity-0 order-1 lg:order-2" data-animate="animate-slide-in-right" data-animate-delay="200ms">
            <div className="relative">
              {/* Main shield illustration */}
              <div className="w-full max-w-[280px] sm:max-w-sm mx-auto">
                <div className="relative">
                  <div className="absolute inset-0 bg-success/20 blur-3xl rounded-full hidden sm:block" />
                  <div className="relative bg-white/90 backdrop-blur-sm border-2 border-success/20 rounded-[var(--card-border-radius)] p-6 sm:p-8 lg:p-12 text-center shadow-[4px_4px_0px_0px_hsl(var(--success)/0.2)] sm:shadow-[5px_5px_0px_0px_hsl(var(--success)/0.2)]">
                    <Shield className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-success mx-auto mb-4 sm:mb-6" />
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground mb-2 sm:mb-4">
                      Ambiente Seguro
                    </h3>
                    <p className="text-muted-foreground">
                      Verificación, moderación y herramientas de control para tu tranquilidad
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating security badges con bordes */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-white/90 backdrop-blur-sm border-2 border-destructive/30 rounded-2xl flex items-center justify-center animate-float shadow-[3px_3px_0px_0px_hsl(var(--destructive)/0.2)]">
                <UserX className="w-8 h-8 text-destructive" />
              </div>

              <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-white/90 backdrop-blur-sm border-2 border-primary/30 rounded-2xl flex items-center justify-center animate-float shadow-[3px_3px_0px_0px_hsl(var(--primary)/0.2)]" style={{ animationDelay: '1s' }}>
                <Eye className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}