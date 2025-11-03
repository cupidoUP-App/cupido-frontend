import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";

const EditPreferencesPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    rango_edad_min: 18,
    rango_edad_max: 40,
    rango_estatura_min: 150,
    rango_estatura_max: 190,
    ubicacion: "",
    genero_preferido: "",
    hobbies_preferidos: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { user } = useAppStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const prefs = await authAPI.getPreferences();
        if (prefs.length > 0) {
          const pref = prefs[0]; // Assuming first preference
          setPreferences({
            rango_edad_min: pref.rango_edad_min || 18,
            rango_edad_max: pref.rango_edad_max || 40,
            rango_estatura_min: pref.rango_estatura_min || 150,
            rango_estatura_max: pref.rango_estatura_max || 190,
            ubicacion: pref.ubicacion || "",
            genero_preferido: pref.genero_preferido || "",
            hobbies_preferidos: pref.hobbies_preferidos || "",
          });
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las preferencias",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [toast]);

  const handleInputChange = (field: string, value: string | number) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await authAPI.updatePreferences(preferences);

      toast({
        title: "Éxito",
        description: "Preferencias actualizadas correctamente",
      });

      navigate('/profile');
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar las preferencias",
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
          <p className="mt-4 text-gray-600">Cargando preferencias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF6F5] flex flex-col items-center py-10 px-6">
      <h1 className="text-2xl font-bold mb-2">Editar Preferencias</h1>
      <p className="text-gray-500 mb-6">
        Configura tus preferencias de búsqueda
      </p>

      <form className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        <div>
          <label className="block">Rango de Edad Mínimo</label>
          <input
            type="number"
            value={preferences.rango_edad_min}
            onChange={(e) => handleInputChange('rango_edad_min', parseInt(e.target.value))}
            className="w-full border rounded-md px-3 py-2 mt-1"
            min="18"
            max="100"
          />

          <label className="mt-4 block">Rango de Edad Máximo</label>
          <input
            type="number"
            value={preferences.rango_edad_max}
            onChange={(e) => handleInputChange('rango_edad_max', parseInt(e.target.value))}
            className="w-full border rounded-md px-3 py-2 mt-1"
            min="18"
            max="100"
          />

          <label className="mt-4 block">Rango de Estatura Mínimo (cm)</label>
          <input
            type="number"
            value={preferences.rango_estatura_min}
            onChange={(e) => handleInputChange('rango_estatura_min', parseInt(e.target.value))}
            className="w-full border rounded-md px-3 py-2 mt-1"
            min="120"
            max="250"
          />

          <label className="mt-4 block">Rango de Estatura Máximo (cm)</label>
          <input
            type="number"
            value={preferences.rango_estatura_max}
            onChange={(e) => handleInputChange('rango_estatura_max', parseInt(e.target.value))}
            className="w-full border rounded-md px-3 py-2 mt-1"
            min="120"
            max="250"
          />
        </div>

        <div>
          <label>Ubicación Preferida</label>
          <input
            type="text"
            value={preferences.ubicacion}
            onChange={(e) => handleInputChange('ubicacion', e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1"
            placeholder="Ej: Bogotá, Medellín..."
          />

          <label className="mt-4 block">Género Preferido</label>
          <select
            value={preferences.genero_preferido}
            onChange={(e) => handleInputChange('genero_preferido', e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1"
          >
            <option value="">Sin preferencia</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="Otro">Otro</option>
          </select>

          <label className="mt-4 block">Hobbies Preferidos</label>
          <textarea
            value={preferences.hobbies_preferidos}
            onChange={(e) => handleInputChange('hobbies_preferidos', e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1"
            rows={4}
            placeholder="Ej: Música, Deportes, Lectura..."
          />
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

export default EditPreferencesPage;