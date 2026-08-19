import { useNavigate } from 'react-router-dom';
import Iridescence from '../ui/Iridescence';
import { ScrollAndClickNfc3DFlip } from './strategy/StrategyPageLayout';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-7xl mx-auto rounded-[28px] sm:rounded-[44px] border border-emerald-100/80 dark:border-emerald-900/40 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/30 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-emerald-950/20 shadow-xl shadow-emerald-950/5 flex flex-col justify-between my-2 sm:my-4 py-8 sm:py-16 md:py-20">
      
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
      <div className="relative z-10 px-2.5 sm:px-10 md:px-16 flex flex-col items-center justify-center my-auto w-full">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center w-full max-w-6xl mx-auto">
          
          {/* Left Column (Desktop: Headline, Subtitle, Buttons) */}
          <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-6 text-center lg:text-left">
            
            {/* Headline - Dual-Mode Responsive 2 Lines */}
            <h1 className="font-serif text-[22px] min-[380px]:text-[25px] sm:text-[30px] md:text-[34px] lg:text-[36px] xl:text-[42px] font-normal text-slate-900 dark:text-white leading-[1.18] tracking-tight">
              <span className="block sm:whitespace-nowrap">
                The link page that works <span className="hidden sm:inline"><em className="italic font-serif text-emerald-600">with</em> you,</span>
              </span>
              <span className="block sm:whitespace-nowrap">
                <span className="inline sm:hidden"><em className="italic font-serif text-emerald-600">with</em> you, </span>
                not just for you
              </span>
            </h1>

            {/* Mobile Small Description (< sm) */}
            <p className="block sm:hidden text-slate-600 dark:text-slate-300 text-[12px] leading-relaxed max-w-xs mx-auto font-normal">
              The ultimate free bio link & tap-to-share NFC smart card for software engineers, creators & founders.
            </p>

            {/* Desktop Full Description (≥ sm) */}
            <p className="hidden sm:block text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              LinkMakeup is the ultimate free link-in-bio platform for software engineers, LinkedIn creators, and tech founders. Claim your custom subdomain, tap-to-share physical NFC cards, and showcase your links.
            </p>

            {/* Desktop Action Buttons (Visible on lg:) */}
            <div className="hidden lg:flex flex-wrap items-center justify-start gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="group flex items-center justify-center gap-2.5 p-2 pr-5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs sm:text-sm hover:opacity-95 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <span>Get started free</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/order-nfc')}
                className="px-5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:border-emerald-500 transition-all shadow-xs cursor-pointer"
              >
                Order NFC Smart Card
              </button>
            </div>

          </div>

          {/* Right Column: 3D NFC Card Showcase */}
          <div className="lg:col-span-5 flex justify-center w-full my-2 lg:my-0">
            <ScrollAndClickNfc3DFlip />
          </div>

          {/* Mobile Action Buttons (Placed below NFC Card Image, Visible on < lg) */}
          <div className="lg:hidden flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-2">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="group flex items-center justify-center gap-2.5 p-2 pr-5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs sm:text-sm hover:opacity-95 transition-all shadow-md hover:scale-105 active:scale-95 w-full sm:w-auto cursor-pointer"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <span>Get started free</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/order-nfc')}
              className="px-5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:border-emerald-500 transition-all shadow-xs w-full sm:w-auto text-center cursor-pointer"
            >
              Order NFC Smart Card
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
