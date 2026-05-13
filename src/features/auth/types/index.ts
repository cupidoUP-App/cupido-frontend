/**
 * Tipos e interfaces del módulo de autenticación.
 * Define las estructuras de datos utilizadas en el flujo
 * de registro e inicio de sesión de la aplicación Cupido.
 *
 * @module types
 */

/**
 * Datos básicos del formulario de registro.
 */
export interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

/**
 * Pasos del flujo de registro en el formulario.
 */
export type FormStep = 'initial' | 'captcha' | 'email-verification' | 'complete-register' | 'completed';

/**
 * Estado completo de los pasos del flujo de registro.
 */
export interface FormStepState {
  currentStep: FormStep;
  showTerms: boolean;
  isCaptchaVerified: boolean;
  isSubmitting: boolean;
  isVerifyingEmail: boolean;
  showCompleteRegister: boolean;
}

