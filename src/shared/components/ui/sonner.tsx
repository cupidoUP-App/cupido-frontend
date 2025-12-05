import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Componente Toaster (Sonner) con estilos mejorados para alta visibilidad.
 * - Bordes pronunciados (2px) para efecto "soft brutalism"
 * - Sombras offset para profundidad visual
 * - Colores con alto contraste respecto al fondo de la app
 * - Responsivo: se adapta a pantallas pequeñas
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      expand={false}
      richColors
      closeButton
      duration={5000}
      gap={12}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-2 group-[.toaster]:border-gray-800/20 group-[.toaster]:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] group-[.toaster]:rounded-xl group-[.toaster]:min-w-[280px] group-[.toaster]:max-w-[90vw] sm:group-[.toaster]:max-w-[380px]",
          description: "group-[.toast]:text-gray-600 group-[.toast]:text-sm",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:border-2 group-[.toast]:border-primary/80",
          cancelButton: "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:border group-[.toast]:border-gray-300",
          success: "group-[.toaster]:bg-emerald-600 group-[.toaster]:text-white group-[.toaster]:border-2 group-[.toaster]:border-emerald-700/50 group-[.toaster]:shadow-[3px_3px_0px_0px_rgba(5,150,105,0.3)]",
          error: "group-[.toaster]:bg-red-600 group-[.toaster]:text-white group-[.toaster]:border-2 group-[.toaster]:border-red-700/50 group-[.toaster]:shadow-[3px_3px_0px_0px_rgba(220,38,38,0.3)]",
          warning: "group-[.toaster]:bg-amber-500 group-[.toaster]:text-white group-[.toaster]:border-2 group-[.toaster]:border-amber-600/50 group-[.toaster]:shadow-[3px_3px_0px_0px_rgba(245,158,11,0.3)]",
          info: "group-[.toaster]:bg-blue-600 group-[.toaster]:text-white group-[.toaster]:border-2 group-[.toaster]:border-blue-700/50 group-[.toaster]:shadow-[3px_3px_0px_0px_rgba(37,99,235,0.3)]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
