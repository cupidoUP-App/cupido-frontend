import React from 'react';
import { useAppStore } from '@/store/appStore';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/lib/api';

const Dashboard: React.FC = () => {
  const { closeModals, logout, user } = useAppStore();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // Obtener el refresh token antes de hacer logout
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          // Intentar refrescar el token antes del logout para mantener la sesión activa
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

      // Llamar al endpoint de logout del backend
      await authAPI.logout();

      // Limpiar estado global y localStorage
      logout();

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });

      // Cerrar el dashboard y volver a la página principal
      closeModals();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);

      // Aun si falla el logout del backend, limpiar el estado local
      logout();

      toast({
        title: "Sesión cerrada",
        description: "Sesión cerrada localmente.",
        variant: "destructive"
      });

      closeModals();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-[80vh] bg-[#F2D6CD] rounded-[40px] shadow-[2px_6px_4px_0px_rgba(0,0,0,0.35)] relative overflow-hidden">

        {/* Botón para cerrar */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 p-1 rounded-full hover:bg-rose-300 transition-colors z-10"
          aria-label="Cerrar dashboard"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenido del dashboard */}
        <div className="h-full flex flex-col p-8">
          {/* Logo centrado en la parte superior */}
          <div className="flex justify-center mb-6">
            <img
              src="src/assets/logo-login.webp"
              alt="CUPIDO Logo"
              className="w-[87px] h-[80px]"
            />
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="text-black text-3xl font-normal font-['Poppins']">
              Hola, {user?.nombres || user?.email}!
            </div>
            <div className="text-black text-2xl font-medium font-['Poppins'] mt-2">
              Dashboard
            </div>
          </div>

          {/* Contenido principal del dashboard */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            {/* Mensaje de bienvenida */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                ¡Felicidades! Tu perfil está completo
              </h2>
              <p className="text-gray-600 max-w-md">
                Ahora puedes empezar a explorar CUPIDO y encontrar conexiones especiales.
              </p>
            </div>

            {/* Placeholder para futuras funcionalidades */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
              <div className="bg-white/80 p-6 rounded-xl text-center shadow-sm">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="font-semibold text-gray-800">Chat</h3>
                <p className="text-sm text-gray-600">Próximamente</p>
              </div>

              <div className="bg-white/80 p-6 rounded-xl text-center shadow-sm">
                <div className="text-2xl mb-2">❤️</div>
                <h3 className="font-semibold text-gray-800">Matches</h3>
                <p className="text-sm text-gray-600">Próximamente</p>
              </div>

              <div className="bg-white/80 p-6 rounded-xl text-center shadow-sm">
                <div className="text-2xl mb-2">👤</div>
                <h3 className="font-semibold text-gray-800">Perfil</h3>
                <p className="text-sm text-gray-600">Próximamente</p>
              </div>
            </div>

            {/* Botón de logout */}
            <div className="pt-8">
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;