import React from "react";
import { motion } from "framer-motion";

const EmptyMatchesState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="mb-6 relative"
      >
        <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-white/40">
          <span className="text-6xl">🏹</span>
        </div>
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-2 -right-2 text-4xl"
        >
          💘
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-md font-['Poppins']"
      >
        ¡Ya agotaste todas tus flechas!
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white/90 text-lg font-medium leading-relaxed drop-shadow-sm"
      >
        Vuelve pronto para obtener mejores y más oportunidades.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <div className="h-1 w-24 bg-white/30 rounded-full mx-auto" />
      </motion.div>
    </div>
  );
};

export default EmptyMatchesState;
