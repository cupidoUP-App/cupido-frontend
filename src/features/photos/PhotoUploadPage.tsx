import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Star } from 'lucide-react';
import fondo from "../../assets/fondoCargueImagenes.png";
import logo from "../../assets/logo-login.webp"; 
import { toast } from 'sonner';
import { photoAPI } from '@/lib/api';

interface PhotoFile extends File {
  preview: string;
  id?: number;
  es_principal?: boolean;
  imagen?: string;
}

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
      console.log('Fotos del servidor:', data);
      // Acceder a results si existe, sino usar data directamente
      const photosArray = data.results || data;
      const fetchedFiles: PhotoFile[] = photosArray.map((photo: any) => ({
        name: photo.imagen.split('/').pop(),
        size: 0, 
        type: 'image/jpeg',
        preview: photo.imagen,
        id: photo.imagen_id || photo.id,
        es_principal: photo.es_principal,
        imagen: photo.imagen,
      }));
      setLocalFiles(fetchedFiles);
    },
    onError: (error: any) => {
      console.error('Error cargando fotos:', error);
      toast.error(`Error al cargar las fotos: ${error.response?.data?.detail || error.message}`);
    },
  });

  // Mutación para subir fotos
  const uploadMutation = useMutation({
    mutationFn: photoAPI.uploadPhoto,
    onSuccess: (data) => {
      console.log('✅ Subida exitosa:', data);
      queryClient.invalidateQueries({ queryKey: ['userPhotos'] });
    },
    onError: (error: any) => {
      console.error('❌ Error en uploadPhoto:', error);
      const errorData = error.response?.data;
      
      if (errorData) {
        console.log('📋 Datos del error:', errorData);
        
        if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          toast.error(`Error: ${errorMessages}`);
        } else if (typeof errorData === 'string') {
          toast.error(`Error: ${errorData}`);
        } else {
          toast.error(`Error al subir imagen: ${error.message || 'Error desconocido'}`);
        }
      } else {
        toast.error(`Error de conexión: ${error.message}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: photoAPI.deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPhotos'] });
      toast.success("Imagen eliminada exitosamente!");
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar imagen: ${error.response?.data?.detail || error.message}`);
    },
  });

  const setPrincipalMutation = useMutation({
    mutationFn: photoAPI.setPrincipalPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPhotos'] });
      toast.success("Imagen principal actualizada!");
    },
    onError: (error: any) => {
      toast.error(`Error al establecer imagen principal: ${error.response?.data?.detail || error.message}`);
    },
  });

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentTotalFiles = localFiles.length;
    const maxFilesAllowed = 3;
    const remainingSlots = maxFilesAllowed - currentTotalFiles;

    if (files.length === 0) return;

    let acceptedFiles = files;
    if (files.length > remainingSlots) {
      toast.error(`Solo puedes subir ${remainingSlots} imagen(es) más.`);
      acceptedFiles = files.slice(0, remainingSlots);
    }

    const newFiles: PhotoFile[] = [];
    acceptedFiles.forEach(file => {
      const max_size_mb = 5;
      if (file.size > max_size_mb * 1024 * 1024) {
        toast.error(`El archivo '${file.name}' es muy grande. Máximo ${max_size_mb}MB.`);
        return;
      }
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error(`El archivo '${file.name}' no es una imagen válida.`);
        return;
      }

      newFiles.push(Object.assign(file, {
        preview: URL.createObjectURL(file),
        es_principal: false,
      }));
    });

    setLocalFiles(prevFiles => {
      const updatedFiles = [...prevFiles, ...newFiles];
      
      // Si es la primera imagen que se sube, marcarla como principal localmente
      if (prevFiles.length === 0 && newFiles.length > 0) {
        updatedFiles[0].es_principal = true;
      }
      
      return updatedFiles;
    });

    if (newFiles.length > 0) {
      toast.info(`${newFiles.length} imagen(es) lista(s) para guardar.`);
    }

    // Limpiar el input
    e.target.value = '';
  }, [localFiles]);

  const handleDeleteFile = useCallback((fileToDelete: PhotoFile) => {
    if (fileToDelete.id) {
      deleteMutation.mutate(fileToDelete.id);
    } else {
      setLocalFiles(prevFiles => {
        const newFiles = prevFiles.filter(file => file !== fileToDelete);
        // Si eliminamos la imagen principal, establecer la primera como principal
        if (fileToDelete.es_principal && newFiles.length > 0) {
          newFiles[0].es_principal = true;
        }
        return newFiles;
      });
      // Liberar URL del objeto
      if (fileToDelete.preview.startsWith('blob:')) {
        URL.revokeObjectURL(fileToDelete.preview);
      }
      toast.info(`Imagen '${fileToDelete.name}' removida.`);
    }
  }, [deleteMutation]);

  const handleSetPrincipal = useCallback((fileToSetPrincipal: PhotoFile) => {
    if (fileToSetPrincipal.id) {
      // Si ya está en el servidor, actualizar directamente
      setPrincipalMutation.mutate(fileToSetPrincipal.id);
    } else {
      // Si es local, actualizar el estado local
      setLocalFiles(prevFiles =>
        prevFiles.map(file => ({
          ...file,
          es_principal: file === fileToSetPrincipal
        }))
      );
      toast.success(`'${fileToSetPrincipal.name}' será establecida como principal al guardar.`);
    }
  }, [setPrincipalMutation]);

  const handleSave = useCallback(async (onSuccess?: () => void) => {
    const newFiles = localFiles.filter(file => !file.id);
    const principalFile = localFiles.find(file => file.es_principal && !file.id);

    if (newFiles.length === 0) {
      toast.info("No hay nuevas imágenes para guardar.");
      onSuccess?.();
      return;
    }

    setIsSaving(true);
    
    try {
      console.log('🚀 Iniciando subida de', newFiles.length, 'archivos');
      
      // Subir archivos uno por uno
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        console.log(`📤 Subiendo archivo ${i + 1}/${newFiles.length}:`, file.name);
        
        await uploadMutation.mutateAsync(file);
        
        // Esperar un poco para que el backend procese la imagen
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Invalidar queries para obtener los nuevos datos
      await queryClient.invalidateQueries({ queryKey: ['userPhotos'] });
      
      // Si hay una imagen principal local, establecerla como principal en el servidor
      if (principalFile) {
        console.log('🎯 Buscando imagen principal para establecer...');
        
        // Esperar un poco más y obtener las fotos actualizadas
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Obtener las fotos actualizadas del servidor
        const updatedPhotosResponse = await queryClient.fetchQuery({ 
          queryKey: ['userPhotos'],
          queryFn: photoAPI.getPhotos 
        });
        
        console.log('📷 Respuesta actualizada:', updatedPhotosResponse);
        
        // Acceder a results si existe, sino usar el array directamente
        const updatedPhotos = updatedPhotosResponse.results || updatedPhotosResponse;
        console.log('📸 Fotos actualizadas (array):', updatedPhotos);
        
        if (Array.isArray(updatedPhotos)) {
          // Buscar la imagen principal por nombre (aproximación)
          const principalServerPhoto = updatedPhotos.find((photo: any) => {
            const photoName = photo.imagen.split('/').pop().toLowerCase();
            const principalName = principalFile.name.toLowerCase();
            return photoName.includes(principalName.split('.')[0]) || 
                   photo.es_principal;
          });
          
          if (principalServerPhoto) {
            console.log('🎯 Estableciendo imagen principal:', principalServerPhoto);
            const photoId = principalServerPhoto.imagen_id || principalServerPhoto.id;
            await setPrincipalMutation.mutateAsync(photoId);
            console.log('✅ Imagen principal establecida');
          } else {
            console.warn('⚠️ No se encontró la imagen principal en el servidor');
            // Si no se encuentra, establecer la primera imagen como principal
            if (updatedPhotos.length > 0) {
              const firstPhoto = updatedPhotos[0];
              const photoId = firstPhoto.imagen_id || firstPhoto.id;
              console.log('🔄 Estableciendo primera imagen como principal:', firstPhoto);
              await setPrincipalMutation.mutateAsync(photoId);
            }
          }
        } else {
          console.error('❌ updatedPhotos no es un array:', updatedPhotos);
        }
      }
      
      toast.success("¡Todas las imágenes se guardaron exitosamente!");
      onSuccess?.();
    } catch (error) {
      console.error('💥 Error durante la subida:', error);
    } finally {
      setIsSaving(false);
    }
  }, [localFiles, uploadMutation, setPrincipalMutation, queryClient]);

  const handleDeleteAll = useCallback(() => {
    const serverFileIds = localFiles.filter(f => f.id).map(f => f.id);
    if (serverFileIds.length > 0) {
      serverFileIds.forEach(id => id && deleteMutation.mutate(id));
    }
    
    // Liberar URLs de objetos
    localFiles.forEach(file => {
      if (file.preview.startsWith('blob:')) {
        URL.revokeObjectURL(file.preview);
      }
    });
    
    setLocalFiles([]);
    toast.info("Todas las imágenes removidas.");
  }, [localFiles, deleteMutation]);

  const handleContinue = useCallback(() => {
    if (localFiles.length === 0) {
      toast.error("Debes subir al menos una imagen para continuar.");
      return;
    }
    handleSave(onComplete);
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
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FFF0EC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando tus fotos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex relative bg-[#FFF0EC]">
      {/* Fondo pegado abajo */}
      <div
        className="absolute inset-x-0 bottom-0 top-auto z-0 h-2/3"
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: "contain",
          backgroundPosition: "bottom center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Botón volver - esquina superior izquierda */}
      <button className="absolute top-8 left-8 text-gray-600 hover:text-gray-800 text-2xl z-20">
        ←
      </button>

      {/* Contenedor principal dividido en 2 columnas */}
      <div className="flex flex-1 w-full relative z-10">
        
        {/* COLUMNA IZQUIERDA - 50% */}
        <div className="w-1/2 flex flex-col items-center justify-center px-12 -mt-60">
          <div className="max-w-md text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img 
                src={logo} 
                alt="Logo" 
                className="w-24 h-24 object-contain" 
              />
            </div>

            {/* Título */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sube tus mejores fotos
            </h1>
            
            {/* Descripción */}
            <p className="text-gray-700 text-lg mb-8">
              Puedes subir entre 1 y 3 imágenes para tu perfil.
            </p>

            {/* Botón Continuar */}
            <button
              onClick={handleContinue}
              disabled={localFiles.length === 0 || isSaving || uploadMutation.isPending}
              className="w-full px-10 py-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg shadow-lg"
            >
              {isSaving || uploadMutation.isPending ? "Guardando..." : "Continuar"}
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA - 50% */}
        <div className="w-1/2 flex flex-col items-center justify-center pr-12">
          <div className="flex gap-6 mb-8">
            
            {/* Foto Principal (grande vertical) */}
            <div>
              {localFiles[0] ? (
                <div className="w-72 h-96 rounded-3xl overflow-hidden shadow-2xl relative group">
                  <img 
                    src={localFiles[0].preview} 
                    alt="Principal"
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleSetPrincipal(localFiles[0])}
                      className={`bg-white/95 backdrop-blur-sm rounded-xl w-11 h-11 flex items-center justify-center shadow-lg hover:bg-white transition-all ${
                        localFiles[0].es_principal ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${
                        localFiles[0].es_principal ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'
                      }`} />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(localFiles[0])}
                      className="bg-white/95 backdrop-blur-sm rounded-xl w-11 h-11 flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  {localFiles[0].es_principal && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Principal
                    </div>
                  )}
                </div>
              ) : (
                <label className="w-72 h-96 rounded-3xl border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all shadow-lg">
                  <input 
                    type="file" 
                    accept="image/jpeg,image/png,image/webp" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileInputChange}
                  />
                  <div className="text-6xl mb-3">📷</div>
                  <p className="text-gray-500 text-base font-medium">Subir foto</p>
                </label>
              )}
            </div>

            {/* Fotos Secundarias (2 pequeñas apiladas) */}
            <div className="flex flex-col gap-6">
              {[1, 2].map((index) => {
                const photo = localFiles[index];
                return (
                  <div key={index}>
                    {photo ? (
                      <div className="w-56 h-44 rounded-3xl overflow-hidden shadow-2xl relative group">
                        <img 
                          src={photo.preview} 
                          alt={`Secundaria ${index}`}
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={() => handleSetPrincipal(photo)}
                            className={`bg-white/95 backdrop-blur-sm rounded-xl w-10 h-10 flex items-center justify-center shadow-lg hover:bg-white transition-all ${
                              photo.es_principal ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${
                              photo.es_principal ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'
                            }`} />
                          </button>
                          <button
                            onClick={() => handleDeleteFile(photo)}
                            className="bg-white/95 backdrop-blur-sm rounded-xl w-10 h-10 flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                        {photo.es_principal && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Principal
                          </div>
                        )}
                      </div>
                    ) : (
                      <label className="w-56 h-44 rounded-3xl border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all shadow-lg">
                        <input 
                          type="file" 
                          accept="image/jpeg,image/png,image/webp" 
                          multiple 
                          className="hidden" 
                          onChange={handleFileInputChange}
                        />
                        <div className="text-4xl mb-2">📷</div>
                        <p className="text-gray-500 text-sm font-medium">Subir foto</p>
                      </label>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* BOTONES DEBAJO DE LAS IMÁGENES */}
          <div className="flex gap-6">
            <button
              onClick={() => handleSave()}
              disabled={localFiles.length === 0 || isSaving || uploadMutation.isPending}
              className="px-12 py-3.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg text-base"
            >
              {isSaving || uploadMutation.isPending ? "Guardando..." : "Guardar"}
            </button>

            <button
              onClick={handleDeleteAll}
              disabled={localFiles.length === 0}
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