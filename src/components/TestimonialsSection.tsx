import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnimateOnScroll } from '@/hooks/useAnimateOnScroll';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "Conocí personas afines a mi carrera y con intereses similares. La verificación universitaria me dio mucha confianza.",
      author: "María González",
      program: "Estudiante de Ingeniería",
      university: "Universidad Nacional"
    },
    {
      quote: "Me encantó la interfaz y lo directo del proceso de match. Sin perder tiempo con perfiles falsos.",
      author: "Carlos Mendoza",
      program: "Estudiante de Diseño",
      university: "Universidad del Arte"
    },
    {
      quote: "La verificación .edu me dio confianza para conectar. Saber que todos son estudiantes reales marca la diferencia.",
      author: "Ana Rodríguez",
      program: "Estudiante de Medicina",
      university: "Universidad de Medicina"
    },
    {
      quote: "Encontré conexiones genuinas en mi propia universidad. La app entiende el ambiente estudiantil.",
      author: "Diego Vargas",
      program: "Estudiante de Psicología",
      university: "Universidad Central"
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
    <section className="py-20 lg:py-32 bg-gradient-to-br from-secondary/30 to-background" ref={animationRef}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0" data-animate="animate-fade-in">
          <h2 className="font-display font-bold text-display-lg text-foreground mb-6">
            Lo que dicen nuestros{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              estudiantes
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Historias reales de conexiones auténticas en el campus
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative opacity-0" data-animate="animate-fade-in" data-animate-delay="200ms">
            {/* Main testimonial */}
            <div className="card-floating p-8 lg:p-12 text-center min-h-[300px] flex flex-col justify-center transition-shadow duration-300 hover:shadow-2xl">
              <Quote className="w-12 h-12 text-primary/30 mx-auto mb-6" />
              
              <blockquote className="text-xl lg:text-2xl text-foreground leading-relaxed mb-8 font-medium">
                "{testimonials[currentIndex].quote}"
              </blockquote>
              
              <div className="space-y-2">
                <div className="font-display font-bold text-lg text-foreground">
                  {testimonials[currentIndex].author}
                </div>
                <div className="text-muted-foreground">
                  {testimonials[currentIndex].program}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonials[currentIndex].university}
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
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

          {/* Indicators */}
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

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mt-16 text-center">
            <div className="opacity-0" data-animate="animate-slide-up" data-animate-delay="500ms">
              <div className="font-display font-bold text-3xl text-primary mb-2">4.8⭐</div>
              <div className="text-sm text-muted-foreground">Calificación promedio</div>
            </div>
            <div className="opacity-0" data-animate="animate-slide-up" data-animate-delay="600ms">
              <div className="font-display font-bold text-3xl text-accent mb-2">89%</div>
              <div className="text-sm text-muted-foreground">Matches exitosos</div>
            </div>
            <div className="col-span-2 lg:col-span-1 opacity-0" data-animate="animate-slide-up" data-animate-delay="700ms">
              <div className="font-display font-bold text-3xl text-success mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Recomendarían cUPido</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}