/**
 * Módulo de hook personalizado que maneja los pasos del flujo de registro.
 * Controla la navegación entre las distintas etapas del formulario
 * (inicial, captcha, verificación de email, registro completo, finalizado).
 *
 * @module useFormSteps
 */

import { useState } from 'react';
import { FormStep, FormStepState } from '../types';

/**
 * Hook que administra los pasos del flujo de registro de usuario.
 *
 * @returns Objeto con el estado actual de los pasos y funciones
 *          para modificar cada propiedad del estado.
 */
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

