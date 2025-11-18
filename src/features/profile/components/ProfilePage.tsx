import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { useToast } from "@/hooks/use-toast";
<<<<<<< Updated upstream
import { authAPI } from "@/lib/api";
=======
import { authAPI, photoAPI } from "@/lib/api";
>>>>>>> Stashed changes
import ProfileCarousel from "./ProfileCarousel";
import ProfileInfo from "./ProfileInfo";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState<any>(null);
<<<<<<< Updated upstream
=======
  const [userImages, setUserImages] = useState<string[]>([]);
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
        const userProfile = userResponse.user;
>>>>>>> Stashed changes

        console.log("Obteniendo perfil del usuario...");
        let profile = null;
        try {
          profile = await authAPI.getProfile();
          console.log("Perfil obtenido:", profile);
        } catch (profileError) {
<<<<<<< Updated upstream
          console.log("Perfil no encontrado, continuando sin perfil:", profileError);
          profile = null;
        }

        // Cargar catálogos por si el backend retorna IDs
=======
          console.log("Perfil no encontrado:", profileError);
          profile = null;
        }

        // 🔥 OBTENER IMÁGENES REALES DEL USUARIO - CORREGIDO
        console.log("Obteniendo imágenes del usuario...");
        let userPhotos: string[] = [];
        try {
          const photosResponse = await photoAPI.getPhotos();
          console.log("🔍 Respuesta CRUDA de imágenes:", photosResponse);
          
          // La respuesta tiene estructura {count, next, previous, results}
          if (photosResponse && photosResponse.results && Array.isArray(photosResponse.results)) {
            userPhotos = photosResponse.results.map((photo: any) => {
              console.log("🔍 Procesando foto:", photo);
              
              if (photo.imagen) {
                const imageUrl = photo.imagen;
                console.log("🔍 URL de imagen encontrada:", imageUrl);
                
                // 🔥 CORRECCIÓN: Verificar si ya es una URL completa
                if (imageUrl.startsWith('http')) {
                  return imageUrl; // Ya es URL completa, usar directamente
                }
                
                // 🔥 CORRECCIÓN: Si es una ruta de media, construir URL correcta
                if (imageUrl.startsWith('/media/')) {
                  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                  // Remover el /api/v1/ duplicado que se estaba agregando
                  return `${baseUrl}${imageUrl}`;
                }
                
                // Para cualquier otra ruta relativa
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
              }
              
              return "";
            }).filter(url => url !== "" && url !== null && url !== undefined);
          }
          
          console.log("✅ Imágenes procesadas:", userPhotos);
        } catch (photosError) {
          console.error("❌ Error obteniendo imágenes:", photosError);
          userPhotos = [];
        }

        // Si no hay imágenes, usar algunas de prueba locales
        if (userPhotos.length === 0) {
          console.log("⚠️ No se encontraron imágenes, usando imágenes de prueba locales");
          userPhotos = [
            "/images/profile1.jpg",
            "/images/profile2.jpg", 
            "/images/profile3.jpg",
          ];
        }

        // Cargar catálogos
>>>>>>> Stashed changes
        let degreesCatalog: any[] = [];
        let locationsCatalog: any[] = [];
        try {
          const [degRes, locRes] = await Promise.all([
            authAPI.getDegrees(),
            authAPI.getLocations(),
          ]);
          degreesCatalog = Array.isArray(degRes) ? degRes : degRes?.results || [];
          locationsCatalog = Array.isArray(locRes) ? locRes : locRes?.results || [];
        } catch {}

        // Calculate age from birth date
        const birthDate = new Date(userProfile.fechanacimiento);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear() -
          (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);

        const programaObj = profile?.programa_academico;
        const programaId = programaObj?.programa_id ?? programaObj ?? null;
        const programaDesc = programaObj?.descripcion
          || degreesCatalog.find((d: any) => (d.programa_id ?? d.id) === programaId)?.descripcion
          || programaObj?.nombre
          || "No especificado";

        const ubicacionObj = profile?.ubicacion;
        const ubicacionId = ubicacionObj?.ubicacion_id ?? ubicacionObj ?? null;
        const ubicacionDesc = ubicacionObj?.descripcion
          || locationsCatalog.find((l: any) => (l.ubicacion_id ?? l.id) === ubicacionId)?.descripcion
          || ubicacionObj?.nombre
          || "No especificado";

        const profileData = {
          name: `${userProfile.nombres} ${userProfile.apellidos}`,
<<<<<<< Updated upstream
          status: profile.estado || "",
          age: age,
          location: ubicacionDesc,
          about: userProfile.descripcion || "Sin descripción",
          interests: profile.hobbies ? profile.hobbies.split(',').map((h: string) => h.trim()) : [],
          programa_academico: programaDesc,
          estatura: profile.estatura || undefined,
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
=======
          status: profile?.estado || "",
          age: age,
          location: ubicacionDesc,
          about: userProfile.descripcion || "Sin descripción",
          interests: profile?.hobbies ? profile.hobbies.split(',').map((h: string) => h.trim()) : [],
          programa_academico: programaDesc,
          estatura: profile?.estatura || undefined,
        };

        console.log("📊 Datos del perfil preparados:", profileData);
        console.log("🖼️ Imágenes del usuario:", userPhotos);
        
        setProfileData(profileData);
        setUserImages(userPhotos);
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleEditPreferences = () => {
<<<<<<< Updated upstream
    // Navigate to dashboard and open filters modal
    closeModals();
    navigate('/');
    // The dashboard will be shown and filters can be configured there
=======
    closeModals();
    navigate('/');
>>>>>>> Stashed changes
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
    <div className="relative min-h-screen bg-[#FFF6F5] px-4 sm:px-6 py-8 sm:py-12 md:py-16 lg:py-20 flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#E74C3C]/10 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-[#E74C3C]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#E74C3C]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 xl:gap-16">
        {/* Imágenes - Izquierda */}
        <div className="flex justify-center lg:col-span-5 lg:justify-end order-2 lg:order-1">
<<<<<<< Updated upstream
          <ProfileCarousel images={profileData.images} />
=======
          <ProfileCarousel images={userImages} />
>>>>>>> Stashed changes
        </div>

        {/* Información del perfil - Derecha */}
        <div className="w-full lg:col-span-7 order-1 lg:order-2">
          <div className="rounded-3xl bg-white/80 backdrop-blur-md p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl border border-white/50">
            <div className="space-y-8">
              <ProfileInfo {...profileData} />
              
              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 border-t border-gray-200/50">
                <button
                  onClick={handleEditProfile}
                  className="bg-gradient-to-r from-[#E74C3C] to-[#C0392B] text-white px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E74C3C] text-base font-semibold"
                  aria-label="Editar perfil"
                >
                  Editar Perfil
                </button>
                <button
                  onClick={handleEditPreferences}
                  className="bg-white text-[#E74C3C] px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border-2 border-[#E74C3C]/30 hover:bg-[#E74C3C]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E74C3C] text-base font-semibold"
                  aria-label="Abrir preferencias"
                >
                  Preferencias
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< Updated upstream
export default ProfilePage;
=======
export default ProfilePage;
>>>>>>> Stashed changes
