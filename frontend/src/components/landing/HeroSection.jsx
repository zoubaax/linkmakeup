import { useNavigate } from 'react-router-dom';
import Iridescence from '../ui/Iridescence';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-7xl mx-auto rounded-[32px] sm:rounded-[44px] border border-emerald-100/80 dark:border-emerald-900/40 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/30 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-emerald-950/20 shadow-xl shadow-emerald-950/5 flex flex-col justify-between my-2 sm:my-4 min-h-[75vh] sm:min-h-[75vh] md:min-h-[72vh]">
      
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

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-14 md:p-20 flex flex-col items-center justify-center text-center my-auto w-full">
        
        <div className="space-y-5 sm:space-y-6 w-full max-w-5xl mx-auto text-center">
          
          {/* Headline - Prominent, Bold & Balanced 2 Lines */}
          <h1 className="font-serif text-[26px] min-[380px]:text-[28px] sm:text-5xl md:text-6xl lg:text-[68px] font-normal text-slate-900 dark:text-white leading-[1.18] sm:leading-[1.08] tracking-tight max-w-5xl mx-auto px-1">
            The link page that works <em className="italic font-serif text-emerald-600">with</em> you,<br />
            not just for you
          </h1>

          {/* Subtext */}
          <p className="text-slate-600 dark:text-slate-300 text-xs min-[380px]:text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto px-2">
            LinkMakeup empowers creators and developers — claim your custom subdomain, customize themes in real-time, and manage everything from one dashboard.
          </p>

          {/* Single Centered Parley Chevron CTA Button */}
          <div className="flex items-center justify-center pt-2 sm:pt-4">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="group flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 pr-6 sm:pr-6 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white hover:bg-black font-semibold text-xs sm:text-sm transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <span>Get started free</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
