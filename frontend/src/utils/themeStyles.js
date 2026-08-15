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
        className: 'w-full flex flex-col items-center text-center bg-transparent border-0 shadow-none pb-2',
        style: {},
      },
      avatarWrap: { className: compact ? 'relative w-16 h-16 mb-2.5 p-0.5 rounded-full border border-slate-200/80 dark:border-white/10 shadow-2xs bg-white/80 dark:bg-zinc-800/80' : 'relative w-22 h-22 mb-3.5 p-1 rounded-full border border-slate-200/80 dark:border-white/10 shadow-xs bg-white/80 dark:bg-zinc-800/80' },
      avatarRing: { className: 'hidden' },
      avatar: { className: 'relative w-full h-full rounded-full object-cover shadow-2xs' },
      name: { className: `${compact ? 'text-sm' : 'text-2xl'} font-bold tracking-tight text-slate-900 dark:text-white` },
      role: { className: `${compact ? 'text-[11px]' : 'text-sm'} font-medium mt-1 text-slate-500 dark:text-slate-400` },
      bio: { className: `${compact ? 'text-[10px] mt-1' : 'text-sm mt-1.5'} leading-relaxed text-slate-600 dark:text-slate-300 max-w-xs font-normal` },
      domainPill: {
        className: 'hidden',
        style: {},
      },
      linksWrap: { className: `w-full flex flex-col ${compact ? 'gap-2' : 'gap-3'}` },
      link: {
        className: `group flex items-center justify-between ${compact ? 'px-3 py-2.5 rounded-xl' : 'px-4 py-3.5 rounded-2xl'} border border-slate-200/70 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xs transition-all duration-200`,
        style: {},
      },
      linkIcon: { className: `${compact ? 'w-8 h-8 rounded-xl' : 'w-10 h-10 rounded-xl'} flex items-center justify-center shrink-0` },
      linkTitle: { className: `${compact ? 'text-[11px]' : 'text-sm'} font-bold text-slate-800 dark:text-slate-100` },
      linkSubtitle: { className: `${compact ? 'text-[9px]' : 'text-xs'} text-slate-500 dark:text-slate-400 font-normal mt-0.5` },
      linkArrow: { className: `${compact ? 'w-5 h-5' : 'w-7 h-7'} rounded-full bg-slate-100/80 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 flex items-center justify-center group-hover:bg-slate-200/80 dark:group-hover:bg-zinc-700 transition-colors shrink-0` },
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

  // classic (default - matching clean light-blue reference)
  return {
    ...base,
    page: {
      style: {
        ...base.page.style,
        backgroundImage: isDark
          ? `radial-gradient(ellipse at 50% 0%, ${hexToRgba(accent, 0.15)} 0%, transparent 60%)`
          : `radial-gradient(circle at 50% 0%, rgba(219, 234, 254, 0.65) 0%, rgba(238, 242, 255, 0.35) 55%, transparent 100%)`,
      },
      className: `${base.page.className} ${compact ? 'px-3 py-4' : 'px-4 py-12'}`,
    },
    shell: { className: compact ? 'gap-3' : 'gap-4' },
    hero: {
      className: `w-full ${compact ? 'rounded-2xl p-4' : 'rounded-3xl p-6 sm:p-7'} border flex flex-col items-center text-center backdrop-blur-sm`,
      style: {
        backgroundColor: isDark ? 'rgba(24,24,27,0.85)' : '#FFFFFF',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(226,232,240,0.8)',
        boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.35)' : '0 10px 35px rgba(99,102,241,0.06)',
      },
    },
    avatarWrap: { className: compact ? 'relative w-16 h-16 mb-2.5 p-0.5 rounded-full border border-indigo-100 dark:border-white/10 shadow-xs bg-white' : 'relative w-24 h-24 mb-3.5 p-1 rounded-full border border-indigo-100 dark:border-white/10 shadow-md shadow-indigo-500/10 bg-white' },
    avatarRing: { className: 'absolute -inset-1 rounded-full opacity-25 blur-xs', style: { backgroundColor: accent } },
    avatar: { className: 'relative w-full h-full rounded-full object-cover shadow-xs' },
    name: { className: `${compact ? 'text-sm' : 'text-2xl'} font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-1.5` },
    role: { className: `${compact ? 'text-[11px]' : 'text-sm'} font-medium mt-1 text-slate-500 dark:text-slate-400` },
    bio: { className: `${compact ? 'text-[10px] mt-1' : 'text-sm mt-1.5'} leading-relaxed opacity-75 max-w-xs` },
    domainPill: {
      className: `mt-3 inline-block px-3.5 py-1 rounded-full border border-indigo-100 dark:border-white/10 font-mono font-semibold ${compact ? 'text-[8px]' : 'text-xs'}`,
      style: { backgroundColor: 'rgba(238,242,255,0.6)', color: accent },
    },
    linksWrap: { className: `w-full flex flex-col ${compact ? 'gap-2' : 'gap-3'}` },
    link: {
      className: `group flex items-center justify-between ${compact ? 'px-3 py-2.5 rounded-xl' : 'px-4 py-3.5 rounded-2xl'} border shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`,
      style: {
        backgroundColor: isDark ? 'rgba(24,24,27,0.85)' : '#FFFFFF',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(226,232,240,0.8)',
        boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 18px rgba(99,102,241,0.04)',
      },
    },
    linkIcon: { className: `${compact ? 'w-8 h-8 rounded-xl' : 'w-11 h-11 rounded-2xl'} flex items-center justify-center shrink-0` },
    linkTitle: { className: `${compact ? 'text-[11px]' : 'text-sm'} font-bold text-slate-800 dark:text-slate-100` },
    linkSubtitle: { className: `${compact ? 'text-[9px]' : 'text-xs'} text-slate-500 dark:text-slate-400 font-normal mt-0.5` },
    linkArrow: { className: `${compact ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-slate-500 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-zinc-700 transition-colors shrink-0` },
    showGlassOrbs: false,
  };
}
