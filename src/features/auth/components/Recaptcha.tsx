import { useState } from 'react';
import { X } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Button } from '@/components/ui/button';

interface RecaptchaProps {
  onClose: () => void;
  onVerify: (token: string | null) => void;
}

const Recaptcha = ({ onClose, onVerify }: RecaptchaProps) => {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaValue(token);
  };

  const handleContinue = () => {
    onVerify(captchaValue);
  };

  return (
    <div className="relative bg-[#FCE3DC] rounded-3xl shadow-lg p-10 w-[400px] font-[Poppins]">
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-gray-600 hover:text-gray-800"
      >
        <X />
      </button>

      {/* Logo y encabezado */}
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 mb-4 flex items-center justify-center">
          <img
            src="src/assets/logo-login.webp"
            alt="CUPIDO logo"
            className="w-21 h-20"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verificación en dos pasos
        </h2>
        <p className="text-sm text-gray-600">
          Por motivos de seguridad, completa el siguiente CAPTCHA antes de continuar.
        </p>
      </div>

      {/* reCAPTCHA */}
      <div className="flex justify-center mb-20">
        <ReCAPTCHA
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Site key de prueba de Google
          onChange={handleCaptchaChange}
          theme="light"
        />
      </div>

      {/* Botón continuar */}
      <Button
        onClick={handleContinue}
        disabled={!captchaValue}
        className="w-full bg-[#E93C25] hover:bg-[#cc341f] text-white rounded-lg py-3 text-base font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar
      </Button>
    </div>
  );
};

export default Recaptcha;
