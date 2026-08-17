import { useNavigate } from 'react-router-dom';
import { ScrollAndClickNfc3DFlip } from './strategy/StrategyPageLayout';

export default function NfcSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-7xl mx-auto rounded-[28px] sm:rounded-[40px] border border-emerald-100/80 dark:border-emerald-900/40 bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-emerald-950/20 p-5 sm:p-10 lg:p-12 shadow-xl shadow-emerald-950/5 my-8">
      <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left Column: Text & CTA */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
          <span className="text-[10px] font-semibold tracking-wider text-emerald-800 dark:text-emerald-300 uppercase bg-emerald-100/80 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/40">
            PHYSICAL + DIGITAL SYNERGY
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-slate-900 dark:text-white leading-tight">
            Tap & Connect at Tech Conferences
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
            Ditch paper business cards. Tap your matte black NFC smart card on any smartphone at tech meetups, conferences, or hackathons to instantly open your GitHub, LinkedIn, and bio link.
          </p>
          <div>
            <button
              type="button"
              onClick={() => navigate('/signup?type=nfc')}
              className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs sm:text-sm shadow-md hover:opacity-90 transition-all cursor-pointer"
            >
              <span>Order Custom Matte NFC Card</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive 3D Scroll & Click Flip Card */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <ScrollAndClickNfc3DFlip />
        </div>
      </div>
    </section>
  );
}
