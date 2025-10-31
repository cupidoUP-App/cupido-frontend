// CompleteRegister.tsx - RESPONSIVE
import React, { useState, useEffect } from 'react';
import RightSideWithParticles from '../shared/RightSideWithParticles';
import { authAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/appStore';

interface CompleteRegisterProps {
  isOpen: boolean;
  onSubmit: (data: RegistrationData) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export interface RegistrationData {
  name: string;
  lastName: string;
  gender: string;
  birthDate: {
    day: string;    
    month: string;
    year: string;
  };
  description: string;
}

const CompleteRegister: React.FC<CompleteRegisterProps> = ({
  isOpen,
  onSubmit,
  onClose,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    lastName: '',
    gender: '',
    birthDate: {
      day: '',
      month: '',
      year: ''
    },
    description: ''
  });

  const [errors, setErrors] = useState<Partial<RegistrationData>>({});
  const { toast } = useToast();
  const { openDashboard } = useAppStore();

  // Resetear form cuando se abre
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        lastName: '',
        gender: '',
        birthDate: {
          day: '',
          month: '',
          year: ''
        },
        description: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof Omit<RegistrationData, 'birthDate'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleBirthDateChange = (field: 'day' | 'month' | 'year', value: string) => {
    setFormData(prev => ({
      ...prev,
      birthDate: {
        ...prev.birthDate,
        [field]: value
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationData> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'Los apellidos son requeridos';
    if (!formData.gender) newErrors.gender = 'El sexo es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    
    // Validate birth date
    if (!formData.birthDate.day || !formData.birthDate.month || !formData.birthDate.year) {
      newErrors.birthDate = { day: '', month: '', year: '' }; // Mark as error
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Formatear fecha de nacimiento
      const birthDate = `${formData.birthDate.year}-${formData.birthDate.month.padStart(2, '0')}-${formData.birthDate.day.padStart(2, '0')}`;

      // Mapear género a ID (asumiendo que el backend espera IDs numéricos)
      const genderMapping: { [key: string]: number } = {
        'male': 1,    // Asumiendo que 1 es masculino
        'female': 2,  // Asumiendo que 2 es femenino
        'other': 3    // Asumiendo que 3 es otro
      };

      const genderId = genderMapping[formData.gender] || 1;

      // Llamar al endpoint real del backend
      const response = await authAPI.updateProfile({
        nombres: formData.name,
        apellidos: formData.lastName,
        genero_id: genderId,
        fechanacimiento: birthDate,
        descripcion: formData.description
      });

      console.log('Perfil actualizado:', response);

      // Verificar el estado del usuario después de actualizar el perfil
      await verifyUserStatusAfterUpdate();

    } catch (error: any) {
      console.error('Error al completar perfil:', error);

      let errorMessage = "No pudimos completar tu perfil. Intenta de nuevo.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.nombres) {
        errorMessage = Array.isArray(error.response.data.nombres)
          ? error.response.data.nombres[0]
          : error.response.data.nombres;
      } else if (error.response?.data?.apellidos) {
        errorMessage = Array.isArray(error.response.data.apellidos)
          ? error.response.data.apellidos[0]
          : error.response.data.apellidos;
      } else if (error.response?.data?.genero_id) {
        errorMessage = Array.isArray(error.response.data.genero_id)
          ? error.response.data.genero_id[0]
          : error.response.data.genero_id;
      } else if (error.response?.data?.fechanacimiento) {
        errorMessage = Array.isArray(error.response.data.fechanacimiento)
          ? error.response.data.fechanacimiento[0]
          : error.response.data.fechanacimiento;
      } else if (error.response?.data?.descripcion) {
        errorMessage = Array.isArray(error.response.data.descripcion)
          ? error.response.data.descripcion[0]
          : error.response.data.descripcion;
      }

      toast({
        title: "Error al completar perfil",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const verifyUserStatusAfterUpdate = async () => {
    try {
      // Obtener datos del usuario usando el endpoint user-get
      const userData = await authAPI.getUserProfile();
      
      console.log('Datos del usuario después de actualizar:', userData);
      
      const estado = userData.estado;
      const shouldCompleteProfile = userData.should_complete_profile;
      const [showCompleteRegister, setShowCompleteRegister] = useState(false);

      if (estado ===1 && shouldCompleteProfile){
        toast({
          title: "idiotas?!",
          description: "Tu perfil ha sido completado exitosamente.",
        });
      }
      setShowCompleteRegister(true);


      if (estado === '2' && !shouldCompleteProfile) {
        // Perfil completado exitosamente - redirigir al dashboard
        toast({
          title: "¡Perfil completado!",
          description: "Tu perfil ha sido completado exitosamente.",
        });

        // Cerrar modal y abrir dashboard
        onClose();
        setTimeout(() => {
          openDashboard();
        }, 1000);
      } else {
        // Aún hay campos faltantes
        toast({
          title: "Perfil parcialmente completado",
          description: "Tu perfil aún necesita más información. Revisa los campos requeridos.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error al verificar estado del usuario después de actualizar:', error);
      
      toast({
        title: "Error de verificación",
        description: "No pudimos verificar el estado de tu perfil. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  const handleCloseCompleteRegister = async () => {
    try {
      // Obtener el refresh token antes de hacer logout
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          // Intentar refrescar el token antes del logout
          console.log('Refrescando token antes del logout...');
          const refreshResponse = await authAPI.refreshToken();
          
          // Actualizar el access token con el nuevo token
          localStorage.setItem('access_token', refreshResponse.access);
          console.log('Token refrescado exitosamente');
        } catch (refreshError) {
          console.log('No se pudo refrescar el token:', refreshError);
          // Continuar con el logout aunque falle el refresh
        }
      }

      // Call logout endpoint when closing
      await authAPI.logout();

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Continue with closing even if logout fails
    }

    // Reset form fields when closing
    setFormData({
      name: '',
      lastName: '',
      gender: '',
      birthDate: {
        day: '',
        month: '',
        year: ''
      },
      description: ''
    });
    setErrors({});
    onClose();
  };

  // Opciones para los selects
  const genderOptions = [
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Femenino' },
    { value: 'other', label: 'Otro' },
  ];

  const months = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm overflow-auto">
        {/* Contenedor principal RESPONSIVE */}
        <div className="w-full min-h-full bg-[#F2D6CD] relative flex items-center justify-center lg:justify-start py-4">
          
          {/* Componente de mitad derecha con partículas - OCULTO EN MÓVIL */}
          <div className="hidden lg:block">
            <RightSideWithParticles>
              {/* Imagen más grande */}
              <div className="absolute right-0 bottom-0 h-[85vh] max-w-[45vw] flex items-end z-10"> 
                <img 
                  src="src\assets\flat-valentine-s-day-photocall-template-Photoroom 1.webp" 
                  alt="Decoración" 
                  className="h-full w-auto object-right-bottom object-contain"
                />
              </div>
            </RightSideWithParticles>
          </div>

          {/* Botón para cerrar */}
          <button
            onClick={handleCloseCompleteRegister}
            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-rose-300 transition-colors z-30"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Contenedor del formulario RESPONSIVE */}
          <div className="w-full max-w-md mx-4 lg:mx-0 lg:ml-10 xl:ml-20 2xl:ml-28 z-20 bg-white/80 lg:bg-transparent rounded-xl lg:rounded-none p-6 lg:p-0">
            
            {/* Logo más compacto */}
            <div className="flex justify-center mb-4">
              <img 
                src="src/assets/logo-login.webp" 
                alt="CUPIDO Logo" 
                className="w-16 h-14"
              />
            </div>

            {/* Header más compacto y centrado */}
            <div className="mb-6">
              <div className="text-black text-base font-normal font-['Poppins'] text-center">
                  Bienvenido a{' '}
                  <span className="text-[#E93923] font-semibold">CUPIDO</span>
              </div>
              <div className="text-black text-lg font-medium font-['Poppins'] mt-1 text-center">
                  Completa tu registro
              </div>
              <p className="text-gray-700 text-xs mt-1 font-['Poppins'] max-w-md leading-relaxed text-center mx-auto">
                  Cuéntanos un poco sobre ti para que podamos personalizar tu experiencia.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Nombre y Apellidos - RESPONSIVE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 font-['Poppins']">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#E93923] focus:border-transparent bg-white font-['Poppins'] text-xs ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tu nombre"
                    maxLength={50}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 font-['Poppins']">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 font-['Poppins']">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#E93923] focus:border-transparent bg-white font-['Poppins'] text-xs ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tus apellidos"
                    maxLength={50}
                    disabled={isSubmitting}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1 font-['Poppins']">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Sexo */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 font-['Poppins']">
                  Sexo *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#E93923] focus:border-transparent bg-white font-['Poppins'] text-xs ${
                    errors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Selecciona</option>
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1 font-['Poppins']">{errors.gender}</p>
                )}
              </div>

              {/* Fecha de Nacimiento - MEJORADO RESPONSIVE */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 font-['Poppins']">
                  Fecha de Nacimiento *
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {/* Día */}
                  <div>
                    <select
                      value={formData.birthDate.day}
                      onChange={(e) => handleBirthDateChange('day', e.target.value)}
                      className={`w-full px-2 py-2 border rounded-md focus:ring-2 focus:ring-[#E93923] focus:border-transparent bg-white font-['Poppins'] text-xs ${
                        errors.birthDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    >
                      <option value="">DD</option>
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  {/* Mes */}
                  <div>
                    <select
                      value={formData.birthDate.month}
                      onChange={(e) => handleBirthDateChange('month', e.target.value)}
                      className={`w-full px-2 py-2 border rounded-md focus:ring-2 focus:ring-[#E93923] focus:border-transparent bg-white font-['Poppins'] text-xs ${
                        errors.birthDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    >
                      <option value="">MM</option>
                      {months.map(month => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Año */}
                  <div>
                    <select
                      value={formData.birthDate.year}
                      onChange={(e) => handleBirthDateChange('year', e.target.value)}
                      className={`w-full px-2 py-2 border rounded-md focus:ring-2 focus:ring-[#E93923] focus:border-transparent bg-white font-['Poppins'] text-xs ${
                        errors.birthDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    >
                      <option value="">AAAA</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {errors.birthDate && (
                  <p className="text-red-500 text-xs mt-1 font-['Poppins']">La fecha es requerida</p>
                )}
              </div>

              {/* Descripción más compacta */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 font-['Poppins']">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#E93923] focus:border-transparent bg-white font-['Poppins'] text-xs resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Cuéntanos sobre ti..."
                  rows={3}
                  maxLength={50}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1 font-['Poppins']">{errors.description}</p>
                )}
                <p className="text-xs text-gray-600 mt-1 font-['Poppins']">
                  Haz que tu perfil destaque o cuéntanos algo especial sobre ti
                </p>
              </div>

              {/* Botón de Registro */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-xs shadow hover:shadow-md font-['Poppins']"
                >
                  {isSubmitting ? 'Completando...' : 'Continuar'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompleteRegister;