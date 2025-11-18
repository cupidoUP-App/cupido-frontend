import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";
import { interests } from "../data/interests";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const estados = [
  "Ganoso de arrunchis",
  "Buscando calor humano",
  "Ganoso de detonar 💣",
  "Listo pa' mimar",
  "Buscando match real",
  "Pura malicia",
  "arrunchis como empanada",
  "vamonos de perucho",
];

const EditProfilePage = () => {
  const [height, setHeight] = useState(1.5);
  const [initialHeight, setInitialHeight] = useState<number | null>(null);
  const [heightHasChanged, setHeightHasChanged] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [degrees, setDegrees] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [isTelefonoLocked, setIsTelefonoLocked] = useState(false);
  const [isProgramaLocked, setIsProgramaLocked] = useState(false);
  const [isHeightLocked, setIsHeightLocked] = useState(false);
  const [telefonoError, setTelefonoError] = useState<string>("");
  const [programaSearchQuery, setProgramaSearchQuery] = useState("");
  const [isProgramaDropdownOpen, setIsProgramaDropdownOpen] = useState(false);
  const [highlightedProgramaIndex, setHighlightedProgramaIndex] = useState(-1);
  const programaInputRef = useRef<HTMLInputElement>(null);
  const programaDropdownRef = useRef<HTMLDivElement>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [initialTelefono, setInitialTelefono] = useState<string>("");
  const [initialProgramaAcademico, setInitialProgramaAcademico] = useState<string>("");
  const [isDraggingHeight, setIsDraggingHeight] = useState(false);
  const [heightTooltipPosition, setHeightTooltipPosition] = useState<number>(0);
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
          console.log("Respuesta completa de degrees:", degreesRes);
          const degreesArray = Array.isArray(degreesRes) ? degreesRes : (degreesRes?.results || []);
          console.log(`Programas académicos cargados: ${degreesArray.length}`);
          setDegrees(degreesArray);
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

        // Guardar valores iniciales para detectar cambios
        setInitialTelefono(normalizedPhone);
        setInitialProgramaAcademico(programaAcademicoValue);

        // Establecer estados de bloqueo basados en valores guardados existentes
        const phoneLocked = normalizedPhone !== "" && normalizedPhone !== "0000000000";
        setIsTelefonoLocked(phoneLocked);
        setIsProgramaLocked(programaAcademicoValue !== "");
        
        // Limpiar error de teléfono si está bloqueado o si está vacío
        if (phoneLocked || normalizedPhone === "") {
          setTelefonoError("");
        }

        const profileHeight = profile?.estatura || 1.5;
        setHeight(profileHeight);
        setInitialHeight(profileHeight);
        setHeightHasChanged(false);
        // Si hay estatura guardada (no es el valor por defecto), bloquear el campo
        setIsHeightLocked(profile?.estatura !== null && profile?.estatura !== undefined);
        setSelectedInterests(profile?.hobbies ? profile.hobbies.split(',').map((h: string) => h.trim()) : []);
        setSelectedEstado(profile?.estado || "");

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

  // Validar y formatear número de teléfono
  const handleTelefonoChange = (value: string) => {
    // Solo permitir números
    const numericValue = value.replace(/\D/g, '');
    
    // Limitar a 10 dígitos máximo
    const limitedValue = numericValue.slice(0, 10);
    
    // Validar solo si hay contenido
    if (limitedValue.length === 0) {
      setTelefonoError("");
    } else if (limitedValue[0] !== '3') {
      setTelefonoError("El número debe empezar con 3");
    } else if (limitedValue.length < 10) {
      setTelefonoError("El número debe tener 10 dígitos");
    } else {
      setTelefonoError(""); // Limpiar error si está completo y válido
    }
    
    handleInputChange('telefono', limitedValue);
  };

  // Función para normalizar texto quitando tildes y convirtiendo a minúsculas
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Elimina diacríticos (tildes)
  };

  // Filtrar programas académicos basado en la búsqueda (ignorando tildes)
  const filteredDegrees = degrees.filter((deg: any) => {
    const searchTerm = normalizeText(programaSearchQuery);
    const programName = normalizeText(deg.descripcion ?? deg.nombre ?? deg.name ?? "");
    return programName.includes(searchTerm);
  });

  // Obtener el programa seleccionado para mostrar su nombre
  const selectedDegree = degrees.find((deg: any) => 
    String(deg.programa_id ?? deg.id) === formData.programa_academico
  );
  const selectedDegreeName = selectedDegree 
    ? (selectedDegree.descripcion ?? selectedDegree.nombre ?? selectedDegree.name ?? "")
    : "";

  // Manejar selección de programa académico
  const handleProgramaSelect = (degree: any) => {
    const degreeId = String(degree.programa_id ?? degree.id);
    const degreeName = degree.descripcion ?? degree.nombre ?? degree.name ?? "";
    handleInputChange('programa_academico', degreeId);
    setProgramaSearchQuery(degreeName);
    setIsProgramaDropdownOpen(false);
    setHighlightedProgramaIndex(-1);
  };

  // Manejar teclas en el input de programa académico
  const handleProgramaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedProgramaIndex(prev => 
        prev < filteredDegrees.length - 1 ? prev + 1 : prev
      );
      setIsProgramaDropdownOpen(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedProgramaIndex(prev => prev > 0 ? prev - 1 : -1);
      setIsProgramaDropdownOpen(true);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedProgramaIndex >= 0 && filteredDegrees[highlightedProgramaIndex]) {
        handleProgramaSelect(filteredDegrees[highlightedProgramaIndex]);
      } else if (filteredDegrees.length === 1) {
        handleProgramaSelect(filteredDegrees[0]);
      }
    } else if (e.key === 'Escape') {
      setIsProgramaDropdownOpen(false);
      setHighlightedProgramaIndex(-1);
    }
  };

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        programaInputRef.current &&
        !programaInputRef.current.contains(event.target as Node) &&
        programaDropdownRef.current &&
        !programaDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProgramaDropdownOpen(false);
        // Si hay un programa seleccionado, mostrar su nombre; si no, limpiar el input
        if (formData.programa_academico && selectedDegreeName) {
          setProgramaSearchQuery(selectedDegreeName);
        } else {
          setProgramaSearchQuery("");
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formData.programa_academico, selectedDegreeName]);

  // Establecer el texto de búsqueda del programa académico cuando se carga el perfil o cambian los degrees
  useEffect(() => {
    if (formData.programa_academico && degrees.length > 0) {
      const selectedDegree = degrees.find((deg: any) => 
        String(deg.programa_id ?? deg.id) === formData.programa_academico
      );
      if (selectedDegree) {
        const degreeName = selectedDegree.descripcion ?? selectedDegree.nombre ?? selectedDegree.name ?? "";
        setProgramaSearchQuery(degreeName);
      }
    }
  }, [degrees, formData.programa_academico]);

  // Detectar si se modificaron campos irreversibles
  const hasIrreversibleChanges = () => {
    const telefonoChanged = !isTelefonoLocked && formData.telefono !== initialTelefono && formData.telefono !== "";
    const programaChanged = !isProgramaLocked && formData.programa_academico !== initialProgramaAcademico && formData.programa_academico !== "";
    const estaturaChanged = heightHasChanged && initialHeight !== null;
    
    return telefonoChanged || programaChanged || estaturaChanged;
  };

  // Obtener lista de campos modificados
  const getModifiedFields = () => {
    const fields: string[] = [];
    if (!isTelefonoLocked && formData.telefono !== initialTelefono && formData.telefono !== "") {
      fields.push("Número de Teléfono");
    }
    if (!isProgramaLocked && formData.programa_academico !== initialProgramaAcademico && formData.programa_academico !== "") {
      fields.push("Programa Académico");
    }
    if (heightHasChanged && initialHeight !== null) {
      fields.push("Estatura");
    }
    return fields;
  };

  const handleSave = async () => {
    // Validar teléfono antes de guardar
    if (formData.telefono && !isTelefonoLocked) {
      if (formData.telefono.length !== 10) {
        setTelefonoError("El número debe tener 10 dígitos");
        toast({
          title: "Error",
          description: "El número de teléfono debe tener 10 dígitos",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
      if (formData.telefono[0] !== '3') {
        setTelefonoError("El número debe empezar con 3");
        toast({
          title: "Error",
          description: "El número de teléfono debe empezar con 3",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
    }

    // Verificar si hay cambios irreversibles y mostrar confirmación
    if (hasIrreversibleChanges()) {
      setShowConfirmDialog(true);
      return;
    }

    // Si no hay cambios irreversibles, guardar directamente
    await performSave();
  };

  const performSave = async () => {
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
      // Solo incluir estatura si fue modificada explícitamente
      const profileData: any = {
        programa_academico: formData.programa_academico ? parseInt(formData.programa_academico) : null,
        ubicacion: formData.ubicacion ? parseInt(formData.ubicacion) : null,
        hobbies: selectedInterests.join(', '),
        estado: selectedEstado || null,
      };

      // Solo incluir estatura si fue modificada explícitamente
      if (heightHasChanged && initialHeight !== null) {
        profileData.estatura = height;
      } else if (initialHeight === null) {
        // Si no hay estatura inicial (perfil nuevo), incluirla
        profileData.estatura = height;
      }

      console.log("Guardando datos del perfil:", profileData);
      await authAPI.updateProfileData(profileData);

      // Bloquear programa académico si tiene valor después de guardar
      if (formData.programa_academico && formData.programa_academico !== "") {
        setIsProgramaLocked(true);
      }

      // Si se guardó la estatura, bloquearla y actualizar el valor inicial
      if (profileData.estatura !== undefined) {
        setIsHeightLocked(true);
        setInitialHeight(profileData.estatura);
        setHeight(profileData.estatura);
        setHeightHasChanged(false);
      }

      toast({
        title: "Éxito",
        description: "Perfil actualizado correctamente",
      });

      // Actualizar valores iniciales después de guardar
      setInitialTelefono(formData.telefono);
      setInitialProgramaAcademico(formData.programa_academico);

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
    <>
      {/* Estilos CSS personalizados para el slider de estatura */}
      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 24px;
          background: transparent;
          cursor: pointer;
          position: relative;
        }
        
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 9999px;
          border: none;
          display: block;
          -webkit-appearance: none;
        }
        
        input[type="range"]::-webkit-slider-track {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 9999px;
          border: none;
          display: block;
          -webkit-appearance: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #E74C3C;
          border-radius: 50%;
          cursor: grab;
          margin-top: -9px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.1s ease;
          position: relative;
          z-index: 1;
        }
        
        input[type="range"]:active::-webkit-slider-thumb {
          cursor: grabbing;
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(231, 76, 60, 0.4);
        }
        
        input[type="range"]::-moz-range-track {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 9999px;
          border: none;
        }
        
        input[type="range"]::-moz-range-progress {
          height: 6px;
          background: #E74C3C;
          border-radius: 9999px;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #E74C3C;
          border: none;
          border-radius: 50%;
          cursor: grab;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.1s ease;
        }
        
        input[type="range"]:active::-moz-range-thumb {
          cursor: grabbing;
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(231, 76, 60, 0.4);
        }
        
        input[type="range"]:disabled {
          cursor: not-allowed;
        }
        
        input[type="range"]:disabled::-webkit-slider-track {
          background: #d1d5db;
        }
        
        input[type="range"]:disabled::-webkit-slider-thumb {
          cursor: not-allowed;
          background: #9ca3af;
        }
        
        input[type="range"]:disabled::-moz-range-track {
          background: #d1d5db;
        }
        
        input[type="range"]:disabled::-moz-range-thumb {
          cursor: not-allowed;
          background: #9ca3af;
        }
      `}</style>
    <div className="min-h-screen bg-[#FFF6F5] flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#E74C3C] to-[#C0392B] bg-clip-text text-transparent">
            Editar Perfil
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#E74C3C] to-[#C0392B] mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">
            Edita tu información y agrega tu toque personal
          </p>
        </div>

      <form className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Columna 1: Información Personal */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Información Personal</h2>
          
          <div>
            <label className="text-gray-500 text-sm">Correo Institucional</label>
            <input
              type="email"
              value={userProfile?.email || user?.email || ""}
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-500 text-sm"
              disabled
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isTelefonoLocked ? 'text-gray-500' : 'text-gray-700'}`}>
              Número de Teléfono {isTelefonoLocked && <span className="text-xs">(No modificable)</span>}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.telefono}
              onChange={(e) => handleTelefonoChange(e.target.value)}
              disabled={isTelefonoLocked}
              placeholder="3001234567"
              maxLength={10}
              className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                isTelefonoLocked ? 'bg-gray-100 text-gray-500' : 'bg-white'
              } ${telefonoError ? 'border-red-500' : 'border-gray-300'}`}
            />
            {telefonoError && !isTelefonoLocked && (
              <p className="text-red-500 text-xs mt-1">{telefonoError}</p>
            )}
            {!telefonoError && formData.telefono && !isTelefonoLocked && (
              <p className="text-gray-500 text-xs mt-1">
                {formData.telefono.length}/10 dígitos
              </p>
            )}
          </div>

          <div>
            <label className="text-gray-500 text-sm">Nombres</label>
            <input
              type="text"
              value={formData.nombres}
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-500 text-sm"
              disabled
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">Apellidos</label>
            <input
              type="text"
              value={formData.apellidos}
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-500 text-sm"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm resize-none"
              rows={4}
              placeholder="Cuéntanos sobre ti..."
            />
          </div>
        </div>

        {/* Columna 2: Información Académica */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Información Académica</h2>
          
          <div>
            <label className={`block text-sm font-medium ${isProgramaLocked ? 'text-gray-500' : 'text-gray-700'}`}>
              Programa Académico {isProgramaLocked && <span className="text-xs">(No modificable)</span>}
            </label>
            <div className="relative mt-1" ref={programaInputRef}>
            <input
              type="text"
              value={programaSearchQuery}
              onChange={(e) => {
                const newValue = e.target.value;
                setProgramaSearchQuery(newValue);
                setIsProgramaDropdownOpen(true);
                setHighlightedProgramaIndex(-1);
                // Limpiar selección si el usuario está escribiendo algo diferente al programa seleccionado
                const currentSelected = degrees.find((deg: any) => 
                  String(deg.programa_id ?? deg.id) === formData.programa_academico
                );
                const currentSelectedName = currentSelected 
                  ? (currentSelected.descripcion ?? currentSelected.nombre ?? currentSelected.name ?? "")
                  : "";
                if (newValue !== currentSelectedName) {
                  handleInputChange('programa_academico', "");
                }
              }}
              onFocus={() => setIsProgramaDropdownOpen(true)}
              onKeyDown={handleProgramaKeyDown}
              disabled={isProgramaLocked}
              placeholder="Busca tu programa académico..."
              className={`w-full border rounded-lg px-3 py-2 text-sm ${
                isProgramaLocked ? 'bg-gray-100 text-gray-500' : 'bg-white border-gray-300'
              }`}
            />
            {isProgramaDropdownOpen && !isProgramaLocked && filteredDegrees.length > 0 && (
              <div
                ref={programaDropdownRef}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
              >
                {filteredDegrees.map((deg: any, index: number) => {
                  const degreeId = String(deg.programa_id ?? deg.id);
                  const degreeName = deg.descripcion ?? deg.nombre ?? deg.name ?? "";
                  const isHighlighted = index === highlightedProgramaIndex;
                  const isSelected = formData.programa_academico === degreeId;
                  
                  return (
                    <div
                      key={degreeId}
                      onClick={() => handleProgramaSelect(deg)}
                      className={`px-3 py-2 cursor-pointer hover:bg-[#E74C3C]/10 ${
                        isHighlighted ? 'bg-[#E74C3C]/20' : ''
                      } ${isSelected ? 'bg-[#E74C3C]/10 font-semibold' : ''}`}
                      onMouseEnter={() => setHighlightedProgramaIndex(index)}
                    >
                      {degreeName}
                    </div>
                  );
                })}
              </div>
            )}
            {isProgramaDropdownOpen && !isProgramaLocked && programaSearchQuery && filteredDegrees.length === 0 && (
              <div
                ref={programaDropdownRef}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
              >
                <div className="px-3 py-2 text-gray-500">
                  No se encontraron programas
                </div>
              </div>
            )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ubicación</label>
            <select
              value={formData.ubicacion}
              onChange={(e) => handleInputChange('ubicacion', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-white text-sm"
            >
            <option value="">Selecciona tu ubicación</option>
            {locations.map((loc: any) => (
              <option key={loc.ubicacion_id ?? loc.id} value={(loc.ubicacion_id ?? loc.id)}>{loc.descripcion ?? loc.nombre ?? loc.name}</option>
            ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`block text-sm font-medium ${isHeightLocked ? 'text-gray-500' : 'text-gray-700'}`}>
                Estatura: <span className="font-semibold text-[#E74C3C]">{height.toFixed(2)}</span> m
                {isHeightLocked && <span className="text-xs text-gray-500 ml-2">(No modificable)</span>}
              </label>
              {initialHeight !== null && !heightHasChanged && !isHeightLocked && (
                <span className="text-xs text-gray-500">(Solo puedes cambiarla una vez)</span>
              )}
            </div>
            <div className="relative pb-4">
              {/* Indicador visual ampliado para móviles (zoom táctil) */}
              {(isDraggingHeight || heightTooltipPosition > 0) && !isHeightLocked && (
                <div
                  className="absolute z-50 pointer-events-none"
                  style={{
                    left: `${heightTooltipPosition}%`,
                    bottom: 'calc(50% + 26px)',
                    transform: 'translateX(-50%)',
                    transition: 'none',
                  }}
                >
                  <div className="bg-[#E74C3C] text-white px-6 py-3 rounded-xl shadow-2xl text-xl font-bold transform scale-110">
                    <div className="text-center">
                      <div className="text-2xl mb-1">{height.toFixed(2)}</div>
                      <div className="text-sm font-normal opacity-90">metros</div>
                    </div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-transparent border-t-[#E74C3C]"></div>
                  </div>
                </div>
              )}
              <input
                type="range"
                min="1.4"
                max="2.0"
                step="0.01"
                value={height}
                onChange={(e) => {
                  if (isHeightLocked) return; // No permitir cambios si está bloqueado
                  const newHeight = Number(e.target.value);
                  setHeight(newHeight);
                  
                  // Calcular posición del tooltip basado en el valor
                  const percentage = ((newHeight - 1.4) / (2.0 - 1.4)) * 100;
                  setHeightTooltipPosition(percentage);
                  
                  // Marcar como modificado si es diferente al inicial
                  if (initialHeight !== null) {
                    // Usar comparación con tolerancia para números flotantes
                    const difference = Math.abs(newHeight - initialHeight);
                    if (difference > 0.001) {
                      setHeightHasChanged(true);
                    } else {
                      // Si vuelve al valor inicial, no se considera modificado
                      setHeightHasChanged(false);
                    }
                  } else {
                    // Si no hay estatura inicial (perfil nuevo), siempre permitir cambios
                    setHeightHasChanged(true);
                  }
                }}
                onInput={(e) => {
                  // Manejar input para actualizar en tiempo real mientras se arrastra
                  if (isHeightLocked) return;
                  const target = e.target as HTMLInputElement;
                  const newHeight = Number(target.value);
                  setHeight(newHeight);
                  const percentage = ((newHeight - 1.4) / (2.0 - 1.4)) * 100;
                  setHeightTooltipPosition(percentage);
                  
                  // Actualizar estado de cambio
                  if (initialHeight !== null) {
                    const difference = Math.abs(newHeight - initialHeight);
                    setHeightHasChanged(difference > 0.001);
                  } else {
                    setHeightHasChanged(true);
                  }
                }}
                onMouseDown={(e) => {
                  if (!isHeightLocked) {
                    setIsDraggingHeight(true);
                    const target = e.target as HTMLInputElement;
                    const percentage = ((Number(target.value) - 1.4) / (2.0 - 1.4)) * 100;
                    setHeightTooltipPosition(percentage);
                  }
                }}
                onMouseMove={(e) => {
                  if (isDraggingHeight && !isHeightLocked) {
                    const target = e.target as HTMLInputElement;
                    const percentage = ((Number(target.value) - 1.4) / (2.0 - 1.4)) * 100;
                    setHeightTooltipPosition(percentage);
                  }
                }}
                onMouseUp={() => {
                  setIsDraggingHeight(false);
                  setTimeout(() => setHeightTooltipPosition(0), 200);
                }}
                onMouseLeave={() => {
                  setIsDraggingHeight(false);
                  setTimeout(() => setHeightTooltipPosition(0), 200);
                }}
                onTouchStart={(e) => {
                  if (!isHeightLocked) {
                    setIsDraggingHeight(true);
                    const target = e.target as HTMLInputElement;
                    const percentage = ((Number(target.value) - 1.4) / (2.0 - 1.4)) * 100;
                    setHeightTooltipPosition(percentage);
                  }
                }}
                onTouchMove={(e) => {
                  if (isDraggingHeight && !isHeightLocked) {
                    const target = e.target as HTMLInputElement;
                    // Actualizar posición del tooltip basado en el valor actual del input
                    const percentage = ((Number(target.value) - 1.4) / (2.0 - 1.4)) * 100;
                    setHeightTooltipPosition(percentage);
                  }
                }}
                onTouchEnd={() => {
                  setIsDraggingHeight(false);
                  setTimeout(() => setHeightTooltipPosition(0), 400);
                }}
                disabled={isHeightLocked}
                className={`w-full mt-2 ${isHeightLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ 
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  height: '24px',
                  touchAction: 'none',
                }}
              />
              {heightHasChanged && initialHeight !== null && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#E74C3C] h-2 rounded-full"
                      style={{ width: `${((height - 1.4) / (2.0 - 1.4)) * 100}%`, transition: 'none' }}
                    ></div>
                  </div>
                  <span className="text-xs text-[#E74C3C] font-medium">Modificada</span>
                </div>
              )}
            </div>
            {initialHeight !== null && !heightHasChanged && !isHeightLocked && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <span>⚠️</span>
                <span>Mueve la barra para modificar tu estatura (solo una vez)</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado Actual
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Elige tu estado actual
            </p>
            <div className="flex flex-wrap gap-2">
              {estados.map((estado) => (
                <button
                  key={estado}
                  type="button"
                  onClick={() => setSelectedEstado(estado === selectedEstado ? "" : estado)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                    selectedEstado === estado
                      ? "bg-[#E74C3C] text-white border-[#E74C3C] shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#E74C3C]/50"
                  }`}
                >
                  {estado}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Columna 3: Intereses */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Sobre Ti</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intereses
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Elige hasta 3 temas que te representen
            </p>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  disabled={selectedInterests.length >= 3 && !selectedInterests.includes(interest)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                    selectedInterests.includes(interest)
                      ? "bg-[#E74C3C] text-white border-[#E74C3C] shadow-sm"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#E74C3C]/50"
                  } ${selectedInterests.length >= 3 && !selectedInterests.includes(interest) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {interest}
                </button>
              ))}
            </div>
            {selectedInterests.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {selectedInterests.length}/3 seleccionados
              </p>
            )}
          </div>
        </div>
      </form>

      <div className="w-full max-w-7xl flex justify-center mt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-[#E74C3C] to-[#C0392B] text-white px-12 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base"
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
      </div>

      {/* Modal de confirmación */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro que quieres guardar?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Has modificado los siguientes campos que <strong>no se podrán modificar después</strong> de guardar:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {getModifiedFields().map((field, index) => (
                  <li key={index} className="text-[#E74C3C] font-medium">{field}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm">
                Una vez que guardes estos cambios, no podrás modificarlos nuevamente. ¿Deseas continuar?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirmDialog(false);
                performSave();
              }}
              className="bg-[#E74C3C] hover:bg-[#C0392B]"
            >
              Sí, guardar cambios
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </>
  );
};

export default EditProfilePage;
