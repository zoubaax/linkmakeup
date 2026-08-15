import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './landing/Header';
import HeroSection from './landing/HeroSection';
import WhySection from './landing/WhySection';
import FeaturesSection from './landing/FeaturesSection';
import PresetsSection from './landing/PresetsSection';
import Footer from './landing/Footer';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate(profile ? '/dashboard' : '/onboarding', { replace: true });
    }
  }, [loading, user, profile, navigate]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-4 sm:p-8 flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* 1. Navbar Header */}
      <Header user={user} profile={profile} />

      {/* 2. Floating Hero Section */}
      <HeroSection />

      {/* 3. Why LinkMakeup Section (Parley-style 4 Cards) */}
      <WhySection />

      {/* 4. High Performance Server & Architecture Section */}
      <FeaturesSection />

      {/* 5. Interactive Theme Studio Section */}
      <PresetsSection />

      {/* 6. Trust Bar & Footer */}
      <Footer />
    </div>
  );
}
