import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      expand={false}
      richColors
      closeButton
      duration={5000}
      gap={8}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background/95 group-[.toaster]:backdrop-blur-sm group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:bg-green-600/95 group-[.toaster]:text-white group-[.toaster]:border-green-500/50",
          error: "group-[.toaster]:bg-red-600/95 group-[.toaster]:text-white group-[.toaster]:border-red-500/50",
          warning: "group-[.toaster]:bg-amber-500/95 group-[.toaster]:text-white group-[.toaster]:border-amber-500/50",
          info: "group-[.toaster]:bg-blue-600/95 group-[.toaster]:text-white group-[.toaster]:border-blue-500/50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
