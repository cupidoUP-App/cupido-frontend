import React from "react";
import { MatchData } from "../types";

interface MatchInfoProps {
  data: MatchData;
}

const MatchInfo: React.FC<MatchInfoProps> = ({ data }) => {
  return (
    <div className="w-full p-4 space-y-6">
      <div className="space-y-2">
        <h3 className="text-base font-poppins text-black">Acerca de mi</h3>
        <div className="w-full min-h-[150px] p-4 bg-white border border-gray-200 flex items-center justify-center">
          <p className="text-sm text-gray-500 text-center w-full">
            {data?.info?.description || "Descripcion"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-poppins text-black">Ubicacion</h3>
        <div className="flex justify-center">
          <span className="text-lg font-poppins text-black text-center font-bold">
            {data?.info?.ubicación || "Ubicacion"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-poppins text-black">Preferencias</h3>
        <div className="flex flex-wrap gap-2 justify-center items-center">
          {data?.info?.intereses ? (
            data.info.intereses
              .split(", ")
              .map((interes: string, index: number) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-black shadow-md shadow-black/50 w-fit min-w-[50px]"
                >
                  {interes.trim()}
                </span>
              ))
          ) : (
            <span className="inline-block px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-black w-fit min-w-[50px]">
              Preferencia 1
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchInfo;
