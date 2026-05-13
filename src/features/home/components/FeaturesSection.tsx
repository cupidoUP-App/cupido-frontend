/**
 * Sección de características destacadas de la landing page.
 * Muestra una cuadrícula de 4 tarjetas (Swipe intuitivo, Rápido con Hotwire,
 * Privacidad primero, En tu campus) con animaciones al hacer scroll.
 */
import { Heart, Zap, Shield, MapPin } from 'lucide-react';
import { useAnimateOnScroll } from '@hooks/useAnimateOnScroll';
import AnimatedStat from './AnimatedStat';

export default function FeaturesSection() {
  const features = [
    {
      icon: Heart,
      title: 'Swipe intuitivo',
      description: 'Interfaz fluida con micro-animaciones y feedback táctil para una experiencia natural y envolvente.',
      gradient: 'from-primary/20 to-accent/20'
    },
    {
      icon: Zap,
      title: 'Rápido con Hotwire',
      description: 'Transiciones sin recarga preparadas para Turbo y Streams. Velocidad que no compromete la experiencia.',
      gradient: 'from-accent/20 to-primary/20'
    },
    {
      icon: Shield,
      title: 'Privacidad primero',
      description: 'Control fino de visibilidad, reportes y bloqueo. Tu seguridad y comodidad son nuestra prioridad.',
      gradient: 'from-primary/20 to-success/20'
    },
    {
      icon: MapPin,
      title: 'En tu campus',
      description: 'Preferencia por cercanía y afinidad académica. Conecta con personas de tu mismo entorno universitario.',
      gradient: 'from-success/20 to-accent/20'
    }
  ];

  const animationRef = useAnimateOnScroll({ triggerOnce: true });

  return (
    <section className="py-12 sm:py-20 lg:py-32 bg-white/50" ref={animationRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 opacity-0" data-animate="animate-fade-in">
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-display-lg text-foreground mb-4 sm:mb-6">
            Diseñado para{' '}
            <span className="text-primary">
              jóvenes
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Cada característica pensada para crear conexiones auténticas en el ambiente universitario
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const animation = index < 2 ? 'animate-slide-in-left' : 'animate-slide-in-right';
            
            return (
              <div
                key={index}
                className="feature-card group opacity-0"
                data-animate={animation}
                data-animate-delay={`${index * 200}ms`}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary/10 border-2 border-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto feature-icon transition-all duration-300 group-hover:shadow-[3px_3px_0px_0px_hsl(var(--primary)/0.3)]">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-foreground transition-colors duration-300" />
                </div>
                
                <h3 className="font-display font-bold text-lg sm:text-xl text-foreground mb-2 sm:mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* 
        🔒 Sección de estadísticas ocultada temporalmente..
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '500+', label: 'jóvenes activos' },
            { value: '50+', label: 'Universidades' },
            { value: '1,200+', label: 'Matches realizados' },
            { value: '98%', label: 'Seguridad verificada' }
          ].map((stat) => (
            <AnimatedStat 
              key={stat.label}
              value={stat.value} 
              label={stat.label} 
              className="text-primary"
            />
          ))}
        </div>
        */}
      </div>
    </section>
  );
}
