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
    const results = response.data.results;

    if (!results || !Array.isArray(results)) {
        return [];
    }

    return results.map((item: any) => {
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

      const mainImage = constructImageUrl(item.main_image) || MatchPlaceholder1;
      const secondaryImages: [string?, string?] = [
        constructImageUrl(item.secondary_images?.[0]) || MatchPlaceholder2,
        constructImageUrl(item.secondary_images?.[1]) || MatchPlaceholder3
      ];

      return {
        mainImage,
        info: {
          title: `${item.nombre || ''} ${item.apellido || ''}`.trim(),
          description: `Score: ${item.score}`, // Using score as description for now
          edad: item.edad,
          ubicación: "Colombia", // Placeholder
          intereses: item.hobbies,
          estatura: item.estatura,
          score: item.score
        },
        secondaryImages
      };
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};

export const getMatches = (): MatchData[] => {
  return mockMatchDataList;
};
