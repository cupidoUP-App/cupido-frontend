import React from "react";
import MatchDislike from "@assets/MatchDislike.png";
import MatchLike from "@assets/MatchLike.png";

interface MatchActionButtonsProps {
  handleLike: () => void;
  handleDislike: () => void;
  isAnimating: boolean;
  isAtTop: boolean;
}

const MatchActionButtons: React.FC<MatchActionButtonsProps> = ({
  handleLike,
  handleDislike,
  isAnimating,
  isAtTop,
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 flex pointer-events-none">
      <button
        onClick={handleDislike}
        disabled={isAnimating}
        style={{
          left: isAtTop ? "30%" : "10%",
          bottom: isAtTop ? "30px" : "10px",
          transform: "translateX(-50%)",
        }}
        className={`absolute pointer-events-auto ${isAtTop ? "w-20 h-20" : "w-10 h-10"
          } rounded-full bg-white shadow-lg shadow-black/30 flex items-center justify-center ${isAtTop ? "hover:scale-110" : "hover:scale-150"
          } transition-all duration-300 hover:bg-blue-500 group disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <img
          src={MatchDislike}
          alt="Dislike"
          className={`${isAtTop ? "w-10 h-10" : "w-8 h-8"
            } transition-all duration-300 group-hover:invert group-hover:brightness-200`}
        />
      </button>
      <button
        onClick={handleLike}
        disabled={isAnimating}
        style={{
          left: isAtTop ? "70%" : "90%",
          bottom: isAtTop ? "30px" : "10px",
          transform: "translateX(-50%)",
        }}
        className={`absolute pointer-events-auto ${isAtTop ? "w-20 h-20" : "w-10 h-10"
          } rounded-full bg-white shadow-lg shadow-black/30 flex items-center justify-center ${isAtTop ? "hover:scale-110" : "hover:scale-150"
          } transition-all duration-300 hover:bg-red-500 group disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <img
          src={MatchLike}
          alt="Like"
          className={`${isAtTop ? "w-10 h-10" : "w-8 h-8"
            } transition-all duration-300 group-hover:invert group-hover:brightness-200`}
        />
      </button>
    </div>
  );
};

export default MatchActionButtons;
