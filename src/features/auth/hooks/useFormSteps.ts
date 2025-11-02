import { useState } from 'react';
import { FormStep, FormStepState } from '../types';

export const useFormSteps = () => {
  const [stepState, setStepState] = useState<FormStepState>({
    currentStep: 'initial',
    showTerms: false,
    isCaptchaVerified: false,
    isSubmitting: false,
    isVerifyingEmail: false,
    showCompleteRegister: false,
  });

  const setCurrentStep = (step: FormStep) => {
    setStepState(prev => ({ ...prev, currentStep: step }));
  };

  const setShowTerms = (show: boolean) => {
    setStepState(prev => ({ ...prev, showTerms: show }));
  };

  const setIsCaptchaVerified = (verified: boolean) => {
    setStepState(prev => ({ ...prev, isCaptchaVerified: verified }));
  };

  const setIsSubmitting = (submitting: boolean) => {
    setStepState(prev => ({ ...prev, isSubmitting: submitting }));
  };

  const setIsVerifyingEmail = (verifying: boolean) => {
    setStepState(prev => ({ ...prev, isVerifyingEmail: verifying }));
  };

  const setShowCompleteRegister = (show: boolean) => {
    setStepState(prev => ({ ...prev, showCompleteRegister: show }));
  };

  return {
    stepState,
    setCurrentStep,
    setShowTerms,
    setIsCaptchaVerified,
    setIsSubmitting,
    setIsVerifyingEmail,
    setShowCompleteRegister,
  };
};

