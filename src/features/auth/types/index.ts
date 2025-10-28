export interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export type FormStep = 'initial' | 'captcha' | 'email-verification' | 'complete-register' | 'completed';

export interface FormStepState {
  currentStep: FormStep;
  showTerms: boolean;
  isCaptchaVerified: boolean;
  isSubmitting: boolean;
  isVerifyingEmail: boolean;
  showCompleteRegister: boolean;
}

