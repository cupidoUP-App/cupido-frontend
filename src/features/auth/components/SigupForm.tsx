import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, X, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import Recaptcha from './Recaptcha';


const eduEmailSchema = z
  .string()
  .email({ message: 'Correo inválido' })
  .refine((email) => /^[^\s@]+@unipamplona\.edu\.co$/i.test(email), {
    message: 'Debe ser un correo institucional @unipamplona.edu.co',
  });

// Regex de contraseña
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

// Schema de signup
const signupSchema = z
  .object({
    email: eduEmailSchema,
    password: z
      .string()
      .min(8, { message: 'Mínimo 8 caracteres' })
      .regex(/[A-Z]/, { message: 'Debe contener al menos una letra mayúscula' })
      .regex(/\d/, { message: 'Debe contener al menos un número' })
      .regex(/[^A-Za-z0-9]/, { message: 'Debe contener al menos un símbolo especial' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const { closeModals, openLogin, openRecaptcha, setPendingFormData } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

    const onSubmit = async (data: SignupFormValues) => {
    console.log('Signup attempt:', data);
    setPendingFormData(data);
    openRecaptcha();
  };

  return (
    <div className="relative bg-[#FCE3DC] rounded-3xl shadow-lg p-10 w-[400px] font-[Poppins]">
      {/* Botón cerrar */}
      <button
        onClick={closeModals}
        className="absolute top-5 right-5 text-gray-600 hover:text-gray-800"
      >
        <X />
      </button>

      {/* Logo y encabezado */}
      <div className="text-center mb-8">
        <img
          src="src/assets/logo-login.webp"
          alt="Logo Cupido"
          className="mx-auto w-21 h-20 mb-3"
        />
        <h2 className="text-gray-800 font-Poppins ">Bienvenido a <span className="text-[#E93C25] font-Poppins">CUPIDO</span></h2>
        <h1 className="text-2xl font-Poppins text-gray-900">Registrarse</h1>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Correo */}
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            Correo Electrónico
            <AlertCircle className="w-3 h-3 text-gray-400" />
          </label>
          <div className="relative mt-2">
            <Input
              type="email"
              placeholder="Ingresa tu correo institucional"
              {...register('email')}
              className={`bg-white h-12 ${errors.email ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label className="text-sm font-medium text-gray-700">Contraseña</label>
          <div className="relative mt-2">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              {...register('password')}
              className={`bg-white h-12 w-full rounded-md px-4 pr-10 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#E93C25]`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label className="text-sm font-medium text-gray-700">Confirmar contraseña</label>
          <div className="relative mt-2">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repite tu Contraseña"
              {...register('confirmPassword')}
              className={`bg-white h-12 w-full rounded-md px-4 pr-10 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#E93C25]`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>


        {/* Botón principal */}
        <Button
          type="submit"
          className="w-full bg-[#E93C25] hover:bg-[#cc341f] text-white rounded-lg py-3 text-base mt-4"
        >
          Continuar
        </Button>
      </form>

      {/* Texto inferior */}
      <div className="text-center text-sm mt-6">
        ¿Tienes una cuenta?{' '}
        <button
          onClick={openLogin}
          className="text-red-500 hover:text-accent font-Poppins"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default SignupForm;