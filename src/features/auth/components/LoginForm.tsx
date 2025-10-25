import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/appStore';




const eduEmailSchema = z.string().email({ message: 'Correo inválido' }).refine(
  (email) => /^[^\s@]+@unipamplona\.edu\.co$/i.test(email),
  { message: 'Debe ser un correo institucional @unipamplona.edu.co' }
);


const loginSchema = z.object({
  email: eduEmailSchema,
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;


const LoginForm = () => {
  const { closeModals, openRecovery, 
    openSignup, openRecaptcha, setPendingLoginData } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log('Login attempt:', data);
    setPendingLoginData(data);
    openRecaptcha();
  };

  return (
    <div className="relative bg-[#FCE3DC] rounded-3xl shadow-lg p-10 w-[400px] font-[Poppins]">
      <div className="flex mb-2">
        <button
            onClick={closeModals}
            className="absolute top-5 right-5 text-gray-600 hover:text-gray-800"
          >
            <X />
        </button>
      </div>

      {/* Logo y título */}
      <div className="flex flex-col items-center mb-2">
        <img
          src="src/assets/logo-login.webp"
          alt="cUPido logo"
          className="w-21 h-20 mb-2"
        />
        <h2 className="text-xl font-Poppins">
          Bienvenido a <span className="text-red-500 ml-1">CUPIDO</span>
        </h2>
        <h1 className="text-2xl font-Poppins text-gray-900">Iniciar Sesion</h1>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Correo */}
        <div className="space-y-1">
          <h3 className="text-base font-medium">Correo electrónico</h3>
          <Input
            type="email"
            placeholder="Ingresa tu correo institucional"
            {...register('email')}
            className="w-full h-12 rounded-lg border border-gray-200 bg-white"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Contraseña */}
        <div className="space-y-1">
          <h3 className="text-base font-medium">Contraseña</h3>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña"
              {...register('password')}
              className="w-full h-12 rounded-lg border border-gray-200 pr-10 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Recuperación */}
        <div className="text-right">
          <button
            type="button"
            onClick={openRecovery}
            className="text-red-500 text-sm"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Botón Iniciar Sesión */}
        <button
          type="submit"
          className="w-full bg-[#E84332] hover:bg-[#d63c2d] text-white font-medium py-3 rounded-xl shadow-md transition"
        >
          Iniciar Sesión
        </button>
      </form>

      {/* Registro */}
      <div className="text-center text-sm mt-6">
        ¿No tienes cuenta?{' '}
        <button
          onClick={openSignup}
          className="text-red-500 hover:text-accent font-Poppins"
        >
          Regístrate
        </button>
      </div>

    </div>
  );
};

export default LoginForm;

// --- End of Sub-components ---