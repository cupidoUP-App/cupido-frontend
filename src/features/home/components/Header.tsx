import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@ui/button';
//import ThemeToggle from './ThemeToggle';
import { useAppStore } from '@store/appStore';
import logofemdark from '@assets/logofemdark.webp';
//import logomascdark from '@/assets/logomascdark.webp';

const useScroll = (threshold = 10) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
};

interface HeaderProps {
  //onThemeChange: (theme: string) => void;
  onOpenSignup?: () => void;
  openLogin?: () => void;
}

export function Header({ /*onThemeChange*/ }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //theme
  const { openSigUp, openLogin, isAuthenticated, user, logout } = useAppStore();
  const scrolled = useScroll();

  // Función para scroll suave al inicio de la página
  const scrollToHeroSection = () => {
    const HeroSection = document.querySelector('#hero-section');
    if (HeroSection) {
      HeroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Función para scroll suave al footer
  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Inicio', onClick: scrollToHeroSection },
    { label: 'Cómo funciona', href: '#how' },
    { label: 'Seguridad', href: '#safety' },
    { label: 'Preguntas', href: '#faq' },
    { label: 'Contacto', onClick: scrollToFooter },
  ];

  const logo = logofemdark;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 border-b-2 h-[50px] transition-all duration-300 ease-in-out ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-white'
          }`}
      >
        <div className="container mx-auto px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={scrollToHeroSection}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && scrollToHeroSection()}
              aria-label="Ir al inicio"
            >
              <img src={logo} alt="cUPido logo" className="h-8 w-auto" />
              <span className="font-display font-bold text-xl text-foreground hidden sm:block">
                cUPido
              </span>
            </div>
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.onClick ? '#' : item.href}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="hidden lg:flex items-center space-x-4">
              {/* <ThemeToggle theme={theme} onThemeChange={onThemeChange} /> */}
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {user?.nombres || user?.email}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="text-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openLogin}
                    className="text-foreground"
                  >
                    Ingresar
                  </Button>
                  <Button
                    onClick={openSigUp}
                    size="sm"
                    className="btn-hero px-6"
                  >
                    Crear cuenta
                  </Button>
                </>
              )}
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
                    href={item.onClick ? '#' : item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium py-2 cursor-pointer"
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-center pb-2">
                    {/* <ThemeToggle theme={theme} onThemeChange={onThemeChange} /> */}
                  </div>
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-2 text-foreground px-3 py-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {user?.nombres || user?.email}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => { logout(); setIsMenuOpen(false); }}
                        className="justify-start text-foreground"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Salir
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => { openLogin(); setIsMenuOpen(false); }}
                        className="justify-start text-foreground"
                      >
                        Ingresar
                      </Button>
                      <Button
                        onClick={() => { openSigUp(); setIsMenuOpen(false); }}
                        className="btn-hero justify-start"
                      >
                        Crear cuenta
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}