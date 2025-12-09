import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface MatchSuccessSlideProps {
  matchedUser: {
    name: string;
    photoUrl?: string;
    id: number | string;
  };
  currentUserPhotoUrl?: string;
  onClose: () => void;
}

// Confetti particle component
const ConfettiParticle: React.FC<{ delay: number; left: string }> = ({ delay, left }) => (
  <motion.div
    initial={{ y: -20, opacity: 1, rotate: 0 }}
    animate={{ 
      y: "100vh", 
      opacity: 0, 
      rotate: 360,
    }}
    transition={{ 
      duration: 3 + Math.random() * 2, 
      delay,
      ease: "linear",
      repeat: Infinity,
    }}
    className="absolute top-0 text-2xl pointer-events-none"
    style={{ left }}
  >
    {["💕", "❤️", "💖", "✨", "💘", "💗"][Math.floor(Math.random() * 6)]}
  </motion.div>
);

const MatchSuccessSlide: React.FC<MatchSuccessSlideProps> = ({
  matchedUser,
  currentUserPhotoUrl,
  onClose,
}) => {
  const navigate = useNavigate();
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Minimum display time of 3 seconds to prevent premature closing
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGoToChat = useCallback(() => {
    if (!canClose) return;
    navigate(`/chat`);
    onClose();
  }, [canClose, navigate, onClose]);

  const handleContinuePlaying = useCallback(() => {
    if (!canClose) return;
    onClose();
  }, [canClose, onClose]);

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 12 }, (_, i) => (
    <ConfettiParticle 
      key={i} 
      delay={i * 0.2} 
      left={`${5 + (i * 8)}%`} 
    />
  ));

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] h-[100dvh] w-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white p-4 sm:p-6 overflow-hidden"
      >
        {/* Confetti particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confettiParticles}
        </div>

        {/* Main content container - scrollable on very small screens */}
        <div className="relative z-10 flex flex-col items-center justify-center max-h-full overflow-y-auto py-4">
          {/* Animated heart emoji */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="mb-4 sm:mb-8"
          >
            <span className="text-6xl sm:text-7xl md:text-8xl">💘</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-2 sm:mb-4 font-['Poppins'] drop-shadow-lg"
          >
            ¡Es un Match!
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-center mb-6 sm:mb-10 md:mb-12 max-w-sm sm:max-w-md font-medium text-white/90 px-2"
          >
            ¡Cupido ha hecho de las suyas! <br />
            Tú y <span className="font-bold text-yellow-200">{matchedUser.name}</span> se gustan.
          </motion.p>

          {/* User photos */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-10 md:mb-12 relative">
            {/* Current user photo */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-3 sm:border-4 border-white shadow-2xl overflow-hidden bg-gray-200 flex-shrink-0"
            >
              {currentUserPhotoUrl ? (
                <img src={currentUserPhotoUrl} alt="Tú" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-xs">Tú</div>
              )}
            </motion.div>

            {/* Central heart */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: 0.9, repeat: Infinity, duration: 1.5 }}
              className="absolute z-10 bg-white text-pink-500 rounded-full p-1.5 sm:p-2 shadow-lg"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </motion.div>

            {/* Matched user photo */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-3 sm:border-4 border-white shadow-2xl overflow-hidden bg-gray-200 flex-shrink-0"
            >
              {matchedUser.photoUrl ? (
                <img src={matchedUser.photoUrl} alt={matchedUser.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-pink-200 text-pink-600 font-bold text-xl sm:text-2xl">
                  {matchedUser.name.charAt(0)}
                </div>
              )}
            </motion.div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-[280px] sm:max-w-xs px-2">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              onClick={handleGoToChat}
              disabled={!canClose}
              className={`w-full bg-white text-pink-600 font-bold py-3 sm:py-4 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
                canClose 
                  ? "hover:bg-gray-50 hover:scale-105 cursor-pointer" 
                  : "opacity-70 cursor-not-allowed"
              }`}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {canClose ? "Enviar mensaje" : `Espera ${countdown}s...`}
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              onClick={handleContinuePlaying}
              disabled={!canClose}
              className={`w-full bg-transparent border-2 border-white text-white font-semibold py-2.5 sm:py-3 rounded-full transition-all duration-200 text-sm sm:text-base ${
                canClose 
                  ? "hover:bg-white/10 cursor-pointer" 
                  : "opacity-70 cursor-not-allowed"
              }`}
            >
              {canClose ? "Seguir jugando" : "..."}
            </motion.button>
          </div>

          {/* Timer indicator */}
          {!canClose && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 sm:mt-6"
            >
              <div className="h-1 w-32 sm:w-40 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MatchSuccessSlide;
