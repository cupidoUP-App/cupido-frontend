import { Heart, Zap, Shield, MapPin } from 'lucide-react';

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

  return (
    <section className="py-20 lg:py-32 bg-white/50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-display-lg text-foreground mb-6">
            Diseñado para{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              estudiantes
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cada característica pensada para crear conexiones auténticas en el ambiente universitario
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={index}
                className="feature-card group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto feature-icon transition-all duration-300`}>
                  <Icon className="w-8 h-8 text-foreground transition-colors duration-300" />
                </div>
                
                <h3 className="font-display font-bold text-xl text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '500+', label: 'Estudiantes activos' },
            { value: '50+', label: 'Universidades' },
            { value: '1,200+', label: 'Matches realizados' },
            { value: '98%', label: 'Seguridad verificada' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-display font-bold text-3xl lg:text-4xl text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}