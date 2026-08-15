import ProfilePageView from './profile/ProfilePageView';

export default function LiveMobilePreview({ profile, links = [] }) {
  return (
    <div className="relative w-full max-w-[280px] mx-auto aspect-[9/18] bg-charcoal rounded-[40px] p-2.5 border-4 border-charcoal-mid shadow-2xl shadow-black/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-charcoal rounded-b-2xl z-20 flex items-center justify-center">
        <div className="w-10 h-1 bg-charcoal-mid rounded-full" />
      </div>

      <div className="relative w-full h-full rounded-[30px] overflow-y-auto">
        <ProfilePageView
          profile={profile}
          links={links}
          theme={profile?.themeConfig}
          compact
        />
      </div>
    </div>
  );
}
