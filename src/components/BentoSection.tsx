import { Shield, Zap, Heart, Users, CheckCircle, Star } from 'lucide-react';
import { useAnimateOnScroll } from '@/hooks/useAnimateOnScroll';

export default function BentoSection() {
  const animationRef = useAnimateOnScroll({ triggerOnce: true });

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-background via-accent/5 to-background relative overflow-hidden" ref={animationRef}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 opacity-0" data-animate="animate-fade-in">
          <h2 className="font-display font-bold text-display-lg text-foreground mb-6">
            Todo lo que necesitas para{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              conectar
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Una experiencia completa diseñada para estudiantes universitarios
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Large feature - spans 2 columns */}
          <div className="md:col-span-2 glass-card p-8 rounded-3xl opacity-0 group hover:scale-[1.02] transition-all duration-500" data-animate="animate-fade-in" data-animate-delay="100ms">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl text-foreground mb-3">
                  Verificación Universitaria Real
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Solo estudiantes con correos .edu activos. Cero perfiles falsos, 100% conexiones auténticas en tu campus.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Email .edu', 'Verificación 2FA', 'ID Universitario'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Medium feature */}
          <div className="glass-card p-8 rounded-3xl opacity-0 group hover:scale-[1.02] transition-all duration-500" data-animate="animate-fade-in" data-animate-delay="200ms">
            <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground mb-3">
              Conexión Instantánea
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Match y chatea al instante. Sin límites artificiales ni esperas.
            </p>
          </div>

          {/* Stats card */}
          <div className="glass-card p-8 rounded-3xl opacity-0 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500" data-animate="animate-fade-in" data-animate-delay="300ms">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <Star className="w-12 h-12 text-primary mb-4 group-hover:rotate-12 transition-transform" />
              <div className="font-display font-bold text-4xl text-primary mb-2">98%</div>
              <p className="text-muted-foreground text-sm">
                Satisfacción de usuarios verificados
              </p>
            </div>
          </div>

          {/* Features list */}
          <div className="md:col-span-2 glass-card p-8 rounded-3xl opacity-0 group hover:scale-[1.02] transition-all duration-500" data-animate="animate-fade-in" data-animate-delay="400ms">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-success/20 to-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-8 h-8 text-success group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-2xl text-foreground mb-4">
                  Características Premium
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Filtros por carrera',
                    'Preferencias de match',
                    'Chat en tiempo real',
                    'Sistema de reportes',
                    'Modo privado',
                    'Notificaciones push'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Community card */}
          <div className="glass-card p-8 rounded-3xl opacity-0 flex flex-col justify-between group hover:scale-[1.02] transition-all duration-500" data-animate="animate-fade-in" data-animate-delay="500ms">
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">
                Comunidad Activa
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Únete a estudiantes de más de 50 universidades
              </p>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="font-display font-bold text-3xl text-primary">500+</div>
              <p className="text-sm text-muted-foreground">Usuarios activos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
