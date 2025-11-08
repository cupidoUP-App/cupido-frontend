import { Music, Gamepad2, BookText, MapPin, Calendar, Ruler, GraduationCap } from "lucide-react";

interface ProfileInfoProps {
  name: string;
  status?: string;
  age: number;
  location: string;
  about: string;
  interests: string[];
  programa_academico?: string;
  estatura?: number;
}

const iconMap: Record<string, JSX.Element> = {
  Música: <Music size={18} />,
  Videojuegos: <Gamepad2 size={18} />,
  Lectura: <BookText size={18} />,
};

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  name,
  status,
  age,
  location,
  about,
  interests,
  programa_academico,
  estatura,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Título centrado */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#E74C3C] to-[#C0392B] bg-clip-text text-transparent">
          {name}
        </h2>
        {status && (
          <p className="text-[#E74C3C] text-lg md:text-xl font-medium italic">
            {status}
          </p>
        )}
      </div>

      {/* Información básica centrada */}
      <div className="flex flex-col items-center gap-3 text-gray-700">
        {/* Edad y Estatura en la misma línea */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm">
            <Calendar size={18} className="text-[#E74C3C]" />
            <span className="text-base md:text-lg font-medium">{age} años</span>
          </div>
          {estatura && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm">
              <Ruler size={18} className="text-[#E74C3C]" />
              <span className="text-base md:text-lg font-medium">{estatura.toFixed(2)} m</span>
            </div>
          )}
        </div>

        {/* Ciudad */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm">
          <MapPin size={18} className="text-[#E74C3C]" />
          <span className="text-base md:text-lg font-medium">{location}</span>
        </div>

        {/* Programa Académico */}
        {programa_academico && (
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm">
            <GraduationCap size={18} className="text-[#E74C3C]" />
            <span className="text-base md:text-lg font-medium">{programa_academico}</span>
          </div>
        )}
      </div>

      {/* Separador decorativo */}
      <div className="flex items-center justify-center py-2">
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#E74C3C]/30 to-transparent"></div>
      </div>

      {/* Intereses */}
      {interests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 text-center">Intereses</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {interests.map((interest, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#E74C3C]/10 to-[#C0392B]/10 rounded-full text-sm md:text-base font-medium shadow-md hover:shadow-lg transition-shadow border border-[#E74C3C]/20"
              >
                {iconMap[interest] || null}
                <span className="text-gray-800">{interest}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Separador decorativo */}
      {interests.length > 0 && (
        <div className="flex items-center justify-center py-2">
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#E74C3C]/30 to-transparent"></div>
        </div>
      )}

      {/* Sobre mí */}
      <div className="space-y-4">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 text-center">Sobre mí</h3>
        <div className="bg-white/60 rounded-xl p-6 shadow-inner">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed text-center md:text-left">
            {about}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
