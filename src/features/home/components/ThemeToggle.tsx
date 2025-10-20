import { Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  theme: string;
  onThemeChange: (theme: string) => void;
}

export default function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const toggleTheme = () => {
    // Use Spanish strings to be consistent
    const newTheme = theme === 'femenino' ? 'masculino' : 'femenino';
    onThemeChange(newTheme);
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className="relative h-10 w-20 rounded-full bg-muted/30 hover:bg-muted/50 transition-all duration-300"
      aria-label={`Cambiar a tema ${theme === 'femenino' ? 'masculino' : 'femenino'}`}
      title={theme === 'femenino' ? 'Tema femenino activo' : 'Tema masculino activo'}
    >
      <div className="flex items-center justify-between w-full px-2">
        <Heart 
          className={`w-4 h-4 transition-all duration-300 ${
            // Use Spanish string for comparison
            theme === 'femenino' ? 'text-primary scale-110 fill-current' : 'text-muted-foreground/50 scale-90'
          }`}
        />
        <Zap 
          className={`w-4 h-4 transition-all duration-300 ${
            // Use Spanish string for comparison
            theme === 'masculino' ? 'text-primary scale-110' : 'text-muted-foreground/50 scale-90'
          }`}
        />
      </div>
      <div 
        className={`absolute top-1 h-8 w-8 rounded-full bg-primary shadow-md transition-all duration-300 ${
          // Use Spanish string for comparison
          theme === 'femenino' ? 'left-1' : 'left-11'
        }`}
      />
    </Button>
  );
}
