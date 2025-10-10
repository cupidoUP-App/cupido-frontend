import { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/appStore';

export default function AuthModals() {
  const { authModal, closeModals } = useAppStore();
  const showLogin = authModal === 'login';
  const showSignup = authModal === 'signup';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirm: '' 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const eduPattern = /^[^\s@]+@[^\s@]+\.(edu|edu\.[a-z]{2})$/i;
    return eduPattern.test(email);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!loginData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = 'Debe ser un correo institucional (.edu)';
    }

    if (!loginData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Simulate login success
      console.log('Login attempt:', loginData);
      closeModals();
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!signupData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!signupData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!validateEmail(signupData.email)) {
      newErrors.email = 'Debe ser un correo institucional (.edu)';
    }

    if (!signupData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (signupData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (signupData.password !== signupData.confirm) {
      newErrors.confirm = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Simulate signup success
      console.log('Signup attempt:', signupData);
      closeModals();
    }
  };

  if (authModal === 'closed') return null;

  return (
    <div className="modal-backdrop" onClick={closeModals}>
      <div 
        className="card-floating w-full max-w-md mx-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={showLogin ? "login-title" : "signup-title"}
      >
        {/* Close button */}
        <button
          onClick={closeModals}
          className="absolute top-4 right-4 p-2 hover:bg-secondary/50 rounded-full transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="p-8">
          {showLogin && (
            <>
              <div className="text-center mb-8">
                <h2 id="login-title" className="font-display font-bold text-2xl text-foreground mb-2">
                  Ingresar
                </h2>
                <p className="text-muted-foreground">
                  Bienvenido de vuelta a cUPido
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="login-email" className="text-foreground font-medium mb-2 block">
                    Correo institucional
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="usuario@universidad.edu"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className={`pl-10 h-12 ${errors.email ? 'border-destructive' : ''}`}
                      aria-describedby={errors.email ? "login-email-error" : undefined}
                    />
                  </div>
                  {errors.email && (
                    <div id="login-email-error" className="flex items-center space-x-2 mt-2 text-destructive text-sm" role="alert">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-foreground font-medium mb-2 block">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tu contraseña"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className={`pl-10 pr-10 h-12 ${errors.password ? 'border-destructive' : ''}`}
                      aria-describedby={errors.password ? "login-password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary/50 rounded"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div id="login-password-error" className="flex items-center space-x-2 mt-2 text-destructive text-sm" role="alert">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                <Button type="submit" className="btn-hero w-full h-12">
                  Ingresar
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-primary hover:text-accent transition-colors text-sm"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </form>
            </>
          )}

          {showSignup && (
            <>
              <div className="text-center mb-8">
                <h2 id="signup-title" className="font-display font-bold text-2xl text-foreground mb-2">
                  Crear cuenta
                </h2>
                <p className="text-muted-foreground">
                  Únete a la comunidad de cUPido
                </p>
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="signup-name" className="text-foreground font-medium mb-2 block">
                    Nombre completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className={`pl-10 h-12 ${errors.name ? 'border-destructive' : ''}`}
                      aria-describedby={errors.name ? "signup-name-error" : undefined}
                    />
                  </div>
                  {errors.name && (
                    <div id="signup-name-error" className="flex items-center space-x-2 mt-2 text-destructive text-sm" role="alert">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="signup-email" className="text-foreground font-medium mb-2 block">
                    Correo institucional
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="usuario@universidad.edu"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className={`pl-10 h-12 ${errors.email ? 'border-destructive' : ''}`}
                      aria-describedby={errors.email ? "signup-email-error" : undefined}
                    />
                  </div>
                  {errors.email && (
                    <div id="signup-email-error" className="flex items-center space-x-2 mt-2 text-destructive text-sm" role="alert">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="signup-password" className="text-foreground font-medium mb-2 block">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className={`pl-10 pr-10 h-12 ${errors.password ? 'border-destructive' : ''}`}
                      aria-describedby={errors.password ? "signup-password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary/50 rounded"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div id="signup-password-error" className="flex items-center space-x-2 mt-2 text-destructive text-sm" role="alert">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="signup-confirm" className="text-foreground font-medium mb-2 block">
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repite tu contraseña"
                      value={signupData.confirm}
                      onChange={(e) => setSignupData({ ...signupData, confirm: e.target.value })}
                      className={`pl-10 pr-10 h-12 ${errors.confirm ? 'border-destructive' : ''}`}
                      aria-describedby={errors.confirm ? "signup-confirm-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary/50 rounded"
                      aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {errors.confirm && (
                    <div id="signup-confirm-error" className="flex items-center space-x-2 mt-2 text-destructive text-sm" role="alert">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.confirm}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  Al continuar aceptas nuestros{' '}
                  <button className="text-primary hover:text-accent transition-colors">
                    Términos de Servicio
                  </button>{' '}
                  y{' '}
                  <button className="text-primary hover:text-accent transition-colors">
                    Política de Privacidad
                  </button>
                </div>

                <Button type="submit" className="btn-hero w-full h-12">
                  Crear cuenta
                </Button>

                <div className="text-center">
                  <Button variant="outline" type="button" className="w-full h-12">
                    Continuar con Microsoft (proximamente)
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}