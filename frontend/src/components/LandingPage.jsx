import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAuthenticatedHomePath } from '../utils/authRedirect';
import SEOHead from './common/SEOHead';
import Header from './landing/Header';
import HeroSection from './landing/HeroSection';
import LogoTicker from './landing/LogoTicker';
import QuoteSection from './landing/QuoteSection';
import WhySection from './landing/WhySection';
import ReactBitsPricingCards from './ui/ReactBitsPricingCards';
import FaqSection from './landing/FaqSection';
import Footer from './landing/Footer';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate(getAuthenticatedHomePath(profile), { replace: true });
    }
  }, [loading, user, profile, navigate]);

  return (
    <div className="min-h-screen bg-[var(--lm-app)] text-[var(--lm-fg)] font-sans p-3 sm:p-8 flex flex-col justify-between selection:bg-emerald-600 selection:text-white transition-colors duration-300">
      <SEOHead
        title="Link Make Up — The link page that works with you, not just for you"
        description="Link Make Up is the free link in bio and digital identity tool for creators, developers, and founders. Claim your custom subdomain, digital business card, and share your links."
        canonicalUrl="https://www.linkmakeup.com/"
        ogImage="https://www.linkmakeup.com/card-logo.png"
      />

      {/* 1. Navbar Header */}
      <Header user={user} profile={profile} />

      {/* Main Landmark for SEO accessibility */}
      <main id="main-content" className="flex-1 flex flex-col justify-between space-y-10 sm:space-y-16 py-2 sm:py-6">
        {/* 2. Floating Hero Section */}
        <HeroSection />

        {/* 3. Infinite Logo Ticker (Platform Ecosystem Marquee) */}
        <LogoTicker />

        {/* 4. Brand Manifesto Section (GSAP ScrollReveal) */}
        <QuoteSection />

        {/* 5. Why LinkMakeup Section (Glassy Stacking Cards) */}
        <WhySection />

        {/* 6. Transparent Pricing Section */}
        <section id="pricing" className="py-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              TRANSPARENT PRICING
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-slate-900 dark:text-white leading-tight">
              One link for everything you build. Zero hidden fees.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Get started for free or upgrade to a custom matte black NFC card with lifetime access.
            </p>
          </div>

          <ReactBitsPricingCards
            onSelectPlan={(planType) => {
              if (planType === 'nfc') {
                navigate('/order-nfc');
              } else {
                navigate('/signup');
              }
            }}
          />
        </section>

        {/* 7. FAQ Section */}
        <section id="faq">
          <FaqSection />
        </section>
      </main>

      {/* 8. Trust Bar & Footer */}
      <Footer />
    </div>
  );
}
