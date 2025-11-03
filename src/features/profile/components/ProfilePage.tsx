import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";
import ProfileCarousel from "./ProfileCarousel";
import ProfileInfo from "./ProfileInfo";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, closeModals } = useAppStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("Cargando datos del perfil...");
      try {
        console.log("Obteniendo datos del usuario...");
        const userResponse = await authAPI.getUserProfile();
        console.log("Respuesta completa del usuario:", userResponse);

        // El backend devuelve { estado, should_complete_profile, user }
        const userProfile = userResponse.user;
        console.log("Datos del usuario extraídos:", userProfile);
        console.log("Campos específicos:", {
          nombres: userProfile.nombres,
          apellidos: userProfile.apellidos,
          email: userProfile.email,
          fechanacimiento: userProfile.fechanacimiento,
          numerotelefono: userProfile.numerotelefono,
          descripcion: userProfile.descripcion
        });

        console.log("Obteniendo perfil del usuario...");
        let profile = null;
        try {
          profile = await authAPI.getProfile();
          console.log("Perfil obtenido:", profile);
        } catch (profileError) {
          console.log("Perfil no encontrado, continuando sin perfil:", profileError);
          profile = null;
        }

        // Calculate age from birth date
        const birthDate = new Date(userProfile.fechanacimiento);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear() -
          (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);

        const profileData = {
          name: `${userProfile.nombres} ${userProfile.apellidos}`,
          status: profile.estado || "",
          age: age,
          location: profile.ubicacion?.nombre || "No especificado",
          about: userProfile.descripcion || "Sin descripción",
          interests: profile.hobbies ? profile.hobbies.split(',').map((h: string) => h.trim()) : [],
          programa_academico: profile.programa_academico?.nombre || "No especificado",
          telefono: userProfile.numerotelefono || profile.telefono || "",
          images: [
            "/images/profile1.jpg",
            "/images/profile2.jpg",
            "/images/profile3.jpg",
          ],
        };

        console.log("Datos del perfil preparados:", profileData);
        setProfileData(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleEditPreferences = () => {
    // Navigate to dashboard and open filters modal
    closeModals();
    navigate('/');
    // The dashboard will be shown and filters can be configured there
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF6F5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E74C3C] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF6F5]">
        <div className="text-center">
          <p className="text-gray-600">No se pudo cargar el perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-center items-center gap-12 bg-[#FFF6F5] px-6 py-10">
      <ProfileCarousel images={profileData.images} />

      <div className="max-w-md space-y-6">
        <ProfileInfo {...profileData} />
        <div className="flex justify-center md:justify-start gap-6 mt-6">
          <button
            onClick={handleEditProfile}
            className="bg-[#E74C3C] text-white px-6 py-2 rounded-lg shadow-md hover:opacity-90"
          >
            Editar Perfil
          </button>
          <button
            onClick={handleEditPreferences}
            className="bg-[#E74C3C] text-white px-6 py-2 rounded-lg shadow-md hover:opacity-90"
          >
            Preferencias
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
