import { useState } from 'react';
import Header from '@/components/Header';
import Preloader from '@/components/Preloader';
import HeroSection from '@/components/HeroSection';
import IntroNarrativa from '@/components/IntroNarrativa';
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
    <div className="min-h-screen bg-background">
      {/* Preloader */}
      {showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* Main content */}
      <div className={showPreloader ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        <Header onLoginClick={openLogin} onSignupClick={openSignup} />
        
        <main>
          <HeroSection onLoginClick={openLogin} onSignupClick={openSignup} />
          <IntroNarrativa />
          <FeaturesSection />
          <HowItWorksSection />
          <SafetySection />
          <TestimonialsSection />
          <FAQSection />
          <CTAFinalSection onSignupClick={openSignup} />
        </main>

        <Footer />
      </div>

      {/* Auth Modals */}
      <AuthModals
        showLogin={showLogin}
        showSignup={showSignup}
        onClose={closeModals}
      />
    </div>
  );
};

export default Index;
