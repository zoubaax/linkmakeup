import { getPlatformIcon } from './SocialIcons';
import { env } from '../config/env';

export default function LiveMobilePreview({ profile, links = [] }) {
  const activeLinks = links.filter((l) => l.isActive);

  return (
    <div className="relative w-full max-w-[280px] mx-auto aspect-[9/18] bg-surface-muted rounded-[40px] p-2.5 border-4 border-border-strong shadow-2xl shadow-black/10 dark:shadow-black/40">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-surface-muted rounded-b-2xl z-20 flex items-center justify-center">
        <div className="w-10 h-1 bg-border-strong rounded-full" />
      </div>

      <div className="relative w-full h-full bg-app rounded-[30px] overflow-y-auto flex flex-col items-center pt-8 pb-4 px-3 text-center">
        <div className="mb-3 px-2.5 py-0.5 rounded-full bg-surface border border-border text-accent font-mono text-[10px] font-semibold">
          {profile?.username || 'username'}.{env.appDomain}
        </div>

        <div className="relative w-16 h-16 mb-2.5">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700" />
          <img
            src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'user'}`}
            alt={profile?.displayName}
            className="relative w-full h-full rounded-full object-cover border-2 border-app bg-surface-muted"
          />
        </div>

        <h3 className="font-bold text-fg text-sm leading-tight">{profile?.displayName || 'Your Name'}</h3>
        {profile?.bio && (
          <p className="text-fg-subtle text-[11px] mt-1 leading-relaxed max-w-[200px]">{profile.bio}</p>
        )}

        <div className="w-full flex flex-col gap-2 mt-3">
          {activeLinks.length === 0 ? (
            <div className="py-4 border-2 border-dashed border-border rounded-xl text-fg-subtle text-[10px]">
              Add links to see them here
            </div>
          ) : (
            activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface border border-border hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-accent">{getPlatformIcon(link.icon || link.title, 'w-3 h-3')}</span>
                  <span className="text-[11px] font-semibold text-fg truncate">{link.title}</span>
                </div>
                <svg className="w-2.5 h-2.5 text-fg-subtle shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            ))
          )}
        </div>

        <div className="mt-auto pt-3 text-[9px] text-fg-subtle">
          Powered by <span className="text-accent font-bold">LinkMakeup</span>
        </div>
      </div>
    </div>
  );
}
