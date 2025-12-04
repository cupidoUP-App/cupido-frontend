import { useState } from 'react';
import { Heart } from 'lucide-react';
//import { useAppStore } from '@store/appStore';
import TyC from '@modals/TyC';
import logofemlight from '@/assets/logofemlight.webp';
//import logomasclight from '@/assets/logomasclight.webp';

export default function Footer() {
  //const { theme } = useAppStore();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleLegalLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href?: string) => {
    // Si es un enlace legal (términos, privacidad, cookies), abrir el modal
    if (href && (href.includes('#terms') || href.includes('#privacy') || href.includes('#cookies'))) {
      e.preventDefault();
      setIsTermsModalOpen(true);
    }
  };

  const footerSections = [
    {
      title: 'cUPido',
      links: [
        { label: 'Acerca de', href: '/about' },
        { label: 'Equipo', href: '/team' },
        { label: 'Blog', target: '_blank', href: 'http://instagram.com/cupidocol' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Términos', href: '#terms' },
        { label: 'Privacidad', target: '_blank', href: 'https://drive.google.com/file/d/1HJxuJaxnaDsad_JhiaZdMC6oUl_vgfwD/view?usp=drive_link' },
        { label: 'Disclaimer', target: '_blank', href: 'https://drive.google.com/file/d/1mYLWA-KEx1WMhFpsEw2T740d8plZhQEG/view?usp=sharing' }
      ]
    },
    {
      title: 'Soporte',
      links: [
        { label: 'Ayuda', href: '#faq' },
        { label: 'Contacto', target: '_blank', href: 'https://mail.google.com/mail/u/0/?view=cm&fs=1&to=admin@cupidocol.com' },
        { label: 'Reportar (Futuro)', disabled: true }
      ]
    }
  ];

  const logo = logofemlight;

  return (
    <>
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
                        onClick={(e) => handleLegalLinkClick(e, link.href)}
                        className={`text-background/80 hover:text-background transition-colors duration-200 ${link.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        {...(link.disabled && { 'aria-disabled': 'true' })}
                        {...(link.target && { target: link.target, rel: 'noopener noreferrer' })}
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
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de Términos y Condiciones */}
      <TyC
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </>
  );
}