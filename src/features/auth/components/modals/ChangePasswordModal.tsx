import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PasswordField from './PasswordField';
import ConfirmPasswordField from './ConfirmPasswordField';
import { authAPI } from '@/lib/api';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Contraseñas no coinciden",
        description: "Las contraseñas deben ser iguales",
        variant: "destructive"
      });
      return;
    }

    if (currentPassword === newPassword) {
      toast({
        title: "Contraseña inválida",
        description: "La nueva contraseña debe ser diferente a la actual",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the API with the correct field names matching the backend
      await authAPI.changePassword({
        contrasena_actual: currentPassword,
        nueva_contrasena: newPassword,
      });

      toast({
        title: "¡Contraseña cambiada!",
        description: "Tu contraseña ha sido actualizada exitosamente.",
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error changing password:', error);

      let errorMessage = "No pudimos cambiar tu contraseña. Intenta de nuevo.";

      if (error.response?.data) {
        // Handle specific backend validation errors
        const data = error.response.data;
        if (data.contrasena_actual) {
          errorMessage = data.contrasena_actual[0] || "La contraseña actual es incorrecta.";
        } else if (data.nueva_contrasena) {
          errorMessage = data.nueva_contrasena[0] || "La nueva contraseña no cumple con los requisitos.";
        } else if (data.detail) {
          errorMessage = data.detail;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-[439px] h-[600px] bg-[#F2D6CD] rounded-[40px] shadow-[2px_6px_4px_0px_rgba(0,0,0,0.35)] relative overflow-hidden">

        {/* Close button */}
        <button
          onClick={() => {
            // Reset form fields when closing
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 p-1 rounded-full hover:bg-rose-300 transition-colors z-10"
          aria-label="Cerrar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="h-full flex flex-col p-5">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="src/assets/logo-login.webp"
              alt="CUPIDO Logo"
              className="w-[70px] h-[65px]"
            />
          </div>

          {/* Header */}
          <div className="mb-6 text-center">
            <div className="text-black text-xl font-normal font-['Poppins']">
              Cambiar Contraseña
            </div>
            <div className="text-black text-2xl font-medium font-['Poppins'] mt-2">
              Actualiza tu contraseña
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-700 text-sm">
                  Ingresa tu contraseña actual y crea una nueva segura
                </p>
              </div>

              {/* Current Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Contraseña Actual
                </label>
                <PasswordField
                  value={currentPassword}
                  onChange={setCurrentPassword}
                />
              </div>

              {/* New Password */}
              <PasswordField
                value={newPassword}
                onChange={setNewPassword}
              />

              {/* Confirm New Password */}
              <ConfirmPasswordField
                value={confirmPassword}
                onChange={setConfirmPassword}
                originalPassword={newPassword}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim() || newPassword !== confirmPassword}
                className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 text-sm"
              >
                {isSubmitting ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;