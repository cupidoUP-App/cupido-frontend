import { ArrowLeft, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/appStore";


const eduEmailSchema = z.string().email({ message: 'Correo inválido' }).refine(
  (email) => /^[^\s@]+@unipamplona\.edu\.co$/i.test(email),
  { message: 'Debe ser un correo institucional @unipamplona.edu.co' }
);


const passwordRecoverySchema = z.object({
  email: eduEmailSchema,
});

type PasswordRecoveryValues = z.infer<typeof passwordRecoverySchema>;



const PasswordRecovery = () => {
  const { closeModals, openLogin } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordRecoveryValues>({
    resolver: zodResolver(passwordRecoverySchema),
    mode: "onChange",
  });

  const onSubmit = (data: PasswordRecoveryValues) => {
    console.log("Recuperar contraseña para:", data.email);
    alert("Se ha enviado el correo de recuperación");
    closeModals();
  };

  return (
    <div className="relative bg-[#FCE3DC] rounded-3xl shadow-lg p-10 w-[400px] font-[Poppins]">
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
        <div className="flex flex-col items-center mt-6">
          <img
            src="src/assets/logo-login.webp"
            alt="Logo Cupido"
            className="w-21 h-20 mb-2"
          />
        </div>

        {/* Título */}
        <h2 className="text-center text-2xl font-semibold mb-2 text-black">
          Recuperar Contraseña
        </h2>
        <p className="text-center text-sm text-gray-700 mb-8">
          Ingresa tu correo institucional para enviarte el enlace de recuperación.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <label className="text-base font-medium" htmlFor="email">
              Correo electrónico
            </label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@unipamplona.edu.co"
              {...register("email")}
              className="w-full h-12 rounded-lg border border-gray-200 bg-white"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Espaciado adicional para igualar altura con LoginForm */}
          <div className="space-y-20">
            <div></div>
            <div></div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#E84332] hover:bg-[#d63c2d] text-white font-medium py-3 rounded-xl shadow-md transition"
          >
            Enviar enlace de recuperación
          </button>
        </form>
    </div>
  );
};

export default PasswordRecovery;

