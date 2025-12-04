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
//import ThemeTransitionOverlay from '@ui/ThemeTransitionOverlay';
import ScrollToTopButton from './components/ScrollToTopButton';
import { useAppStore } from '@store/appStore';
import SigUpForm from '@/features/auth/SigUpForm';
import LoginForm from '@/features/auth/LoginForm';
import Dashboard from '@/features/dashboard/Dashboard';

// Constante para detectar registro pendiente (debe coincidir con LoginForm)
const REGISTRATION_STEP_KEY = "cupido_registration_step";

const Index = () => {
  const {
    showPreloader,
    hidePreloader,
    //theme,
    //setTheme,
    //isTransitioning,
    //setIsTransitioning,
    openLogin,
    openSigUp,
    authModal,
    closeModals,
  } = useAppStore();

  //useEffect(() => {
  //  document.documentElement.setAttribute('data-theme', 'femenino');
  //}, ['femenino']);

  // =========================================================================
  // Efecto para detectar si hay un registro pendiente y abrir LoginForm
  // Lógica: Si hay paso guardado + token, el usuario estaba en medio del registro
  // =========================================================================
  useEffect(() => {
    const savedStep = localStorage.getItem(REGISTRATION_STEP_KEY);
    const accessToken = localStorage.getItem("access_token");

    if (savedStep && accessToken && authModal === null) {
      const step = parseInt(savedStep, 10);
      if (step >= 1 && step <= 3) {
        console.log("[Home] Detectado registro pendiente en paso:", step);
        openLogin(); // Abrir LoginForm que restaurará el paso correcto
      }
    }
  }, [authModal, openLogin]);
  /* 
    const handleThemeChange = (newTheme: string) => {
      if (newTheme !== theme) {
        setIsTransitioning(true);
        setTimeout(() => {
          setTheme(newTheme as 'main' | 'about');
          setTimeout(() => {
            setIsTransitioning(false);
          }, 300);
        }, 300);
      }
    }; */

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

  /*   const handleOpenDashboard = () => {
      closeModals();
      // El dashboard se abre automáticamente cuando authModal es 'dashboard'
    }; */

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {showPreloader && <Preloader onComplete={hidePreloader} />}
      {/* {isTransitioning && <ThemeTransitionOverlay theme={theme} />}
      Header onThemeChange={handleThemeChange}
      || isTransitioning ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'} */}

      <div className={showPreloader ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        <Header />
        <main>
          <HeroSection />
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