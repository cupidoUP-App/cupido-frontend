import { useState, useEffect, useRef } from 'react';

// Easing function for a more natural animation
const easeOutExpo = (t: number) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

/**
 * @function useCountUp
 * @description Animación de conteo progresivo desde 0 hasta un valor final.
 * Se activa cuando el elemento entra en el viewport (IntersectionObserver al 50%).
 * Usa una función de easing "exponential out" para una animación más natural.
 * @param {number} end - Valor numérico final al que se debe llegar.
 * @param {number} [duration=2000] - Duración de la animación en milisegundos.
 * @returns {{ count: number, ref: React.RefObject<HTMLDivElement> }} El valor actual animado y la ref para adjuntar al elemento.
 */
export function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime: number | null = null;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const t = Math.min(progress / duration, 1);
            const easedT = easeOutExpo(t);
            
            const currentCount = Math.floor(easedT * end);
            setCount(currentCount);

            if (progress < duration) {
              animationFrameId.current = requestAnimationFrame(animate);
            } else {
              setCount(end); // Ensure it ends on the exact number
            }
          };

          animationFrameId.current = requestAnimationFrame(animate);
          observer.unobserve(node);
        }
      },
      { threshold: 0.5 } // Start animation when 50% of the element is visible
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [end, duration]);

  return { count, ref };
}
