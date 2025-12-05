import { useState, useEffect, useRef } from "react";
import MatchDislike from "@assets/MatchDislike.png";
import MatchLike from "@assets/MatchLike.png";
import { MatchData } from "../types";
import { getMatches } from "../services/matchService";

export const useMatch = (initialMatchData?: MatchData) => {
  const [matchList] = useState<MatchData[]>(getMatches());
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * matchList.length)
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

  const displayData = initialMatchData || matchList[currentIndex];

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
          setCurrentIndex((prev) => (prev + 1) % matchList.length);
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
          setCurrentIndex((prev) => (prev + 1) % matchList.length);
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

    // Dynamic threshold based on screen width
    // Use 25% of screen width or 100px, whichever is smaller
    const screenThreshold = typeof window !== 'undefined' ? window.innerWidth * 0.25 : 100;
    const maxHorizontalMove = Math.min(100, screenThreshold);

    const clampedDeltaX = Math.max(-maxHorizontalMove, Math.min(maxHorizontalMove, deltaX));

    // No permitir movimiento vertical hacia arriba, solo hacia abajo con límite
    const verticalMove = deltaY > 0 ? Math.min(deltaY, 20) : 0;

    setDragOffset({ x: clampedDeltaX, y: verticalMove });

    // Calculate rotation based on horizontal drag
    const maxRotation = 15;
    const rotationValue = (clampedDeltaX / maxHorizontalMove) * maxRotation;
    setSwipeRotation(rotationValue);

    // Show preview overlay
    if (Math.abs(clampedDeltaX) > (maxHorizontalMove * 0.5)) {
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
    const screenThreshold = typeof window !== 'undefined' ? window.innerWidth * 0.25 : 100;
    const threshold = Math.min(100, screenThreshold);

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

  return {
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
    handlePointerCancel
  };
};
