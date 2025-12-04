import MatchPlaceholder1 from "@/assets/MatchPlaceholder1.jpeg";
import MatchPlaceholder2 from "@/assets/MatchPlaceholder2.webp";
import MatchPlaceholder3 from "@/assets/MatchPlaceholder3.jpg";
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

export const getMatches = (): MatchData[] => {
  return mockMatchDataList;
};
