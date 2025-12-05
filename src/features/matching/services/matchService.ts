import api from "@lib/api";
import MatchPlaceholder1 from "@assets/MatchPlaceholder1.jpeg";
import MatchPlaceholder2 from "@assets/MatchPlaceholder2.webp";
import MatchPlaceholder3 from "@assets/MatchPlaceholder3.jpg";
import { MatchData } from "../types";

export const mockMatchDataList: MatchData[] = [
  {
    mainImage: MatchPlaceholder1,
    info: {
      title: "Marisol Pérez",
      description: "sit amet consectetur adipisicing elitQuisquam, quos lorem ipsum dolor sit amet que? qué? quisquam, quos",
      edad: 28,
      ubicación: "Bogotá, Colombia",
      intereses: "Viajes"
    },
    secondaryImages: [MatchPlaceholder2, MatchPlaceholder3]
  },
  {
    mainImage: MatchPlaceholder2,
    info: {
      title: "Ana Maria",
      description: "consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet que? lorem ipsum dolor sit amet consectetur adipisicing elit",
      edad: 25,
      ubicación: "Medellín, Colombia",
      intereses: "Otorrinolaringologia, Arte, Lectura, Cine"
    },
    secondaryImages: [MatchPlaceholder3, MatchPlaceholder1]
  },
  {
    mainImage: MatchPlaceholder3,
    info: {
      title: "Jimena Gomez",
      description: "consectetur adipisicing elit Quisquam, quos lorem ipsum dolor sit amet que?",
      edad: 30,
      ubicación: "Cali, Colombia",
      intereses: "Gastronomía, Fotografía, Naturaleza, Deportes, Música"
    },
    secondaryImages: [MatchPlaceholder1, MatchPlaceholder2]
  }
];

export const fetchMatches = async (): Promise<MatchData[]> => {
  try {
    const response = await api.get("/match/recommendations/");
    
    // 🔍 DEBUG: Ver la respuesta completa
    console.log("🔍 RESPUESTA COMPLETA DEL BACKEND:", response.data);
    console.log("🔍 RESULTS ARRAY:", response.data.results);
    
    const results = response.data.results;

    if (!results || !Array.isArray(results)) {
        console.error("❌ Results no es un array o está vacío");
        return [];
    }

    console.log(`✅ Se encontraron ${results.length} matches`);

    return results.map((item: any, index: number) => {
      // 🔍 DEBUG: Ver cada item individual
      console.log(`\n🔍 ITEM ${index + 1}:`, item);
      console.log(`  - nombre: "${item.nombre}"`);
      console.log(`  - apellido: "${item.apellido}"`);
      console.log(`  - descripcion: "${item.descripcion}"`);
      console.log(`  - estado: "${item.estado}"`);
      console.log(`  - hobbies: "${item.hobbies}"`);
      console.log(`  - ubicacion: "${item.ubicacion}"`);
      console.log(`  - estatura: ${item.estatura}`);
      console.log(`  - edad: ${item.edad}`);
      console.log(`  - main_image: "${item.main_image}"`);
      console.log(`  - secondary_images:`, item.secondary_images);
      
      // Construir URLs de imágenes (mismo patrón que profile)
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      
      const constructImageUrl = (imageUrl: string | null | undefined): string | undefined => {
        if (!imageUrl) return undefined;
        
        // Si ya es una URL completa, usarla directamente
        if (imageUrl.startsWith('http')) {
          return imageUrl;
        }
        
        // Si empieza con /media/, concatenar con baseUrl
        if (imageUrl.startsWith('/media/')) {
          return `${baseUrl}${imageUrl}`;
        }
        
        // Caso general: asegurar que haya una barra
        return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      };

      const mainImage = constructImageUrl(item.main_image);
      const secondaryImages: [string?, string?] = [
        constructImageUrl(item.secondary_images?.[0]),
        constructImageUrl(item.secondary_images?.[1])
      ];

      // Construir el nombre completo
      const nombreCompleto = `${item.nombre || ''} ${item.apellido || ''}`.trim();
      
      // Usar descripción del usuario o estado como fallback
      const descripcion = item.descripcion || item.estado || 'Sin descripción';
      
      // Formatear estatura si existe
      const estaturaTexto = item.estatura 
        ? `${item.estatura}m` 
        : null;

      const matchData = {
        mainImage,
        info: {
          title: nombreCompleto,
          description: descripcion,
          edad: item.edad,
          ubicación: item.ubicacion || 'No especificada',
          intereses: item.hobbies || 'No especificados',
          estatura: estaturaTexto,
          estado: item.estado,
          score: item.score
        },
        secondaryImages
      };

      // 🔍 DEBUG: Ver el objeto final mapeado
      console.log(`✅ MATCH DATA MAPEADO ${index + 1}:`, matchData);

      return matchData;
    });
  } catch (error) {
    console.error("❌ Error fetching matches:", error);
    throw error;
  }
};

export const getMatches = (): MatchData[] => {
  return []; // Ya no usar datos mock, siempre usar fetchMatches
};
