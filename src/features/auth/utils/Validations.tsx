// src/utils/validations.ts
export interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@unipamplona\.edu\.co$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

export const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.email) {
    errors.email = 'El correo electrónico es requerido';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Solo se permiten correos @unipamplona.edu.co';
  }

  if (!formData.password) {
    errors.password = 'La contraseña es requerida';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'La contraseña no cumple con los requisitos';
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  if (!formData.acceptTerms) {
    errors.terms = 'Debes aceptar los términos y condiciones';
  }

  return errors;
};