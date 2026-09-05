import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiXMark, HiUserPlus, HiCheck } from 'react-icons/hi2';
import { LinkIcon, getLinkIconContainerStyle } from '../LinkIcon';
import { normalizeThemeConfig } from '../../utils/themePresets';
import { getThemeVisuals } from '../../utils/themeStyles';
import ProfileBrandingFooter from './ProfileBrandingFooter';
import { StatusPill } from '../StatusPill';
import { getDefaultSubtitle } from '../SocialIcons';
import { getProfileAvatarUrl } from '../../utils/cloudinary';
import { downloadVCard } from '../../utils/vcard';

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
  publicUrl,
  onLinkClick,
}) {
  const theme = normalizeThemeConfig(themeInput);
  const visuals = getThemeVisuals(theme, { compact });
  const activeLinks = links.filter((link) => link.isActive !== false);
  const avatarSrc = getProfileAvatarUrl(profile?.avatarUrl) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile?.username || 'user')}`;
  const [clickedId, setClickedId] = useState(null);
  const [ripplePos, setRipplePos] = useState({ x: 50, y: 50 });
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [isContactSaved, setIsContactSaved] = useState(false);

  useEffect(() => {
    if (!isPhotoOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsPhotoOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPhotoOpen]);

  const handleSaveContact = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsContactSaved(true);
    await downloadVCard({ profile, links, publicUrl, photoUrl: avatarSrc });
    setTimeout(() => setIsContactSaved(false), 2400);
  };

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

  const getContactBtnConfig = () => {
    const layout = visuals.layoutStyle || 'classic';
    const isDark = visuals.isDark;

    if (layout === 'minimal') {
      return {
        className: `inline-flex items-center justify-center font-semibold rounded-full border transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-xs ${
          compact ? 'px-3 py-1 text-[10px] gap-1.5' : 'px-4.5 py-2 text-xs gap-2'
        }`,
        style: {
          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
          borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)',
          color: theme.textColor,
        },
      };
    }

    if (layout === 'glass') {
      return {
        className: `inline-flex items-center justify-center font-bold rounded-2xl border backdrop-blur-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-md ${
          compact ? 'px-3 py-1 text-[10px] gap-1.5' : 'px-4.5 py-2 text-xs gap-2'
        }`,
        style: {
          backgroundColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.7)',
          borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.9)',
          color: theme.textColor,
        },
      };
    }

    if (layout === 'maximal') {
      return {
        className: `inline-flex items-center justify-center font-black uppercase tracking-wider rounded-2xl border-[2px] transition-all duration-200 hover:scale-[1.04] active:scale-[0.98] cursor-pointer shadow-lg ${
          compact ? 'px-3.5 py-1.5 text-[10px] gap-1.5' : 'px-5 py-2 text-xs gap-2'
        }`,
        style: {
          backgroundColor: accent,
          borderColor: accent,
          color: '#ffffff',
          boxShadow: `0 4px 18px ${accent}40`,
        },
      };
    }

    if (layout === 'neo') {
      return {
        className: `inline-flex items-center justify-center font-black uppercase tracking-wide rounded-none border-[2.5px] transition-all duration-150 hover:translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 cursor-pointer ${
          compact ? 'px-3 py-1 text-[10px] gap-1.5' : 'px-4.5 py-2 text-xs gap-2'
        }`,
        style: {
          backgroundColor: accent,
          borderColor: theme.textColor,
          color: '#ffffff',
          boxShadow: compact ? `3px 3px 0 0 ${theme.textColor}` : `4px 4px 0 0 ${theme.textColor}`,
        },
      };
    }

    // Classic default
    return {
      className: `inline-flex items-center justify-center font-bold rounded-full border transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-sm ${
        compact ? 'px-3.5 py-1.5 text-[10px] gap-1.5' : 'px-4.5 py-2 text-xs gap-2'
      }`,
      style: {
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.95)',
        borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.1)',
        color: theme.textColor,
        boxShadow: isDark ? '0 4px 14px rgba(0,0,0,0.3)' : '0 4px 14px rgba(0,0,0,0.06)',
      },
    };
  };

  const contactBtn = getContactBtnConfig();

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
              <button
                type="button"
                onClick={() => setIsPhotoOpen(true)}
                title="Click to view full photo"
                aria-label="Click to view photo"
                className={`${cleanClassName(visuals.avatarWrap.className)} overflow-hidden relative cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-offset-2`}
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
                  className={`${cleanClassName(visuals.avatar.className)} overflow-hidden relative z-10 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105`}
                  style={{ ...visuals.avatar.style, ...avatarRadiusStyle }}
                  referrerPolicy="no-referrer"
                />
              </button>
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

            {/* Save Contact Button */}
            <div style={fadeUp(280)} className={compact ? 'mt-2.5' : 'mt-4'}>
              <button
                type="button"
                onClick={handleSaveContact}
                className={contactBtn.className}
                style={contactBtn.style}
                title="Save contact card to phone"
                aria-label="Save contact to phone"
              >
                {isContactSaved ? (
                  <>
                    <HiCheck className={compact ? 'w-3 h-3 text-emerald-400 shrink-0' : 'w-4 h-4 text-emerald-400 shrink-0'} />
                    <span>Contact Saved!</span>
                  </>
                ) : (
                  <>
                    <HiUserPlus className={compact ? 'w-3 h-3 shrink-0' : 'w-4 h-4 shrink-0'} />
                    <span>Save Contact</span>
                  </>
                )}
              </button>
            </div>
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

      {/* ── Photo Lightbox Modal ── */}
      {isPhotoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsPhotoOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Profile photo preview"
        >
          <div
            className="relative max-w-sm sm:max-w-md w-full bg-zinc-950/90 border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-white animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsPhotoOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Close photo"
            >
              <HiXMark className="w-5 h-5" />
            </button>

            {/* Enlarged Photo */}
            <div
              className="overflow-hidden border-2 shadow-2xl mt-1 relative flex items-center justify-center bg-black/40"
              style={{
                borderRadius: profile?.avatarShape === 'square' ? '16px' : profile?.avatarShape === 'rounded' ? '28px' : '9999px',
                borderColor: accent || '#10b981',
                width: 'min(280px, 72vw)',
                height: 'min(280px, 72vw)',
              }}
            >
              <img
                src={avatarSrc}
                alt={profile?.displayName || 'Profile Photo'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Profile info */}
            <div className="text-center px-2">
              <h3 className="font-bold text-lg text-white tracking-tight">
                {profile?.displayName || 'Profile Photo'}
              </h3>
              {profile?.username && (
                <p className="text-xs text-zinc-400 mt-0.5">@{profile.username}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
