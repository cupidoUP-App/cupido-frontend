import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Página de fin de producción - Única página disponible
const SeeYouSoonPage = lazy(() => import("@home/pages/SeeYouSoonPage"));

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
        {/* PÁGINA DE FIN DE PRODUCCIÓN */}
        <Route path="/see-you-soon" element={<SeeYouSoonPage />} />
        
        {/* TODAS LAS RUTAS REDIRIGEN A SEE-YOU-SOON */}
        <Route path="*" element={<Navigate to="/see-you-soon" replace />} />
      </Routes>
    </Suspense>
  );
};
