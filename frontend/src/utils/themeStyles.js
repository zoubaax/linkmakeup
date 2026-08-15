import { isColorDark } from './themePresets';

export const LAYOUT_STYLES = [
  { id: 'minimal',  name: 'Minimalist',    description: 'Typography-led, open space',        tagline: 'Less chrome, more focus' },
  { id: 'classic',  name: 'Classic',       description: 'Soft cards, balanced hierarchy',   tagline: 'Timeless link-in-bio' },
  { id: 'glass',    name: 'Glass',         description: 'Frosted layers over color',          tagline: 'Translucent & modern' },
  { id: 'maximal',  name: 'Maximalist',    description: 'Bold frames, rich detail',           tagline: 'Expressive & loud' },
  { id: 'neo',      name: 'Neo-Brutalist', description: 'Hard edges, offset blocks',          tagline: 'Raw & graphic' },
];

export function resolveLayoutStyle(layoutStyle) {
  return LAYOUT_STYLES.find((style) => style.id === layoutStyle) || LAYOUT_STYLES[0];
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return `rgba(255,255,255,${alpha})`;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getThemeVisuals(theme, { compact = false } = {}) {
  const layoutStyle = theme.layoutStyle || 'minimal';
  const isDark = theme.isDark ?? isColorDark(theme.backgroundColor);
  const accent = theme.accentColor;
  const text = theme.textColor;

  const base = {
    layoutStyle,
    isDark,
    page:     { style: { backgroundColor: theme.backgroundColor, color: text }, className: 'transition-colors duration-300' },
    text:     { style: { color: text } },
    accent:   { style: { color: accent } },
    accentBg: { style: { backgroundColor: accent } },
  };

  /* ─────────────────────────────────────────
     MINIMAL
  ───────────────────────────────────────── */
  if (layoutStyle === 'minimal') {
    return {
      ...base,
      page: {
        style: base.page.style,
        className: `${base.page.className} ${compact ? 'px-3 py-4' : 'px-5 py-14'}`,
      },
      shell:      { className: compact ? 'gap-4' : 'gap-7' },
      hero: {
        className: 'w-full flex flex-col items-center text-center bg-transparent border-0 shadow-none pb-2',
        style: {},
      },
      avatarWrap: {
        className: compact
          ? 'relative w-[62px] h-[62px] mb-2 overflow-hidden'
          : 'relative w-[96px] h-[96px] mb-4 overflow-hidden',
      },
      avatarRing: { className: 'hidden' },
      avatar: {
        className: 'relative w-full h-full object-cover z-10',
        style: {},
      },
      name: { className: `${compact ? 'text-sm' : 'text-[1.75rem]'} font-extrabold tracking-tight leading-tight` },
      role: { className: `${compact ? 'text-[11px]' : 'text-sm'} font-medium mt-1 tracking-wide` },
      bio:  { className: `${compact ? 'text-[10px] mt-1' : 'text-sm mt-2'} leading-relaxed max-w-xs opacity-75 font-normal` },
      domainPill: { className: 'hidden', style: {} },
      linksWrap:  { className: `w-full flex flex-col ${compact ? 'gap-2' : 'gap-3'}` },
      link: {
        className: `group flex items-center ${compact ? 'px-3 py-2.5 rounded-full' : 'px-5 py-4 rounded-full'} border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`,
        style: {
          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.035)',
          borderColor:      isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
        },
      },
      linkIcon:     { className: `${compact ? 'w-7 h-7 rounded-xl' : 'w-9 h-9 rounded-2xl'} flex items-center justify-center shrink-0` },
      linkTitle:    { className: `${compact ? 'text-[11px]' : 'text-sm'} font-extrabold tracking-wide` },
      linkSubtitle: { className: `${compact ? 'text-[9px]' : 'text-xs'} font-normal opacity-55 mt-0.5 tracking-normal leading-relaxed` },
      linkArrow: {
        className: `${compact ? 'w-5 h-5' : 'w-7 h-7'} rounded-full flex items-center justify-center shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5`,
        style: {
          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
        },
      },
      showGlassOrbs: false,
      heroDecor: false,
    };
  }

  /* ─────────────────────────────────────────
     GLASS
  ───────────────────────────────────────── */
  if (layoutStyle === 'glass') {
    const cardBg     = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.5)';
    const cardBorder = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.75)';
    return {
      ...base,
      page: {
        style: {
          ...base.page.style,
          backgroundImage: [
            `radial-gradient(ellipse at 20% 0%,   ${hexToRgba(accent, 0.3)} 0%, transparent 50%)`,
            `radial-gradient(ellipse at 80% 100%, ${hexToRgba(accent, 0.2)} 0%, transparent 45%)`,
            `radial-gradient(ellipse at 50% 50%,  ${hexToRgba(accent, 0.08)} 0%, transparent 65%)`,
          ].join(', '),
        },
        className: `${base.page.className} relative overflow-hidden ${compact ? 'px-3 py-4' : 'px-5 py-14'}`,
      },
      shell:      { className: compact ? 'gap-3 relative z-10' : 'gap-5 relative z-10' },
      hero: {
        className: `w-full ${compact ? 'rounded-2xl p-3' : 'rounded-3xl p-7'} border flex flex-col items-center text-center backdrop-blur-2xl`,
        style: { backgroundColor: cardBg, borderColor: cardBorder, boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.45)' : '0 12px 40px rgba(0,0,0,0.06)' },
      },
      avatarWrap: { className: compact ? 'relative w-[60px] h-[60px] mb-2 overflow-hidden' : 'relative w-[100px] h-[100px] mb-4 overflow-hidden' },
      avatarRing: { className: 'absolute -inset-1 rounded-full opacity-30 blur-sm', style: { backgroundColor: accent } },
      avatar: { className: 'relative w-full h-full object-cover z-10', style: { boxShadow: `0 0 0 2px ${hexToRgba(accent, 0.4)}` } },
      name:     { className: `${compact ? 'text-sm' : 'text-[1.75rem]'} font-bold tracking-tight` },
      role:     { className: `${compact ? 'text-[10px]' : 'text-sm'} font-semibold mt-1 opacity-80` },
      bio:      { className: `${compact ? 'text-[9px] mt-1' : 'text-sm mt-2'} leading-relaxed opacity-65 max-w-xs` },
      domainPill: { className: 'hidden', style: {} },
      linksWrap: { className: `w-full flex flex-col ${compact ? 'gap-2' : 'gap-3'}` },
      link: {
        className: `group flex items-center ${compact ? 'px-3 py-2.5 rounded-2xl' : 'px-4 py-4 rounded-2xl'} border backdrop-blur-2xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200`,
        style: { backgroundColor: cardBg, borderColor: cardBorder },
      },
      linkIcon:     { className: `${compact ? 'w-8 h-8 rounded-xl' : 'w-10 h-10 rounded-xl'} flex items-center justify-center shrink-0`, style: { backgroundColor: hexToRgba(accent, 0.18) } },
      linkTitle:    { className: `${compact ? 'text-[10px]' : 'text-sm'} font-bold` },
      linkSubtitle: { className: `${compact ? 'text-[8px]' : 'text-xs'} opacity-55 mt-0.5` },
      linkArrow:    { className: `${compact ? 'w-5 h-5' : 'w-7 h-7'} rounded-full flex items-center justify-center shrink-0`, style: { backgroundColor: hexToRgba(accent, 0.14), color: accent } },
      showGlassOrbs: true,
      heroDecor: false,
    };
  }

  /* ─────────────────────────────────────────
     MAXIMAL
  ───────────────────────────────────────── */
  if (layoutStyle === 'maximal') {
    return {
      ...base,
      page: {
        style: base.page.style,
        className: `${base.page.className} ${compact ? 'px-2.5 py-4' : 'px-4 py-10'}`,
      },
      shell:     { className: compact ? 'gap-3' : 'gap-4' },
      hero: {
        className: `w-full ${compact ? 'rounded-2xl p-3' : 'rounded-[2rem] p-7'} border-[3px] flex flex-col items-center text-center relative overflow-hidden`,
        style: {
          backgroundColor: theme.cardColor,
          borderColor: accent,
          boxShadow: `0 20px 60px ${hexToRgba(accent, 0.3)}, inset 0 0 80px ${hexToRgba(accent, 0.04)}`,
          backgroundImage: `radial-gradient(ellipse at 50% 0%, ${hexToRgba(accent, 0.1)} 0%, transparent 60%)`,
        },
      },
      heroDecor: true,
      avatarWrap: { className: compact ? 'relative w-[66px] h-[66px] mb-3 overflow-hidden' : 'relative w-[110px] h-[110px] mb-4 overflow-hidden' },
      avatarRing: { className: 'absolute -inset-2 rounded-full border-[3px] opacity-60', style: { borderColor: accent } },
      avatar:     { className: 'relative w-full h-full object-cover border-[3px] border-white z-10', style: { boxShadow: '0 8px 24px rgba(0,0,0,0.25)' } },
      name:     { className: `${compact ? 'text-base' : 'text-[2rem]'} font-black tracking-tight uppercase` },
      role:     { className: `${compact ? 'text-[10px]' : 'text-base'} font-bold mt-1 opacity-85` },
      bio:      { className: `${compact ? 'text-[9px] mt-1.5' : 'text-sm mt-2'} leading-relaxed font-medium opacity-70 max-w-xs` },
      domainPill: { className: 'hidden', style: {} },
      linksWrap: { className: `w-full flex flex-col ${compact ? 'gap-2' : 'gap-3'}` },
      link: {
        className: `group flex items-center ${compact ? 'px-3 py-3 rounded-2xl' : 'px-5 py-4 rounded-2xl'} border-[2.5px] hover:scale-[1.02] hover:shadow-2xl transition-all duration-200`,
        style: {
          backgroundColor: theme.cardColor,
          borderColor: hexToRgba(accent, 0.45),
          boxShadow: `0 4px 20px ${hexToRgba(accent, 0.12)}`,
        },
      },
      linkIcon:     { className: `${compact ? 'w-9 h-9 rounded-xl' : 'w-11 h-11 rounded-2xl'} flex items-center justify-center shrink-0 border-2`, style: { backgroundColor: hexToRgba(accent, 0.12), borderColor: hexToRgba(accent, 0.3) } },
      linkTitle:    { className: `${compact ? 'text-[11px]' : 'text-base'} font-black` },
      linkSubtitle: { className: `${compact ? 'text-[8px]' : 'text-xs'} font-semibold opacity-60 mt-0.5` },
      linkArrow:    { className: `${compact ? 'w-6 h-6' : 'w-8 h-8'} rounded-full border-2 flex items-center justify-center font-bold shrink-0`, style: { borderColor: accent, color: accent } },
      showGlassOrbs: false,
    };
  }

  /* ─────────────────────────────────────────
     NEO-BRUTALIST
  ───────────────────────────────────────── */
  if (layoutStyle === 'neo') {
    return {
      ...base,
      page: {
        style: base.page.style,
        className: `${base.page.className} ${compact ? 'px-2.5 py-4' : 'px-4 py-10'}`,
      },
      shell:     { className: compact ? 'gap-3' : 'gap-4' },
      hero: {
        className: `w-full ${compact ? 'p-3' : 'p-7'} border-[3px] flex flex-col items-center text-center rounded-none`,
        style: { backgroundColor: theme.cardColor, borderColor: text, boxShadow: compact ? `4px 4px 0 0 ${accent}` : `8px 8px 0 0 ${accent}` },
      },
      heroDecor: false,
      avatarWrap: { className: compact ? 'relative w-[60px] h-[60px] mb-2 overflow-hidden' : 'relative w-[90px] h-[90px] mb-3 overflow-hidden' },
      avatarRing: { className: 'hidden' },
      avatar:     { className: 'relative w-full h-full object-cover border-[3px] z-10', style: { borderColor: text } },
      name:     { className: `${compact ? 'text-sm' : 'text-[1.8rem]'} font-black uppercase tracking-tight` },
      role:     { className: `${compact ? 'text-[9px]' : 'text-sm'} font-bold mt-1 uppercase tracking-widest opacity-75` },
      bio:      { className: `${compact ? 'text-[8px] mt-1' : 'text-sm mt-2'} leading-snug font-medium opacity-65 max-w-xs` },
      domainPill: { className: 'hidden', style: {} },
      linksWrap: { className: `w-full flex flex-col ${compact ? 'gap-2' : 'gap-3'}` },
      link: {
        className: `group flex items-center ${compact ? 'px-3 py-2.5' : 'px-4 py-4'} border-[3px] rounded-none hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform duration-150`,
        style: { backgroundColor: theme.cardColor, borderColor: text, boxShadow: compact ? `3px 3px 0 0 ${accent}` : `5px 5px 0 0 ${accent}` },
      },
      linkIcon:     { className: `${compact ? 'w-8 h-8' : 'w-10 h-10'} flex items-center justify-center shrink-0 border-[2px] rounded-none`, style: { backgroundColor: hexToRgba(accent, 0.15), borderColor: text } },
      linkTitle:    { className: `${compact ? 'text-[10px]' : 'text-sm'} font-black uppercase tracking-wide` },
      linkSubtitle: { className: `${compact ? 'text-[8px]' : 'text-xs'} font-bold opacity-55 mt-0.5 uppercase` },
      linkArrow:    { className: 'font-black text-lg leading-none shrink-0', style: { color: accent } },
      showGlassOrbs: false,
    };
  }

  /* ─────────────────────────────────────────
     CLASSIC (default)
  ───────────────────────────────────────── */
  return {
    ...base,
    page: {
      style: {
        ...base.page.style,
        backgroundImage: isDark
          ? `radial-gradient(ellipse at 50% 0%, ${hexToRgba(accent, 0.18)} 0%, transparent 60%)`
          : `radial-gradient(ellipse at 50% -10%, ${hexToRgba(accent, 0.12)} 0%, rgba(238,242,255,0.5) 45%, transparent 70%)`,
      },
      className: `${base.page.className} ${compact ? 'px-3 py-4' : 'px-5 py-14'}`,
    },
    shell:     { className: compact ? 'gap-3' : 'gap-5' },
    hero: {
      className: `w-full ${compact ? 'rounded-2xl p-4' : 'rounded-3xl p-7'} border flex flex-col items-center text-center`,
      style: {
        backgroundColor: isDark ? 'rgba(24,24,27,0.85)' : 'rgba(255,255,255,0.96)',
        borderColor:      isDark ? 'rgba(255,255,255,0.1)' : 'rgba(226,232,240,0.9)',
        boxShadow:        isDark ? '0 12px 40px rgba(0,0,0,0.4)' : `0 12px 40px ${hexToRgba(accent, 0.07)}`,
        backdropFilter:   'blur(12px)',
      },
    },
    heroDecor: false,
    avatarWrap: {
      className: compact
        ? 'relative w-[66px] h-[66px] mb-3 overflow-hidden'
        : 'relative w-[108px] h-[108px] mb-4 overflow-hidden',
    },
    avatarRing: {
      className: 'absolute -inset-1 rounded-full opacity-30 blur-sm',
      style: { backgroundColor: accent },
    },
    avatar: {
      className: 'relative w-full h-full object-cover z-10',
      style: { boxShadow: `0 0 0 3px ${hexToRgba(accent, 0.25)}` },
    },
    name:     { className: `${compact ? 'text-sm' : 'text-[1.85rem]'} font-extrabold tracking-tight leading-tight` },
    role:     { className: `${compact ? 'text-[11px]' : 'text-sm'} font-medium mt-1` },
    bio:      { className: `${compact ? 'text-[10px] mt-1' : 'text-sm mt-2'} leading-relaxed opacity-70 max-w-xs` },
    domainPill: { className: 'hidden', style: {} },
    linksWrap: { className: `w-full flex flex-col ${compact ? 'gap-2' : 'gap-3'}` },
    link: {
      className: `group flex items-center ${compact ? 'px-3 py-2.5 rounded-full' : 'px-5 py-4 rounded-full'} border hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200`,
      style: {
        backgroundColor: isDark ? 'rgba(24,24,27,0.9)' : 'rgba(255,255,255,0.98)',
        borderColor:      isDark ? 'rgba(255,255,255,0.1)' : 'rgba(226,232,240,0.9)',
        boxShadow:        isDark ? '0 2px 12px rgba(0,0,0,0.25)' : `0 2px 16px ${hexToRgba(accent, 0.06)}`,
      },
    },
    linkIcon:     { className: `${compact ? 'w-8 h-8 rounded-xl' : 'w-10 h-10 rounded-2xl'} flex items-center justify-center shrink-0` },
    linkTitle:    { className: `${compact ? 'text-[11px]' : 'text-[0.9rem]'} font-bold` },
    linkSubtitle: { className: `${compact ? 'text-[9px]' : 'text-xs'} opacity-55 mt-0.5` },
    linkArrow: {
      className: `${compact ? 'w-5 h-5' : 'w-8 h-8'} rounded-full flex items-center justify-center shrink-0 transition-colors duration-200`,
      style: { backgroundColor: hexToRgba(accent, 0.1), color: accent },
    },
    showGlassOrbs: false,
  };
}
