import * as React from "react";

import { cn } from "@lib/utils";

/**
 * Componente Input mejorado con transiciones suaves de focus.
 * Incluye animación sutil del borde y sombra para feedback visual premium.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-base",
          // Transiciones suaves para UX premium
          "transition-all duration-200 ease-out",
          // Ring y offset para accesibilidad
          "ring-offset-background",
          // File input styles
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Placeholder
          "placeholder:text-muted-foreground",
          // Focus state con glow sutil
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "focus-visible:border-primary/50 focus-visible:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Responsive text
          "md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
