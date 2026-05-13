/**
 * Representa un perfil de usuario dentro del sistema de matching.
 * Contiene la información del usuario, sus imágenes y datos relevantes
 * para mostrar en las tarjetas de recomendación.
 */
export interface MatchData {
  /** ID único del usuario en el sistema. Esencial para enviar likes/dislikes. */
  usuario_id?: string | number;
  /** ID del perfil asociado al usuario. */
  perfil_id?: string | number;
  /** Nombre del usuario. */
  nombre?: string;
  /** Apellido del usuario. */
  apellido?: string;
  /** URL de la imagen principal del perfil. */
  mainImage?: string;
  /** Información detallada del perfil: título, descripción, edad, ubicación, intereses, etc. */
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
  /** Lista de imágenes secundarias del perfil (hasta 2). */
  secondaryImages: (string | undefined)[];
}

/** Props para la página principal de matching. */
export interface MatchPageProps {
  /** Datos opcionales de un match para precargar. */
  matchData?: MatchData;
}
