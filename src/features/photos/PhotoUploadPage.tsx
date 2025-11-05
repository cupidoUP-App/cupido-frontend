import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BannerInfo from './components/BannerInfo';
import UploadDropzone from './components/UploadDropzone';
import PhotoSlot from './components/PhotoSlot';
import ActionButtons from './components/ActionButtons';
import { toast } from 'sonner';
import { photoAPI } from '@/lib/api';

interface PhotoFile extends File {
  preview: string;
  id?: number; 
  es_principal?: boolean;
  imagen?: string; 
}

// 1. Definir las props del componente
interface PhotoUploadPageProps {
  onComplete: () => void;
}

const PhotoUploadPage: React.FC<PhotoUploadPageProps> = ({ onComplete }) => {
  const queryClient = useQueryClient();
  const [localFiles, setLocalFiles] = useState<PhotoFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { data: serverPhotos, isLoading: isLoadingPhotos } = useQuery({
    queryKey: ['userPhotos'],
    queryFn: photoAPI.getPhotos,
    onSuccess: (data) => {
      const fetchedFiles: PhotoFile[] = data.map((photo: any) => ({
        name: photo.imagen.split('/').pop(),
        size: 0, 
        type: 'image/jpeg',
        preview: photo.imagen,
        id: photo.imagen_id,
        es_principal: photo.es_principal,
        imagen: photo.imagen,
      }));
      setLocalFiles(fetchedFiles);
    },
    onError: (error: any) => {
      toast.error(`failed to load photos: ${error.response?.data?.detail || error.message}`);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: photoAPI.uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPhotos'] });
    },
    onError: (error: any) => {
      toast.error(`failed to upload image: ${error.response?.data?.detail || error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: photoAPI.deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPhotos'] });
      toast.success("image deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(`failed to delete image: ${error.response?.data?.detail || error.message}`);
    },
  });

  const setPrincipalMutation = useMutation({
    mutationFn: photoAPI.setPrincipalPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPhotos'] });
      toast.success("principal image updated!");
    },
    onError: (error: any) => {
      toast.error(`failed to set principal image: ${error.response?.data?.detail || error.message}`);
    },
  });

  const handleFilesAccepted = useCallback((acceptedFiles: File[]) => {
    const currentTotalFiles = localFiles.length;
    const maxFilesAllowed = 3;
    const remainingSlots = maxFilesAllowed - currentTotalFiles;

    if (acceptedFiles.length === 0) return;

    if (acceptedFiles.length > remainingSlots) {
      toast.error(`you can only upload ${remainingSlots} more image(s).`);
      acceptedFiles = acceptedFiles.slice(0, remainingSlots);
    }

    const newFiles: PhotoFile[] = [];
    acceptedFiles.forEach(file => {
      const max_size_mb = 5;
      if (file.size > max_size_mb * 1024 * 1024) {
        toast.error(`file '${file.name}' is too large. max size is ${max_size_mb}MB.`);
        return;
      }
      newFiles.push(Object.assign(file, {
        preview: URL.createObjectURL(file),
        es_principal: localFiles.length === 0 && newFiles.length === 0,
      }));
    });

    setLocalFiles(prevFiles => [...prevFiles, ...newFiles]);

    if (newFiles.length > 0) {
      toast.info(`${newFiles.length} image(s) ready to be saved.`);
    }
  }, [localFiles]);

  const handleDeleteFile = useCallback((fileToDelete: PhotoFile) => {
    if (fileToDelete.id) {
      deleteMutation.mutate(fileToDelete.id);
    } else {
      setLocalFiles(prevFiles => prevFiles.filter(file => file !== fileToDelete));
      toast.info(`image '${fileToDelete.name}' removed.`);
    }
  }, [deleteMutation]);

  const handleSetPrincipal = useCallback((fileToSetPrincipal: PhotoFile) => {
    if (fileToSetPrincipal.id) {
      setPrincipalMutation.mutate(fileToSetPrincipal.id);
    } else {
      setLocalFiles(prevFiles =>
        prevFiles.map(file =>
          file === fileToSetPrincipal
            ? { ...file, es_principal: true }
            : { ...file, es_principal: false }
        )
      );
      toast.success(`'${fileToSetPrincipal.name}' will be set as principal on save.`);
    }
  }, [setPrincipalMutation]);

  const handleSave = useCallback(async (onSuccess?: () => void) => {
    setIsSaving(true);
    const newFiles = localFiles.filter(file => !file.id);

    if (newFiles.length === 0) {
      toast.info("no new images to save.");
      setIsSaving(false);
      onSuccess?.();
      return;
    }

    try {
      await Promise.all(newFiles.map(file => uploadMutation.mutateAsync(file)));
      toast.success("images saved successfully!");
      onSuccess?.();
    } catch (error) {
      // Error handled by mutation's onError
    } finally {
      setIsSaving(false);
    }
  }, [localFiles, uploadMutation]);

  const handleDeleteAll = useCallback(() => {
    const serverFileIds = localFiles.filter(f => f.id).map(f => f.id);
    if (serverFileIds.length > 0) {
      serverFileIds.forEach(id => id && deleteMutation.mutate(id));
    }
    setLocalFiles([]);
    toast.info("all images removed.");
  }, [localFiles, deleteMutation]);

  // 2. Modificar handleContinue para usar onComplete
  const handleContinue = useCallback(() => {
    if (localFiles.length === 0) {
      toast.error("you must upload at least one image to continue.");
      return;
    }
    handleSave(onComplete); // Llama a onComplete después de guardar
  }, [localFiles, handleSave, onComplete]);

  useEffect(() => {
    return () => {
      localFiles.forEach(file => {
        if (file.preview.startsWith('blob:')) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [localFiles]);

  if (isLoadingPhotos) {
    return <div className="container mx-auto p-4 text-center">loading your photos...</div>;
  }

  const totalSlots = 3;
  const slots = Array.from({ length: totalSlots });

  return (
    <div className="container mx-auto p-4">
      <BannerInfo 
        title="Upload Your Best Photos"
        description="You need to upload between 1 and 3 photos for your profile."
        tooltipContent="Only JPG or PNG formats are allowed. Ensure your face is visible and avoid inappropriate content suchs as nudity, weapons, or offensive material."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {slots.map((_, index) => {
          const file = localFiles[index];
          if (file) {
            return (
              <PhotoSlot 
                key={file.id || file.name + index}
                file={file}
                onDelete={handleDeleteFile}
                onSetPrincipal={handleSetPrincipal}
                isPrincipal={file.es_principal || false}
              />
            );
          }
          return <UploadDropzone key={index} onFilesAccepted={handleFilesAccepted} />;
        })}
      </div>

      <ActionButtons
        hasFiles={localFiles.length > 0}
        onSave={() => handleSave(onComplete)} // También se puede usar aquí
        onDeleteAll={handleDeleteAll}
        onContinue={handleContinue}
        isSaving={isSaving || uploadMutation.isPending}
      />
    </div>
  );
};

export default PhotoUploadPage;