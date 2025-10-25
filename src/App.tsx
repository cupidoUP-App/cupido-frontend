import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./features/home/Home";
import TwoSteptSigUp from "./features/auth/components/TwoSteptSigUp";
import NotFound from "./pages/NotFound";
import ResetPassword from "./features/auth/components/ResetPassword";
import SingupForm2 from "./features/auth/components/SingupForm2";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resetPassword" element={<ResetPassword/>} />
          <Route path="/TwoSteptSingUp" element={<TwoSteptSigUp/>} />
          <Route path="/SingUp2" element={<SingupForm2/>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
