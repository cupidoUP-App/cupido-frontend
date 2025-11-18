import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";
import FiltersPage from "@/features/filters/components/FiltersPage";

const Dashboard: React.FC = () => {
  const { closeModals, logout, user } = useAppStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
      closeModals();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      logout();
      toast({
        title: "Sesión cerrada",
        description: "Sesión cerrada localmente.",
        variant: "destructive",
      });
      closeModals();
    }
  };

  const handleFiltersComplete = () => {
    setShowFilters(false);
    toast({
      title: "Filtros guardados",
      description: "Tus preferencias de búsqueda han sido actualizadas.",
    });
  };

  const handleProfileClick = () => {
    console.log("Navegando a perfil...");
    closeModals();
    navigate('/profile');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-4xl h-[80vh] bg-[#F2D6CD] rounded-[40px] shadow-[2px_6px_4px_0px_rgba(0,0,0,0.35)] relative overflow-hidden">
          <button
            onClick={closeModals}
            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 p-1 rounded-full hover:bg-rose-300 transition-colors z-10"
            aria-label="Cerrar dashboard"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="h-full flex flex-col p-8">
            <div className="flex justify-center mb-6">
              <img
                src="/src/assets/logo-login.webp"
                alt="CUPIDO Logo"
                className="w-[87px] h-[80px]"
              />
            </div>

            <div className="mb-8 text-center">
              <div className="text-black text-3xl font-normal font-['Poppins']">
                Hola, {user?.nombres}!
              </div>
              <div className="text-black text-2xl font-medium font-['Poppins'] mt-2">
                Dashboard
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  ¡Felicidades! Tu perfil está completo
                </h2>
                <p className="text-gray-600 max-w-md">
                  Ahora puedes empezar a explorar CUPIDO y encontrar conexiones
                  especiales.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="bg-[#E93923] hover:bg-[#d1321f] text-white font-semibold py-3 px-8 rounded-lg transition duration-200 shadow-md hover:shadow-lg text-lg"
                >
                  Configurar Filtros
                </button>
              </div>

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

                <div className="bg-white/80 p-6 rounded-xl text-center shadow-sm cursor-pointer hover:bg-white/90 transition-colors" onClick={handleProfileClick}>
                  <div className="text-2xl mb-2">👤</div>
                  <h3 className="font-semibold text-gray-800">Perfil</h3>
                  <p className="text-sm text-gray-600">Editar perfil</p>
                </div>
              </div>

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

      {showFilters && (
        <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20">
            <FiltersPage
              userId={user?.usuario_id?.toString() || ""}
              onComplete={handleFiltersComplete}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;