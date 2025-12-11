import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface AnnouncementBannerProps {
  className?: string;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ className = '' }) => {
  return (
    <div 
      className={`w-full bg-gradient-to-r from-red-600 via-pink-600 to-red-600 py-3 px-4 shadow-lg ${className}`}
      style={{
        animation: 'pulse 2s ease-in-out infinite',
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
        <AlertTriangle className="w-5 h-5 text-white flex-shrink-0 animate-bounce" />
        <p className="text-white text-center text-sm md:text-base font-medium">
          <span className="font-bold">⚠️ Cupido hará el cierre de la aplicación el día de hoy (12 de diciembre) a las 5 de la tarde. </span>
          Gasta tus últimas flechas, apunta los números con quien te flechaste y que el amor surja 💘
        </p>
        <AlertTriangle className="w-5 h-5 text-white flex-shrink-0 animate-bounce" />
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementBanner;
