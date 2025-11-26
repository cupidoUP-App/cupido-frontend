import { Toaster } from "@ui/toaster";
import { Toaster as Sonner } from "@ui/sonner";
import { TooltipProvider } from "@ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@home/Home";
import ProfilePage from "@profile/components/ProfilePage";
import EditProfilePage from "@profile/components/EditProfilePage";
import EditPreferencesPage from "@profile/components/EditPreferencesPage";
import NotFound from "@pages/NotFound";

import MainLayout from "@pages/MainLayout"; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          {/* Rutas SIN sidebar */}
          <Route path="/" element={<Home />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/edit-preferences" element={<EditPreferencesPage />} />

          {/* RUTAS CON SIDEBAR */}
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* catch-all */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
