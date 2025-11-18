import React from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BannerInfoProps {
  title: string;
  description: string;
  tooltipContent: string;
}

const BannerInfo: React.FC<BannerInfoProps> = ({ title, description, tooltipContent }) => {
  return (
    <div className="mb-8 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg shadow-sm flex items-center justify-between">
      <div className="flex items-center">
        {/* Animated icon placeholder - will be replaced with a Framer Motion icon later */}
        <span className="text-pink-500 text-3xl mr-3 animate-pulse">❤️</span> 
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
