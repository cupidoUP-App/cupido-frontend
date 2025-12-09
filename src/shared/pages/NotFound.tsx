import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@ui/button";
import { HeartCrack, ArrowLeft } from "lucide-react";
import Logo from "@assets/Logo.png";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();


  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#F5F5F5] to-[#E7D8D8] p-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-[#E93923]"
        >
          <img src={Logo} alt="Logo" />
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-4 -right-8 text-pink-300"
          animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <span className="text-6xl font-bold opacity-20">?</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-8 space-y-4 max-w-md"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          ¡Cupido perdió el rumbo!
        </h1>
        <p className="text-lg text-gray-600 font-light">
          Parece que la página que buscas no existe o ha sido movida.
          No te preocupes, el amor está en otro lado.
        </p>

        <div className="pt-6">
          <Button
            onClick={() => navigate("/")}
            size="lg"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Volver al Inicio
          </Button>
        </div>
      </motion.div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>
    </div>
  );
};

export default NotFound;
