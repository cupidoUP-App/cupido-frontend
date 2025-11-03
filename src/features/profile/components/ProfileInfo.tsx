import { Music, Gamepad2, BookText } from "lucide-react";

interface ProfileInfoProps {
  name: string;
  status?: string;
  age: number;
  location: string;
  about: string;
  interests: string[];
  programa_academico?: string;
  telefono?: string;
}

const iconMap: Record<string, JSX.Element> = {
  Música: <Music size={16} />,
  Videojuegos: <Gamepad2 size={16} />,
  Lectura: <BookText size={16} />,
};

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  name,
  status,
  age,
  location,
  about,
  interests,
  programa_academico,
  telefono,
}) => {
  return (
    <div className="text-center md:text-left space-y-4">
      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-gray-500 text-sm">{status ? `(${status})` : ""}</p>
      <p className="text-gray-700">{age} años</p>
      <p className="text-gray-700">{location}</p>
      {programa_academico && <p className="text-gray-700">{programa_academico}</p>}
      {telefono && <p className="text-gray-700">{telefono}</p>}

      <div>
        <h3 className="font-semibold mt-4">Intereses</h3>
        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
          {interests.map((interest, i) => (
            <span
              key={i}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {iconMap[interest] || null} {interest}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mt-4">Sobre mí</h3>
        <p className="text-gray-600 text-sm">{about}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
