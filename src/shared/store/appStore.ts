/** Store global de la aplicación con persistencia en localStorage.

Maneja:
- Estado del modal de autenticación (login/signup/closed)
- Sesión del usuario (isAuthenticated, user, login, logout)
- Estado del preloader de carga inicial
*/

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthModalState = 'closed' | 'openSigUp' | 'openLogin';

interface User {
  usuario_id: number;
  email: string;
  nombres?: string;
  apellidos?: string;
  estadocuenta: string;
  is_superuser?: boolean;
}

interface AppState {
  authModal: AuthModalState;
  openSigUp: () => void;
  openLogin: () => void;
  closeModals: () => void;

  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;

  showPreloader: boolean;
  hidePreloader: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      authModal: 'closed',
      openSigUp: () => set({ authModal: 'openSigUp' }),
      closeModals: () => set({ authModal: 'closed' }),
      openLogin: () => set({ authModal: 'openLogin' }),

      isAuthenticated: false,
      user: null,
      isLoading: false,
      login: (userData: User) => set({ isAuthenticated: true, user: userData, isLoading: false }),
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ isAuthenticated: false, user: null, authModal: 'closed', isLoading: false });
      },
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      showPreloader: true,
      hidePreloader: () => set({ showPreloader: false }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
    }
  )
);
