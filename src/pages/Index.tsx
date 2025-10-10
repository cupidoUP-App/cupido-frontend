import { useEffect } from 'react';
import Header from '@/components/Header';
import Preloader from '@/components/Preloader';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import BentoSection from '@/components/BentoSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import SafetySection from '@/components/SafetySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import CTAFinalSection from '@/components/CTAFinalSection';
import Footer from '@/components/Footer';
import AuthModals from '@/components/AuthModals';
import ThemeTransitionOverlay from '@/components/ui/ThemeTransitionOverlay';
import ScrollToTop from '@/components/ScrollToTop';
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
          <BentoSection />
          <HowItWorksSection />
          <SafetySection />
          <TestimonialsSection />
          <FAQSection />
          <CTAFinalSection onSignupClick={openSignup} />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
      <AuthModals />
    </div>
  );
};

export default Index;