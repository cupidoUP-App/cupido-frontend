import React, { useState, useEffect, useCallback } from "react";
import MatchBG from "@assets/background_verification.webp";
import { MatchPageProps } from "../types";
import { useMatch } from "../hooks/useMatch";
import { useAutoRefresh, AutoRefreshPresets } from "../hooks/useAutoRefresh";
import { fetchMatches } from "../services/matchService";
import MatchCard from "../components/MatchCard";
import MatchLimitDialog from "../components/MatchLimitDialog";
import MatchOptionsDialog from "../components/MatchOptionsDialog";
import MatchSuccessSlide from "../components/MatchSuccessSlide";
import { MatchData } from "../types";

const MatchPage: React.FC<MatchPageProps> = ({ matchData }) => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar matches
  const loadMatches = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await fetchMatches();
      setMatches(data);
      setError(null);

      console.log("✅ Matches cargados/refrescados:", data.length);
    } catch (err) {
      console.error("Error loading matches:", err);
      setError("No se pudieron cargar las recomendaciones");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Carga inicial de matches
  useEffect(() => {
    loadMatches();
  }, []);

  // 🔄 OPCIÓN 3: Regeneración periódica automática de URLs
  // Callback memoizado para el auto-refresh
  const refreshCallback = useCallback(async () => {
    // Refrescar sin mostrar loading (seamless para el usuario)
    await loadMatches(false);
  }, []);

  // Configurar auto-refresh cada 45 minutos (antes de que expiren las URLs de 1 hora)
  useAutoRefresh(refreshCallback, {
    ...AutoRefreshPresets.CONSERVATIVE, // 45 minutos
    enabled: true,
    onRefreshSuccess: () => {
      console.log('✅ Presigned URLs refrescadas exitosamente');
    },
    onRefreshError: (error) => {
      console.error('❌ Error refrescando presigned URLs:', error);
    },
  });

  const {
    displayData,
    isAtTop,
    rotation,
    isAnimating,
    showOverlay,
    overlayIcon,
    showOptions,
    setShowOptions,
    likesRemaining,
    timeUntilReset,
    showLimitOverlay,
    setShowLimitOverlay,
    isDragging,
    dragOffset,
    swipeRotation,
    cardRef,
    handleLike,
    handleDislike,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    matchSuccessData,
    onCloseMatchSuccess,
  } = useMatch(matchData, matches);

  if (loading) {
    return (
      <main
        className="min-h-screen w-full flex items-center justify-center p-4 md:p-6"
        style={{
          backgroundImage: `url(${MatchBG})`,
          backgroundSize: "100% auto",
          backgroundPosition: "left bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E74C3C] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando recomendaciones...</p>
        </div>
      </main>
    );
  }

  if (error || matches.length === 0) {
    return (
      <main
        className="min-h-screen w-full flex items-center justify-center p-4 md:p-6"
        style={{
          backgroundImage: `url(${MatchBG})`,
          backgroundSize: "100% auto",
          backgroundPosition: "left bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-center">
          <p className="text-gray-600">
            {error || "No hay recomendaciones disponibles"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 relative"
      style={{
        backgroundImage: `url(${MatchBG})`,
        backgroundSize: "100% auto",
        backgroundPosition: "left bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      <MatchLimitDialog
        open={showLimitOverlay}
        onOpenChange={setShowLimitOverlay}
        timeUntilReset={timeUntilReset}
      />

      <MatchOptionsDialog open={showOptions} onOpenChange={setShowOptions} />

      {matchSuccessData && (
        <MatchSuccessSlide
          matchedUser={matchSuccessData}
          // currentUserPhotoUrl={user?.photoUrl} // TODO: Obtener foto del usuario actual si es posible
          onClose={onCloseMatchSuccess}
        />
      )}

      <MatchCard
        data={displayData}
        cardRef={cardRef}
        handlers={{
          onPointerDown: handlePointerDown,
          onPointerMove: handlePointerMove,
          onPointerUp: handlePointerUp,
          onPointerCancel: handlePointerCancel,
        }}
        style={{
          transform: `rotateY(${rotation}deg) translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotateZ(${swipeRotation}deg)`,
          transition: isDragging
            ? "none"
            : "transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)",
          transformStyle: "preserve-3d",
          cursor:
            likesRemaining <= 0
              ? "not-allowed"
              : isDragging
                ? "grabbing"
                : "grab",
        }}
        isAtTop={isAtTop}
        setShowOptions={setShowOptions}
        showOverlay={showOverlay}
        overlayIcon={overlayIcon}
        likesRemaining={likesRemaining}
        timeUntilReset={timeUntilReset}
        handleLike={handleLike}
        handleDislike={handleDislike}
        isAnimating={isAnimating}
      />
    </main>
  );
};

export default MatchPage;
