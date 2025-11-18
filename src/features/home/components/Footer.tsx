import { Heart } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import logofemlight from '@/assets/logofemlight.webp';
import logomasclight from '@/assets/logomasclight.webp';

export default function Footer() {
  const { theme } = useAppStore();
  const footerSections = [
    {
      title: 'cUPido',
      links: [
        { label: 'Acerca de', href: '#about' },
        { label: 'Equipo', href: '#team' },
        { label: 'Blog (futuro)', href: '#blog', disabled: true }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Términos', href: '#terms' },
        { label: 'Privacidad', href: '#privacy' },
        { label: 'Cookies', href: '#cookies' }
      ]
    },
    {
      title: 'Soporte',
      links: [
        { label: 'Ayuda', href: '#help' },
        { label: 'Contacto', href: '#contact' },
        { label: 'Reportar', href: '#report' }
      ]
    }
  ];

  const logo = theme === 'femenino' ? logofemlight : logomasclight;

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand section */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img src={logo} alt="cUPido" className="h-8 w-auto" />
              <span className="font-display font-bold text-xl">cUPido</span>
            </div>
            <p className="text-background/80 mb-6 leading-relaxed">
              Conecta con estudiantes verificados en tu campus. 
              Matches auténticos para relaciones reales.
            </p>
            <div className="flex items-center space-x-2 text-sm text-background/60">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 text-accent fill-current" />
              <span>para jóvenes</span>
            </div>
          </div>

          {/* Links sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-display font-semibold text-lg mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className={`text-background/80 hover:text-background transition-colors duration-200 ${
                        link.disabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      {...(link.disabled && { 'aria-disabled': 'true' })}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-background/60 text-sm">
              © 2025 cUPido — Proyecto académico. Todos los derechos reservados.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-background/60">
              <span>Ingeniería de Software II</span>
              <span>•</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}