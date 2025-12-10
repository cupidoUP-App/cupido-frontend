// WelcomeProfileModal.tsx - Modal de bienvenida para nuevos usuarios
import React from "react";

interface WelcomeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeProfileModal: React.FC<WelcomeProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-md bg-gradient-to-br from-rose-50 to-rose-100 rounded-3xl shadow-2xl p-8 transform animate-in fade-in zoom-in duration-300 relative overflow-hidden"
        style={{
          boxShadow: "0 25px 50px -12px rgba(233, 57, 35, 0.25)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-200/40 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-amber-200/40 rounded-full blur-2xl" />

        {/* Cupid arrow icon */}
        <div className="flex justify-center mb-6 relative">
          <div className="w-20 h-20 bg-gradient-to-br from-[#E93923] to-rose-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 font-['Poppins'] mb-4">
          ¡Bienvenido a{" "}
          <span className="text-[#E93923]">CUPIDO</span>! 💘
        </h2>

        {/* Message */}
        <p className="text-center text-gray-700 font-['Poppins'] text-base leading-relaxed mb-8">
          Para que cupido tenga más puntería al flecharte con alguien,{" "}
          <span className="font-semibold text-[#E93923]">
            edita tu perfil y completa todos los campos
          </span>
          !
        </p>

        {/* Decorative arrow */}
        <div className="flex justify-center mb-6">
          <svg
            className="w-16 h-10 text-rose-400 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14m-7 7l7-7-7-7"
            />
          </svg>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-[#E93923] to-rose-500 hover:from-[#d1321f] hover:to-rose-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-['Poppins']"
        >
          ¡Entendido! 
        </button>

        {/* Subtle hint */}
        <p className="text-center text-gray-500 text-xs mt-4 font-['Poppins']">
          Un perfil completo aumenta tus posibilidades de encontrar el amor ❤️
        </p>
      </div>
    </div>
  );
};

export default WelcomeProfileModal;
