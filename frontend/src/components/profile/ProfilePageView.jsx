import { LinkIcon, getLinkIconContainerStyle } from '../LinkIcon';
import { env } from '../../config/env';
import { normalizeThemeConfig } from '../../utils/themePresets';
import { getThemeVisuals } from '../../utils/themeStyles';
import { getCopyrightLine } from '../../utils/pageExport';
import { StatusPill } from '../StatusPill';
import { getDefaultSubtitle } from '../SocialIcons';

function LinkArrow({ visuals, compact }) {
  if (visuals.layoutStyle === 'neo') {
    return <span style={visuals.linkArrow.style} className={visuals.linkArrow.className}>→</span>;
  }

  return (
    <div className={visuals.linkArrow.className} style={visuals.linkArrow.style}>
      <svg className={compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
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
  const avatarSrc = profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile?.username || 'user')}`;

  const cleanClassName = (className = '') => className.replace(/rounded-(full|none|2xl|xl|lg|md|sm)/g, '');

  const getAvatarRadiusStyle = (shape, isCompact) => {
    if (shape === 'square') {
      return { borderRadius: isCompact ? '6px' : '10px' };
    }
    if (shape === 'rounded') {
      return { borderRadius: isCompact ? '14px' : '22px' };
    }
    return { borderRadius: '9999px' };
  };

  const avatarRadiusStyle = getAvatarRadiusStyle(profile?.avatarShape, compact);

  return (
    <div style={visuals.page.style} className={`relative min-h-full ${visuals.page.className} ${className}`}>
      {visuals.showGlassOrbs && (
        <>
          <div
            className="absolute -top-8 -left-8 w-32 h-32 rounded-full blur-3xl opacity-40 pointer-events-none"
            style={{ backgroundColor: theme.accentColor }}
          />
          <div
            className="absolute bottom-10 -right-6 w-28 h-28 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ backgroundColor: theme.accentColor }}
          />
        </>
      )}

      <div className={`max-w-sm mx-auto flex flex-col items-center ${visuals.shell.className}`}>
        <div style={visuals.hero.style} className={visuals.hero.className}>
          {visuals.heroDecor && (
            <div
              className="absolute top-3 right-3 w-8 h-8 rounded-full opacity-20"
              style={{ backgroundColor: theme.accentColor }}
            />
          )}

          <div className={`${cleanClassName(visuals.avatarWrap.className)} overflow-hidden`} style={avatarRadiusStyle}>
            {visuals.avatarRing.className !== 'hidden' && (
              <div style={{ ...visuals.avatarRing.style, ...avatarRadiusStyle }} className={cleanClassName(visuals.avatarRing.className)} />
            )}
            <img
              src={avatarSrc}
              alt={profile?.displayName || 'Profile'}
              className={`${cleanClassName(visuals.avatar.className)} overflow-hidden`}
              style={{ ...visuals.avatar.style, ...avatarRadiusStyle }}
              referrerPolicy="no-referrer"
            />
          </div>

          <h1 style={visuals.text.style} className={visuals.name.className}>
            {profile?.displayName || 'Your Name'}
          </h1>
          {profile?.role && (
            <p style={visuals.text.style} className={visuals.role.className}>{profile.role}</p>
          )}
          {profile?.bio && (
            <p style={visuals.text.style} className={visuals.bio.className}>{profile.bio}</p>
          )}
          {profile?.showStatusBadge !== false && profile?.statusBadge && (
            <StatusPill statusBadge={profile.statusBadge} className={compact ? 'mt-2' : 'mt-3'} />
          )}
        </div>

        <div className={visuals.linksWrap.className} style={visuals.linksWrap.style}>
          {activeLinks.length === 0 ? (
            <p style={{ ...visuals.text.style, opacity: 0.6 }} className={`text-center ${compact ? 'text-[10px] py-4' : 'text-sm py-6'}`}>
              {compact ? 'Add links to preview' : 'No links added yet.'}
            </p>
          ) : (
            activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                style={visuals.link.style}
                className={visuals.link.className}
              >
                <div className="flex items-center gap-2.5 min-w-0">
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
                  <div className="text-left min-w-0">
                    <span style={visuals.text.style} className={`${visuals.linkTitle.className} block truncate`}>
                      {link.title}
                    </span>
                    {(() => {
                      const sub = link.subtitle || getDefaultSubtitle(link.icon, link.title);
                      return sub ? (
                        <span style={{ ...visuals.text.style, opacity: 0.55 }} className={`${visuals.linkSubtitle.className} block truncate`}>
                          {sub}
                        </span>
                      ) : null;
                    })()}
                  </div>
                </div>
                <LinkArrow visuals={visuals} compact={compact} />
              </a>
            ))
          )}
        </div>

        {showFooter && (
          <p
            style={{ ...visuals.text.style, opacity: 0.45 }}
            className={`mt-4 text-center ${compact ? 'text-[9px]' : 'text-[11px]'} tracking-wide`}
          >
            {getCopyrightLine()}
          </p>
        )}
      </div>
    </div>
  );
}
