/**
 * Utilidades de validación para el formulario de registro.
 * Contiene funciones para validar correo electrónico institucional,
 * contraseñas seguras y el formulario completo.
 *
 * @module Validations
 */

/**
 * Datos del formulario de registro con firma de términos.
 */
export interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  firma: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

/**
 * Valida que el correo electrónico pertenezca al dominio institucional.
 *
 * @param email - Correo electrónico a validar.
 * @returns `true` si el correo termina en @unipamplona.edu.co.
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@unipamplona\.edu\.co$/;
  return emailRegex.test(email);
};

/**
 * Valida que la contraseña cumpla con los requisitos de seguridad:
 * mínimo 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales.
 *
 * @param password - Contraseña a validar.
 * @returns `true` si la contraseña cumple todos los requisitos.
 */
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

/**
 * Valida todos los campos del formulario de registro.
 *
 * @param formData - Objeto con los datos del formulario.
 * @returns Objeto con los errores encontrados por campo.
 */
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

  if (!formData.firma) {
    errors.terms = 'Debes proporcionar tu firma en los términos y condiciones';
  }

  return errors;
};