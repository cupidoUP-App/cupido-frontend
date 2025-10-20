import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

// --- Validation Schemas ---
const eduEmailSchema = z.string().email({ message: 'Correo inválido' }).refine(
  (email) => /^[^\s@]+@[^\s@]+\.(edu|edu\.[a-z]{2})$/i.test(email),
  { message: 'Debe ser un correo .edu' }
);

const loginSchema = z.object({
  email: eduEmailSchema,
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
});

const signupSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  email: eduEmailSchema,
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: "Las contraseñas no coinciden",
  path: ["confirm"], // path of error
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

// --- Sub-components for Login and Signup Forms ---

const LoginForm = () => {
  const { closeModals } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // Real-time validation
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log('Login attempt:', data);
    closeModals();
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 id="login-title" className="font-display font-bold text-2xl text-foreground mb-2">Ingresar</h2>
        <p className="text-muted-foreground">Bienvenido de vuelta a cUPido</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="login-email">Correo institucional</Label>
          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="login-email" type="email" placeholder="usuario@unipamplona.edu.co" {...register('email')} className={cn('pl-10 h-12', errors.email && 'border-destructive')} />
          </div>
          {errors.email && <p className="flex items-center space-x-2 mt-2 text-destructive text-sm"><AlertCircle className="w-4 h-4" /><span>{errors.email.message}</span></p>}
        </div>
        <div>
          <Label htmlFor="login-password">Contraseña</Label>
          <div className="relative mt-2">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="login-password" type={showPassword ? 'text' : 'password'} placeholder="Tu contraseña" {...register('password')} className={cn('pl-10 pr-10 h-12', errors.password && 'border-destructive')} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" aria-label={showPassword ? 'Ocultar' : 'Mostrar'}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
          </div>
          {errors.password && <p className="flex items-center space-x-2 mt-2 text-destructive text-sm"><AlertCircle className="w-4 h-4" /><span>{errors.password.message}</span></p>}
        </div>
        <Button type="submit" className="btn-hero w-full h-12">Ingresar</Button>
        <div className="text-center"><button type="button" className="text-primary hover:text-accent text-sm">¿Olvidaste tu contraseña?</button></div>
      </form>
    </>
  );
};

const SignupForm = () => {
  const { closeModals } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: SignupFormValues) => {
    console.log('Signup attempt:', data);
    closeModals();
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 id="signup-title" className="font-display font-bold text-2xl text-foreground mb-2">Crear cuenta</h2>
        <p className="text-muted-foreground">Únete a la comunidad de cUPido</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="signup-name">Nombre completo</Label>
          <div className="relative mt-2">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="signup-name" placeholder="Tu nombre" {...register('name')} className={cn('pl-10 h-12', errors.name && 'border-destructive')} />
          </div>
          {errors.name && <p className="flex items-center space-x-2 mt-2 text-destructive text-sm"><AlertCircle className="w-4 h-4" /><span>{errors.name.message}</span></p>}
        </div>
        <div>
          <Label htmlFor="signup-email">Correo institucional</Label>
          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="signup-email" type="email" placeholder="usuario@unipamplona.edu.co" {...register('email')} className={cn('pl-10 h-12', errors.email && 'border-destructive')} />
          </div>
          {errors.email && <p className="flex items-center space-x-2 mt-2 text-destructive text-sm"><AlertCircle className="w-4 h-4" /><span>{errors.email.message}</span></p>}
        </div>
        <div>
          <Label htmlFor="signup-password">Contraseña</Label>
          <div className="relative mt-2">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="signup-password" type={showPassword ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" {...register('password')} className={cn('pl-10 pr-10 h-12', errors.password && 'border-destructive')} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" aria-label={showPassword ? 'Ocultar' : 'Mostrar'}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
          </div>
          {errors.password && <p className="flex items-center space-x-2 mt-2 text-destructive text-sm"><AlertCircle className="w-4 h-4" /><span>{errors.password.message}</span></p>}
        </div>
        <div>
          <Label htmlFor="signup-confirm">Confirmar contraseña</Label>
          <div className="relative mt-2">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="signup-confirm" type={showConfirmPassword ? 'text' : 'password'} placeholder="Repite tu contraseña" {...register('confirm')} className={cn('pl-10 pr-10 h-12', errors.confirm && 'border-destructive')} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" aria-label={showConfirmPassword ? 'Ocultar' : 'Mostrar'}>
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
          </div>
          {errors.confirm && <p className="flex items-center space-x-2 mt-2 text-destructive text-sm"><AlertCircle className="w-4 h-4" /><span>{errors.confirm.message}</span></p>}
        </div>
        <Button type="submit" className="btn-hero w-full h-12">Crear cuenta</Button>
      </form>
    </>
  );
};


// --- Main Component ---

export default function AuthModals() {
  const { authModal, closeModals, openLogin, openSignup } = useAppStore();
  const showLogin = authModal === 'login';
  const showSignup = authModal === 'signup';

  // Reset form state when modal is opened
  // This is a simple way to ensure forms are clear on reopen
  const [formKey, setFormKey] = useState(0);
  useEffect(() => {
    if (authModal !== 'closed') {
      setFormKey(prev => prev + 1);
    }
  }, [authModal]);

  if (authModal === 'closed') return null;

  return (
    <div className="modal-backdrop" onClick={closeModals}>
      <div className="card-floating w-full max-w-md mx-auto animate-scale-in" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button onClick={closeModals} className="absolute top-4 right-4 p-2 rounded-full" aria-label="Cerrar">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="p-8">
          {showLogin && <LoginForm key={`login-${formKey}`} />}
          {showSignup && <SignupForm key={`signup-${formKey}`} />}
          
          <div className="text-center text-sm mt-6">
            {showLogin ? (
              <>
                ¿No tienes cuenta?{' '}
                <button onClick={openSignup} className="text-primary hover:text-accent font-semibold">Regístrate</button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button onClick={openLogin} className="text-primary hover:text-accent font-semibold">Ingresa</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}