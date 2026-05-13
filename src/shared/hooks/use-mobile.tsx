import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * @function useIsMobile
 * @description Detecta si la ventana actual corresponde a un dispositivo móvil según un breakpoint de 768px.
 * Escucha cambios en el viewport y actualiza el estado en consecuencia.
 * @returns {boolean} `true` si el ancho de la ventana es menor a 768px, `false` en caso contrario.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
