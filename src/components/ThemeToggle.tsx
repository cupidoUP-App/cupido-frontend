import { useEffect, useState } from 'react';
import { Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'feminine' | 'masculine'>('feminine');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('cupido-theme') as 'feminine' | 'masculine' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'feminine' ? 'masculine' : 'feminine';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('cupido-theme', newTheme);
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className="relative h-10 w-20 rounded-full bg-muted/30 hover:bg-muted/50 transition-all duration-300"
      aria-label={`Cambiar a tema ${theme === 'feminine' ? 'masculino' : 'femenino'}`}
      title={theme === 'feminine' ? 'Tema femenino activo' : 'Tema masculino activo'}
    >
      <div className="flex items-center justify-between w-full px-2">
        <Heart 
          className={`w-4 h-4 transition-all duration-300 ${
            theme === 'feminine' ? 'text-primary scale-110 fill-current' : 'text-muted-foreground/50 scale-90'
          }`}
        />
        <Zap 
          className={`w-4 h-4 transition-all duration-300 ${
            theme === 'masculine' ? 'text-primary scale-110' : 'text-muted-foreground/50 scale-90'
          }`}
        />
      </div>
      <div 
        className={`absolute top-1 h-8 w-8 rounded-full bg-primary shadow-md transition-all duration-300 ${
          theme === 'feminine' ? 'left-1' : 'left-11'
        }`}
      />
    </Button>
  );
}
