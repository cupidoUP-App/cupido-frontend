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
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    {children}
                </TooltipProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
};
