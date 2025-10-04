import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Preloader from '@/components/Preloader';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import SafetySection from '@/components/SafetySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import CTAFinalSection from '@/components/CTAFinalSection';
import Footer from '@/components/Footer';
import AuthModals from '@/components/AuthModals';

const Index = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'femenino');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      <div className={showPreloader ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        <Header
          onLoginClick={openLogin}
          onSignupClick={openSignup}
          theme={theme}
          onThemeChange={setTheme}
        />
        <main>
          <HeroSection
            onLoginClick={openLogin}
            onSignupClick={openSignup}
            theme={theme}
          />
          <FeaturesSection />
          <HowItWorksSection />
          <SafetySection />
          <TestimonialsSection />
          <FAQSection />
          <CTAFinalSection onSignupClick={openSignup} />
        </main>
        <Footer />
      </div>
      <AuthModals
        showLogin={showLogin}
        showSignup={showSignup}
        onClose={closeModals}
      />
    </div>
  );
};

export default Index;
