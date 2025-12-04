import { Routes, Route } from "react-router-dom";
import Home from "@home/Home";
import ProfilePage from "@profile/components/ProfilePage";
import EditProfilePage from "@profile/components/EditProfilePage";
import NotFound from "@pages/NotFound";
import MatchPage from "@matching/pages/MatchPage";
import ChatGeneral from "@chat/ChatGeneral";
import MainLayout from "@pages/MainLayout";
import ResetPasswordPage from "@auth/pages/resetPasswordPage";
import AboutPage from "@home/pages/AboutPage";
import TeamPage from "@home/pages/TeamPage";

export const AppRouter = () => {
  return (
    <Routes>
      {/* RUTAS SIN SIDEBAR */}
      <Route path="/" element={<Home />} />
      <Route path="/edit-profile" element={<EditProfilePage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/team" element={<TeamPage />} />

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
