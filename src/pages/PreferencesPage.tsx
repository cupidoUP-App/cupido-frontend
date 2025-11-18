import React from 'react';
import FiltersPage from '@/features/filters/components/FiltersPage';
import { useUserSession } from '@/hooks/useUserSession';

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

  return (
    <div className="w-full h-full bg-white">
      <FiltersPage
        userId={user.usuario_id.toString()}
        onComplete={handlePreferencesComplete}
        onClose={onComplete} // Si el usuario cierra, también contamos como completado para refrescar el dashboard
      />
    </div>
  );
};

export default PreferencesPage;