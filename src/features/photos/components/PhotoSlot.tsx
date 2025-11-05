import React from 'react';
import { TrashIcon, StarIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button'; // Shadcn/ui button

interface PhotoSlotProps {
  file: File & { preview: string }; // File object with a preview URL
  onDelete: (file: File) => void;
  onSetPrincipal: (file: File) => void;
  isPrincipal: boolean;
}

const PhotoSlot: React.FC<PhotoSlotProps> = ({ file, onDelete, onSetPrincipal, isPrincipal }) => {
  return (
    <div className="relative w-full h-48 rounded-lg overflow-hidden border group">
      <img src={file.preview} alt={`preview-${file.name}`} className="w-full h-full object-cover" />

      {/* Overlay for actions */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex space-x-2">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(file)}
            className="hover:scale-110 transition-transform"
          >
            <TrashIcon className="h-5 w-5" />
          </Button>
          <Button
            variant={isPrincipal ? "default" : "secondary"}
            size="icon"
            onClick={() => onSetPrincipal(file)}
            className={`hover:scale-110 transition-transform ${isPrincipal ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
          >
            <StarIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isPrincipal && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
          Principal
        </div>
      )}
    </div>
  );
};

export default PhotoSlot;
