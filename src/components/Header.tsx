import { useState } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoCupido from '@/assets/logo-cupido.png';

interface HeaderProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export default function Header({ onLoginClick, onSignupClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', href: '#home' },
    { label: 'Cómo funciona', href: '#how' },
    { label: 'Seguridad', href: '#safety' },
    { label: 'Preguntas', href: '#faq' },
    { label: 'Contacto', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-white/20 h-18">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={logoCupido} alt="cUPido" className="h-10 w-auto" />
            <span className="font-display font-bold text-xl text-foreground hidden sm:block">
              cUPido
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                data-action="scroll->navigation#scrollTo"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onLoginClick}
              className="text-foreground hover:text-primary"
              data-action="click->auth#openLogin"
            >
              Ingresar
            </Button>
            <Button
              onClick={onSignupClick}
              className="btn-hero"
              data-action="click->auth#openSignup"
            >
              Crear cuenta
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/20 py-4 animate-slide-up">
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
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
                <Button
                  variant="ghost"
                  onClick={() => {
                    onLoginClick();
                    setIsMenuOpen(false);
                  }}
                  className="justify-start text-foreground hover:text-primary"
                >
                  Ingresar
                </Button>
                <Button
                  onClick={() => {
                    onSignupClick();
                    setIsMenuOpen(false);
                  }}
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