import { getPlatformIcon, getPlatformContainerStyle } from './SocialIcons';
import { env } from '../config/env';
import { DEFAULT_THEME } from '../utils/themePresets';
import { StatusPill } from './StatusPill';

export default function LiveMobilePreview({ profile, links = [] }) {
  const activeLinks = links.filter((l) => l.isActive);
  const theme = profile?.themeConfig || DEFAULT_THEME;

  const bgStyle = theme.backgroundColor ? { backgroundColor: theme.backgroundColor } : {};
  const cardStyle = theme.cardColor ? { backgroundColor: theme.cardColor, borderColor: 'rgba(0,0,0,0.06)' } : {};
  const textStyle = theme.textColor ? { color: theme.textColor } : {};
  const accentStyle = theme.accentColor ? { color: theme.accentColor } : {};

  return (
    <div className="relative w-full max-w-[280px] mx-auto aspect-[9/18] bg-charcoal rounded-[40px] p-2.5 border-4 border-charcoal-mid shadow-2xl shadow-black/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-charcoal rounded-b-2xl z-20 flex items-center justify-center">
        <div className="w-10 h-1 bg-charcoal-mid rounded-full" />
      </div>

      <div
        style={bgStyle}
        className="relative w-full h-full rounded-[30px] overflow-y-auto flex flex-col items-center p-3 text-center transition-colors duration-300 gap-3"
      >
        {/* Top Subdomain Tag */}
        <div
          style={{ backgroundColor: theme.cardColor, color: theme.accentColor }}
          className="mt-5 px-2.5 py-0.5 rounded-full border border-black/10 font-mono text-[9px] font-semibold"
        >
          {profile?.username || 'username'}.{env.appDomain}
        </div>

        {/* Elevated Profile Hero Card */}
        <div style={cardStyle} className="w-full rounded-2xl p-4 border shadow-sm flex flex-col items-center">
          {/* Avatar with dual ring */}
          <div className="relative w-16 h-16 mb-2">
            <div
              style={{ backgroundColor: theme.accentColor }}
              className="absolute -inset-1 rounded-full opacity-20"
            />
            <img
              src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'user'}`}
              alt={profile?.displayName}
              className="relative w-full h-full rounded-full object-cover border-2 border-white bg-slate-100 shadow-sm"
            />
          </div>

          <h3 style={textStyle} className="font-bold text-sm leading-tight">
            {profile?.displayName || 'Your Name'}
          </h3>
          {profile?.role && (
            <p style={{ ...textStyle, opacity: 0.8 }} className="text-[11px] font-medium mt-0.5 leading-snug">
              {profile.role}
            </p>
          )}
          {profile?.bio && (
            <p style={{ ...textStyle, opacity: 0.65 }} className="text-[10px] mt-1 leading-relaxed max-w-[200px]">
              {profile.bio}
            </p>
          )}

          {/* Status Badge (rendered only if showStatusBadge is true) */}
          {profile?.showStatusBadge !== false && profile?.statusBadge && (
            <StatusPill statusBadge={profile.statusBadge} className="mt-2.5" />
          )}
        </div>

        {/* Links Stack */}
        <div className="w-full flex flex-col gap-2">
          {activeLinks.length === 0 ? (
            <div style={textStyle} className="py-4 border-2 border-dashed border-black/10 rounded-xl text-[10px] opacity-60">
              Add links to see them here
            </div>
          ) : (
            activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                style={cardStyle}
                className="flex items-center justify-between px-3 py-2.5 rounded-2xl border shadow-sm transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${getPlatformContainerStyle(link.icon || link.title)}`}>
                    {getPlatformIcon(link.icon || link.title, 'w-3.5 h-3.5')}
                  </div>
                  <div className="text-left min-w-0">
                    <span style={textStyle} className="text-[11px] font-bold block truncate leading-tight">{link.title}</span>
                    {link.subtitle && (
                      <span style={{ ...textStyle, opacity: 0.6 }} className="text-[9px] font-medium block truncate leading-tight mt-0.5">{link.subtitle}</span>
                    )}
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center shrink-0 group-hover:bg-black/10 transition-colors">
                  <svg style={accentStyle} className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))
          )}
        </div>

        <div style={{ ...textStyle, opacity: 0.5 }} className="mt-auto pt-2 text-[9px]">
          Powered by <span style={accentStyle} className="font-bold">LinkMakeup</span>
        </div>
      </div>
    </div>
  );
}
