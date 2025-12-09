import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@hooks/use-toast";
import api from "@lib/api";
import { authAPI } from "@lib/api";
import ProfileCarousel from "./ProfileCarousel";
import ProfileInfo from "./ProfileInfo";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { likeAPI } from "@lib/api";
import MatchSuccessSlide from "../../matching/components/MatchSuccessSlide";

/**
 * Sanitiza una cadena de texto para prevenir inyecciones XSS
 * Elimina caracteres peligrosos y limita la longitud
 */
const sanitizeString = (input: unknown, maxLength: number = 1000): string => {
  if (input === null || input === undefined) {
    return "";
  }

  let str = String(input);

  // Limitar longitud
  if (str.length > maxLength) {
    str = str.substring(0, maxLength);
  }

  // Eliminar caracteres de control y caracteres peligrosos para HTML
  str = str
    .replace(/[\x00-\x1F\x7F]/g, "") // Caracteres de control
    .replace(/[<>]/g, ""); // Caracteres HTML básicos

  return str.trim();
};

/**
 * Sanitiza un array de strings
 */
const sanitizeStringArray = (input: unknown): string[] => {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => sanitizeString(item, 100))
    .filter((item) => item.length > 0);
};

/**
 * Valida que el userId sea un número válido
 */
const validateUserId = (userId: number | string): number | null => {
  if (typeof userId === "number") {
    return userId > 0 ? userId : null;
  }

  if (typeof userId === "string") {
    const parsed = parseInt(userId, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return null;
};

const OtherUserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const location = useLocation();
  // Obtener estado de match desde la navegación (default false si no viene)
  const [isMatch, setIsMatch] = useState<boolean>(location.state?.match || false);
  const [matchSuccessData, setMatchSuccessData] = useState<{
    name: string;
    photoUrl?: string;
    id: number | string;
  } | null>(null);

  useEffect(() => {
    if (!location.state?.allowed) {
      toast({
        title: "Acceso denegado",
        description: "No puedes acceder directamente a este perfil.",
        variant: "destructive",
      });

      navigate("/", { replace: true });
      return; // <- evita cargar datos innecesarios
    }
  }, [location.state, toast, navigate]);

  useEffect(() => {
    const fetchOtherUserProfile = async () => {
      // Validar userId
      const validUserId = validateUserId(userId || "");
      if (!validUserId) {
        setError("ID de usuario inválido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Obtener el perfil del usuario (similar a ProfilePage pero para otro usuario)
        let profile = null;
        try {
          const profileResponse = await api.get(
            `/profile/profileManagement/${validUserId}/`
          );
          profile = profileResponse.data;
        } catch (profileError: any) {
          if (profileError.response?.status === 404) {
            throw new Error("Perfil no encontrado");
          }
          throw profileError;
        }

        if (!profile) {
          throw new Error("Perfil no encontrado");
        }

        // Obtener los datos del usuario asociado al perfil
        // El backend ahora devuelve los datos completos del usuario en profile.usuario
        let userProfile: any = null;

        // El backend devuelve el objeto usuario completo con todos los campos
        if (profile.usuario && typeof profile.usuario === "object") {
          // Verificar si tiene usuario_id (datos completos del usuario)
          if (profile.usuario.usuario_id) {
            userProfile = profile.usuario;
          } else {
            // Si no tiene usuario_id, puede ser solo el ID numérico
            userProfile = {
              nombres: "Usuario",
              apellidos: "",
              fechanacimiento: null,
              descripcion: "",
            };
          }
        } else {
          // Si no hay datos del usuario, usar valores por defecto
          userProfile = {
            nombres: "Usuario",
            apellidos: "",
            fechanacimiento: null,
            descripcion: "",
          };
        }

        // Cargar catálogos por si el backend retorna IDs (igual que ProfilePage)
        let degreesCatalog: any[] = [];
        let locationsCatalog: any[] = [];
        try {
          const [degRes, locRes] = await Promise.all([
            authAPI.getDegrees(),
            authAPI.getLocations(),
          ]);
          degreesCatalog = Array.isArray(degRes)
            ? degRes
            : degRes?.results || [];
          locationsCatalog = Array.isArray(locRes)
            ? locRes
            : locRes?.results || [];
        } catch (catalogError) {
        }

        // Calculate age from birth date (igual que ProfilePage)
        let age = 0;
        if (userProfile.fechanacimiento) {
          try {
            const birthDate = new Date(userProfile.fechanacimiento);
            const today = new Date();
            age =
              today.getFullYear() -
              birthDate.getFullYear() -
              (today <
              new Date(
                today.getFullYear(),
                birthDate.getMonth(),
                birthDate.getDate()
              )
                ? 1
                : 0);
          } catch (e) {
            age = 0;
          }
        }

        // Procesar programa académico (igual que ProfilePage)
        const programaObj = profile?.programa_academico;
        const programaId = programaObj?.programa_id ?? programaObj ?? null;
        const programaDesc =
          programaObj?.descripcion ||
          degreesCatalog.find(
            (d: any) => (d.programa_id ?? d.id) === programaId
          )?.descripcion ||
          programaObj?.nombre ||
          "No especificado";

        // Procesar ubicación (igual que ProfilePage)
        const ubicacionObj = profile?.ubicacion;
        const ubicacionId = ubicacionObj?.ubicacion_id ?? ubicacionObj ?? null;
        const ubicacionDesc =
          ubicacionObj?.descripcion ||
          locationsCatalog.find(
            (l: any) => (l.ubicacion_id ?? l.id) === ubicacionId
          )?.descripcion ||
          ubicacionObj?.nombre ||
          "No especificado";

        // Sanitizar todos los datos antes de usarlos
        const sanitizedName = sanitizeString(
          userProfile.nombres && userProfile.apellidos
            ? `${userProfile.nombres} ${userProfile.apellidos}`
            : userProfile.nombres || "Usuario"
        );
        const sanitizedStatus = sanitizeString(profile.estado || "", 50);
        const sanitizedLocation = sanitizeString(ubicacionDesc, 100);
        const sanitizedAbout = sanitizeString(
          userProfile.descripcion || "Sin descripción",
          500
        );
        const sanitizedInterests = sanitizeStringArray(
          profile.hobbies
            ? profile.hobbies.split(",").map((h: string) => h.trim())
            : []
        );
        const sanitizedPrograma = sanitizeString(programaDesc, 100);
        const sanitizedEstatura =
          typeof profile.estatura === "number" && profile.estatura > 0
            ? profile.estatura
            : undefined;

        // Preparar datos del perfil (igual estructura que ProfilePage)
        const preparedProfileData = {
          name: sanitizedName,
          status: sanitizedStatus,
          age: age > 0 ? age : undefined,
          location: sanitizedLocation,
          about: sanitizedAbout,
          interests: sanitizedInterests,
          programa_academico: sanitizedPrograma,
          estatura: sanitizedEstatura,
          images:
            profile.images &&
            Array.isArray(profile.images) &&
            profile.images.length > 0
              ? profile.images.map((img: any) => {
                  const imageUrl = img.imagen;
                  if (imageUrl.startsWith("http")) return imageUrl;
                  const baseUrl = import.meta.env.VITE_API_BASE_URL;
                  return `${baseUrl}${
                    imageUrl.startsWith("/") ? "" : "/"
                  }${imageUrl}`;
                })
              : [
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(sanitizedName) +
                    "&background=random&size=400",
                ],
        };

        setProfileData(preparedProfileData);
      } catch (err: any) {

        // Manejo seguro de errores sin exponer detalles internos
        let errorMessage = "No se pudo cargar el perfil";

        if (err.response) {
          // Error de respuesta del servidor
          if (err.response.status === 404) {
            errorMessage = "Perfil no encontrado";
          } else if (err.response.status === 403) {
            errorMessage = "No tienes permiso para ver este perfil";
          } else if (err.response.status >= 500) {
            errorMessage = "Error del servidor. Por favor, intenta más tarde";
          }
        } else if (err.request) {
          // Error de red
          errorMessage = "Error de conexión. Verifica tu conexión a internet";
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOtherUserProfile();
    }
    if (userId) {
      fetchOtherUserProfile();
    }
  }, [userId, toast]);

  const handleLike = async () => {
    if (!profileData || !userId) return;

    try {
      const response = await likeAPI.sendLike(userId);

      if (response.match_found) {
        setMatchSuccessData({
          name: profileData.name,
          photoUrl: profileData.images?.[0],
          id: (response as any).chat_id || userId
        });
        setIsMatch(true); // Ya es match
      } else {
        toast({
          title: "Like enviado",
          description: "Has dado like a este perfil",
        });
        // Opcional: Desactivar botones o cambiar estado si solo se permite un like
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo enviar el like",
        variant: "destructive",
      });
    }
  };

  const handleDislike = async () => {
    if (!userId) return;
    try {
      await likeAPI.sendDislike(userId);
      toast({
        title: "Dislike enviado",
        description: "Has descartado este perfil",
      });
      navigate(-1); // Volver atrás después de dislike?
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo enviar el dislike",
        variant: "destructive",
      });
    }
  };

  // Estado de carga (igual que ProfilePage)
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

  // Estado de error
  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF6F5]">
        <div className="text-center">
          <p className="text-gray-600 text-lg">
            {error || "No se pudo cargar el perfil"}
          </p>
        </div>
      </div>
    );
  }

  // Renderizar perfil (igual estructura visual que ProfilePage pero sin botón de editar)
  return (
    <div className="relative min-h-screen bg-[#FFF6F5] px-4 sm:px-6 py-8 sm:py-12 md:py-16 lg:py-20 flex items-center justify-center">
      {/* BOTÓN REGRESAR */}
      <button
        onClick={() => {
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate("/", { replace: true });
          }
        }}
        className="fixed top-5 left-4 sm:left-20 z-50
             bg-white/70 backdrop-blur-md border border-white/50
             shadow-lg hover:bg-white text-[#E74C3C] font-semibold
             px-4 py-2 rounded-full transition-all flex items-center 
             gap-2 text-lg"
      >
        <span className="text-2xl sm:text-3xl font-bold">←</span>
        <span className="hidden sm:inline">Regresar</span>
      </button>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-15 -top-24 h-72 w-72 rounded-full bg-[#E74C3C]/10 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-[#E74C3C]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#E74C3C]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 xl:gap-16">
        {/* Imágenes - Izquierda */}
        <div className="flex justify-center lg:col-span-5 lg:justify-end order-2 lg:order-1">
          <ProfileCarousel images={profileData.images} />
        </div>

        {/* Información del perfil - Derecha */}
        <div className="w-full lg:col-span-7 order-1 lg:order-2">
          <div className="rounded-3xl bg-white/80 backdrop-blur-md p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl border border-white/50">
            <div className="space-y-8">
              <ProfileInfo {...profileData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfilePage;
