import React from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Heart } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip';

/** Propiedades del componente BannerInfo. */
interface BannerInfoProps {
  /** Título principal del banner. */
  title: string;
  /** Descripción informativa secundaria. */
  description: string;
  /** Contenido del tooltip que se muestra al hacer clic en el ícono de información. */
  tooltipContent: string;
}

/**
 * Componente de banner informativo con icono decorativo y tooltip de ayuda.
 * Muestra un título, descripción y un ícono de información con tooltip interactivo.
 * Utiliza un diseño con gradiente de fondo rosa/rojo.
 */

const BannerInfo: React.FC<BannerInfoProps> = ({ title, description, tooltipContent }) => {
  return (
    <div className="mb-8 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg shadow-sm flex items-center justify-between">
      <div className="flex items-center">
        {/* Animated Phosphor heart icon */}
        <Heart size={32} weight="fill" className="text-pink-500 mr-3 animate-pulse" />
        <div>
          <h2 className="text-2xl font-bold text-pink-700">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoCircledIcon className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs p-3 text-sm bg-white shadow-lg rounded-md">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default BannerInfo;
