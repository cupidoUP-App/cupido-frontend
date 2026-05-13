import { useEffect, useRef } from 'react';

interface AnimateOnScrollOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

/**
 * @function useAnimateOnScroll
 * @description Activa animaciones CSS en elementos hijo cuando el contenedor entra en el viewport.
 * Lee atributos `data-animate` (nombre de la animación) y `data-animate-delay` (retraso) de los elementos hijo.
 * @param {AnimateOnScrollOptions} [options] - Opciones de configuración del IntersectionObserver.
 * @param {string} [options.rootMargin='0px'] - Margen adicional para el viewport.
 * @param {number} [options.threshold=0.1] - Porcentaje de visibilidad para disparar la animación.
 * @param {boolean} [options.triggerOnce=false] - Si `true`, la animación se ejecuta solo una vez.
 * @returns {React.RefObject<HTMLDivElement>} Ref que debe asignarse al contenedor cuyos hijos se animarán.
 */
export function useAnimateOnScroll(options?: AnimateOnScrollOptions) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('[data-animate]');
            elements.forEach((el, index) => {
              const delay = el.getAttribute('data-animate-delay') || `${index * 100}ms`;
              const animation = el.getAttribute('data-animate') || 'animate-fade-in';
              
              (el as HTMLElement).style.animationDelay = delay;
              el.classList.add(animation);
              el.classList.remove('opacity-0');
            });

            if (options?.triggerOnce) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: options?.rootMargin || '0px',
        threshold: options?.threshold || 0.1,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return ref;
}
