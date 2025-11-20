import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthModalState = 'closed' | 'openSigUp' | 'openLogin' | 'dashboard';
type Theme = 'femenino' | 'masculino';

interface User {
  usuario_id: number;
  email: string;
  nombres?: string;
  apellidos?: string;
  estadocuenta: string;
  // otros campos del usuario
}

interface AppState {
  authModal: AuthModalState;
  openSigUp: () => void;
  openLogin: () => void;
  openDashboard: () => void;
  closeModals: () => void;

  // Authentication State
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;

  theme: Theme;
  setTheme: (newTheme: Theme) => void;
  isTransitioning: boolean;
  setIsTransitioning: (isTransitioning: boolean) => void;

  showPreloader: boolean;
  hidePreloader: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth Modal State
      authModal: 'closed',
      openSigUp: () => set({ authModal: 'openSigUp' }),
      closeModals: () => set({ authModal: 'closed' }),
      openLogin: () => set({ authModal: 'openLogin' }),
      openDashboard: () => set({ authModal: 'dashboard' }),

      // Authentication State
      isAuthenticated: false,
      user: null,
      isLoading: false,
      login: (userData: User) => set({
        isAuthenticated: true,
        user: userData,
        authModal: 'dashboard',
        isLoading: false
      }),
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({
          isAuthenticated: false,
          user: null,
          authModal: 'closed',
          isLoading: false
        });
      },
      setLoading: (loading: boolean) => set({ isLoading: loading }),

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
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        isAuthenticated: state.isAuthenticated,
        user: state.user
      }),
    }
  )
);
