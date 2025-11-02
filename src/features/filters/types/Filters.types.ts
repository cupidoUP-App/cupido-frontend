export interface Preferences {
    genero_preferido: string;
    hobbies_preferidos: string;
    ubicacion: string;
    rango_edad_min: number;
    rango_edad_max: number;
    rango_estatura_min: number;
    rango_estatura_max: number;
  }
  
  export interface PreferencesPageProps {
    userId: string;
    onComplete: () => void;
  }