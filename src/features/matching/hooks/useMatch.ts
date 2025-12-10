import { useState, useEffect, useRef } from "react";
import MatchDislike from "@assets/MatchDislike.png";
import MatchLike from "@assets/MatchLike.png";
import { MatchData } from "../types";
import { getMatches } from "../services/matchService";
import { likeAPI } from "../../../shared/lib/api"; 

export const useMatch = (initialMatchData?: MatchData, matches?: MatchData[]) => {
  const [matchList, setMatchList] = useState<MatchData[]>(matches || getMatches());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayIcon, setOverlayIcon] = useState<string>("");
  const [showOptions, setShowOptions] = useState(false);
  const [likesRemaining, setLikesRemaining] = useState(50); // Aumentado a 50
  const [timeUntilReset, setTimeUntilReset] = useState<string>("");
  const [showLimitOverlay, setShowLimitOverlay] = useState(false);
  
  // Estado para el slide de éxito de match
  const [matchSuccessData, setMatchSuccessData] = useState<{
    name: string;
    photoUrl?: string;
    id: number | string;
  } | null>(null);

  // Swipe states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [swipeRotation, setSwipeRotation] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // 🔥 NUEVO: Variables para controlar llamadas duplicadas
  const likeInProgress = useRef(false);
  const dislikeInProgress = useRef(false);

  // ⭐ Actualizar matchList cuando lleguen los datos reales (matches cambia)
  useEffect(() => {
    if (matches && matches.length > 0) {
      setMatchList(matches);
      setCurrentIndex(0); // Reiniciar al primer match
    }
  }, [matches]);

  const displayData = initialMatchData || matchList[currentIndex];
  
  // 🔍 DEBUG: Ver qué datos está mostrando
  useEffect(() => {
  }, [displayData, matchList, currentIndex]);

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

  // ✅ MODIFICADA: handleLike con protección contra múltiples llamadas
  const handleLike = async () => {
    // 🔥 NUEVO: Verificar si ya hay una operación en progreso
    if (likeInProgress.current || isAnimating || likesRemaining <= 0) {
      if (likesRemaining <= 0) {
        setShowLimitOverlay(true);
      }
      return;
    }

    likeInProgress.current = true;
    
    const currentUserId = displayData?.usuario_id;
    
    if (!currentUserId) {
      
      // Buscar en otras posibles ubicaciones
      const data = displayData as any;
      const possibleId = data?.id || data?.userId || data?.user_id;
      if (possibleId) {
      } else {
        alert("Error: No se puede identificar el perfil");
        likeInProgress.current = false; // 🔥 Liberar bloqueo
        return;
      }
    }
    
    setIsAnimating(true);
    
    // Calcular el nuevo valor de likesRemaining
    const newLikesRemaining = likesRemaining - 1;
    setLikesRemaining(newLikesRemaining);
    
    if (newLikesRemaining === 0) {
      setTimeout(() => {
        setShowLimitOverlay(true);
      }, 0);
    }
    
    setOverlayIcon(MatchLike);

    try {
      
      // Asegurar que el ID sea string
      const userIdToSend = String(currentUserId);
      const response = await likeAPI.sendLike(userIdToSend);
      
      if (response.match_found) {
        // En lugar de alert, seteamos el estado para mostrar el slide
        const resp = response as any;
        setMatchSuccessData({
            name: displayData?.info?.title || "Usuario",
            photoUrl: displayData?.mainImage,
            id: resp.chat_id || currentUserId // Usar chat_id si viene, o user_id
        });
      }
      
      
    } catch (error: any) {
      
      // Si hay error, revertir el conteo de likes
      setLikesRemaining(likesRemaining);
      
      let errorMessage = "Error al enviar el like";
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Ya has interactuado con este perfil";
      } else if (error.response?.status === 401) {
        errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
      } else if (error.response?.status === 404) {
        errorMessage = "Endpoint no encontrado. Verifica la URL.";
      } else if (error.response?.status === 500) {
        errorMessage = "Error interno del servidor. Intenta más tarde.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}`);
      setIsAnimating(false);
      likeInProgress.current = false; // 🔥 Liberar bloqueo
      return;
    }

    // Continuar con la animación normal (solo si la API fue exitosa)
    setTimeout(() => {
      setRotation(135);

      setTimeout(() => {
        // Usar newLikesRemaining en lugar de likesRemaining
        if (newLikesRemaining > 0) {
          // 🔥 CORRECCIÓN: Verificar si hay más elementos antes de incrementar
          if (currentIndex < matchList.length - 1) {
             setCurrentIndex((prev) => prev + 1);
          } else {
             // Si es el último, incrementamos para que displayData sea undefined/null
             // y la UI pueda mostrar "No hay más perfiles"
             setCurrentIndex((prev) => prev + 1);
          }
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
          if (newLikesRemaining > 0) {
            setTimeout(() => {
              setShowOverlay(false);
            }, 200);
          }
          likeInProgress.current = false; 
        }, 500);
      }, 250);
    }, 0);
  };

  const handleDislike = async () => {
    // 🔥 NUEVO: Verificar si ya hay una operación en progreso
    if (dislikeInProgress.current || isAnimating || likesRemaining <= 0) {
      if (likesRemaining <= 0) {
        setShowLimitOverlay(true);
      }
      return;
    }

    dislikeInProgress.current = true;
    
    const currentUserId = displayData?.usuario_id;
    
    if (!currentUserId) {
      
      const data = displayData as any;
      const possibleId = data?.id || data?.userId || data?.user_id;
      if (possibleId) {
      } else {
        alert("Error: No se puede identificar el perfil");
        dislikeInProgress.current = false; 
        return;
      }
    }
    
    
    setIsAnimating(true);
    
    const newLikesRemaining = likesRemaining - 1;
    setLikesRemaining(newLikesRemaining);
    
    if (newLikesRemaining === 0) {
      setTimeout(() => {
        setShowLimitOverlay(true);
      }, 0);
    }
    
    setOverlayIcon(MatchDislike);

    try {
      
      const userIdToSend = String(currentUserId);
      const response = await likeAPI.sendDislike(userIdToSend);
      
    } catch (error: any) {
      
      setLikesRemaining(likesRemaining);
      
      let errorMessage = "Error al enviar el dislike";
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Ya has interactuado con este perfil";
      } else if (error.response?.status === 500) {
        errorMessage = "Error interno del servidor. Intenta más tarde.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}`);
      setIsAnimating(false);
      dislikeInProgress.current = false; 
      return;
    }

    setTimeout(() => {
      setRotation(-135);

      setTimeout(() => {
        if (newLikesRemaining > 0) {
          // 🔥 CORRECCIÓN: Verificar si hay más elementos antes de incrementar
          if (currentIndex < matchList.length - 1) {
             setCurrentIndex((prev) => prev + 1);
          } else {
             setCurrentIndex((prev) => prev + 1);
          }
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
          if (newLikesRemaining > 0) {
            setTimeout(() => {
              setShowOverlay(false);
            }, 200);
          }
          dislikeInProgress.current = false; 
        }, 500);
      }, 250);
    }, 0);
  };

  // Swipe handler - MEJORADO con protección
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isAnimating || likesRemaining <= 0 || likeInProgress.current || dislikeInProgress.current) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || likesRemaining <= 0 || likeInProgress.current || dislikeInProgress.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const screenThreshold = typeof window !== 'undefined' ? window.innerWidth * 0.25 : 100;
    const maxHorizontalMove = Math.min(150, screenThreshold);

    const clampedDeltaX = Math.max(-maxHorizontalMove, Math.min(maxHorizontalMove, deltaX));

    const verticalMove = deltaY > 0 ? Math.min(deltaY, 20) : 0;

    setDragOffset({ x: clampedDeltaX, y: verticalMove });

    const maxRotation = 15;
    const rotationValue = (clampedDeltaX / maxHorizontalMove) * maxRotation;
    setSwipeRotation(rotationValue);

    // Mostrar overlay visual cuando se acerca al threshold (50% del máximo)
    const swipeThreshold = maxHorizontalMove * 0.5;
    if (Math.abs(clampedDeltaX) > swipeThreshold) {
      setShowOverlay(true);
      setOverlayIcon(clampedDeltaX > 0 ? MatchLike : MatchDislike);
    } else {
      setShowOverlay(false);
    }
    // NO disparamos acciones aquí - solo en handlePointerUp
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;

    setIsDragging(false);
    const deltaX = e.clientX - dragStart.x;

    const screenThreshold = typeof window !== 'undefined' ? window.innerWidth * 0.25 : 100;
    const maxHorizontalMove = Math.min(150, screenThreshold);
    // Threshold para activar acción: 50% del movimiento máximo
    const actionThreshold = maxHorizontalMove * 0.5;

    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease-out';
    }

    // Solo activar acción si se supera el threshold y no hay operaciones en progreso
    if (Math.abs(deltaX) >= actionThreshold && !likeInProgress.current && !dislikeInProgress.current && likesRemaining > 0) {
      if (deltaX > 0) {
        handleLike();
      } else {
        handleDislike();
      }
    } else {
      setShowOverlay(false);
    }

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
    handlePointerCancel,
    matchSuccessData,
    onCloseMatchSuccess: () => setMatchSuccessData(null)
  };
};