import PhotoUploadPage from "./PhotoUploadPage";
import { useNavigate } from "react-router-dom";

/**
 * EditPhotosPage - Wrapper component for editing profile photos
 * Uses PhotoUploadPage which automatically loads existing photos
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
