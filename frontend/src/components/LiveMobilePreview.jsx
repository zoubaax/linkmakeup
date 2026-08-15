import ProfilePageView from './profile/ProfilePageView';

export default function LiveMobilePreview({ profile, links = [] }) {
  return (
    <div className="relative mx-auto select-none">
      {/* Sleek Matte Dark Graphite / Deep Slate Phone Frame */}
      <div className="relative w-[290px] sm:w-[310px] h-[580px] sm:h-[610px] bg-gradient-to-b from-slate-800 via-zinc-900 to-slate-950 rounded-[40px] p-2.5 border border-slate-700/60 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.4)] flex flex-col transition-all duration-300">
        
        {/* Soft Notch Pill */}
        <div className="shrink-0 w-full pt-1.5 pb-1 flex justify-center items-center z-20">
          <div className="w-16 h-3.5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-end px-1.5 shadow-2xs">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          </div>
        </div>

        {/* Display Screen */}
        <div className="flex-1 w-full rounded-[30px] overflow-y-auto scrollbar-none border border-slate-900 bg-white dark:bg-zinc-950 shadow-inner">
          <ProfilePageView
            profile={profile}
            links={links}
            theme={profile?.themeConfig}
            compact
          />
        </div>

        {/* Soft Bottom Home Indicator Bar */}
        <div className="shrink-0 w-full py-1.5 flex justify-center items-center z-20">
          <div className="w-20 h-1 rounded-full bg-slate-600/50" />
        </div>

      </div>
    </div>
  );
}
