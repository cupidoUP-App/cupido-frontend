import { Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "@home/Home";

// Code splitting - carga lazy de rutas secundarias para mejorar LCP/TTI
const OtherUserProfilePage = lazy(() => import("@profile/components/OtherUserProfilePage"));
const ProfilePage = lazy(() => import("@profile/components/ProfilePage"));
const EditProfilePage = lazy(() => import("@profile/components/EditProfilePage"));
const NotFound = lazy(() => import("@pages/NotFound"));
const MatchPage = lazy(() => import("@matching/pages/MatchPage"));
const ChatGeneral = lazy(() => import("@chat/ChatGeneral"));
const MainLayout = lazy(() => import("@pages/MainLayout"));
const ResetPasswordPage = lazy(() => import("@auth/pages/resetPasswordPage"));
const AboutPage = lazy(() => import("@home/pages/AboutPage"));
const TeamPage = lazy(() => import("@home/pages/TeamPage"));

// Fallback mínimo para Suspense - no bloquea el LCP
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
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
          <Route path="/chat" element={<ChatGeneral />} />
          <Route path="/other-user-profile/:userId" element={<OtherUserProfilePage />} />
        </Route>

        {/* CATCH ALL */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
