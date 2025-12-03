import { Routes, Route } from "react-router-dom";
import Home from "@home/Home";
import ProfilePage from "@profile/components/ProfilePage";
import EditProfilePage from "@profile/components/EditProfilePage";
import NotFound from "@pages/NotFound";
import MatchPage from "@features/matching/pages/MatchPage";
import ChatGeneral from "@features/chat/ChatGeneral";
import MainLayout from "@pages/MainLayout";
import ResetPasswordPage from "@features/auth/pages/resetPasswordPage";
import AboutPage from "@features/home/pages/AboutPage";
import TeamPage from "@features/home/pages/TeamPage";

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
