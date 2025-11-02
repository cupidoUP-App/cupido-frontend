import React, { useState } from "react";
import GenderSelector from "./GenderSelector";
import HeightSelector from "./HeightSelector";
import LocationSelector from "./LocationSelector";
import RangeSelector from "./RangeSelector";
import InterestsSelector from "./InterestsSelector";
import { filtersService } from "../services/filtersService";

interface FiltersPageProps {
  userId: string;
  onComplete: () => void;
  onClose: () => void;
}

type AgeRange = [number, number];
type HeightRange = [number, number];

const FiltersPage: React.FC<FiltersPageProps> = ({
  userId,
  onComplete,
  onClose,
}) => {
  const [rangoEdad, setRangoEdad] = useState<AgeRange>([18, 40]);
  const [rangoEstatura, setRangoEstatura] = useState<HeightRange>([150, 190]);
  const [selectedGenero, setSelectedGenero] = useState<string | null>(null);
  const [selectedUbicacion, setSelectedUbicacion] = useState<string | null>(null);
  const [intereses, setIntereses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Guardar filtros - SOLO CREACIÓN
  const handleApplyFilters = async () => {
    if (!userId) {
      console.error("❌ No user ID available");
      alert("Error: No se pudo identificar al usuario.");
      return;
    }

    setLoading(true);
    try {
      console.log("🔄 Creando nuevos filtros para usuario:", userId);

      // Preparar datos para guardar
      const filtersData = {
        filter_types: ["edad", "genero", "ubicacion", "hobbies", "estatura"],
        filter_values: [
          `${rangoEdad[0]}-${rangoEdad[1]}`,
          selectedGenero || "",
          selectedUbicacion || "",
          intereses.join(", "),
          `${rangoEstatura[0]}-${rangoEstatura[1]}`
        ],
      };

      console.log("📦 Datos a guardar:", filtersData);

      // Crear nuevos filtros en la base de datos
      const result = await filtersService.saveFilters(userId, filtersData);
      console.log("✅ Filtros creados exitosamente:", result);

      // Ejecutar callback de completado
      onComplete();
      
    } catch (error: any) {
      console.error("❌ Error al crear filtros:", error);
      
      let errorMessage = "Error al guardar los filtros. Intenta nuevamente.";
      
      if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRangoEdad([18, 40]);
    setRangoEstatura([150, 190]);
    setSelectedGenero(null);
    setSelectedUbicacion(null);
    setIntereses([]);
  };

  return (
    <div className="w-full h-[90vh] flex">
      {/* Contenedor con scroll sin alterar el estilo */}
      <div
        className="flex-1 overflow-y-auto p-8"
        style={{ backgroundColor: "#F2D6CD" }}
      >
        {/* Header con botón de cierre fijo */}
        <div className="relative mb-8 pb-4 border-b border-gray-300">
          {/* Botón de cierre fijo (siempre visible) */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 m-2 text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-rose-300 transition-colors z-50 bg-[#F2D6CD]/70 backdrop-blur-md"
            aria-label="Cerrar filtros"
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

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Configura tus filtros de búsqueda
            </h1>
            <p className="text-gray-700 text-sm mt-1">
              Personaliza tus preferencias para encontrar mejores coincidencias.
            </p>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="max-w-2xl mx-auto space-y-8 pb-8">
          {/* Edad */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <h2 className="text-gray-800 text-xl font-semibold mb-2">
              Rango de Edad
            </h2>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Selecciona el rango de edad que prefieres para tus coincidencias.
            </p>
            <RangeSelector
              type="age"
              value={rangoEdad}
              onChange={(value: [number, number]) => setRangoEdad(value)}
              minValue={18}
              maxValue={40}
              minLabel="18 años"
              maxLabel="40 años"
            />
          </div>

          {/* Género */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Género</h2>
            <p className="text-sm text-gray-600 mb-4">
              Prefiero conectar con...
            </p>
            <GenderSelector
              selectedGenders={selectedGenero}
              onGendersChange={setSelectedGenero}
            />
          </div>

          {/* Estatura */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <h2 className="text-gray-800 text-xl font-semibold mb-2">
              Rango de Estatura
            </h2>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Selecciona el rango de estatura que te gustaría en tus
              coincidencias.
            </p>
            <HeightSelector
              value={rangoEstatura}
              onChange={(value: [number, number]) => setRangoEstatura(value)}
            />
          </div>

          {/* Intereses */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <h2 className="text-gray-800 text-xl font-semibold mb-2">
              Intereses
            </h2>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Selecciona hasta 3 intereses que te definan.
            </p>
            <InterestsSelector
              selectedInterests={intereses}
              onInterestsChange={setIntereses}
              maxSelection={3}
            />
          </div>

          {/* Ubicación */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Ubicación
            </h2>
            <p className="text-sm text-gray-600 mb-4">Estoy en...</p>
            <LocationSelector
              selectedLocation={selectedUbicacion || ""}
              onLocationChange={setSelectedUbicacion}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-8 border-t border-gray-300">
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-500/80 hover:bg-gray-600/80 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 text-lg backdrop-blur-sm"
            >
              Restablecer
            </button>
            <button
              onClick={handleApplyFilters}
              disabled={loading}
              className={`flex-1 text-white font-semibold py-4 px-6 rounded-lg text-lg transition duration-200 ${
                loading ? "bg-gray-400" : "bg-[#E93923] hover:bg-[#d1321f]"
              }`}
            >
              {loading ? "Creando Filtros..." : "Crear Filtros"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersPage;