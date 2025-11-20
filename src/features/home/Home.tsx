// Home.tsx - VERSIÓN ORIGINAL
import { useEffect } from 'react';
import { Header } from './components/Header';
import Preloader from './components/Preloader';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import SafetySection from './components/SafetySection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import CTAFinalSection from './components/CTAFinalSection';
import Footer from './components/Footer';
import ThemeTransitionOverlay from '@ui/ThemeTransitionOverlay';
import ScrollToTopButton from './components/ScrollToTopButton';
import { useAppStore } from '@store/appStore';
import SigUpForm from '@/features/auth/SigUpForm';
import LoginForm from '@/features/auth/LoginForm';
import Dashboard from '@/features/dashboard/Dashboard';

const Index = () => {
  const {
    showPreloader,
    hidePreloader,
    theme,
    setTheme,
    isTransitioning,
    setIsTransitioning,
    openLogin,
    openSigUp,
    authModal,
    closeModals,
  } = useAppStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    if (newTheme !== theme) {
      setIsTransitioning(true);
      setTimeout(() => {
        setTheme(newTheme as 'femenino' | 'masculino');
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 300);
    }
  };
 
  const handleCloseAuthModal = () => {
    closeModals();
  };

  const handleSwitchToRegister = () => {
    closeModals();
    openSigUp();
  };

  const handleSwitchToLogin = () => {
    closeModals();
    openLogin();
  };

  const handleOpenDashboard = () => {
    closeModals();
    // El dashboard se abre automáticamente cuando authModal es 'dashboard'
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {showPreloader && <Preloader onComplete={hidePreloader} />}
      {isTransitioning && <ThemeTransitionOverlay theme={theme} />}

      <div className={showPreloader || isTransitioning ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        <Header onThemeChange={handleThemeChange} />
        <main>
          <HeroSection/>
          <FeaturesSection />
          <HowItWorksSection />
          <SafetySection />
          <TestimonialsSection />
          <FAQSection />
          <CTAFinalSection onSignupClick={openSigUp} />
        </main>
        <Footer />
      </div>

      {/* ✅ Mostrar LoginForm cuando authModal es 'openLogin' */}
      {authModal === 'openLogin' && (
        <LoginForm 
          onClose={handleCloseAuthModal} 
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}

      {/* ✅ Mostrar SigUp cuando authModal es 'openSigUp' */}
      {authModal === 'openSigUp' && (
        <SigUpForm onClose={handleCloseAuthModal} />
      )}

      {/* ✅ Mostrar Dashboard cuando authModal es 'dashboard' */}
      {authModal === 'dashboard' && (
        <Dashboard />
      )}

      <ScrollToTopButton />
    </div>
  );
};

export default Index;