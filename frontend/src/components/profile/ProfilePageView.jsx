import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LinkIcon, getLinkIconContainerStyle } from '../LinkIcon';
import { normalizeThemeConfig } from '../../utils/themePresets';
import { getThemeVisuals } from '../../utils/themeStyles';
import ProfileBrandingFooter from './ProfileBrandingFooter';
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

/* ─── Link arrow — beautiful flight + hover nudge ─── */
function LinkArrow({ visuals, compact, accent, isClicking }) {
  // neo uses plain text arrow → wrap for motion
  if (visuals.layoutStyle === 'neo') {
    return (
      <span
        style={visuals.linkArrow.style}
        className={`${visuals.linkArrow.className} ppv-arrow inline-block will-change-transform ${isClicking ? 'ppv-arrow-flying' : 'group-hover:translate-x-0.5'}`}
      >
        →
      </span>
    );
  }
  const sizeCls = compact ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const wrapSize = compact ? 'w-7 h-7' : 'w-8 h-8';
  // minimal diagonal vs classic chevron
  const isDiagonal = visuals.layoutStyle === 'minimal';
  return (
    <div
      style={visuals.linkArrow.style}
      className={`${visuals.linkArrow.className} ${wrapSize} ppv-arrow-wrap relative overflow-hidden shrink-0 flex items-center justify-center rounded-full will-change-transform ${isClicking ? 'ppv-arrow-wrap-clicking' : ''}`}
    >
      {/* arrow icon — flies out on click */}
      <span className={`ppv-arrow ppv-arrow-main inline-flex items-center justify-center ${sizeCls} will-change-transform ${isClicking ? 'ppv-arrow-flying' : ''}`}>
        <svg className={sizeCls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          {isDiagonal ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          )}
        </svg>
      </span>
      {/* ghost arrow that slides in after fly-out — creates “pass-through” */}
      <span
        aria-hidden="true"
        className={`ppv-arrow ppv-arrow-ghost absolute inset-0 flex items-center justify-center ${sizeCls} will-change-transform ${isClicking ? 'ppv-arrow-ghost-in' : 'opacity-0 -translate-x-3'}`}
      >
        <svg className={sizeCls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          {isDiagonal ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          )}
        </svg>
      </span>
      {/* subtle accent pulse ring on click */}
      {isClicking && <span aria-hidden="true" className="ppv-arrow-ring absolute inset-0 rounded-full" style={{ borderColor: accent }} />}
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
  onLinkClick,
}) {
  const theme = normalizeThemeConfig(themeInput);
  const visuals = getThemeVisuals(theme, { compact });
  const activeLinks = links.filter((link) => link.isActive !== false);
  const avatarSrc = getProfileAvatarUrl(profile?.avatarUrl) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile?.username || 'user')}`;
  const [clickedId, setClickedId] = useState(null);
  const [ripplePos, setRipplePos] = useState({ x: 50, y: 50 });

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
        @keyframes ppv-click-ripple {
          from { transform: translate(-50%, -50%) scale(0); opacity: 0.45; }
          to   { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
        @keyframes ppv-click-bounce {
          0%   { transform: scale(1); }
          28%  { transform: scale(0.96); }
          55%  { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        @keyframes ppv-click-shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(200%); }
        }
        .ppv-link.ppv-clicking {
          animation: ppv-click-bounce 420ms cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .ppv-link.ppv-clicking::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--ppv-accent) 18%, transparent) 0%, transparent 70%);
          opacity: 0.9;
          pointer-events: none;
        }
        /* ── arrow beauty ── */
        .ppv-link:hover .ppv-arrow-wrap:not(.ppv-arrow-wrap-clicking) .ppv-arrow-main {
          transform: translateX(3px);
        }
        .ppv-link:hover .ppv-arrow-wrap:not(.ppv-arrow-wrap-clicking) {
          background: color-mix(in srgb, var(--ppv-accent) 10%, transparent);
        }
        .ppv-arrow { transition: transform 260ms cubic-bezier(0.22,1,0.36,1), opacity 260ms ease; }
        @keyframes ppv-arrow-fly {
          0%   { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
          28%  { transform: translateX(6px) translateY(-2px) scale(1.08); opacity: 1; }
          45%  { transform: translateX(18px) translateY(-6px) scale(0.85); opacity: 0; }
          46%  { transform: translateX(-14px) translateY(4px) scale(0.85); opacity: 0; }
          100% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
        }
        @keyframes ppv-arrow-ghost-in {
          0%   { transform: translateX(-12px); opacity: 0; }
          48%  { transform: translateX(-12px); opacity: 0; }
          68%  { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes ppv-arrow-ring {
          0%   { transform: scale(0.7); opacity: 0; }
          30%  { opacity: 0.35; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .ppv-arrow-flying { animation: ppv-arrow-fly 560ms cubic-bezier(0.22,1,0.36,1) forwards; }
        .ppv-arrow-ghost-in { animation: ppv-arrow-ghost-in 560ms cubic-bezier(0.22,1,0.36,1) forwards; }
        .ppv-arrow-ring {
          border: 1.5px solid currentColor;
          animation: ppv-arrow-ring 560ms ease-out forwards;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .ppv-arrow-flying, .ppv-arrow-ghost-in, .ppv-arrow-ring, .ppv-link.ppv-clicking { animation: none !important; }
        }
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
              activeLinks.map((link, idx) => {
                const isClicking = clickedId === link.id;
                return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.button === 1) { onLinkClick?.(link); return; }
                    e.preventDefault();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setRipplePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
                    setClickedId(link.id);
                    onLinkClick?.(link);
                    setTimeout(() => {
                      window.open(link.url, '_blank', 'noopener,noreferrer');
                      setTimeout(() => setClickedId((cur) => (cur === link.id ? null : cur)), 650);
                    }, 420);
                  }}
                  style={{ ...visuals.link.style, ...(isClicking ? {} : fadeUp(300 + idx * 60)), '--ppv-accent': accent }}
                  className={`ppv-link group relative overflow-hidden isolate ${visuals.link.className} ${isClicking ? 'ppv-clicking' : ''}`}
                >
                  {/* click ripple */}
                  {isClicking && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute w-20 h-20 -ml-10 -mt-10 rounded-full"
                      style={{
                        left: `${ripplePos.x}%`,
                        top: `${ripplePos.y}%`,
                        background: `radial-gradient(circle, color-mix(in srgb, ${accent} 30%, transparent) 0%, transparent 65%)`,
                        animation: 'ppv-click-ripple 520ms ease-out forwards',
                      }}
                    />
                  )}
                  {/* shimmer sweep */}
                  {isClicking && (
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                      <span
                        className="absolute inset-y-0 w-1/3 -skew-x-12 opacity-20"
                        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, animation: 'ppv-click-shimmer 520ms ease-out forwards' }}
                      />
                    </span>
                  )}
                  {/* Icon */}
                  <div
                    className={`${getLinkIconContainerStyle(link.icon, link.title, link.url)} ${visuals.linkIcon.className} relative z-10 transition-transform duration-200 ${isClicking ? 'scale-110' : 'group-hover:scale-[1.03]'}`}
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
                  <div className="flex-1 text-left min-w-0 px-1 relative z-10">
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

                  {/* Arrow — beautiful */}
                  <span className="relative z-10 shrink-0">
                    <LinkArrow visuals={visuals} compact={compact} accent={accent} isClicking={isClicking} />
                  </span>
                  {isClicking && (
                    <span className="absolute inset-0 rounded-[inherit] border-2 pointer-events-none" style={{ borderColor: accent, opacity: 0.35 }} />
                  )}
                </a>
                );
              })
            )}
          </div>

          {/* ── Footer ── */}
          {showFooter && (
            <ProfileBrandingFooter
              compact={compact}
              style={visuals.text.style}
            />
          )}

        </div>
      </div>
    </>
  );
}
