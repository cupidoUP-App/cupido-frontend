import PhotoUploadPage from "./PhotoUploadPage";
import { useNavigate } from "react-router-dom";

/**
 * Página de edición de fotos de perfil.
 * Componente wrapper que utiliza PhotoUploadPage para cargar y editar
 * las fotos existentes del usuario, redirigiendo al perfil al finalizar.
 */
const EditPhotosPage = () => {
  const navigate = useNavigate();
  
  return (
    <PhotoUploadPage 
      onComplete={() => navigate("/profile")}
      onBack={() => navigate("/edit-profile")}
    />
  );
};

export default EditPhotosPage;
