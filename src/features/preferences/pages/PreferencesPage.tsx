/**
 * Página envoltorio de preferencias que obtiene la sesión del usuario y delega
 * el formulario de preferencias al componente PreferencesPage.
 * Muestra estados de carga y error si no se puede obtener la información del usuario.
 *
 * @interface PreferencesPageProps
 * @property {() => void} onComplete - Callback al completar la configuración de preferencias.
 */
import React from 'react';
import { useUserSession } from '@hooks/useUserSession';

// 1. Definir las props del componente
interface PreferencesPageProps {
  onComplete: () => void;
}

const PreferencesPage: React.FC<PreferencesPageProps> = ({ onComplete }) => {
  const { user, isLoading, isError } = useUserSession();

  // 2. handlePreferencesComplete ahora solo llama a onComplete
  const handlePreferencesComplete = () => {
    onComplete();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 h-full">
        <p className="text-lg">Cargando información del usuario...</p>
      </div>
    );
  }

  if (isError || !user || !user.usuario_id) {
    return (
      <div className="flex items-center justify-center p-4 h-full">
        <p className="text-lg text-red-500">No se pudo cargar la información del usuario.</p>
      </div>
    );
  }

};

export default PreferencesPage;