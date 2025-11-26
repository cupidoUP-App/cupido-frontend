import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Dialog, DialogContent, DialogClose } from "@/shared/components/ui/dialog";
import MatchPlaceholder1 from "@/assets/MatchPlaceholder1.jpeg";
import MatchPlaceholder2 from "@/assets/MatchPlaceholder2.webp";
import MatchPlaceholder3 from "@/assets/MatchPlaceholder3.jpg";
import MatchDislike from "@/assets/MatchDislike.png";
import MatchLike from "@/assets/MatchLike.png";
import OptionDots from "@/assets/OptionDots.png";
import MatchBG from "@/assets/background_verification.webp";
import CupidWhite from "@/assets/cupid-white.png";

interface MatchData {
  mainImage?: string;
  info?: {
    title?: string;
    description?: string;
    [key: string]: any;
  };
  secondaryImages?: [string?, string?];
}

interface MatchPageProps {
  matchData?: MatchData;
}

const mockMatchDataList: MatchData[] = [
  {
    mainImage: MatchPlaceholder1,
    info: {
      title: "Marisol Pérez",
      description: "sit amet consectetur adipisicing elitQuisquam, quos lorem ipsum dolor sit amet que? qué? quisquam, quos",
      edad: 28,
      ubicación: "Bogotá, Colombia",
      intereses: "Viajes"
    },
    secondaryImages: [MatchPlaceholder2, MatchPlaceholder3]
  },
  {
    mainImage: MatchPlaceholder2,
    info: {
      title: "Ana Maria",
      description: "consectetur adipisicing elit. Quisquam, quos. lorem ipsum dolor sit amet que? lorem ipsum dolor sit amet consectetur adipisicing elit",
      edad: 25,
      ubicación: "Medellín, Colombia",
      intereses: "Otorrinolaringologia, Arte, Lectura, Cine"
    },
    secondaryImages: [MatchPlaceholder3, MatchPlaceholder1]
  },
  {
    mainImage: MatchPlaceholder3,
    info: {
      title: "Jimena Gomez",
      description: "consectetur adipisicing elit Quisquam, quos lorem ipsum dolor sit amet que?",
      edad: 30,
      ubicación: "Cali, Colombia",
      intereses: "Gastronomía, Fotografía, Naturaleza, Deportes, Música"
    },
    secondaryImages: [MatchPlaceholder1, MatchPlaceholder2]
  }
];

const MatchPage: React.FC<MatchPageProps> = ({ matchData }) => {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * mockMatchDataList.length)
  );
  const [isAtTop, setIsAtTop] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayIcon, setOverlayIcon] = useState<string>("");
  const [showOptions, setShowOptions] = useState(false);
  const [likesRemaining, setLikesRemaining] = useState(10);
  const [timeUntilReset, setTimeUntilReset] = useState<string>("");
  const [showLimitOverlay, setShowLimitOverlay] = useState(false);

  // Swipe states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [swipeRotation, setSwipeRotation] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const displayData = matchData || mockMatchDataList[currentIndex];

  // Calculate time until midnight reset
  useEffect(() => {
    const calculateTimeUntilMidnight = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeUntilReset(`${hours} h ${minutes} m`);
    };

    calculateTimeUntilMidnight();
    const interval = setInterval(calculateTimeUntilMidnight, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const viewport = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) {
        setIsAtTop(viewport.scrollTop === 0);
      }
    };

    const timeoutId = setTimeout(() => {
      const viewport = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) {
        viewport.addEventListener('scroll', handleScroll);
        setIsAtTop(viewport.scrollTop === 0);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const viewport = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) {
        viewport.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleLike = () => {
    if (isAnimating || likesRemaining <= 0) {
      setShowLimitOverlay(true);
      return;
    }
    setIsAnimating(true);
    setLikesRemaining(prev => {
      const newValue = prev - 1;
      if (newValue === 0) {
        setTimeout(() => {
          setShowLimitOverlay(true);
        }, 0);
      }
      return newValue;
    });
    setOverlayIcon(MatchLike);

    setTimeout(() => {
      setRotation(135);

      setTimeout(() => {
        if (likesRemaining > 1) {
          setCurrentIndex((prev) => (prev + 1) % mockMatchDataList.length);
        }
        setRotation(-20);
        setShowOverlay(true);
        const viewport = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
        if (viewport) {
          viewport.scrollTop = 0;
        }

        setTimeout(() => {
          setRotation(0);
          setIsAnimating(false);
          if (likesRemaining > 1) {
            setTimeout(() => {
              setShowOverlay(false);
            }, 200);
          }
        }, 500);
      }, 250);
    }, 0);
  };

  const handleDislike = () => {
    if (isAnimating || likesRemaining <= 0) {
      setShowLimitOverlay(true);
      return;
    }
    setIsAnimating(true);
    setLikesRemaining(prev => {
      const newValue = prev - 1;
      if (newValue === 0) {
        setTimeout(() => {
          setShowLimitOverlay(true);
        }, 0);
      }
      return newValue;
    });
    setOverlayIcon(MatchDislike);

    setTimeout(() => {
      setRotation(-135);

      setTimeout(() => {
        if (likesRemaining > 1) {
          setCurrentIndex((prev) => (prev + 1) % mockMatchDataList.length);
        }
        setRotation(20);
        setShowOverlay(true);
        const viewport = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
        if (viewport) {
          viewport.scrollTop = 0;
        }

        setTimeout(() => {
          setRotation(0);
          setIsAnimating(false);
          if (likesRemaining > 1) {
            setTimeout(() => {
              setShowOverlay(false);
            }, 200);
          }
        }, 500);
      }, 250);
    }, 0);
  };

  // Swipe handler
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isAnimating || likesRemaining <= 0) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || likesRemaining <= 0) return;

    let deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Limitar movimiento horizontal a máximo 100px en cada dirección
    const maxHorizontalMove = 100;
    const clampedDeltaX = Math.max(-maxHorizontalMove, Math.min(maxHorizontalMove, deltaX));
    
    // No permitir movimiento vertical hacia arriba, solo hacia abajo con límite
    const verticalMove = deltaY > 0 ? Math.min(deltaY, 20) : 0;
    
    setDragOffset({ x: clampedDeltaX, y: verticalMove });
    
    // Calculate rotation based on horizontal drag
    const maxRotation = 15;
    const rotationValue = (clampedDeltaX / 100) * maxRotation;
    setSwipeRotation(rotationValue);

    // Show preview overlay
    if (Math.abs(clampedDeltaX) > 50) {
      setShowOverlay(true);
      setOverlayIcon(clampedDeltaX > 0 ? MatchLike : MatchDislike);
    } else {
      setShowOverlay(false);
    }

    // Auto-trigger action when reaching the limit
    if (Math.abs(deltaX) >= maxHorizontalMove) {
      // Trigger the action immediately
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      setSwipeRotation(0);
      
      if (deltaX > 0) {
        handleLike();
      } else {
        handleDislike();
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;

    setIsDragging(false);
    const deltaX = e.clientX - dragStart.x;
    
    // Threshold for swipe action (won't be reached due to auto-trigger, but kept for safety)
    const threshold = 100;

    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease-out';
    }

    if (Math.abs(deltaX) >= threshold) {
      // Swipe detected
      if (deltaX > 0) {
        // Swipe right - Like
        handleLike();
      } else {
        // Swipe left - Dislike
        handleDislike();
      }
    } else {
      // Reset to original position
      setShowOverlay(false);
    }

    // Reset drag states
    setDragOffset({ x: 0, y: 0 });
    setSwipeRotation(0);
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setSwipeRotation(0);
    setShowOverlay(false);
    
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease-out';
    }
  };

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 relative"
      style={{
        backgroundImage: `url(${MatchBG})`,
        backgroundSize: '100% auto',
        backgroundPosition: 'left bottom',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Likes Limit Overlay */}
      {showLimitOverlay && (
        <Dialog open={showLimitOverlay} onOpenChange={setShowLimitOverlay}>
          <DialogContent className="fixed top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-lg p-6 w-[350px] text-center">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-xl font-semibold">¡Wow! Ya diste todos tus "Me Gusta" de hoy.</h2>
              <p className="text-gray-600">
                Vuelve a intentarlo en <span className="font-bold">{timeUntilReset}</span> y sigue conectando con nuevas personas. 💫
              </p>
              <DialogClose className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors">
                Entendido
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={showOptions} onOpenChange={setShowOptions}>
        <DialogContent className="bg-white rounded-lg p-0 w-[300px] overflow-hidden ">
          <div className="flex flex-col w-full pt-8">
            <button
              onClick={() => {
                setShowOptions(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-red-50 transition-all hover:scale-105 hover:font-medium"
            >
              Bloquear
            </button>
            <div className="flex justify-center w-full">
              <div className="w-[95%] h-[1px] bg-black/20"></div>
            </div>
            <button
              onClick={() => {
                setShowOptions(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-red-50 transition-all hover:scale-105 hover:font-medium"
            >
              Bloquear y reportar
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <div style={{ perspective: '1500px' }}>
        <Card
          ref={cardRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className="h-[85vh] w-[calc(85vh*101/150)] bg-white rounded-lg aspect-[101/150] overflow-hidden flex flex-col relative shadow-lg shadow-black/20 touch-none select-none"
          style={{
            transform: `rotateY(${rotation}deg) translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotateZ(${swipeRotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
            transformStyle: 'preserve-3d',
            cursor: likesRemaining <= 0 ? 'not-allowed' : (isDragging ? 'grabbing' : 'grab')
          }}
        >
          {/* Name/age bar - Static overlay */}
          <div className={`absolute top-0 left-0 w-full px-4 py-3 flex flex-col gap-2 z-20 pointer-events-none transition-colors duration-300 ${isAtTop
            ? 'bg-gradient-to-b from-black/50 via-black/20 to-transparent shadow-transparent'
            : 'bg-white shadow-lg'
            }`}>
            <div className="flex items-center justify-between pointer-events-auto">
              <div className={`text-[30px] font-['Poppins'] transition-colors duration-300 ${isAtTop ? 'text-white' : 'text-black'
                }`}>
                {displayData?.info?.title || "Nombre"}
                {displayData?.info?.edad && `, ${displayData.info.edad}`}
              </div>
              <button
                onClick={() => setShowOptions(true)}
                className={`bg-transparent border-0 p-2 transition-opacity cursor-pointer hover:opacity-70 hover:scale-110 ${isAtTop ? "invert" : ""
                  }`}
              >
                <img
                  src={OptionDots}
                  alt="Options menu icon (three vertical dots)"
                  className={`w-6 h-6  ${isAtTop ? "invert" : ""}`}
                  style={isAtTop ? { filter: "invert(1)" } : { filter: "invert(0)" }}
                />
              </button>
            </div>
            <div className="inline-block px-1 py-1 bg-white rounded-full shadow-md shadow-black/80 pointer-events-auto w-fit min-w-[60px]">
              <div className="flex items-center justify-center">
                <span className="text-[15px] text-black font-['Poppins'] text-center whitespace-nowrap">
                  {displayData?.info?.intereses?.split(",")[0]?.trim() || "Preferencia"}
                </span>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 w-full [&>div[data-orientation='vertical']]:hidden relative">
            {/* Overlay */}
            <div
              className={`absolute inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-200 ${showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'
                } ${likesRemaining === 0 ? 'bg-red-300' : overlayIcon === MatchLike ? 'bg-red-500' : 'bg-blue-500'}`}
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
                  src={displayData?.mainImage || "/placeholder.svg"}
                  alt="Main profile blurred background"
                  className="absolute inset-0 w-full h-full object-cover object-center filter blur-2xl scale-110 z-0 opacity-50 select-none pointer-events-none"
                  aria-hidden="true"
                  draggable={false}
                />
                <div className="absolute inset-0 flex items-center justify-center z-10 select-none pointer-events-none">
                  <img
                    src={displayData?.mainImage || "/placeholder.svg"}
                    alt="Main profile"
                    className="w-full rounded-lg object-contain shadow-lg shadow-black/20 select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Info Frame */}
              <div className="w-full p-4 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-base font-poppins text-black">Acerca de mi</h3>
                  <div className="w-full min-h-[150px] p-4 bg-white border border-gray-200 flex items-center justify-center">
                    <p className="text-sm text-gray-500 text-center w-full">
                      {displayData?.info?.description || "Descripcion"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-poppins text-black">Ubicacion</h3>
                  <div className="flex justify-center">
                    <span className="text-lg font-poppins text-black text-center font-bold">
                      {displayData?.info?.ubicación || "Ubicacion"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-poppins text-black">Preferencias</h3>
                  <div className="flex flex-wrap gap-2 justify-center items-center">
                    {displayData?.info?.intereses ? (
                      displayData.info.intereses.split(", ").map((interes: string, index: number) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-black shadow-md shadow-black/50 w-fit min-w-[50px]"
                        >
                          {interes.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="inline-block px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-black w-fit min-w-[50px]">
                        Preferencia 1
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Two Image Frames */}
              <div className="w-full flex flex-col select-none">
                <div className="w-full aspect-square overflow-hidden rounded-lg shadow-sm shadow-black/50 select-none">
                  <img
                    src={displayData?.secondaryImages?.[0] || "/placeholder.svg"}
                    alt="Secondary image 1"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
                <div className="w-full aspect-square overflow-hidden rounded-lg mt-[10px] shadow-sm shadow-black/50 select-none">
                  <img
                    src={displayData?.secondaryImages?.[1] || "/placeholder.svg"}
                    alt="Secondary image 2"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Action Buttons - Fixed at bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-20 flex pointer-events-none">
            <button
              onClick={handleDislike}
              disabled={isAnimating}
              style={{
                left: isAtTop ? '30%' : '10%',
                bottom: isAtTop ? '30px' : '10px',
                transform: 'translateX(-50%)'
              }}
              className={`absolute pointer-events-auto ${isAtTop ? 'w-20 h-20' : 'w-10 h-10'} rounded-full bg-white shadow-lg shadow-black/30 flex items-center justify-center ${isAtTop ? 'hover:scale-110' : 'hover:scale-150'} transition-all duration-300 hover:bg-blue-500 group disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <img
                src={MatchDislike}
                alt="Dislike"
                className={`${isAtTop ? 'w-10 h-10' : 'w-8 h-8'} transition-all duration-300 group-hover:invert group-hover:brightness-200`}
              />
            </button>
            <button
              onClick={handleLike}
              disabled={isAnimating}
              style={{
                left: isAtTop ? '70%' : '90%',
                bottom: isAtTop ? '30px' : '10px',
                transform: 'translateX(-50%)'
              }}
              className={`absolute pointer-events-auto ${isAtTop ? 'w-20 h-20' : 'w-10 h-10'} rounded-full bg-white shadow-lg shadow-black/30 flex items-center justify-center ${isAtTop ? 'hover:scale-110' : 'hover:scale-150'} transition-all duration-300 hover:bg-red-500 group disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <img
                src={MatchLike}
                alt="Like"
                className={`${isAtTop ? 'w-10 h-10' : 'w-8 h-8'} transition-all duration-300 group-hover:invert group-hover:brightness-200`}
              />
            </button>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default MatchPage;