import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAnimateOnScroll } from '@/hooks/useAnimateOnScroll';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "¿Quién puede usar cUPido?",
      answer: "cUPido está exclusivamente para jóvenes y personal académico con correo institucional verificado (.edu). Esto garantiza que todos los usuarios pertenezcan a la comunidad universitaria y crea un ambiente más seguro y confiable."
    },
    {
      question: "¿Cómo funciona el sistema de matches?",
      answer: "Si ambos usuarios deslizan 'me gusta', se crea un match y se habilita el chat instantáneo. Nuestro algoritmo considera afinidades académicas, intereses compartidos y preferencias establecidas en tu perfil para sugerir conexiones más relevantes."
    },
    {
      question: "¿Qué información se muestra en mi perfil?",
      answer: "Solo se muestra la información que eliges compartir: nombre, carrera, año de estudio, intereses y fotos. Tienes control total sobre tu privacidad y puedes ajustar la visibilidad de cada elemento en cualquier momento."
    },
    {
      question: "¿Es seguro usar cUPido?",
      answer: "Sí. Implementamos verificación obligatoria por correo institucional, sistema de reportes y bloqueo, y controles de privacidad granulares. Además, proporcionamos recursos sobre seguridad en citas y moderamos activamente la plataforma."
    },
    {
      question: "¿Cómo verifican que soy estudiante?",
      answer: "Al registrarte, debes usar tu correo institucional oficial (.edu o dominio universitario verificado). Enviamos un código de verificación que confirma que el correo está activo y pertenece a una institución educativa reconocida."
    },
    {
      question: "¿Puedo bloquear o reportar usuarios?",
      answer: "Absolutamente. Cada perfil tiene opciones para bloquear o reportar comportamiento inapropiado. Los reportes son revisados por nuestro equipo y tomamos medidas rápidas para mantener un ambiente seguro y respetuoso."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const animationRef = useAnimateOnScroll({ triggerOnce: true });

  return (
    <section id="faq" className="py-20 lg:py-32 bg-white/50" ref={animationRef}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0" data-animate="animate-fade-in">
          <h2 className="font-display font-bold text-display-lg text-foreground mb-6">
            Preguntas{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              frecuentes
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Resolvemos las dudas más comunes sobre cUPido y su funcionamiento
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card-floating overflow-hidden opacity-0" data-animate="animate-slide-up" data-animate-delay={`${index * 150}ms`}>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-secondary/20 transition-colors duration-200"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="font-display font-semibold text-lg text-foreground pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div
                    id={`faq-answer-${index}`}
                    className="px-6 pb-6 animate-fade-in"
                  >
                    <p className="text-muted-foreground leading-relaxed max-w-prose">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact support */}
          <div className="text-center mt-12 opacity-0" data-animate="animate-fade-in" data-animate-delay="600ms">
            <p className="text-muted-foreground mb-4">
              ¿No encuentras la respuesta que buscas?
            </p>
            <button className="text-primary hover:text-accent transition-colors font-medium">
              Contáctanos para más ayuda
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}