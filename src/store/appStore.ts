import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthModalState = 'closed' | 'openSigUp' | 'openLogin' | 'dashboard';
type Theme = 'femenino' | 'masculino';

interface AppState {
  authModal: AuthModalState;
  openSigUp: () => void;
  openLogin: () => void;
  openDashboard: () => void;
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
      openSigUp: () => set({ authModal: 'openSigUp' }),
      closeModals: () => set({ authModal: 'closed' }),
      openLogin: () => set({ authModal: 'openLogin' }),
      openDashboard: () => set({ authModal: 'dashboard' }),

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
      name: 'app-theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
