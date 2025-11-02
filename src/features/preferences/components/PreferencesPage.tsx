import React, { useState, useEffect } from 'react';
import GenderSelector from './GenderSelector';
import HeightSelector from './HeightSelector';
import LocationSelector from './LocationSelector';
import RangeSelector from './RangeSelector';
import InterestsSelector from './InterestsSelector';
import { preferencesService } from '../services/preferencesService';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PreferencesPageProps {
  userId: string;
  onComplete: () => void;
  onBack?: () => void;
}

type AgeRange = [number, number];
type HeightRange = [number, number];

const PreferencesPage: React.FC<PreferencesPageProps> = ({
  userId,
  onComplete,
  onBack,
}) => {
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rangoEdad, setRangoEdad] = useState<AgeRange>([18, 40]);
  const [genero, setGenero] = useState("");
  const [rangoEstatura, setRangoEstatura] = useState<HeightRange>([150, 190]);
  const [intereses, setIntereses] = useState<string[]>([]);
  const [ubicacion, setUbicacion] = useState("");
  const [loading, setLoading] = useState(false);
  //const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  //const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedGenero, setSelectedGenero] = useState<string | null>(null);
  const [selectedUbicacion, setSelectedUbicacion] = useState<string | null>(
    null
  );

  const carouselImages = [
    "src/assets/ChicaGlobos.png",
    "src/assets/ParejaCopas.png",
  ];

  // Cargar preferencias existentes
  useEffect(() => {
    const loadExistingPreferences = async () => {
      try {
        const existingPrefs = await preferencesService.getPreferencesByUserId(
          userId
        );
        if (existingPrefs) {
          setRangoEdad([
            existingPrefs.rango_edad_min,
            existingPrefs.rango_edad_max,
          ]);
          setRangoEstatura([
            existingPrefs.rango_estatura_min,
            existingPrefs.rango_estatura_max,
          ]);
          setGenero(existingPrefs.genero_preferido || "");
          setUbicacion(existingPrefs.ubicacion || "");

          if (existingPrefs.hobbies_preferidos) {
            try {
              const parsedInterests = JSON.parse(
                existingPrefs.hobbies_preferidos
              );
              setIntereses(
                Array.isArray(parsedInterests) ? parsedInterests : []
              );
            } catch {
              setIntereses([]);
            }
          }
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    loadExistingPreferences();
  }, [userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);
  // 🔥 FUNCIÓN PARA MANEJAR EL RETROCESO
  const handleBackClick = () => {
    if (onBack) {
      onBack(); // Usar la prop onBack si está disponible
    } else {
      // Comportamiento por defecto si no hay onBack
      console.log("Retrocediendo...");
      // Aquí podrías agregar navegación por defecto si es necesario
    }
  };

  const handleApplyFilters = async () => {
    // 🔎 Validar campos antes de guardar
    if (!selectedGenero) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona un género preferido.',
        variant: 'destructive',
      });
      return;
    }
  
    if (!selectedUbicacion) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona una ubicación.',
        variant: 'destructive',
      });
      return;
    }
  
    if (!intereses || intereses.length !== 3) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona 3 Intereses.',
        variant: 'destructive',
      });
      return;
    }
  
    if (rangoEdad[0] < 18 || rangoEdad[1] <= rangoEdad[0]) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona un rango de edad válido.',
        variant: 'destructive',
      });
      return;
    }
  
    if (rangoEstatura[0] < 100 || rangoEstatura[1] <= rangoEstatura[0]) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona un rango de estatura válido.',
        variant: 'destructive',
      });
      return;
    }
  
    setLoading(true);
  
    try {
      await preferencesService.savePreferences(userId, {
        genero_preferido: selectedGenero,
        hobbies_preferidos: JSON.stringify(intereses),
        ubicacion: selectedUbicacion,
        rango_edad_min: rangoEdad[0],
        rango_edad_max: rangoEdad[1],
        rango_estatura_min: rangoEstatura[0],
        rango_estatura_max: rangoEstatura[1],
      });
  
      toast({
        title: 'Éxito',
        description: 'Preferencias guardadas con éxito.',
        variant: 'default', // 👈 CORREGIDO
      });
  
      onComplete();
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error al guardar',
        description: 'No se pudieron guardar las preferencias. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
 
  const handleReset = () => {
    setRangoEdad([18, 40]);
    setGenero("");
    setRangoEstatura([150, 190]);
    setIntereses([]);
    setUbicacion("");
  };

  return (
    <>
      {/* 🔙 Flecha de retroceso - CONECTADA */}
      <button
        onClick={handleBackClick} // 🔥 Usar la nueva función
        className="absolute top-4 left-4 p-2 rounded-full bg-white shadow-md hover:bg-red-100 transition-all z-50"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>

      <div className="lg:hidden bg-[#F2D6CD] h-screen overflow-y-scroll">
        {/* HEADER */}
        <div className="bg-[#F2D6CD] py-6 px-4 text-center">
          <img
            src="src/assets/Cupido-rojo.png"
            alt="Cupido Logo"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-[#333] mb-2">
            Configura tus preferencias de búsqueda
          </h1>
          <p className="text-[#666] text-base">
            Selecciona hasta 3 filtros para mejorar tus coincidencias.
          </p>
        </div>

        {/* CARRUSEL */}
        <div className="bg-[#F2D6CD] py-8 px-4">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <img
                src={carouselImages[currentImageIndex]}
                alt="Preferencias Cupido"
                className="max-w-full max-h-[50vh] object-contain rounded-xl"
              />
            </div>

            <div className="flex justify-center gap-3">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "bg-[#E93923] scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="bg-white rounded-t-3xl px-4 py-8">
          {/* Rango de Edad */}
          <div className="mb-8">
            <h2 className="text-[#333] text-xl font-semibold mb-2">
              Rango de Edad
            </h2>
            <p className="text-[#666] text-sm mb-4 leading-relaxed">
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

          <div className="h-px bg-[#e9ecef] my-8"></div>

          {/* === SECCIÓN GÉNERO === */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Género</h2>
            <div className="flex flex-wrap gap-2">
              {["Hombre", "Mujer", "Otro"].map((genero) => (
                <button
                  key={genero}
                  onClick={() => setSelectedGenero(genero)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedGenero === genero
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {genero}
                </button>
              ))}
            </div>
          </div>

          {/* Rango de Estatura */}
          <div className="mb-8">
            <h2 className="text-[#333] text-xl font-semibold mb-2">
              Rango de Estatura
            </h2>
            <p className="text-[#666] text-sm mb-4 leading-relaxed">
              Selecciona el rango de estatura que te gustaría en tus
              coincidencias.
            </p>
            <HeightSelector
              value={rangoEstatura}
              onChange={(value: [number, number]) => setRangoEstatura(value)}
            />
          </div>

          <div className="h-px bg-[#e9ecef] my-8"></div>

          {/* Intereses */}
          <div className="mb-8">
            <h2 className="text-[#333] text-xl font-semibold mb-2">
              Intereses
            </h2>
            <p className="text-[#666] text-sm mb-4 leading-relaxed">
              Selecciona hasta 3 intereses que te definan.
            </p>
            <InterestsSelector
              selectedInterests={intereses}
              onInterestsChange={setIntereses}
              maxSelection={3}
            />
          </div>

          <div className="h-px bg-[#e9ecef] my-8"></div>

          {/* === SECCIÓN UBICACIÓN === */}
          <div>
            <h2 className="text-lg font-semibold mb-2 mt-4">Ubicación</h2>
            <div className="flex flex-wrap gap-2">
              {["Pamplona", "Cúcuta"].map((ubicacion) => (
                <button
                  key={ubicacion}
                  onClick={() => setSelectedUbicacion(ubicacion)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedUbicacion === ubicacion
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {ubicacion}
                </button>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-[#e9ecef] pb-8">
            <button
              onClick={handleReset}
              className="flex-1 bg-[#6c757d] hover:bg-[#5a6268] text-white font-semibold py-4 px-6 rounded-lg transition duration-200 text-lg order-2 sm:order-1"
            >
              Restablecer
            </button>
            <button
              className="flex-1 bg-[#E93923] hover:bg-[#d1321f] text-white font-semibold py-4 px-6 rounded-lg transition duration-200 text-lg order-1 sm:order-2"
              onClick={handleApplyFilters}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Aplicar Filtros"}
            </button>
          </div>
        </div>
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden lg:flex lg:h-screen lg:w-screen bg-[#F2D6CD]">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="absolute top-12 flex flex-col items-center justify-center w-full">
            <img
              src="src/assets/Cupido-rojo.png"
              alt="Cupido Logo"
              className="h-16 w-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-[#333] text-center">
              Configura tus preferencias de búsqueda
            </h2>
          </div>

          <div className="flex-1 flex items-center justify-center w-full max-w-2xl mt-20">
            <img
              src={carouselImages[currentImageIndex]}
              alt="Preferencias Cupido"
              className="max-w-full max-h-[60vh] object-contain rounded-xl"
            />
          </div>

          <div className="flex gap-3 mb-12">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? "bg-[#E93923]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            <div className="h-px bg-[#e9ecef] my-8"></div>

            {/* Rango de Edad */}
            <div className="mb-8">
              <h2 className="text-[#333] text-xl font-semibold mb-2">
                Rango de Edad
              </h2>
              <p className="text-[#666] text-sm mb-4 leading-relaxed">
                Selecciona el rango de edad que prefieres para tus
                coincidencias.
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

            <div className="h-px bg-[#e9ecef] my-8"></div>

            {/* === SECCIÓN GÉNERO === */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-1">Género</h2>
              <p className="text-sm text-gray-600 mb-2">
                Prefiero conectar con...
              </p>
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full sm:w-3/4">
                  <h3 className="text-center text-red-500 font-semibold mb-2">
                    Género
                  </h3>
                  <div className="flex justify-center flex-wrap gap-3">
                    {["Hombre", "Mujer", "Otro"].map((genero) => (
                      <button
                        key={genero}
                        onClick={() => setSelectedGenero(genero)}
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                          selectedGenero === genero
                            ? "bg-red-500 text-white scale-105 shadow-md"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      >
                        {genero}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#e9ecef] my-8"></div>

            {/* Rango de Estatura */}
            <div className="mb-8">
              <h2 className="text-[#333] text-xl font-semibold mb-2">
                Rango de Estatura
              </h2>
              <p className="text-[#666] text-sm mb-4 leading-relaxed">
                Selecciona el rango de estatura que te gustaría en tus
                coincidencias.
              </p>
              <HeightSelector
                value={rangoEstatura}
                onChange={(value: [number, number]) => setRangoEstatura(value)}
              />
            </div>

            <div className="h-px bg-[#e9ecef] my-8"></div>

            {/* Intereses */}
            <div className="mb-8">
              <h2 className="text-[#333] text-xl font-semibold mb-2">
                Intereses
              </h2>
              <p className="text-[#666] text-sm mb-4 leading-relaxed">
                Selecciona hasta 3 intereses que te definan.
              </p>
              <InterestsSelector
                selectedInterests={intereses}
                onInterestsChange={setIntereses}
                maxSelection={3}
              />
            </div>

            <div className="h-px bg-[#e9ecef] my-8"></div>

            {/* === SECCIÓN UBICACIÓN === */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-1">Ubicación</h2>
              <p className="text-sm text-gray-600 mb-2">Estoy en...</p>
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full sm:w-3/4">
                  <h3 className="text-center text-red-500 font-semibold mb-2">
                    Ubicación
                  </h3>
                  <div className="flex justify-center flex-wrap gap-3">
                    {["Pamplona", "Cúcuta"].map((ubicacion) => (
                      <button
                        key={ubicacion}
                        onClick={() => setSelectedUbicacion(ubicacion)}
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                          selectedUbicacion === ubicacion
                            ? "bg-red-500 text-white scale-105 shadow-md"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      >
                        {ubicacion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 mt-12 pt-8 border-t border-[#e9ecef]">
              <button
                onClick={handleReset}
                className="flex-1 bg-[#6c757d] hover:bg-[#5a6268] text-white font-semibold py-4 px-6 rounded-lg transition duration-200 text-lg"
              >
                Restablecer
              </button>
              <button
                className="flex-1 bg-[#E93923] hover:bg-[#d1321f] text-white font-semibold py-4 px-6 rounded-lg transition duration-200 text-lg"
                onClick={handleApplyFilters}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Aplicar Filtros"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreferencesPage;
