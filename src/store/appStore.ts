import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthModalState = 'closed' | 'login' | 'signup' | 'recovery' | 'two-step' | 'recaptcha';
type Theme = 'femenino' | 'masculino';

interface AppState {
  authModal: AuthModalState;
  openLogin: () => void;
  openRecovery: () => void;
  openTwoStep: () => void;
  openSignup: () => void;
  openRecaptcha: () => void;
  closeModals: () => void;

  // Form data for ReCAPTCHA verification
  pendingFormData: any;
  setPendingFormData: (data: any) => void;
  pendingLoginData: any;
  setPendingLoginData: (data: any) => void;

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
      openRecovery: () => set({ authModal: 'recovery' }),
      openTwoStep: () => set({ authModal: 'two-step' }),
      openRecaptcha: () => set({ authModal: 'recaptcha' }),
      closeModals: () => set({ authModal: 'closed' }),

      // Form data for ReCAPTCHA verification
      pendingFormData: null,
      setPendingFormData: (data) => set({ pendingFormData: data }),
      pendingLoginData: null,
      setPendingLoginData: (data) => set({ pendingLoginData: data }),

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
