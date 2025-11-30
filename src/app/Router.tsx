import { Routes, Route } from "react-router-dom";
import Home from "@home/Home";
import ProfilePage from "@profile/components/ProfilePage";
import EditProfilePage from "@profile/components/EditProfilePage";
import EditPreferencesPage from "@profile/components/EditPreferencesPage";
import NotFound from "@pages/NotFound";
import MatchPage from "@features/matching/MatchPage";
import ChatGeneral from "@features/chat/ChatGeneral";
import MainLayout from "@pages/MainLayout";

export const AppRouter = () => {
  return (
    <Routes>
      {/* RUTAS SIN SIDEBAR */}
      <Route path="/" element={<Home />} />
      <Route path="/edit-profile" element={<EditProfilePage />} />
      <Route path="/edit-preferences" element={<EditPreferencesPage />} />

      {/* RUTAS CON SIDEBAR */}
      <Route element={<MainLayout />}>
        <Route path="/match" element={<MatchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/test-chat" element={<ChatGeneral />} />
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
