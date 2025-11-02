import React from 'react';
import { useSignUpForm } from './hooks/useSignUpForm';
import EmailField from './components/EmailField';
import PasswordField from './components/PasswordField';
import ConfirmPasswordField from './components/ConfirmPasswordField';
import TermsCheckbox from './components/TermsCheckbox';
import TermsAndConditions from './components/TermsAndConditions';
import ReCaptchaModal from './components/ReCaptchaModal';
import EmailVerificationModal from './components/EmailVerificationModal';
import CompleteRegister, { RegistrationData } from './components/CompleteRegister';
import { SignUpFormLayout } from './components/forms/SignUpFormLayout';
import { SignUpFormHeader } from './components/forms/SignUpFormHeader';
import { SignUpFormFooter } from './components/forms/SignUpFormFooter';
import { SignUpFlowIndicator } from './components/forms/SignUpFlowIndicator';

interface RegistroProps {
  onClose: () => void;
  onSwitchToLogin?: () => void; 
}

const SigUpForm: React.FC<RegistroProps> = ({ onClose }) => {
  const {
    formData,
    stepState,
    handleFieldChange,
    handleOpenTerms,
    handleAcceptTerms,
    handleRejectTerms,
    handleCaptchaVerify,
    handleCaptchaExpired,
    handleCaptchaError,
    handleSwitchToLogin,
    handleResendVerificationCode,
    handleVerifyEmailCode,
    handleCompleteRegisterSubmit,
    handleSubmit,
    getButtonText,
    setShowTerms,
    setCurrentStep,
  } = useSignUpForm({ onClose });

  return (
    <>
      <SignUpFormLayout
        onClose={onClose}
        header={<SignUpFormHeader />}
        footer={
          <SignUpFormFooter onSwitchToLogin={handleSwitchToLogin} />
        }
      >
        {/* Formulario con espaciado compacto */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <EmailField
              value={formData.email}
              onChange={(value) => handleFieldChange('email', value)}
            />

            <PasswordField
              value={formData.password}
              onChange={(value) => handleFieldChange('password', value)}
            />

            <ConfirmPasswordField
              value={formData.confirmPassword}
              onChange={(value) => handleFieldChange('confirmPassword', value)}
              originalPassword={formData.password}
            />

            <div className="pt-1">
              <TermsCheckbox
                checked={formData.acceptTerms}
                onChange={(value) => handleFieldChange('acceptTerms', value)}
                onOpenTerms={handleOpenTerms}
              />
            </div>
          </div>

          {/* Indicador de estado del flujo */}
          <SignUpFlowIndicator isCaptchaVerified={stepState.isCaptchaVerified} />

          {/* Botón de continuar */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={stepState.isSubmitting || stepState.isVerifyingEmail}
              className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 text-sm shadow-md hover:shadow-lg"
            >
              {getButtonText()}
            </button>
          </div>
        </form>
      </SignUpFormLayout>

      {/* Modal de Términos y Condiciones */}
      <TermsAndConditions
        isOpen={stepState.showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleAcceptTerms}
        onReject={handleRejectTerms}
      />

      {/* Modal de reCAPTCHA */}
      <ReCaptchaModal
        isOpen={stepState.currentStep === 'captcha'}
        onClose={() => setCurrentStep('initial')}
        onVerify={handleCaptchaVerify}
        onExpired={handleCaptchaExpired}
        onError={handleCaptchaError}
      />

      {/* Modal de verificación de email */}
      <EmailVerificationModal
        isOpen={stepState.currentStep === 'email-verification'}
        onClose={() => setCurrentStep('initial')}
        onVerify={handleVerifyEmailCode}
        onResendCode={handleResendVerificationCode}
        userEmail={formData.email}
        isSubmitting={stepState.isSubmitting}
      />

      {/* Modal CompleteRegister */}
      <CompleteRegister
        isOpen={stepState.showCompleteRegister}
        onSubmit={handleCompleteRegisterSubmit}
        onClose={() => {
          setShowTerms(false);
          setCurrentStep('initial');
        }}
        isSubmitting={stepState.isSubmitting}
      />
    </>
  );
};

export default SigUpForm;

