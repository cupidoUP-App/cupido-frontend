export interface MatchData {
  usuario_id?: string | number; // Ahora es obligatorio para el like
  perfil_id?: string | number;
  nombre?: string;
  apellido?: string;
  
  // Las propiedades que ya tenías
  mainImage?: string;
  info: {
    title: string;
    description: string;
    edad: number;
    ubicación: string;
    intereses: string;
    estatura?: string | null;
    estado?: string;
    score?: number;
  };
  secondaryImages: (string | undefined)[];
}

export interface MatchPageProps {
  matchData?: MatchData;
}
