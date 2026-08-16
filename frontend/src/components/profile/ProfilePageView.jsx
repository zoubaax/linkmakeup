import { Link } from 'react-router-dom';
import { LinkIcon, getLinkIconContainerStyle } from '../LinkIcon';
import { normalizeThemeConfig } from '../../utils/themePresets';
import { getThemeVisuals } from '../../utils/themeStyles';
import { getCopyrightLine, getMarketingSiteUrl } from '../../utils/pageExport';
import { StatusPill } from '../StatusPill';
import { getDefaultSubtitle } from '../SocialIcons';
import { getProfileAvatarUrl } from '../../utils/cloudinary';

/* ─── Staggered entrance animation styles ─── */
const fadeUp = (delay = 0) => ({
  animation: `ppv-fadeUp 0.5s ease both`,
  animationDelay: `${delay}ms`,
});

const scaleIn = (delay = 0) => ({
  animation: `ppv-scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both`,
  animationDelay: `${delay}ms`,
});

/* ─── Link arrow ─── */
function LinkArrow({ visuals, compact, accent }) {
  if (visuals.layoutStyle === 'neo') {
    return <span style={visuals.linkArrow.style} className={visuals.linkArrow.className}>→</span>;
  }
  if (visuals.layoutStyle === 'minimal') {
    return (
      <div className={visuals.linkArrow.className} style={visuals.linkArrow.style}>
        <svg className={compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>
    );
  }
  return (
    <div className={visuals.linkArrow.className} style={visuals.linkArrow.style}>
      <svg className={compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

/* ─── Avatar glow ring ─── */
function AvatarGlowRing({ accent, shape, compact }) {
  const size = compact ? 'w-[72px] h-[72px]' : 'w-[116px] h-[116px]';
  const radius = shape === 'square' ? (compact ? '10px' : '16px') : shape === 'rounded' ? (compact ? '20px' : '32px') : '9999px';
  return (
    <div
      className={`absolute inset-0 ${size} blur-md opacity-50 pointer-events-none`}
      style={{ borderRadius: radius, backgroundColor: accent, animation: 'ppv-pulse 3s ease-in-out infinite' }}
    />
  );
}

export default function ProfilePageView({
  profile,
  links = [],
  theme: themeInput,
  compact = false,
  showFooter = false,
  className = '',
}) {
  const theme = normalizeThemeConfig(themeInput);
  const visuals = getThemeVisuals(theme, { compact });
  const activeLinks = links.filter((link) => link.isActive !== false);
  const avatarSrc = getProfileAvatarUrl(profile?.avatarUrl) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile?.username || 'user')}`;

  const cleanClassName = (cls = '') => cls.replace(/rounded-(full|none|2xl|xl|lg|md|sm)/g, '');

  const getAvatarRadiusStyle = (shape, isCompact) => {
    if (shape === 'square') return { borderRadius: isCompact ? '8px' : '12px' };
    if (shape === 'rounded') return { borderRadius: isCompact ? '16px' : '26px' };
    return { borderRadius: '9999px' };
  };

  const getAvatarDimensionStyle = (sizeKey, isCompact) => {
    if (sizeKey === 'small') {
      return { width: isCompact ? '48px' : '76px', height: isCompact ? '48px' : '76px' };
    }
    if (sizeKey === 'large') {
      return { width: isCompact ? '76px' : '124px', height: isCompact ? '76px' : '124px' };
    }
    // medium (default)
    return { width: isCompact ? '60px' : '96px', height: isCompact ? '60px' : '96px' };
  };

  const avatarRadiusStyle = getAvatarRadiusStyle(profile?.avatarShape, compact);
  const avatarDimensionStyle = getAvatarDimensionStyle(profile?.avatarSize, compact);
  const accent = theme.accentColor;

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @keyframes ppv-fadeUp {
          from { opacity: 0; transform: translateY(${compact ? '6px' : '14px'}); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ppv-scaleIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ppv-pulse {
          0%, 100% { opacity: 0.35; transform: scale(0.97); }
          50%       { opacity: 0.6;  transform: scale(1.05); }
        }
        .ppv-link:active { transform: scale(0.97) !important; }
      `}</style>

      <div style={visuals.page.style} className={`relative min-h-full ${visuals.page.className} ${className}`}>
        {visuals.showGlassOrbs && (
          <>
            <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl opacity-35 pointer-events-none" style={{ backgroundColor: accent }} />
            <div className="absolute bottom-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-25 pointer-events-none" style={{ backgroundColor: accent }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ backgroundColor: accent }} />
          </>
        )}

        <div className={`max-w-sm mx-auto flex flex-col items-center ${visuals.shell.className}`}>

          {/* ── Hero / Profile Header ── */}
          <div style={{ ...visuals.hero.style, ...fadeUp(0) }} className={visuals.hero.className}>
            {visuals.heroDecor && (
              <div className="absolute top-3 right-3 w-10 h-10 rounded-full opacity-15" style={{ backgroundColor: accent }} />
            )}
            {visuals.heroDecor && (
              <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full opacity-10" style={{ backgroundColor: accent }} />
            )}

            {/* Avatar */}
            <div style={{ ...scaleIn(80) }} className="relative flex items-center justify-center">
              <div
                className={`${cleanClassName(visuals.avatarWrap.className)} overflow-hidden relative`}
                style={{ ...avatarRadiusStyle, ...avatarDimensionStyle }}
              >
                {/* Glow pulse ring */}
                <AvatarGlowRing accent={accent} shape={profile?.avatarShape} compact={compact} />

                {visuals.avatarRing.className !== 'hidden' && (
                  <div style={{ ...visuals.avatarRing.style, ...avatarRadiusStyle }} className={cleanClassName(visuals.avatarRing.className)} />
                )}
                <img
                  src={avatarSrc}
                  alt={profile?.displayName || 'Profile'}
                  className={`${cleanClassName(visuals.avatar.className)} overflow-hidden relative z-10`}
                  style={{ ...visuals.avatar.style, ...avatarRadiusStyle }}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Name */}
            <h1 style={{ ...visuals.text.style, ...fadeUp(120) }} className={visuals.name.className}>
              {profile?.displayName || 'Your Name'}
            </h1>

            {/* Role */}
            {profile?.role && (
              <p style={{ ...visuals.text.style, opacity: 0.7, ...fadeUp(180) }} className={visuals.role.className}>
                {profile.role}
              </p>
            )}

            {/* Bio */}
            {profile?.bio && (
              <p style={{ ...visuals.text.style, ...fadeUp(220) }} className={visuals.bio.className}>
                {profile.bio}
              </p>
            )}

            {/* Status badge */}
            {profile?.showStatusBadge !== false && profile?.statusBadge && (
              <div style={fadeUp(260)}>
                <StatusPill statusBadge={profile.statusBadge} className={compact ? 'mt-2' : 'mt-3'} />
              </div>
            )}
          </div>

          {/* ── Links ── */}
          <div className={visuals.linksWrap.className} style={visuals.linksWrap.style}>
            {activeLinks.length === 0 ? (
              <p style={{ ...visuals.text.style, opacity: 0.55 }} className={`text-center ${compact ? 'text-[10px] py-4' : 'text-sm py-6'}`}>
                {compact ? 'Add links to preview' : 'No links added yet.'}
              </p>
            ) : (
              activeLinks.map((link, idx) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...visuals.link.style, ...fadeUp(300 + idx * 60) }}
                  className={`ppv-link ${visuals.link.className}`}
                >
                  {/* Icon */}
                  <div
                    className={`${getLinkIconContainerStyle(link.icon, link.title, link.url)} ${visuals.linkIcon.className}`}
                    style={visuals.linkIcon.style}
                  >
                    <LinkIcon
                      icon={link.icon}
                      title={link.title}
                      url={link.url}
                      className={compact ? 'w-3.5 h-3.5' : 'w-5 h-5'}
                      imgClassName={`${compact ? 'w-3.5 h-3.5' : 'w-5 h-5'} object-contain`}
                    />
                  </div>

                  {/* Title + subtitle */}
                  <div className="flex-1 text-left min-w-0 px-1">
                    <span style={visuals.text.style} className={`${visuals.linkTitle.className} block truncate`}>
                      {link.title}
                    </span>
                    {(() => {
                      const sub = getDefaultSubtitle(link.icon, link.title);
                      return sub ? (
                        <span style={{ ...visuals.text.style, opacity: 0.5 }} className={`${visuals.linkSubtitle.className} block truncate`}>
                          {sub}
                        </span>
                      ) : null;
                    })()}
                  </div>

                  {/* Arrow */}
                  <LinkArrow visuals={visuals} compact={compact} accent={accent} />
                </a>
              ))
            )}
          </div>

          {/* ── Footer ── */}
          {showFooter && (
            <a
              href={getMarketingSiteUrl()}
              target="_top"
              rel="noopener noreferrer"
              style={{ ...visuals.text.style, opacity: 0.6 }}
              className={`mt-6 text-center ${compact ? 'text-[9px]' : 'text-[11px]'} tracking-wide hover:opacity-90 transition-opacity font-semibold cursor-pointer z-30 relative inline-block`}
              title="Create your own bio link page on LinkMakeup"
            >
              {getCopyrightLine()}
            </a>
          )}

        </div>
      </div>
    </>
  );
}
