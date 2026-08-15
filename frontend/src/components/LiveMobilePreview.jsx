import { getPlatformIcon } from './SocialIcons';

export default function LiveMobilePreview({ profile, links = [] }) {
  const activeLinks = links.filter((l) => l.isActive);

  return (
    <div className="w-full max-w-[280px] mx-auto aspect-[9/18] bg-charcoal rounded-[40px] p-2.5 border-4 border-charcoal-mid shadow-2xl">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-charcoal rounded-b-2xl z-20 flex items-center justify-center">
        <div className="w-10 h-1 bg-charcoal-mid rounded-full" />
      </div>

      {/* Screen */}
      <div className="relative w-full h-full bg-cream rounded-[30px] overflow-y-auto flex flex-col items-center pt-8 pb-4 px-3 text-center">
        
        {/* Username badge */}
        <div className="mb-3 px-2.5 py-0.5 rounded-full bg-cream-dark border border-warm-border text-terra font-mono text-[10px] font-semibold">
          {profile?.username || 'username'}.linkmakeup.com
        </div>

        {/* Avatar */}
        <div className="relative w-16 h-16 mb-2.5">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-terra to-amber-warm" />
          <img
            src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'user'}`}
            alt={profile?.displayName}
            className="relative w-full h-full rounded-full object-cover border-2 border-cream bg-cream-dark"
          />
        </div>

        {/* Name & bio */}
        <h3 className="font-serif font-bold text-charcoal text-sm leading-tight">
          {profile?.displayName || 'Your Name'}
        </h3>
        {profile?.bio && (
          <p className="text-stone text-[11px] mt-1 leading-relaxed max-w-[200px]">
            {profile.bio}
          </p>
        )}

        {/* Links */}
        <div className="w-full flex flex-col gap-2 mt-3">
          {activeLinks.length === 0 ? (
            <div className="py-4 border-2 border-dashed border-warm-border rounded-xl text-stone text-[10px]">
              Add links to see them here
            </div>
          ) : (
            activeLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-warm-border shadow-sm hover:border-terra transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-terra">{getPlatformIcon(link.icon || link.title, 'w-3 h-3')}</span>
                  <span className="text-[11px] font-semibold text-charcoal truncate">{link.title}</span>
                </div>
                <svg className="w-2.5 h-2.5 text-stone shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 text-[9px] text-stone-light">
          Powered by <span className="text-terra font-serif font-bold italic">LinkMakeup</span>
        </div>
      </div>
    </div>
  );
}
