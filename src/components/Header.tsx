import { useState } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoCupido from '@/assets/logo-cupido.png';
import ThemeToggle from '@/components/ThemeToggle';

interface HeaderProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  theme: string;
  onThemeChange: (theme: string) => void;
}

export default function Header({ onLoginClick, onSignupClick, theme, onThemeChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', href: '#home' },
    { label: 'Cómo funciona', href: '#how' },
    { label: 'Seguridad', href: '#safety' },
    { label: 'Preguntas', href: '#faq' },
    { label: 'Contacto', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 h-[50px]">
      <div className="container mx-auto px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-2">
            <span className="font-display font-bold text-xl text-foreground hidden sm:block">
              cUPido
            </span>
          </div>
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
            <Button
              variant="outline"
              size="sm"
              onClick={onLoginClick}
              className="text-foreground"
            >
              Ingresar
            </Button>
            <Button
              onClick={onSignupClick}
              size="sm"
              className="btn-hero px-6"
            >
              Crear cuenta
            </Button>
          </div>
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="absolute top-[50px] left-0 right-0 z-30 bg-white shadow-lg lg:hidden border-t border-gray-200 p-4 animate-slide-up">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-center pb-2">
                  <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
                </div>
                <Button
                  variant="outline"
                  onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                  className="justify-start text-foreground"
                >
                  Ingresar
                </Button>
                <Button
                  onClick={() => { onSignupClick(); setIsMenuOpen(false); }}
                  className="btn-hero justify-start"
                >
                  Crear cuenta
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}