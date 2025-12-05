import React from "react";
import MatchBG from "@assets/background_verification.webp";
import { MatchPageProps } from "../types";
import { useMatch } from "../hooks/useMatch";
import MatchCard from "../components/MatchCard";
import MatchLimitDialog from "../components/MatchLimitDialog";
import MatchOptionsDialog from "../components/MatchOptionsDialog";

const MatchPage: React.FC<MatchPageProps> = ({ matchData }) => {
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
  } = useMatch(matchData);

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
