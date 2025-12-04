import React, { useState, useEffect } from "react";
import MatchBG from "@assets/background_verification.webp";
import { MatchPageProps } from "../types";
import { useMatch } from "../hooks/useMatch";
import { fetchMatches } from "../services/matchService";
import MatchCard from "../components/MatchCard";
import MatchLimitDialog from "../components/MatchLimitDialog";
import MatchOptionsDialog from "../components/MatchOptionsDialog";
import { MatchData } from "../types";

const MatchPage: React.FC<MatchPageProps> = ({ matchData }) => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const data = await fetchMatches();
        setMatches(data);
        setError(null);
      } catch (err) {
        console.error("Error loading matches:", err);
        setError("No se pudieron cargar las recomendaciones");
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

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
