import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Star } from "lucide-react";
import fondo from "@assets/fondoCargueImagenes.png";
import logo from "@assets/logo-login.webp";
import { toast } from "sonner";
import { photoAPI } from "@lib/api";

interface PhotoFile {
  id?: number;
  name: string;
  preview: string;
  es_principal?: boolean;
  imagen?: string;
  file?: File;
}

interface PhotoUploadPageProps {
  onComplete: () => void;
}

const PhotoUploadPage: React.FC<PhotoUploadPageProps> = ({ onComplete }) => {
  const queryClient = useQueryClient();
  const [serverFiles, setServerFiles] = useState<PhotoFile[]>([]);
  const [newFiles, setNewFiles] = useState<PhotoFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const {
    data: serverPhotos,
    isLoading: isLoadingPhotos,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["userPhotos"],
    queryFn: photoAPI.getPhotos,
  });

  useEffect(() => {
    if (!isSuccess || !serverPhotos) return;

    console.log("Fotos del servidor:", serverPhotos);

    const photosArray = serverPhotos.results || serverPhotos;

    const fetchedFiles: PhotoFile[] = photosArray.map((photo: any) => {
      const imageUrl = photo.imagen;
      const fileName = imageUrl ? imageUrl.split("/").pop() : `photo_${photo.id}`;
      
      return {
        name: fileName,
        preview: imageUrl,
        id: photo.imagen_id || photo.id,
        es_principal: photo.es_principal,
        imagen: imageUrl,
      };
    });

    setServerFiles(fetchedFiles);
  }, [isSuccess, serverPhotos]);

  useEffect(() => {
    if (!isError || !error) return;

    console.error("Error cargando fotos:", error);

    const err: any = error;

    toast.error(
      `Error al cargar las fotos: ${err.response?.data?.detail || err.message}`
    );
  }, [isError, error]);

  const uploadMutation = useMutation({
    mutationFn: photoAPI.uploadPhoto,
    onSuccess: (data) => {
      console.log("✅ Subida exitosa:", data);
      queryClient.invalidateQueries({ queryKey: ["userPhotos"] });
    },
    onError: (error: any) => {
      console.error("❌ Error en uploadPhoto:", error);
      const errorData = error.response?.data;

      if (errorData) {
        console.log("📋 Datos del error:", errorData);

        // Detectar errores de moderación de contenido (vienen en el campo 'imagen')
        if (errorData.imagen && Array.isArray(errorData.imagen)) {
          const moderationMessage = errorData.imagen[0];
          
          // Verificar si es un error de moderación por contenido inapropiado
          if (moderationMessage.includes("no puede ser publicada") || 
              moderationMessage.includes("contenido")) {
            toast.error(moderationMessage, {
              duration: 6000, // Mostrar más tiempo para que el usuario lea
              icon: "🚫",
            });
            return;
          }
        }

        // Otros errores de validación
        if (typeof errorData === "object") {
          const errorMessages = Object.entries(errorData)
            .map(
              ([key, value]) =>
                Array.isArray(value) ? value.join(", ") : String(value)
            )
            .join("; ");
          toast.error(errorMessages || "Error al subir la imagen");
        } else if (typeof errorData === "string") {
          toast.error(errorData);
        } else {
          toast.error(
            error.message || "Error desconocido al subir imagen"
          );
        }
      } else {
        toast.error(`Error de conexión: ${error.message}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: photoAPI.deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPhotos"] });
      toast.success("Imagen eliminada exitosamente!");
    },
    onError: (error: any) => {
      toast.error(
        `Error al eliminar imagen: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });

  const setPrincipalMutation = useMutation({
    mutationFn: photoAPI.setPrincipalPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPhotos"] });
      toast.success("Imagen principal actualizada!");
    },
    onError: (error: any) => {
      toast.error(
        `Error al establecer imagen principal: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });

  const processFiles = useCallback((files: File[], targetIndex?: number) => {
    const currentTotalFiles = serverFiles.length + newFiles.length;
    const maxFilesAllowed = 3;
    const remainingSlots = maxFilesAllowed - currentTotalFiles;

    if (files.length === 0) return;

    let acceptedFiles = files;
    if (files.length > remainingSlots) {
      toast.error(`Solo puedes subir ${remainingSlots} imagen(es) más.`);
      acceptedFiles = files.slice(0, remainingSlots);
    }

    const processedFiles: PhotoFile[] = [];
    acceptedFiles.forEach((file) => {
      const max_size_mb = 5;
      if (file.size > max_size_mb * 1024 * 1024) {
        toast.error(
          `El archivo '${file.name}' es muy grande. Máximo ${max_size_mb}MB.`
        );
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(`El archivo '${file.name}' no es una imagen válida.`);
        return;
      }

      processedFiles.push({
        name: file.name,
        preview: URL.createObjectURL(file),
        es_principal: false,
        file: file
      });
    });

    setNewFiles((prevFiles) => {
      let updatedFiles = [...prevFiles];
      
      if (targetIndex !== undefined) {
        // Si hay targetIndex, reemplazar/agregar en esa posición específica
        let currentIndex = targetIndex;
        for (const processedFile of processedFiles) {
          if (currentIndex < updatedFiles.length) {
            // Liberar URL anterior si existe
            if (updatedFiles[currentIndex].preview.startsWith("blob:")) {
              URL.revokeObjectURL(updatedFiles[currentIndex].preview);
            }
            updatedFiles[currentIndex] = processedFile;
          } else {
            // Agregar en posición específica
            updatedFiles[currentIndex] = processedFile;
          }
          currentIndex++;
          
          // No exceder el máximo de archivos
          if (currentIndex >= maxFilesAllowed) break;
        }
      } else {
        // Sin targetIndex, agregar al final
        updatedFiles = [...prevFiles, ...processedFiles];
      }

      // Filtrar elementos undefined y limitar a máximo 3
      updatedFiles = updatedFiles.filter(file => file !== undefined).slice(0, maxFilesAllowed);

      // Si es la primera imagen, marcarla como principal
      if (prevFiles.length === 0 && serverFiles.length === 0 && processedFiles.length > 0) {
        updatedFiles[0].es_principal = true;
      }

      return updatedFiles;
    });

    if (processedFiles.length > 0) {
      toast.info(`${processedFiles.length} imagen(es) lista(s) para guardar.`);
    }
  }, [serverFiles.length, newFiles.length]);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, targetIndex?: number) => {
      const files = Array.from(e.target.files || []);
      processFiles(files, targetIndex);
      e.target.value = "";
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggingIndex(index);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggingIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDraggingIndex(null);
    
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files, targetIndex);
  }, [processFiles]);

  const handleDeleteFile = useCallback(
    (fileToDelete: PhotoFile, isServerFile: boolean) => {
      if (isServerFile && fileToDelete.id) {
        deleteMutation.mutate(fileToDelete.id);
      } else {
        setNewFiles((prevFiles) => {
          const newFiles = prevFiles.filter((file) => file !== fileToDelete);
          // Si eliminamos la imagen principal, establecer la primera como principal
          if (fileToDelete.es_principal && newFiles.length > 0) {
            newFiles[0].es_principal = true;
          }
          return newFiles;
        });
        // Liberar URL
        if (fileToDelete.preview.startsWith("blob:")) {
          URL.revokeObjectURL(fileToDelete.preview);
        }
        toast.info(`Imagen '${fileToDelete.name}' removida.`);
      }
    },
    [deleteMutation]
  );

  const handleSetPrincipal = useCallback(
    (fileToSetPrincipal: PhotoFile, isServerFile: boolean) => {
      if (isServerFile && fileToSetPrincipal.id) {
        setPrincipalMutation.mutate(fileToSetPrincipal.id);
      } else if (!isServerFile) {
        // Para archivos nuevos, actualizar el estado local
        setNewFiles((prevFiles) =>
          prevFiles.map((file) => ({
            ...file,
            es_principal: file === fileToSetPrincipal,
          }))
        );
        toast.success(
          `'${fileToSetPrincipal.name}' será establecida como principal al guardar.`
        );
      }
    },
    [setPrincipalMutation]
  );

  const handleSave = useCallback(
    async (onSuccess?: () => void) => {
      if (newFiles.length === 0) {
        toast.info("No hay nuevas imágenes para guardar.");
        onSuccess?.();
        return;
      }

      setIsSaving(true);

      try {
        console.log(" Iniciando subida de", newFiles.length, "archivos");

        // Subir nuevas imágenes
        for (let i = 0; i < newFiles.length; i++) {
          const fileData = newFiles[i];
          if (fileData.file) {
            console.log(
              ` Subiendo archivo ${i + 1}/${newFiles.length}:`,
              fileData.name
            );

            await uploadMutation.mutateAsync(fileData.file);
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }

        // Buscar imagen principal entre las nuevas
        const principalNewFile = newFiles.find((file) => file.es_principal);

        // Esperar y refrescar datos del servidor
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await queryClient.invalidateQueries({ queryKey: ["userPhotos"] });

        // Establecer imagen principal si hay una seleccionada
        if (principalNewFile) {
          console.log(" Buscando imagen principal...");

          const updatedPhotosResponse = await queryClient.fetchQuery({
            queryKey: ["userPhotos"],
            queryFn: photoAPI.getPhotos,
          });

          const updatedPhotos = updatedPhotosResponse.results || updatedPhotosResponse;

          if (Array.isArray(updatedPhotos) && updatedPhotos.length > 0) {
            // Buscar la imagen principal por nombre
            const principalServerPhoto = updatedPhotos.find((photo: any) => {
              const photoName = photo.imagen?.split("/").pop()?.toLowerCase() || '';
              const principalName = principalNewFile.name?.toLowerCase() || '';
              return photoName.includes(principalName.split(".")[0]);
            });

            if (principalServerPhoto) {
              console.log(" Estableciendo imagen principal:", principalServerPhoto);
              const photoId = principalServerPhoto.imagen_id || principalServerPhoto.id;
              await setPrincipalMutation.mutateAsync(photoId);
            } else if (updatedPhotos.length > 0) {
              // Fallback: establecer primera imagen como principal
              const firstPhoto = updatedPhotos[0];
              const photoId = firstPhoto.imagen_id || firstPhoto.id;
              console.log(" Estableciendo primera imagen como principal:", firstPhoto);
              await setPrincipalMutation.mutateAsync(photoId);
            }
          }
        }

        // Limpiar archivos nuevos después de subirlos exitosamente
        // Liberar URLs de blobs para evitar memory leaks
        newFiles.forEach((file) => {
          if (file.preview.startsWith("blob:")) {
            URL.revokeObjectURL(file.preview);
          }
        });
        setNewFiles([]);

        toast.success("¡Todas las imágenes se guardaron exitosamente!");
        onSuccess?.();
      } catch (error) {
        console.error(" Error durante la subida:", error);
        toast.error("Error al guardar las imágenes");
      } finally {
        setIsSaving(false);
      }
    },
    [newFiles, uploadMutation, setPrincipalMutation, queryClient]
  );

  const handleDeleteAll = useCallback(() => {
    // Eliminar archivos del servidor
    serverFiles.forEach((file) => {
      if (file.id) {
        deleteMutation.mutate(file.id);
      }
    });

    // Liberar URLs de archivos nuevos
    newFiles.forEach((file) => {
      if (file.preview.startsWith("blob:")) {
        URL.revokeObjectURL(file.preview);
      }
    });

    setNewFiles([]);
    toast.info("Todas las imágenes removidas.");
  }, [serverFiles, newFiles, deleteMutation]);

  const handleContinue = useCallback(() => {
    const totalFiles = serverFiles.length + newFiles.length;
    if (totalFiles === 0) {
      toast.error("Debes subir al menos una imagen para continuar.");
      return;
    }
    handleSave(onComplete);
  }, [serverFiles.length, newFiles, handleSave, onComplete]);

  useEffect(() => {
    return () => {
      newFiles.forEach((file) => {
        if (file.preview.startsWith("blob:")) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [newFiles]);

  if (isLoadingPhotos) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FFF0EC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando tus fotos...</p>
        </div>
      </div>
    );
  }

  const renderImageSlot = (index: number) => {
    const allFiles = [...serverFiles, ...newFiles];
    const photo = allFiles[index];
    const isServerFile = index < serverFiles.length;
    const isLarge = index === 0;
    const width = isLarge ? "w-72" : "w-56";
    const height = isLarge ? "h-96" : "h-44";
    
    return (
      <div>
        {photo ? (
          <div className={`${width} ${height} rounded-3xl overflow-hidden shadow-2xl relative group`}>
            <img
              src={photo.preview}
              alt={isLarge ? "Principal" : `Secundaria ${index}`}
              className="w-full h-full object-cover"
            />
            <div className={`absolute ${isLarge ? 'top-4 right-4' : 'top-3 right-3'} flex gap-2`}>
              <button
                onClick={() => handleSetPrincipal(photo, isServerFile)}
                className={`bg-white/95 backdrop-blur-sm rounded-xl ${isLarge ? 'w-11 h-11' : 'w-10 h-10'} flex items-center justify-center shadow-lg hover:bg-white transition-all ${
                  photo.es_principal
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <Star
                  className={`${isLarge ? 'w-5 h-5' : 'w-4 h-4'} ${
                    photo.es_principal
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-700"
                  }`}
                />
              </button>
              <button
                onClick={() => handleDeleteFile(photo, isServerFile)}
                className={`bg-white/95 backdrop-blur-sm rounded-xl ${isLarge ? 'w-11 h-11' : 'w-10 h-10'} flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100`}
              >
                <Trash2 className={`${isLarge ? 'w-5 h-5' : 'w-4 h-4'} text-gray-700`} />
              </button>
            </div>
            {photo.es_principal && (
              <div className={`absolute ${isLarge ? 'top-4 left-4' : 'top-3 left-3'} bg-red-500 text-white ${isLarge ? 'px-3 py-1 text-sm' : 'px-2 py-1 text-xs'} rounded-full font-semibold`}>
                Principal
              </div>
            )}
          </div>
        ) : (
          <label 
            className={`${width} ${height} rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all shadow-lg ${
              draggingIndex === index 
                ? "border-red-500 bg-red-50 border-4" 
                : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
            }`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={(e) => handleDragLeave(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple={true}
              className="hidden"
              onChange={(e) => handleFileInputChange(e, index)}
            />
            <div className={`${isLarge ? 'text-6xl mb-3' : 'text-4xl mb-2'}`}>📷</div>
            <p className={`text-gray-500 ${isLarge ? 'text-base' : 'text-sm'} font-medium`}>
              {draggingIndex === index ? "Suelta las imágenes aquí" : "Subir foto"}
            </p>
            {isLarge && (
              <p className="text-gray-400 text-sm mt-2">
                o arrastra y suelta
              </p>
            )}
          </label>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex relative bg-[#FFF0EC]">
      <div
        className="absolute inset-x-0 bottom-0 top-auto z-0 h-2/3"
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: "contain",
          backgroundPosition: "bottom center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <button className="absolute top-8 left-8 text-gray-600 hover:text-gray-800 text-2xl z-20">
        ←
      </button>

      <div className="flex flex-1 w-full relative z-10">
        <div className="w-1/2 flex flex-col items-center justify-center px-12 -mt-60">
          <div className="max-w-md text-center">
            <div className="flex justify-center mb-6">
              <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sube tus mejores fotos
            </h1>

            <p className="text-gray-700 text-lg mb-8">
              Puedes subir entre 1 y 3 imágenes para tu perfil.
            </p>

            <button
              onClick={handleContinue}
              disabled={
                (serverFiles.length + newFiles.length) === 0 || isSaving || uploadMutation.isPending
              }
              className="w-full px-10 py-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg shadow-lg"
            >
              {isSaving || uploadMutation.isPending
                ? "Guardando..."
                : "Continuar"}
            </button>
          </div>
        </div>

        <div className="w-1/2 flex flex-col items-center justify-center pr-12">
          <div className="flex gap-6 mb-8">
            {renderImageSlot(0)}
            
            <div className="flex flex-col gap-6">
              {renderImageSlot(1)}
              {renderImageSlot(2)}
            </div>
          </div>

          <div className="flex gap-6">
            <button
              onClick={() => handleSave()}
              disabled={
                newFiles.length === 0 || isSaving || uploadMutation.isPending
              }
              className="px-12 py-3.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg text-base"
            >
              {isSaving || uploadMutation.isPending
                ? "Guardando..."
                : "Guardar"}
            </button>

            <button
              onClick={handleDeleteAll}
              disabled={(serverFiles.length + newFiles.length) === 0}
              className="px-12 py-3.5 bg-red-400 text-white rounded-xl font-semibold hover:bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg text-base"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadPage;