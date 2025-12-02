import React from "react";
import { Card } from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import OptionDots from "@/assets/OptionDots.png";
import CupidWhite from "@/assets/cupid-white.png";
import MatchLike from "@/assets/MatchLike.png";
import { MatchData } from "../types";
import MatchInfo from "./MatchInfo";
import MatchActionButtons from "./MatchActionButtons";

interface MatchCardProps {
  data: MatchData;
  cardRef: React.RefObject<HTMLDivElement>;
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: () => void;
  };
  style: React.CSSProperties;
  isAtTop: boolean;
  setShowOptions: (show: boolean) => void;
  showOverlay: boolean;
  overlayIcon: string;
  likesRemaining: number;
  timeUntilReset: string;
  handleLike: () => void;
  handleDislike: () => void;
  isAnimating: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({
  data,
  cardRef,
  handlers,
  style,
  isAtTop,
  setShowOptions,
  showOverlay,
  overlayIcon,
  likesRemaining,
  timeUntilReset,
  handleLike,
  handleDislike,
  isAnimating,
}) => {
  return (
    <div
      style={{ perspective: "1500px" }}
      className="flex items-center justify-center w-full h-full"
    >
      <Card
        ref={cardRef}
        onPointerDownCapture={handlers.onPointerDown}
        onPointerMoveCapture={handlers.onPointerMove}
        onPointerUpCapture={handlers.onPointerUp}
        onPointerCancelCapture={handlers.onPointerCancel}
        className="w-full max-w-[400px] aspect-[101/150] max-h-[85vh] bg-white rounded-lg overflow-hidden flex flex-col relative shadow-lg shadow-black/20 touch-pan-y select-none"
        style={style}
      >
        {/* Name/age bar - Static overlay */}
        <div
          className={`absolute top-0 left-0 w-full px-4 py-3 flex flex-col gap-2 z-20 pointer-events-none transition-colors duration-300 ${
            isAtTop
              ? "bg-gradient-to-b from-black/50 via-black/20 to-transparent shadow-transparent"
              : "bg-white shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between pointer-events-auto">
            <div
              className={`text-[24px] md:text-[30px] font-['Poppins'] transition-colors duration-300 ${
                isAtTop ? "text-white" : "text-black"
              }`}
            >
              {data?.info?.title || "Nombre"}
              {data?.info?.edad && `, ${data.info.edad}`}
            </div>
            <button
              onClick={() => setShowOptions(true)}
              className={`bg-transparent border-0 p-2 transition-opacity cursor-pointer hover:opacity-70 hover:scale-110 ${
                isAtTop ? "invert" : ""
              }`}
            >
              <img
                src={OptionDots}
                alt="Options menu icon (three vertical dots)"
                className={`w-6 h-6  ${isAtTop ? "invert" : ""}`}
                style={
                  isAtTop ? { filter: "invert(1)" } : { filter: "invert(0)" }
                }
              />
            </button>
          </div>
          <div className="inline-block px-1 py-1 bg-white rounded-full shadow-md shadow-black/80 pointer-events-auto w-fit min-w-[60px]">
            <div className="flex items-center justify-center">
              <span className="text-[13px] md:text-[15px] text-black font-['Poppins'] text-center whitespace-nowrap">
                {data?.info?.intereses?.split(",")[0]?.trim() || "Preferencia"}
              </span>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 w-full [&>div[data-orientation='vertical']]:hidden relative touch-pan-y overflow-x-hidden">
          {/* Overlay */}
          <div
            className={`absolute inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-200 ${
              showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
            } ${
              likesRemaining === 0
                ? "bg-red-300"
                : overlayIcon === MatchLike
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
          >
            <img
              src={likesRemaining === 0 ? CupidWhite : overlayIcon}
              alt="Action Icon"
              className="w-1/2 aspect-square object-contain animate-pulse invert brightness-0 draggable={false} pointer-events-none"
            />
            {likesRemaining === 0 && (
              <span className="font-bold text-center text-4xl absolute bottom-[25%] text-white">
                {timeUntilReset}
              </span>
            )}
          </div>
          <div className="flex flex-col w-full h-full">
            {/* Main Image Section */}
            <div className="w-full aspect-[101/150] overflow-hidden flex items-center justify-center relative shadow-sm shadow-black/50 corner-round rounded-lg select-none pointer-events-none">
              <img
                src={data?.mainImage || "/placeholder.svg"}
                alt="Main profile blurred background"
                className="absolute inset-0 w-full h-full object-cover object-center filter blur-2xl scale-110 z-0 opacity-50 select-none pointer-events-none"
                aria-hidden="true"
                draggable={false}
              />
              <div className="absolute inset-0 flex items-center justify-center z-10 select-none pointer-events-none">
                <img
                  src={data?.mainImage || "/placeholder.svg"}
                  alt="Main profile"
                  className="w-full rounded-lg object-contain shadow-lg shadow-black/20 select-none pointer-events-none"
                  draggable={false}
                />
              </div>
            </div>

            {/* Info Frame */}
            <MatchInfo data={data} />

            {/* Two Image Frames */}
            <div className="w-full flex flex-col select-none px-4 pb-24">
              <div className="w-full aspect-square overflow-hidden rounded-lg shadow-sm shadow-black/50 select-none">
                <img
                  src={data?.secondaryImages?.[0] || "/placeholder.svg"}
                  alt="Secondary image 1"
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
              </div>
              <div className="w-full aspect-square overflow-hidden rounded-lg mt-[10px] shadow-sm shadow-black/50 select-none">
                <img
                  src={data?.secondaryImages?.[1] || "/placeholder.svg"}
                  alt="Secondary image 2"
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons - Fixed at bottom */}
        <MatchActionButtons
          handleLike={handleLike}
          handleDislike={handleDislike}
          isAnimating={isAnimating}
          isAtTop={isAtTop}
        />
      </Card>
    </div>
  );
};

export default MatchCard;
