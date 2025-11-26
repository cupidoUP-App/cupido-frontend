import { Routes, Route } from "react-router-dom";
import Home from "@home/Home";
import ProfilePage from "@profile/components/ProfilePage";
import EditProfilePage from "@profile/components/EditProfilePage";
import EditPreferencesPage from "@profile/components/EditPreferencesPage";
import NotFound from "@pages/NotFound";
import MainLayout from "@pages/MainLayout";
import MatchPage from "@features/matching/MatchPage";

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/edit-preferences" element={<EditPreferencesPage />} />
            <Route path="/Match" element={<MatchPage />} />

            {/* RUTAS CON SIDEBAR */}
            <Route element={<MainLayout />}>
                <Route path="/profile" element={<ProfilePage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
