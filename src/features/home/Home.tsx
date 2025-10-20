import { useEffect } from 'react';
import { Header } from '@/features/home/components/Header';
import Preloader from '@/features/home/components/Preloader';
import HeroSection from '@/features/home/components/HeroSection';
import FeaturesSection from '@/features/home/components/FeaturesSection';
import HowItWorksSection from '@/features/home/components/HowItWorksSection';
import SafetySection from '@/features/home/components/SafetySection';
import TestimonialsSection from '@/features/home/components/TestimonialsSection';
import FAQSection from '@/features/home/components/FAQSection';
import CTAFinalSection from '@/features/home/components/CTAFinalSection';
import Footer from '@/features/home/components/Footer';
import AuthModals from '@/features/auth/components/AuthModals';
import ThemeTransitionOverlay from '@/components/ui/ThemeTransitionOverlay';
import ScrollToTopButton from '@/features/home/components/ScrollToTopButton';
import { useAppStore } from '@/store/appStore';

const Index = () => {
  const {
    showPreloader,
    hidePreloader,
    theme,
    setTheme,
    isTransitioning,
    setIsTransitioning,
    openSignup,
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
        }, 300); // Duration of fade-out
      }, 300); // Duration of fade-in
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {showPreloader && <Preloader onComplete={hidePreloader} />}
      {isTransitioning && <ThemeTransitionOverlay theme={theme} />}
      <div className={showPreloader || isTransitioning ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        <Header onThemeChange={handleThemeChange} />
        <main>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <SafetySection />
          <TestimonialsSection />
          <FAQSection />
          <CTAFinalSection onSignupClick={openSignup} />
        </main>
        <Footer />
      </div>
      <AuthModals />
      <ScrollToTopButton />
    </div>
  );
};

export default Index;