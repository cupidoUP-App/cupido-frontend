import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Componente Toaster (Sonner) con estilos mejorados para alta visibilidad.
 * - Colores sólidos que contrastan con el fondo de la app
 * - Responsivo: se adapta a pantallas pequeñas
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      expand={true}
      richColors
      closeButton
      duration={5000}
      gap={8}
      toastOptions={{
        style: {
          background: "white",
          color: "#1f2937",
          border: "2px solid rgba(31, 41, 55, 0.15)",
          borderRadius: "12px",
          boxShadow: "3px 3px 0px 0px rgba(0,0,0,0.08)",
          minWidth: "280px",
          maxWidth: "90vw",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
