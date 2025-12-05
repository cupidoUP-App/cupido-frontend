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
  // ... otros datos mock
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
      // 🔍 DEBUG: Ver CADA PROPIEDAD del item
      console.log(`\n🔍 ITEM ${index + 1}:`);
      console.log("  Todas las propiedades:", Object.keys(item));
      
      // Mostrar TODAS las propiedades para ver qué hay disponible
      Object.keys(item).forEach(key => {
        console.log(`  - ${key}:`, item[key]);
      });

      // IMPORTANTE: Buscar el usuario_id - podría tener diferentes nombres
      const usuarioId = item.usuario_id || item.usuarioId || item.user_id || item.userId || item.id;
      console.log(`  🔑 usuario_id encontrado: ${usuarioId} (tipo: ${typeof usuarioId})`);
      
      if (!usuarioId) {
        console.error(`  ⚠️ ADVERTENCIA: Item ${index + 1} no tiene usuario_id identificable`);
      }

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

      // 🔍 DEBUG: Ver el objeto final mapeado
      console.log(`✅ MATCH DATA MAPEADO ${index + 1}:`, matchData);
      console.log(`✅ usuario_id incluido: ${matchData.usuario_id}`);

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