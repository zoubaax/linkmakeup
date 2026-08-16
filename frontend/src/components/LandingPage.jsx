import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './landing/Header';
import HeroSection from './landing/HeroSection';
import LogoTicker from './landing/LogoTicker';
import QuoteSection from './landing/QuoteSection';
import WhySection from './landing/WhySection';
import Footer from './landing/Footer';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    document.title = 'LinkMakeup — 100% Free Link in Bio Tool for Creators & Developers';

    if (!loading && user) {
      navigate(profile ? '/dashboard' : '/onboarding', { replace: true });
    }
  }, [loading, user, profile, navigate]);

  return (
    <div className="min-h-screen bg-[var(--lm-app)] text-[var(--lm-fg)] font-sans p-4 sm:p-8 flex flex-col justify-between selection:bg-emerald-600 selection:text-white transition-colors duration-300">
      {/* 1. Navbar Header */}
      <Header user={user} profile={profile} />

      {/* Main Landmark for SEO accessibility */}
      <main id="main-content" className="flex-1 flex flex-col justify-between">
        {/* 2. Floating Hero Section */}
        <HeroSection />

        {/* 3. Infinite Logo Ticker (Platform Ecosystem Marquee) */}
        <LogoTicker />

        {/* 4. Brand Manifesto Section (GSAP ScrollReveal) */}
        <QuoteSection />

        {/* 5. Why LinkMakeup Section (Glassy Stacking Cards) */}
        <WhySection />
      </main>

      {/* 6. Trust Bar & Footer */}
      <Footer />
    </div>
  );
}
