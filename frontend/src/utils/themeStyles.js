import { isColorDark } from './themePresets';

export const LAYOUT_STYLES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Soft cards, balanced hierarchy',
    tagline: 'Timeless link-in-bio',
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    description: 'Typography-led, open space',
    tagline: 'Less chrome, more focus',
  },
  {
    id: 'glass',
    name: 'Glass',
    description: 'Frosted layers over color',
    tagline: 'Translucent & modern',
  },
  {
    id: 'maximal',
    name: 'Maximalist',
    description: 'Bold frames, rich detail',
    tagline: 'Expressive & loud',
  },
  {
    id: 'neo',
    name: 'Neo-Brutalist',
    description: 'Hard edges, offset blocks',
    tagline: 'Raw & graphic',
  },
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
  const layoutStyle = theme.layoutStyle || 'classic';
  const isDark = theme.isDark ?? isColorDark(theme.backgroundColor);
  const accent = theme.accentColor;
  const text = theme.textColor;

  const base = {
    layoutStyle,
    isDark,
    page: {
      style: { backgroundColor: theme.backgroundColor, color: text },
      className: 'transition-colors duration-300',
    },
    text: { style: { color: text } },
    accent: { style: { color: accent } },
    accentBg: { style: { backgroundColor: accent } },
  };

  if (layoutStyle === 'minimal') {
    return {
      ...base,
      page: {
        style: base.page.style,
        className: `${base.page.className} ${compact ? 'px-3 py-4' : 'px-4 py-12'}`,
      },
      shell: { className: compact ? 'gap-4' : 'gap-6' },
      hero: {
        className: 'w-full flex flex-col items-center text-center bg-transparent border-0 shadow-none',
        style: {},
      },
      avatarWrap: { className: compact ? 'relative w-14 h-14 mb-2' : 'relative w-20 h-20 mb-3' },
      avatarRing: { className: 'hidden' },
      avatar: {
        className: `relative w-full h-full rounded-full object-cover border ${compact ? 'border' : 'border-2'}`,
        style: { borderColor: hexToRgba(text, 0.15) },
      },
      name: { className: `${compact ? 'text-sm' : 'text-2xl'} font-semibold tracking-tight` },
      role: { className: `${compact ? 'text-[10px]' : 'text-sm'} font-medium mt-0.5 opacity-70` },
      bio: { className: `${compact ? 'text-[9px] mt-1' : 'text-sm mt-1.5'} leading-relaxed opacity-60 max-w-xs` },
      domainPill: {
        className: `mt-3 inline-block font-mono ${compact ? 'text-[8px]' : 'text-xs'} opacity-50`,
        style: { color: accent },
      },
      linksWrap: { className: 'w-full flex flex-col divide-y', style: { borderColor: hexToRgba(text, 0.12) } },
      link: {
        className: `group flex items-center justify-between ${compact ? 'py-2' : 'py-3.5'} transition-opacity hover:opacity-80 bg-transparent border-0 shadow-none rounded-none`,
        style: {},
      },
      linkIcon: { className: `${compact ? 'w-7 h-7 rounded-md' : 'w-9 h-9 rounded-lg'} flex items-center justify-center shrink-0`, style: { backgroundColor: hexToRgba(accent, 0.1) } },
      linkTitle: { className: `${compact ? 'text-[10px]' : 'text-sm'} font-medium` },
      linkSubtitle: { className: `${compact ? 'text-[8px]' : 'text-xs'} opacity-50 mt-0.5` },
      linkArrow: { className: 'opacity-40', style: { color: text } },
      showGlassOrbs: false,
    };
  }

  if (layoutStyle === 'glass') {
    const cardBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.42)';
    const cardBorder = isDark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.65)';
    return {
      ...base,
      page: {
        style: {
          ...base.page.style,
          backgroundImage: `radial-gradient(circle at 15% 10%, ${hexToRgba(accent, 0.28)} 0%, transparent 42%), radial-gradient(circle at 85% 85%, ${hexToRgba(accent, 0.18)} 0%, transparent 38%)`,
        },
        className: `${base.page.className} relative overflow-hidden ${compact ? 'px-3 py-4' : 'px-4 py-12'}`,
      },
      shell: { className: compact ? 'gap-3 relative z-10' : 'gap-4 relative z-10' },
      hero: {
        className: `w-full ${compact ? 'rounded-2xl p-3' : 'rounded-3xl p-6'} border flex flex-col items-center text-center backdrop-blur-xl`,
        style: { backgroundColor: cardBg, borderColor: cardBorder, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.35)' : '0 8px 32px rgba(0,0,0,0.08)' },
      },
      avatarWrap: { className: compact ? 'relative w-14 h-14 mb-2' : 'relative w-24 h-24 mb-3' },
      avatarRing: { className: 'absolute -inset-1 rounded-full opacity-30 blur-sm', style: { backgroundColor: accent } },
      avatar: { className: 'relative w-full h-full rounded-full object-cover border-2 border-white/50 shadow-lg' },
      name: { className: `${compact ? 'text-sm' : 'text-2xl'} font-bold tracking-tight` },
      role: { className: `${compact ? 'text-[10px]' : 'text-sm'} font-semibold mt-0.5 opacity-85` },
      bio: { className: `${compact ? 'text-[9px] mt-1' : 'text-sm mt-1.5'} leading-relaxed opacity-70 max-w-xs` },
      domainPill: {
        className: `mt-3 inline-block px-3 py-1 rounded-full border font-mono font-semibold ${compact ? 'text-[8px]' : 'text-xs'} backdrop-blur-md`,
        style: { backgroundColor: hexToRgba(accent, 0.12), borderColor: hexToRgba(accent, 0.25), color: accent },
      },
      linksWrap: { className: `w-full flex flex-col ${compact ? 'gap-2' : 'gap-3'}` },
      link: {
        className: `group flex items-center justify-between ${compact ? 'px-3 py-2.5 rounded-xl' : 'px-4 py-3.5 rounded-2xl'} border backdrop-blur-xl hover:-translate-y-0.5 transition-all`,
        style: { backgroundColor: cardBg, borderColor: cardBorder },
      },
      linkIcon: { className: `${compact ? 'w-8 h-8 rounded-xl' : 'w-10 h-10 rounded-xl'} flex items-center justify-center shrink-0`, style: { backgroundColor: hexToRgba(accent, 0.15) } },
      linkTitle: { className: `${compact ? 'text-[10px]' : 'text-sm'} font-bold` },
      linkSubtitle: { className: `${compact ? 'text-[8px]' : 'text-xs'} opacity-60 mt-0.5` },
      linkArrow: { className: `${compact ? 'w-5 h-5' : 'w-7 h-7'} rounded-full flex items-center justify-center`, style: { backgroundColor: hexToRgba(accent, 0.12), color: accent } },
      showGlassOrbs: true,
    };
  }

  if (layoutStyle === 'maximal') {
    return {
      ...base,
      page: {
        style: base.page.style,
        className: `${base.page.className} ${compact ? 'px-2.5 py-4' : 'px-4 py-10'}`,
      },
      shell: { className: compact ? 'gap-3' : 'gap-5' },
      hero: {
        className: `w-full ${compact ? 'rounded-2xl p-3' : 'rounded-[2rem] p-7'} border-[3px] flex flex-col items-center text-center shadow-2xl relative overflow-hidden`,
        style: { backgroundColor: theme.cardColor, borderColor: accent, boxShadow: `0 20px 50px ${hexToRgba(accent, 0.25)}` },
      },
      heroDecor: true,
      avatarWrap: { className: compact ? 'relative w-16 h-16 mb-2' : 'relative w-28 h-28 mb-4' },
      avatarRing: { className: 'absolute -inset-2 rounded-full border-[3px] opacity-60', style: { borderColor: accent } },
      avatar: { className: 'relative w-full h-full rounded-full object-cover border-[3px] border-white shadow-xl' },
      name: { className: `${compact ? 'text-base' : 'text-3xl'} font-black tracking-tight uppercase` },
      role: { className: `${compact ? 'text-[10px]' : 'text-base'} font-bold mt-1 opacity-90` },
      bio: { className: `${compact ? 'text-[9px] mt-1.5' : 'text-sm mt-2'} leading-relaxed font-medium opacity-75 max-w-xs` },
      domainPill: {
        className: `mt-3 inline-block px-4 py-1.5 rounded-full border-2 font-mono font-black uppercase tracking-widest ${compact ? 'text-[7px]' : 'text-[10px]'}`,
        style: { backgroundColor: hexToRgba(accent, 0.12), borderColor: accent, color: accent },
      },
      linksWrap: { className: `w-full flex flex-col ${compact ? 'gap-2' : 'gap-3'}` },
      link: {
        className: `group flex items-center justify-between ${compact ? 'px-3 py-3 rounded-xl' : 'px-5 py-4 rounded-2xl'} border-[2.5px] shadow-lg hover:scale-[1.02] transition-transform`,
        style: { backgroundColor: theme.cardColor, borderColor: hexToRgba(accent, 0.35) },
      },
      linkIcon: { className: `${compact ? 'w-9 h-9 rounded-xl' : 'w-11 h-11 rounded-2xl'} flex items-center justify-center shrink-0 border-2`, style: { backgroundColor: hexToRgba(accent, 0.1), borderColor: hexToRgba(accent, 0.25) } },
      linkTitle: { className: `${compact ? 'text-[11px]' : 'text-base'} font-black` },
      linkSubtitle: { className: `${compact ? 'text-[8px]' : 'text-xs'} font-semibold opacity-65 mt-0.5` },
      linkArrow: { className: `${compact ? 'w-6 h-6' : 'w-8 h-8'} rounded-full border-2 flex items-center justify-center font-bold`, style: { borderColor: accent, color: accent } },
      showGlassOrbs: false,
    };
  }

  if (layoutStyle === 'neo') {
    return {
      ...base,
      page: {
        style: base.page.style,
        className: `${base.page.className} ${compact ? 'px-2.5 py-4' : 'px-4 py-10'}`,
      },
      shell: { className: compact ? 'gap-3' : 'gap-4' },
      hero: {
        className: `w-full ${compact ? 'p-3' : 'p-6'} border-2 flex flex-col items-center text-center rounded-none`,
        style: { backgroundColor: theme.cardColor, borderColor: text, boxShadow: compact ? `3px 3px 0 0 ${accent}` : `6px 6px 0 0 ${accent}` },
      },
      avatarWrap: { className: compact ? 'relative w-14 h-14 mb-2' : 'relative w-20 h-20 mb-3' },
      avatarRing: { className: 'hidden' },
      avatar: { className: 'relative w-full h-full rounded-none object-cover border-2', style: { borderColor: text } },
      name: { className: `${compact ? 'text-sm' : 'text-2xl'} font-black uppercase tracking-tight` },
      role: { className: `${compact ? 'text-[9px]' : 'text-sm'} font-bold mt-1 uppercase tracking-wide opacity-80` },
      bio: { className: `${compact ? 'text-[8px] mt-1' : 'text-sm mt-1.5'} leading-snug font-medium opacity-70 max-w-xs` },
      domainPill: {
        className: `mt-3 inline-block px-2.5 py-1 border-2 font-mono font-bold uppercase ${compact ? 'text-[7px]' : 'text-[10px]'}`,
        style: { backgroundColor: accent, borderColor: text, color: isDark ? text : '#fff' },
      },
      linksWrap: { className: `w-full flex flex-col ${compact ? 'gap-2' : 'gap-3'}` },
      link: {
        className: `group flex items-center justify-between ${compact ? 'px-3 py-2.5' : 'px-4 py-3.5'} border-2 rounded-none hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform`,
        style: { backgroundColor: theme.cardColor, borderColor: text, boxShadow: compact ? `2px 2px 0 0 ${accent}` : `4px 4px 0 0 ${accent}` },
      },
      linkIcon: { className: `${compact ? 'w-8 h-8' : 'w-10 h-10'} flex items-center justify-center shrink-0 border-2 rounded-none`, style: { backgroundColor: hexToRgba(accent, 0.15), borderColor: text } },
      linkTitle: { className: `${compact ? 'text-[10px]' : 'text-sm'} font-black uppercase tracking-wide` },
      linkSubtitle: { className: `${compact ? 'text-[8px]' : 'text-xs'} font-bold opacity-60 mt-0.5 uppercase` },
      linkArrow: { className: 'font-black text-lg leading-none', style: { color: accent } },
      showGlassOrbs: false,
    };
  }

  // classic (default)
  return {
    ...base,
    page: {
      style: base.page.style,
      className: `${base.page.className} ${compact ? 'px-3 py-4' : 'px-4 py-12'}`,
    },
    shell: { className: compact ? 'gap-3' : 'gap-4' },
    hero: {
      className: `w-full ${compact ? 'rounded-2xl p-4' : 'rounded-3xl p-6'} border shadow-md flex flex-col items-center text-center`,
      style: { backgroundColor: theme.cardColor, borderColor: 'rgba(0,0,0,0.06)' },
    },
    avatarWrap: { className: compact ? 'relative w-16 h-16 mb-2' : 'relative w-24 h-24 mb-3' },
    avatarRing: { className: 'absolute -inset-1 rounded-full opacity-20', style: { backgroundColor: accent } },
    avatar: { className: 'relative w-full h-full rounded-full object-cover border-2 border-white bg-slate-100 shadow-md' },
    name: { className: `${compact ? 'text-sm' : 'text-2xl'} font-bold tracking-tight` },
    role: { className: `${compact ? 'text-[11px]' : 'text-sm'} font-semibold mt-0.5 opacity-85` },
    bio: { className: `${compact ? 'text-[10px] mt-1' : 'text-sm mt-1.5'} leading-relaxed opacity-70 max-w-xs` },
    domainPill: {
      className: `mt-3.5 inline-block px-3.5 py-1 rounded-full border border-black/10 font-mono font-semibold ${compact ? 'text-[8px]' : 'text-xs'}`,
      style: { backgroundColor: 'rgba(0,0,0,0.03)', color: accent },
    },
    linksWrap: { className: `w-full flex flex-col ${compact ? 'gap-2' : 'gap-3'}` },
    link: {
      className: `group flex items-center justify-between ${compact ? 'px-3 py-2.5 rounded-2xl' : 'px-4 py-3.5 rounded-2xl'} border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`,
      style: { backgroundColor: theme.cardColor, borderColor: 'rgba(0,0,0,0.06)' },
    },
    linkIcon: { className: `${compact ? 'w-8 h-8 rounded-xl' : 'w-10 h-10 rounded-xl'} flex items-center justify-center shrink-0` },
    linkTitle: { className: `${compact ? 'text-[11px]' : 'text-sm'} font-bold` },
    linkSubtitle: { className: `${compact ? 'text-[9px]' : 'text-xs'} opacity-60 mt-0.5` },
    linkArrow: { className: `${compact ? 'w-5 h-5' : 'w-7 h-7'} rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors`, style: { color: accent } },
    showGlassOrbs: false,
  };
}
