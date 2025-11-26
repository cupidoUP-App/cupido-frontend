import React, { useEffect } from "react";
import { Toaster } from "@ui/toaster";
import { Toaster as Sonner } from "@ui/sonner";
import { TooltipProvider } from "@ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useAppStore } from "@store/appStore";
import { authAPI } from "@/shared/lib/api";

const queryClient = new QueryClient();

interface AppProviderProps {
    children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const { isAuthenticated, login, logout, setLoading } = useAppStore();

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("access_token");

            // Solo intentar restaurar si hay token Y el estado dice que está autenticado
            if (token && isAuthenticated) {
                setLoading(true);
                try {
                    // Validar token y obtener datos actualizados del usuario
                    const userData = await authAPI.getUserProfile();
                    login(userData);
                } catch (error) {
                    // Token inválido o expirado, hacer logout limpio
                    console.error("Session restoration failed:", error);
                    logout();
                } finally {
                    setLoading(false);
                }
            } else if (!token && isAuthenticated) {
                // Estado inconsistente: dice autenticado pero no hay token
                logout();
            }
        };

        initializeAuth();
    }, []); // Solo ejecutar una vez al montar

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>{children}</BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};
