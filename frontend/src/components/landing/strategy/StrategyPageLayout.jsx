import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Header from '../Header';
import LogoTicker from '../LogoTicker';
import Footer from '../Footer';
import Iridescence from '../../ui/Iridescence';
import ScrollReveal from '../../ui/ScrollReveal';
import SeoHead from '../../ui/SeoHead';
import nfcFrontImg from '../../../assets/nfc crdas.png';
import nfcBackImg from '../../../assets/nfc crdas back.png';

export function ScrollAndClickNfc3DFlip({
  frontImg = nfcFrontImg,
  backImg = nfcBackImg,
  customMaxW = "max-w-[210px] min-[380px]:max-w-[235px] sm:max-w-[265px]"
}) {
  const [manualFlipCount, setManualFlipCount] = useState(0);
  const [scrollAngle, setScrollAngle] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      // Smoothly rotate 0 -> 180deg as user scrolls 0 -> 350px
      const progress = Math.min(Math.max(scrollY / 350, 0), 1);
      setScrollAngle(progress * 180);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const totalRotation = scrollAngle + manualFlipCount * 180;

  return (
    <div
      onClick={() => setManualFlipCount((prev) => prev + 1)}
      className={`group relative cursor-pointer mx-auto w-full ${customMaxW} [perspective:1000px] py-1 select-none`}
    >
      {/* Soft Ambient Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/25 via-teal-500/20 to-emerald-400/25 rounded-[32px] blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* 3D Card Container driven by Scroll + Click */}
      <div
        className="relative w-full transition-transform duration-300 ease-out [transform-style:preserve-3d]"
        style={{ transform: `rotateY(${totalRotation}deg)` }}
      >
        {/* Front Side */}
        <div className="relative w-full [backface-visibility:hidden]">
          <img
            src={frontImg}
            alt="NFC Card Front"
            className="w-full h-auto rounded-[20px] sm:rounded-[26px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.25)]"
          />
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <img
            src={backImg}
            alt="NFC Card Back"
            className="w-full h-auto rounded-[20px] sm:rounded-[26px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.25)]"
          />
        </div>
      </div>
    </div>
  );
}

export default function StrategyPageLayout({
  seo,
  heroBadge = null,
  heroTitle,
  heroSubtitle,
  ctaPrimaryText = 'Get started free',
  ctaSecondaryText = 'Order NFC Smart Card',
  featureEyebrow = 'WHY LINKMAKEUP FOR TECH PROS',
  featureTitle = 'The link page that works with you, not just for you',
  featureSubtitle = 'Everything software engineers, LinkedIn creators, and tech founders need in one hub.',
  features = [],
  nfcCardTitle = 'Tap & Connect at Tech Conferences',
  nfcCardDescription = 'Ditch paper business cards. Tap your matte black NFC smart card on any smartphone at tech meetups or hackathons to instantly open your GitHub, LinkedIn, and bio link.',
  faqs = [],
  demoWidget,
}) {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  // Generate FAQ JSON-LD Schema
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <div className="min-h-screen bg-[var(--lm-app)] text-[var(--lm-fg)] font-sans p-2.5 sm:p-6 lg:p-8 flex flex-col justify-between selection:bg-emerald-600 selection:text-white transition-colors duration-300 antialiased">
      <SeoHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        structuredData={faqSchema}
      />

      {/* 1. Brand Navbar Header */}
      <Header user={user} profile={profile} />

      {/* Main Content */}
      <main id="main-content" className="flex-1 flex flex-col justify-between space-y-6 sm:space-y-12">
        
        {/* 2. Floating Hero Card */}
        <section className="relative w-full max-w-7xl mx-auto rounded-[28px] sm:rounded-[40px] border border-emerald-100/80 dark:border-emerald-900/40 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-emerald-950/20 shadow-xl shadow-emerald-950/5 flex flex-col justify-between my-2 sm:my-4 py-8 sm:py-16 md:py-20">
          
          {/* Background WebGL Iridescence Canvas */}
          <div className="absolute inset-0 z-0 opacity-40">
            <Iridescence
              color={[0.02, 0.58, 0.40]} // Emerald green tone
              mouseReact={true}
              amplitude={0.15}
              speed={0.8}
            />
          </div>

          {/* Soft light overlay */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/90 via-white/75 to-emerald-50/60 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-emerald-950/60 backdrop-blur-[1px]" />

          {/* Hero Content Container */}
          <div className="relative z-10 px-4 sm:px-10 md:px-16 flex flex-col items-center justify-center my-auto w-full">
            <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center w-full max-w-6xl mx-auto">
              
              {/* Left Column (Desktop: Headline, Subtitle, Buttons) */}
              <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-6 text-center lg:text-left">
                
                {/* Green Pill Badge */}
                {heroBadge && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold tracking-tight mx-auto lg:mx-0 w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{heroBadge}</span>
                  </div>
                )}

                {/* H1 Headline */}
                <h1 className="font-serif text-[24px] min-[380px]:text-[30px] sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-slate-900 dark:text-white leading-[1.14] tracking-tight">
                  {heroTitle}
                </h1>

                {/* Subtitle */}
                <p className="text-slate-600 dark:text-slate-300 text-xs min-[380px]:text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                  {heroSubtitle}
                </p>

                {/* Desktop Action Buttons (Visible on lg:) */}
                <div className="hidden lg:flex flex-wrap items-center justify-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="group flex items-center justify-center gap-2.5 p-2 pr-5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs sm:text-sm hover:opacity-95 transition-all shadow-md hover:scale-105 active:scale-95"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <span>{ctaPrimaryText}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/signup?type=nfc')}
                    className="px-5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:border-emerald-500 transition-all shadow-xs"
                  >
                    {ctaSecondaryText}
                  </button>
                </div>

              </div>

              {/* Right Column: Demo Card Widget (Appears between Subtitle & Buttons on Mobile) */}
              <div className="lg:col-span-5 flex justify-center w-full my-2 lg:my-0">
                {demoWidget}
              </div>

              {/* Mobile Action Buttons (Placed below NFC Card Image, Visible on < lg) */}
              <div className="lg:hidden flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="group flex items-center justify-center gap-2.5 p-2 pr-5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs sm:text-sm hover:opacity-95 transition-all shadow-md hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <span>{ctaPrimaryText}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/signup?type=nfc')}
                  className="px-5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:border-emerald-500 transition-all shadow-xs w-full sm:w-auto text-center"
                >
                  {ctaSecondaryText}
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* 3. Logo Marquee Ticker */}
        <LogoTicker />

        {/* 4. Scroll Reveal Manifesto */}
        <section className="w-full max-w-7xl mx-auto py-4 sm:py-12 px-3 sm:px-8 text-center">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 block mb-2 sm:mb-5">
            {featureEyebrow}
          </span>
          <ScrollReveal
            baseOpacity={0.12}
            enableBlur={true}
            baseRotation={1.5}
            blurStrength={4}
            wordAnimationEnd="bottom 30%"
            rotationEnd="bottom 35%"
            containerClassName="text-slate-900 dark:text-white my-2"
            textClassName="font-serif text-slate-900 dark:text-white font-normal leading-[1.45] sm:leading-[1.28] text-[17px] min-[380px]:text-[19px] sm:text-3xl md:text-4xl lg:text-[42px] tracking-normal sm:tracking-tight max-w-6xl sm:max-w-7xl mx-auto text-center [text-wrap:balance]"
          >
            {featureSubtitle}
          </ScrollReveal>
        </section>

        {/* 5. Features Grid */}
        <section id="features" className="w-full max-w-7xl mx-auto py-6 sm:py-16 px-3 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-normal text-slate-900 dark:text-white leading-[1.12]">
              {featureTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-white/95 via-emerald-50/20 to-white/90 dark:from-zinc-900/95 dark:via-emerald-950/20 dark:to-zinc-900/90 border border-emerald-100/80 dark:border-zinc-800 shadow-lg shadow-emerald-950/5 hover:border-emerald-500/50 transition-all duration-300 space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold">
                  {feat.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. NFC Tap Banner */}
        <section className="w-full max-w-7xl mx-auto rounded-[28px] sm:rounded-[40px] border border-emerald-100/80 dark:border-emerald-900/40 bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-emerald-950/20 p-5 sm:p-10 lg:p-12 shadow-xl shadow-emerald-950/5 my-6 sm:my-8">
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
              <span className="text-[10px] font-semibold tracking-wider text-emerald-800 dark:text-emerald-300 uppercase bg-emerald-100/80 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/40">
                PHYSICAL + DIGITAL SYNERGY
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-slate-900 dark:text-white">
                {nfcCardTitle}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
                {nfcCardDescription}
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => navigate('/signup?type=nfc')}
                  className="group inline-flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 font-semibold text-xs sm:text-sm"
                >
                  <span>Order Custom Matte NFC Card</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center w-full">
              <ScrollAndClickNfc3DFlip />
            </div>
          </div>
        </section>

        {/* 7. FAQ Section */}
        {faqs.length > 0 && (
          <section className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-3 sm:px-6">
            <div className="text-center mb-6 sm:mb-10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                FAQ
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-emerald-100/80 dark:border-zinc-800 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-5 py-3.5 text-left flex items-center justify-between font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 text-xs sm:text-sm"
                  >
                    <span>{faq.question}</span>
                    <span className="text-emerald-600 text-base sm:text-lg font-bold ml-3 shrink-0">
                      {openFaq === idx ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-4 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-zinc-800/80 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* 8. Trust Bar & Footer */}
      <Footer />
    </div>
  );
}
