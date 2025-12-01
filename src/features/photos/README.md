# Photos Feature (Frontend)

Feature de React para la gestion de imagenes de perfil de usuario. Permite subir, visualizar, establecer como principal y eliminar fotos.

## Tabla de Contenidos

1. [Descripcion General](#descripcion-general)
2. [Arquitectura](#arquitectura)
3. [Componentes](#componentes)
4. [API Client](#api-client)
5. [Flujo de Usuario](#flujo-de-usuario)
6. [Estado y Cache](#estado-y-cache)
7. [Validaciones](#validaciones)
8. [Integracion con Backend](#integracion-con-backend)
9. [Desarrollo](#desarrollo)

---

## Descripcion General

Este feature implementa la interfaz de usuario para:

- Subir hasta 3 imagenes de perfil
- Previsualizar imagenes antes de guardar
- Establecer una imagen como principal (marcada con estrella)
- Eliminar imagenes individuales o todas
- Mostrar estados de carga y errores

El feature se comunica con el backend a traves de la API REST `/api/profile/photos/`.

---

## Arquitectura

```
photos/
    README.md                 # Esta documentacion
    PhotoUploadPage.tsx       # Pagina principal del feature
    components/
        ActionButtons.tsx     # Botones de accion (guardar, eliminar)
        BannerInfo.tsx        # Banner informativo
        PhotoSlot.tsx         # Slot individual de foto
        UploadDropzone.tsx    # Zona de arrastre para subir
```

### Dependencias

- `@tanstack/react-query`: Cache y sincronizacion de datos del servidor
- `lucide-react`: Iconos (Trash2, Star)
- `sonner`: Notificaciones toast

---

## Componentes

### PhotoUploadPage

Componente principal que orquesta toda la funcionalidad de subida de fotos.

**Props:**
```typescript
interface PhotoUploadPageProps {
  onComplete: () => void;  // Callback al completar el flujo
}
```

**Estado local:**
- `localFiles`: Array de archivos (locales + del servidor)
- `isSaving`: Indicador de guardado en progreso

**Queries:**
- `userPhotos`: Obtiene las fotos actuales del usuario

**Mutations:**
- `uploadMutation`: Sube una imagen al servidor
- `deleteMutation`: Elimina una imagen
- `setPrincipalMutation`: Establece imagen principal

### PhotoSlot

Muestra una imagen individual con controles de accion.

**Caracteristicas:**
- Boton de estrella para marcar como principal
- Boton de eliminar (visible en hover)
- Badge "Principal" cuando `es_principal=true`

### UploadDropzone

Zona interactiva para seleccionar archivos.

**Caracteristicas:**
- Input de tipo file con accept para imagenes
- Soporte para seleccion multiple
- Validacion de tipo y tamano antes de agregar

---

## API Client

El cliente de API se encuentra en `src/shared/lib/api.ts`:

```typescript
export const photoAPI = {
  // Obtener todas las fotos del usuario autenticado
  getPhotos: async () => {
    const response = await api.get("/profile/photos/");
    return response.data;
  },

  // Subir una nueva foto
  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append('imagen', file);
    const response = await api.post("/profile/photos/", formData);
    return response.data;
  },

  // Eliminar una foto por ID
  deletePhoto: async (photoId: number) => {
    const response = await api.delete(`/profile/photos/${photoId}/`);
    return response.data;
  },

  // Establecer una foto como principal
  setPrincipalPhoto: async (photoId: number) => {
    const response = await api.patch(`/profile/photos/${photoId}/`, { 
      es_principal: true 
    });
    return response.data;
  },
};
```

### Nota sobre Content-Type

El header `Content-Type` para `multipart/form-data` NO se establece manualmente. Axios y el navegador lo configuran automaticamente con el boundary correcto.

---

## Flujo de Usuario

### 1. Carga inicial

1. Se ejecuta query `userPhotos`
2. Las fotos del servidor se cargan en `localFiles`
3. Se muestran en los slots correspondientes

### 2. Seleccion de archivos

1. Usuario hace clic en slot vacio o input
2. Se valida tipo (jpeg, png, webp) y tamano (max 5MB)
3. Se crea preview local con `URL.createObjectURL`
4. Se agrega a `localFiles` sin ID (pendiente de guardar)

### 3. Establecer principal

- **Foto local**: Se marca en estado local, se aplicara al guardar
- **Foto del servidor**: Se llama `setPrincipalMutation` inmediatamente

### 4. Guardar

1. Se filtran archivos sin ID (nuevos)
2. Se suben secuencialmente con `uploadMutation`
3. Se invalida cache `userPhotos`
4. Si hay foto principal local, se establece en el servidor

### 5. Continuar

1. Valida que haya al menos 1 foto
2. Ejecuta guardado
3. Llama `onComplete()` al terminar

---

## Estado y Cache

### React Query

```typescript
// Query para obtener fotos
const { data: serverPhotos, isLoading } = useQuery({
  queryKey: ["userPhotos"],
  queryFn: photoAPI.getPhotos,
});

// Invalidar cache despues de mutaciones
queryClient.invalidateQueries({ queryKey: ["userPhotos"] });
```

### Estado Local

El estado `localFiles` combina:
- Fotos del servidor (tienen `id`)
- Fotos pendientes de subir (sin `id`, solo `preview`)

```typescript
interface PhotoFile extends File {
  preview: string;       // URL para mostrar
  id?: number;           // ID del servidor (undefined si es local)
  es_principal?: boolean;
  imagen?: string;       // URL completa del servidor
}
```

---

## Validaciones

### En cliente (antes de agregar a localFiles)

| Validacion     | Mensaje                                        |
|----------------|------------------------------------------------|
| Tipo de archivo| "El archivo 'X' no es una imagen valida."      |
| Tamano > 5MB   | "El archivo 'X' es muy grande. Maximo 5MB."    |
| Limite de 3    | "Solo puedes subir N imagen(es) mas."          |

### En servidor (respuesta de API)

| Codigo | Descripcion                                     |
|--------|-------------------------------------------------|
| 400    | Archivo no es imagen valida                     |
| 400    | Imagen excede tamano maximo                     |
| 400    | Limite de imagenes alcanzado                    |
| 401    | Token invalido o expirado                       |

---

## Integracion con Backend

### Endpoints utilizados

| Metodo | Endpoint                  | Descripcion              |
|--------|---------------------------|--------------------------|
| GET    | /api/profile/photos/      | Listar fotos del usuario |
| POST   | /api/profile/photos/      | Subir nueva foto         |
| PATCH  | /api/profile/photos/{id}/ | Actualizar (principal)   |
| DELETE | /api/profile/photos/{id}/ | Eliminar foto            |

### Formato de respuesta

```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "imagen_id": 1,
      "usuario": 5,
      "imagen": "http://localhost:9000/cupido-media/usuarios/5/5_imagen_1.jpg",
      "es_principal": true,
      "fecha_subida": "2025-11-27T10:30:00Z"
    }
  ]
}
```

### Almacenamiento

Las imagenes se almacenan en MinIO (S3-compatible). La URL de la imagen apunta directamente al bucket:
```
http://{MINIO_PUBLIC_URL}/{BUCKET}/usuarios/{user_id}/{filename}
```

---

## Desarrollo

### Requisitos

1. Backend corriendo en `http://localhost:8000`
2. MinIO corriendo en `http://localhost:9000`
3. Usuario autenticado (token JWT valido)

### Ejecutar frontend

```bash
cd cupido-frontend
npm install
npm run dev
```

### Probar el feature

1. Iniciar sesion en la aplicacion
2. Navegar a la pagina de fotos (o completar registro)
3. Subir imagenes y verificar que aparecen en MinIO

### Verificar en MinIO

1. Abrir http://localhost:9001
2. Login: minioadmin / minioadmin
3. Navegar a bucket `cupido-media` > `usuarios/{tu_user_id}/`

---

## Consideraciones de UX

1. **Feedback inmediato**: Las imagenes locales se muestran instantaneamente con preview
2. **Estados de carga**: Spinner durante carga inicial y guardado
3. **Notificaciones**: Toast para exito, error y acciones informativas
4. **Hover states**: Controles de accion visibles solo en hover
5. **Validacion temprana**: Errores de tipo/tamano antes de intentar subir

---

## Notas Tecnicas

1. **Memory leaks**: Se liberan URLs de objeto con `URL.revokeObjectURL` en cleanup
2. **Subida secuencial**: Las imagenes se suben una por una para evitar race conditions
3. **Delay entre subidas**: 500ms de espera para que el backend procese el renombrado
4. **Cache invalidation**: Se invalida cache despues de cada mutacion exitosa
