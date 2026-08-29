import { useNavigate } from 'react-router-dom';
import Iridescence from '../ui/Iridescence';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-7xl mx-auto rounded-[28px] sm:rounded-[40px] md:rounded-[48px] border border-emerald-100/80 dark:border-emerald-900/40 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/30 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-emerald-950/20 shadow-xl shadow-emerald-950/5 flex flex-col justify-center my-1 sm:my-4 min-h-[68vh] sm:min-h-[540px] py-14 sm:py-20 md:py-28">
      
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

      {/* Hero Content Container (Centered & Full) */}
      <div className="relative z-10 px-4 sm:px-10 md:px-16 flex flex-col items-center justify-center my-auto w-full text-center">
        <div className="flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-7 max-w-4xl mx-auto">
          
          {/* Headline - Dual-Line Responsive Typography */}
          <h1 className="font-serif text-[18px] min-[360px]:text-[20px] min-[390px]:text-[22px] min-[420px]:text-[24px] sm:text-[36px] md:text-[46px] lg:text-[54px] font-normal text-slate-900 dark:text-white leading-[1.25] sm:leading-[1.15] tracking-tight max-w-3xl px-1">
            <span className="block">
              The link page that works <em className="italic font-serif text-emerald-600">with</em> you,
            </span>
            <span className="block">
              not just for you
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base md:text-lg leading-relaxed max-w-lg mx-auto font-normal px-2 sm:px-0">
            Link Make Up is the free link in bio and digital identity tool for creators, developers, and founders.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 sm:pt-4 w-full max-w-xs sm:max-w-none">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="group flex items-center justify-center gap-3 p-2 pr-6 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-sm hover:opacity-95 transition-all shadow-md hover:scale-105 active:scale-95 w-full sm:w-auto cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <span>Get started free</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/pricing')}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:border-emerald-500 transition-all shadow-xs w-full sm:w-auto text-center cursor-pointer"
            >
              Explore Features & Pricing
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-7 gap-y-2 pt-3 sm:pt-5 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> Free Forever
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> Custom Subdomain
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> No Credit Card Required
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
