import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthModalState = 'closed' | 'login' | 'signup';
type Theme = 'femenino' | 'masculino';

interface AppState {
  authModal: AuthModalState;
  openLogin: () => void;
  openSignup: () => void;
  closeModals: () => void;

  theme: Theme;
  setTheme: (newTheme: Theme) => void;
  isTransitioning: boolean;
  setIsTransitioning: (isTransitioning: boolean) => void;

  showPreloader: boolean;
  hidePreloader: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth State
      authModal: 'closed',
      openLogin: () => set({ authModal: 'login' }),
      openSignup: () => set({ authModal: 'signup' }),
      closeModals: () => set({ authModal: 'closed' }),

      // Theme State
      theme: 'femenino', // Default theme
      setTheme: (newTheme) => set({ theme: newTheme }),
      isTransitioning: false,
      setIsTransitioning: (isTransitioning) => set({ isTransitioning }),

      // Preloader State
      showPreloader: true,
      hidePreloader: () => set({ showPreloader: false }),
    }),
    {
      name: 'app-theme-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }), // Only persist the 'theme' part of the state
    }
  )
);
