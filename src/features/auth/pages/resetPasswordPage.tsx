import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useToast } from '@hooks/use-toast';
import { X, ArrowLeft } from 'lucide-react';
import PasswordField from '../components/forms/PasswordField';
import ConfirmPasswordField from '../components/forms/ConfirmPasswordField';
import { authAPI } from '@lib/api';
import backgroundImage1 from '@assets/image1-resetPassword.webp';
import backgroundImage2 from '@assets/image2-resetPassword.webp';

// Page component for resetting password
const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams<{ token: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const { toast } = useToast();

  // Reset form on component mount and check for token
  useEffect(() => {
    setNewPassword('');
    setConfirmPassword('');

    console.log('--- ResetPasswordPage Mounted ---');
    console.log('Initiating token check...');

    // 1. Check URL Path Params (e.g. /reset-password/:token)
    const paramToken = params.token;

    // 2. Check Query Params (e.g. /reset-password?token=...)
    const queryToken = searchParams.get('token');

    let foundToken: string | null = null;

    if (paramToken) {
      console.log('Token found in URL Path Params:', paramToken);
      foundToken = paramToken;
    } else if (queryToken) {
      console.log('Token found in Query Params:', queryToken);
      foundToken = queryToken;
    } else {
      console.log('No token found in URL.');
    }

    if (foundToken) {
      // "Seccionarlo" - assuming this means validating/cleaning if necessary, 
      // for now we just trim it.
      const cleanToken = foundToken.trim();
      console.log('Token processed/cleaned:', cleanToken);

      setToken(cleanToken);
      console.log('Token saved in memory (state):', cleanToken);
    } else {
      console.warn('Warning: No token available for password reset.');
    }

  }, [params.token, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Contraseñas no coinciden',
        description: 'Las contraseñas deben ser iguales',
        variant: 'destructive',
      });
      return;
    }

    console.log('Submitting password reset...');
    if (token) {
      console.log('Using token for request:', token);
    } else {
      console.warn('Submitting without a token!');
    }

    setIsSubmitting(true);
    try {
      // Note: This API call might need adjustment depending on backend requirements for password reset
      // (e.g., if it requires a token or current password). 
      // Proceeding with just new password as per UI changes.

      // If the backend expects the token, we should pass it here.
      // For now, we keep the existing structure but log the intent
      await authAPI.resetPasswordConfirm({
        token: token || '',
        nueva_contrasena: newPassword,
      });

      toast({
        title: '¡Contraseña cambiada!',
        description: 'Tu contraseña ha sido actualizada exitosamente.',
      });
      navigate('/'); // Redirect to login or home after success
    } catch (error: any) {
      console.error('Error changing password:', error);
      let errorMessage = 'No pudimos cambiar tu contraseña. Intenta de nuevo.';
      if (error.response?.data) {
        const data = error.response.data;
        if (data.nueva_contrasena) {
          errorMessage = data.nueva_contrasena[0] || 'La nueva contraseña no cumple con los requisitos.';
        } else if (data.detail) {
          errorMessage = data.detail;
        }
      }
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#FFF0EC] backdrop-blur-sm overflow-hidden">
      {/* Decorative Images - Responsive & Larger */}
      <img
        src={backgroundImage1}
        alt="Decoración"
        className=" ml-24 hidden lg:block w-[500px] h-auto object-contain absolute -left-20 top-1/2 -translate-y-1/2 pointer-events-none opacity-90"
      />
      <img
        src={backgroundImage2}
        alt="Decoración"
        className="mr-24 hidden lg:block w-[500px] h-auto object-contain absolute -right-20 top-1/2 -translate-y-1/2 pointer-events-none opacity-90"
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[439px] min-h-[550px] flex flex-col p-8 bg-[#F2D6CD] rounded-[40px] shadow-[2px_6px_4px_0px_rgba(0,0,0,0.35)]">

        {/* Navigation Icons */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 text-gray-700 hover:text-black transition-colors"
          aria-label="Regresar"
        >
          <ArrowLeft size={24} />
        </button>

        <button
          onClick={() => navigate('/')}
          className="absolute top-8 right-8 text-gray-700 hover:text-black transition-colors"
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="flex justify-center mt-2 mb-2">
          <img
            src="https://i.postimg.cc/htWQx7q5/logo-Fix.webp"
            alt="CUPIDO Logo"
            className="w-[80px] h-[75px]"
          />
        </div>

        {/* Header */}
        <div className="mb-6 text-center px-4">
          <div className="text-black text-2xl font-semibold font-['Poppins'] mt-2 mb-2">
            Reestablecer Contraseña
          </div>
          <div className="text-black text-sm font-normal font-['Poppins'] mt-2 mb-2 leading-relaxed">
            Ingresa tu nueva contraseña. Asegúrate de cumplir con los requisitos de seguridad.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5 px-2">
          <PasswordField value={newPassword} onChange={setNewPassword} />
          <ConfirmPasswordField
            value={confirmPassword}
            onChange={setConfirmPassword}
            originalPassword={newPassword}
          />

          <div className="pt-2">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !newPassword.trim() ||
                !confirmPassword.trim() ||
                newPassword !== confirmPassword
              }
              className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition duration-200 text-sm shadow-md"
            >
              {isSubmitting ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
