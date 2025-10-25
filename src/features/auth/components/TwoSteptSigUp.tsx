import { ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/appStore";

const TwoStepVerification = () => {
  const { closeModals, openLogin } = useAppStore();
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      // Pasar automáticamente al siguiente input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    console.log("Código ingresado:", fullCode);
    // Aquí puedes validar el código o llamar a tu API
    closeModals();
  };
  
  const isCodeComplete = code.every((digit) => digit !== "");


  return (
  <div className="flex items-center justify-center min-h-screen bg-[#FFF0EC]}">
    <div
      className="relative bg-[#FCE3DC] rounded-3xl shadow-lg p-10 w-[400px] font-[Poppins]">


      {/* Botones */}
        <div className="flex justify-between items-center mb-2">
        <button
          onClick={openLogin}
          className="p-2 rounded-full hover:bg-white/30 transition"
          aria-label="Volver al login"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={closeModals}
          className="p-2 rounded-full hover:bg-white/10 transition"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <img
          src="src/assets/logo-login.webp"
          alt="Logo Cupido singUp"
          className="w-21 h-20 mb-2"
        />
      </div>

      {/* Título */}
      <h2 className="text-center text-2xl font-semibold text-black mb-2">
        Verificación de correo
      </h2>
      <p className="text-center text-sm text-gray-700 mb-8">
        Ingresa el código que enviamos a tu correo
      </p>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Código de verificación */}
        <div className="flex justify-center gap-2 mb-4">
          {code.map((digit, i) => (
            <Input
              key={i}
              id={`code-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-12 h-14 text-center text-lg bg-white border border-gray-300 rounded-lg 
                 focus:border-[#E84332] focus:ring-2 focus:ring-[#E84332]/50 transition-all"
            />
          ))}
        </div>

        {/* Reenviar */}
        <p className="text-center text-sm text-gray-700">
          ¿No recibiste el código?{" "}
          <button
            type="button"
            className="text-red-500 font-medium hover:underline"
            onClick={() => console.log("Reenviar código")}
          >
            Reenviar
          </button>
        </p>

        {/* Botón de verificación */}
        <button
          type="submit"
          disabled={!isCodeComplete}
          className="w-full bg-[#E84332] hover:bg-[#d63c2d] text-white font-medium py-3 rounded-xl shadow-md transition"
        >
          Verificar Código
        </button>
      </form>

      <img
        alt="Fondo"
        src="src\assets\Imagen4-singup.webp"
        className="absolute bottom-0 left-0 w-[608px] h-[405px] object- z-0"
            
        />

        <img
        alt="Fondo"
        src="src\assets\Imagen5-singup.webp"
        className="absolute bottom-0 rigt-500 w-[100px] h-[100px] object-cover z-5"
            
        />
        
    </div>
  </div>
);
}
export default TwoStepVerification;
