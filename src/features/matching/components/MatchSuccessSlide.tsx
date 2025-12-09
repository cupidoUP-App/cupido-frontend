import React from "react";
import { motion } from "framer-motion";
import CupidWhite from "@assets/cupid-white.png"; // Asumiendo que existe, o usaré un emoji/icono
import { useNavigate } from "react-router-dom";

interface MatchSuccessSlideProps {
  matchedUser: {
    name: string;
    photoUrl?: string;
    id: number | string;
  };
  currentUserPhotoUrl?: string; // Opcional, si la tenemos
  onClose: () => void;
}

const MatchSuccessSlide: React.FC<MatchSuccessSlideProps> = ({
  matchedUser,
  currentUserPhotoUrl,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleGoToChat = () => {
    // Navegar al chat con el usuario
    navigate(`/chat`); // Ajustar ruta según routing real
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] h-[100dvh] w-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white p-6 animate-fadeIn overflow-y-auto">
      {/* Fondo animado o partículas podrían ir aquí */}
      
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12 }}
        className="mb-8"
      >
        <span className="text-8xl">💘</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-5xl font-bold text-center mb-4 font-['Poppins'] drop-shadow-lg"
      >
        ¡Es un Match!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg md:text-xl text-center mb-12 max-w-md font-medium text-white/90"
      >
        ¡Cupido ha hecho de las suyas! <br />
        Tú y <span className="font-bold text-yellow-200">{matchedUser.name}</span> se gustan.
      </motion.p>

      {/* Fotos de los usuarios */}
      <div className="flex items-center justify-center gap-4 mb-12 relative">
        {/* Foto Usuario Actual (Placeholder si no hay) */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-200"
        >
           {currentUserPhotoUrl ? (
             <img src={currentUserPhotoUrl} alt="Tú" className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-xs">Tú</div>
           )}
        </motion.div>

        {/* Corazón central */}
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ delay: 0.9, repeat: Infinity, duration: 1.5 }}
            className="absolute z-10 bg-white text-pink-500 rounded-full p-2 shadow-lg"
        >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </motion.div>

        {/* Foto Match */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-200"
        >
            {matchedUser.photoUrl ? (
                <img src={matchedUser.photoUrl} alt={matchedUser.name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-pink-200 text-pink-600 font-bold text-2xl">
                    {matchedUser.name.charAt(0)}
                </div>
            )}
        </motion.div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={handleGoToChat}
          className="w-full bg-white text-pink-600 font-bold py-4 rounded-full shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          Enviar mensaje
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          onClick={onClose}
          className="w-full bg-transparent border-2 border-white text-white font-semibold py-3 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          Seguir jugando
        </motion.button>
      </div>
    </div>
  );
};

export default MatchSuccessSlide;
