import { useEffect, useRef } from 'react';

interface AnimateOnScrollOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

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
