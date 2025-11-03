import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";
import { interests } from "../data/interests";

const EditProfilePage = () => {
  const [height, setHeight] = useState(1.5);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [degrees, setDegrees] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [isTelefonoLocked, setIsTelefonoLocked] = useState(false);
  const [isProgramaLocked, setIsProgramaLocked] = useState(false);
  const [formData, setFormData] = useState({
    telefono: "",
    nombres: "",
    apellidos: "",
    descripcion: "",
    programa_academico: "",
    ubicacion: "",
  });

  const { user } = useAppStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        console.log("Cargando datos del perfil para edición...");

        // Obtener datos del usuario primero (siempre existen)
        const userResponse = await authAPI.getUserProfile();
        console.log("Respuesta completa del usuario:", userResponse);

        // El backend devuelve { estado, should_complete_profile, user }
        const userProfileData = userResponse.user;
        console.log("Datos del usuario extraídos:", userProfileData);

        if (!userProfileData) {
          throw new Error("No se pudieron obtener los datos del usuario");
        }

        setUserProfile(userProfileData);

        // Intentar obtener datos del perfil (pueden no existir)
        let profile = null;
        try {
          profile = await authAPI.getProfile();
          console.log("Datos del perfil obtenidos:", profile);
        } catch (profileError) {
          console.log("Perfil no encontrado, usando valores por defecto:", profileError);
          profile = null;
        }

        // Cargar catálogos en paralelo
        try {
          const [degreesRes, locationsRes] = await Promise.all([
            authAPI.getDegrees(),
            authAPI.getLocations(),
          ]);
          setDegrees(Array.isArray(degreesRes) ? degreesRes : degreesRes?.results || []);
          setLocations(Array.isArray(locationsRes) ? locationsRes : locationsRes?.results || []);
        } catch (catalogError) {
          console.log("No se pudieron cargar catálogos:", catalogError);
        }

        const programaValue = profile?.programa_academico;
        const ubicacionValue = profile?.ubicacion;

        const normalizedPhone = (userProfileData.numerotelefono && userProfileData.numerotelefono !== "0000000000")
          ? userProfileData.numerotelefono
          : "";

        const programaAcademicoValue = typeof programaValue === 'number' ? String(programaValue) : (programaValue?.programa_id?.toString() || "");

        setFormData({
          telefono: normalizedPhone,
          nombres: userProfileData.nombres || "",
          apellidos: userProfileData.apellidos || "",
          descripcion: userProfileData.descripcion || "",
          // Aceptar tanto id plano como objeto con *_id
          programa_academico: programaAcademicoValue,
          ubicacion: typeof ubicacionValue === 'number' ? String(ubicacionValue) : (ubicacionValue?.ubicacion_id?.toString() || ""),
        });

        // Establecer estados de bloqueo basados en valores guardados existentes
        setIsTelefonoLocked(normalizedPhone !== "" && normalizedPhone !== "0000000000");
        setIsProgramaLocked(programaAcademicoValue !== "");

        setHeight(profile?.estatura || 1.5);
        setSelectedInterests(profile?.hobbies ? profile.hobbies.split(',').map((h: string) => h.trim()) : []);

        console.log("Datos del formulario preparados:", {
          telefono: normalizedPhone,
          nombres: userProfileData.nombres || "",
          apellidos: userProfileData.apellidos || "",
          descripcion: userProfileData.descripcion || "",
          programa_academico: typeof programaValue === 'number' ? String(programaValue) : (programaValue?.programa_id?.toString() || ""),
          ubicacion: typeof ubicacionValue === 'number' ? String(ubicacionValue) : (ubicacionValue?.ubicacion_id?.toString() || ""),
          estatura: profile?.estatura || 1.5,
          hobbies: profile?.hobbies ? profile.hobbies.split(',').map((h: string) => h.trim()) : [],
          fechanacimiento: userProfileData.fechanacimiento,
          genero_id: userProfileData.genero_id
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar los datos del perfil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [toast]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < 3) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1) Actualizar datos de usuario: descripción y número de teléfono
      await authAPI.updateUserProfileDescription({
        descripcion: formData.descripcion,
        numerotelefono: formData.telefono,
      });

      // Refrescar inmediatamente el teléfono desde backend para reflejarlo en el formulario
      try {
        const refreshed = await authAPI.getUserProfile();
        const refreshedUser = refreshed?.user;
        const refreshedPhone = (refreshedUser?.numerotelefono && refreshedUser.numerotelefono !== "0000000000") ? refreshedUser.numerotelefono : "";
        setFormData(prev => ({ ...prev, telefono: refreshedPhone }));
        
        // Bloquear teléfono si tiene valor después de guardar
        if (refreshedPhone !== "" && refreshedPhone !== "0000000000") {
          setIsTelefonoLocked(true);
        }
      } catch (e) {
        console.warn("No se pudo refrescar el usuario tras guardar teléfono", e);
      }

      // 2) Actualizar datos del perfil (usar nombres de FK del backend)
      const profileData = {
        programa_academico: formData.programa_academico ? parseInt(formData.programa_academico) : null,
        ubicacion: formData.ubicacion ? parseInt(formData.ubicacion) : null,
        estatura: height,
        hobbies: selectedInterests.join(', '),
      };

      console.log("Guardando datos del perfil:", profileData);
      await authAPI.updateProfileData(profileData);

      // Bloquear programa académico si tiene valor después de guardar
      if (formData.programa_academico && formData.programa_academico !== "") {
        setIsProgramaLocked(true);
      }

      toast({
        title: "Éxito",
        description: "Perfil actualizado correctamente",
      });

      navigate('/profile');
    } catch (error: any) {
      console.error("Error updating profile:", error);
      console.error("Error response data:", error.response?.data);

      let errorMessage = "No se pudo actualizar el perfil";
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'object') {
          const firstError = Object.values(data)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF6F5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E74C3C] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF6F5] flex flex-col items-center py-10 px-6">
      <h1 className="text-2xl font-bold mb-2">Editar Perfil</h1>
      <p className="text-gray-500 mb-6">
        Edita tu información y agrega tu toque personal
      </p>

      <form className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        <div>
          <label className="text-gray-500">Correo Institucional (No modificable)</label>
          <input
            type="email"
            value={userProfile?.email || user?.email || ""}
            className="w-full border rounded-md px-3 py-2 mt-1 bg-gray-100 text-gray-500"
            disabled
          />

          <label className={`mt-4 block ${isTelefonoLocked ? 'text-gray-500' : ''}`}>
            Número de Teléfono {isTelefonoLocked && '(No modificable)'}
          </label>
          <input
            type="text"
            value={formData.telefono}
            onChange={(e) => handleInputChange('telefono', e.target.value)}
            disabled={isTelefonoLocked}
            className={`w-full border rounded-md px-3 py-2 mt-1 ${
              isTelefonoLocked ? 'bg-gray-100 text-gray-500' : ''
            }`}
          />

          <label className="mt-4 block text-gray-500">Nombres (No modificable)</label>
          <input
            type="text"
            value={formData.nombres}
            className="w-full border rounded-md px-3 py-2 mt-1 bg-gray-100 text-gray-500"
            disabled
          />

          <label className="mt-4 block text-gray-500">Apellidos (No modificable)</label>
          <input
            type="text"
            value={formData.apellidos}
            className="w-full border rounded-md px-3 py-2 mt-1 bg-gray-100 text-gray-500"
            disabled
          />

          <label className="mt-4 block">Descripción</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => handleInputChange('descripcion', e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1"
            rows={3}
            placeholder="Cuéntanos sobre ti..."
          />
        </div>

        <div>
          <label className={isProgramaLocked ? 'text-gray-500' : ''}>
            Programa Académico {isProgramaLocked && '(No modificable)'}
          </label>
          <select
            value={formData.programa_academico}
            onChange={(e) => handleInputChange('programa_academico', e.target.value)}
            disabled={isProgramaLocked}
            className={`w-full border rounded-md px-3 py-2 mt-1 ${
              isProgramaLocked ? 'bg-gray-100 text-gray-500' : 'bg-white'
            }`}
          >
            <option value="">Selecciona tu programa</option>
            {degrees.map((deg: any) => (
              <option key={deg.programa_id ?? deg.id} value={(deg.programa_id ?? deg.id)}>{deg.descripcion ?? deg.nombre ?? deg.name}</option>
            ))}
          </select>

          <label className="mt-4 block">Ubicación</label>
          <select
            value={formData.ubicacion}
            onChange={(e) => handleInputChange('ubicacion', e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1 bg-white"
          >
            <option value="">Selecciona tu ubicación</option>
            {locations.map((loc: any) => (
              <option key={loc.ubicacion_id ?? loc.id} value={(loc.ubicacion_id ?? loc.id)}>{loc.descripcion ?? loc.nombre ?? loc.name}</option>
            ))}
          </select>

          <label className="mt-4 block">Estatura: {height.toFixed(2)} m</label>
          <input
            type="range"
            min="1.4"
            max="2.0"
            step="0.01"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full accent-[#E74C3C]"
          />

          <label className="mt-4 block">Intereses</label>
          <p className="text-sm text-gray-500 mb-2">
            Elige hasta 3 temas que te representen
          </p>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1 rounded-full border ${
                  selectedInterests.includes(interest)
                    ? "bg-[#E74C3C] text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </form>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-8 bg-[#E74C3C] text-white px-10 py-2 rounded-lg shadow-md hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
};

export default EditProfilePage;
