/**
 * @module matchService
 * Servicio para obtener recomendaciones de perfiles desde la API de matching.
 * Transforma la respuesta del backend al formato interno MatchData,
 * construyendo URLs de imágenes y normalizando los datos de cada perfil.
 */
import api from "@lib/api";
import MatchPlaceholder1 from "@assets/MatchPlaceholder1.jpeg";
import MatchPlaceholder2 from "@assets/MatchPlaceholder2.webp";
import MatchPlaceholder3 from "@assets/MatchPlaceholder3.jpg";
import { MatchData } from "../types";

/** Lista de datos mock para desarrollo y pruebas locales. */
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
  // ... otros datos mock
];

/**
 * Obtiene las recomendaciones de perfiles desde la API.
 * Construye URLs de imágenes, normaliza nombres, descripciones y datos del perfil.
 *
 * @returns Promesa con un arreglo de perfiles tipados como MatchData.
 */
export const fetchMatches = async (): Promise<MatchData[]> => {
  try {
    const response = await api.get("/match/recommendations/");
    
    
    const results = response.data.results;

    if (!results || !Array.isArray(results)) {
        return [];
    }


    return results.map((item: any, index: number) => {
      
      
      // IMPORTANTE: Buscar el usuario_id - podría tener diferentes nombres
      const usuarioId = item.usuario_id || item.usuarioId || item.user_id || item.userId || item.id;
      
      

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

      // 🔥 IMPORTANTE: Ahora incluir el usuario_id en el objeto matchData
      const matchData = {
        // 🔥 AQUÍ ESTÁ EL CAMBIO: Agregar usuario_id en el nivel superior
        usuario_id: usuarioId, // Esto es CRÍTICO para el like
        // También puedes incluir otras propiedades del backend si son necesarias
        perfil_id: item.perfil_id || item.profile_id,
        nombre: item.nombre,
        apellido: item.apellido,
        
        // Los datos que ya tenías
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


      return matchData;
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Retorna una lista vacía de matches.
 * Actualmente solo se usa fetchMatches para obtener datos reales.
 *
 * @returns Arreglo vacío de MatchData.
 */
export const getMatches = (): MatchData[] => {
  return []; // Ya no usar datos mock, siempre usar fetchMatches
};