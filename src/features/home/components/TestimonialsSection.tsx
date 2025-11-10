import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAnimateOnScroll } from '@/hooks/useAnimateOnScroll';
import AnimatedStat from './AnimatedStat';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "Conocí personas afines a mi carrera y con intereses similares. La verificación universitaria me dio mucha confianza.",
      author: "María González",
      initials: "MG",
      program: "Estudiante de Ingeniería",
      university: "Universidad Nacional",
      rating: 5,
    },
    {
      quote: "Me encantó la interfaz y lo directo del proceso de match. Sin perder tiempo con perfiles falsos.",
      author: "Carlos Mendoza",
      initials: "CM",
      program: "Estudiante de Diseño",
      university: "Universidad del Arte",
      rating: 5,
    },
    {
      quote: "La verificación .edu me dio confianza para conectar. Saber que todos son jóvenes reales marca la diferencia.",
      author: "Ana Rodríguez",
      initials: "AR",
      program: "Estudiante de Medicina",
      university: "Universidad de Medicina",
      rating: 5,
    },
    {
      quote: "Encontré conexiones genuinas en mi propia universidad. La app entiende el ambiente estudiantil.",
      author: "Diego Vargas",
      initials: "DV",
      program: "Estudiante de Psicología",
      university: "Universidad Central",
      rating: 4,
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const animationRef = useAnimateOnScroll({ triggerOnce: true });

  return (
    <>
      {/* 
      <section className="py-20 lg:py-32 bg-gradient-to-br from-secondary/30 to-background" ref={animationRef}>
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 opacity-0" data-animate="animate-fade-in">
            <h2 className="font-display font-bold text-display-lg text-foreground mb-6">
              Lo que dicen nuestros{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                jóvenes
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Historias reales de conexiones auténticas en el campus
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative opacity-0" data-animate="animate-fade-in" data-animate-delay="200ms">
              <div className="card-floating p-8 lg:p-12 text-center min-h-[320px] flex flex-col justify-center transition-shadow duration-300 hover:shadow-2xl">
                <div className="flex justify-center items-center gap-4 mb-6">
                  <Avatar>
                    <AvatarFallback>{testimonials[currentIndex].initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center">
                    {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                    {Array.from({ length: 5 - testimonials[currentIndex].rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-muted-foreground/30" />
                    ))}
                  </div>
                </div>

                <blockquote className="text-xl lg:text-2xl text-foreground leading-relaxed mb-8 font-medium">
                  "{testimonials[currentIndex].quote}"
                </blockquote>

                <div className="space-y-2">
                  <div className="font-display font-bold text-lg text-foreground flex items-center justify-center gap-2">
                    {testimonials[currentIndex].author}
                    <Badge variant="secondary" className="border-transparent">
                      <Check className="w-3 h-3 mr-1.5" />
                      .edu Verificado
                    </Badge>
                  </div>
                  <div className="text-muted-foreground">
                    {testimonials[currentIndex].program}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonials[currentIndex].university}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 hover:bg-white/90"
                aria-label="Testimonio anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 hover:bg-white/90"
                aria-label="Siguiente testimonio"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex justify-center space-x-2 mt-8 opacity-0" data-animate="animate-fade-in" data-animate-delay="400ms">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary scale-125'
                      : 'bg-primary/30 hover:bg-primary/50'
                  }`}
                  aria-label={`Ver testimonio ${index + 1}`}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mt-16 text-center">
              <AnimatedStat value="4.8⭐" label="Calificación promedio" className="text-primary" />
              <AnimatedStat value="89%" label="Matches exitosos" className="text-accent" />
              <div className="col-span-2 lg:col-span-1">
                <AnimatedStat value="95%" label="Recomendarían cUPido" className="text-success" />
              </div>
            </div>
          </div>
        </div>
      </section>
      */}
    </>
  );
}
