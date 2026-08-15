export const LAYOUT_STYLE_IDS = ['classic', 'minimal', 'glass', 'maximal', 'neo'];

export const MOOD_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'soft', label: 'Soft' },
  { id: 'bold', label: 'Bold' },
];

export const THEME_PRESETS = [
  {
    id: 'default',
    name: 'Warm Linen',
    layoutStyle: 'classic',
    mood: 'soft',
    description: 'Cream canvas, terracotta accents',
    isDark: false,
    backgroundColor: '#F7F3EE',
    cardColor: '#FFFFFF',
    accentColor: '#C4622A',
    textColor: '#1C1814',
  },
  {
    id: 'noir',
    name: 'Midnight Classic',
    layoutStyle: 'classic',
    mood: 'dark',
    description: 'Dark cards with violet glow',
    isDark: true,
    backgroundColor: '#09090B',
    cardColor: '#18181B',
    accentColor: '#A78BFA',
    textColor: '#FAFAFA',
  },
  {
    id: 'rose',
    name: 'Blush Classic',
    layoutStyle: 'classic',
    mood: 'soft',
    description: 'Soft pink with rose highlights',
    isDark: false,
    backgroundColor: '#FFF5F7',
    cardColor: '#FFFFFF',
    accentColor: '#DB2777',
    textColor: '#374151',
  },
  {
    id: 'minimal-mono',
    name: 'Mono Editorial',
    layoutStyle: 'minimal',
    mood: 'light',
    description: 'Black & white editorial spacing',
    isDark: false,
    backgroundColor: '#FFFFFF',
    cardColor: '#FFFFFF',
    accentColor: '#111827',
    textColor: '#111827',
  },
  {
    id: 'minimal-sage',
    name: 'Quiet Sage',
    layoutStyle: 'minimal',
    mood: 'soft',
    description: 'Airy greens, calm typography',
    isDark: false,
    backgroundColor: '#F8FAF8',
    cardColor: '#F8FAF8',
    accentColor: '#047857',
    textColor: '#14532D',
  },
  {
    id: 'minimal-ink',
    name: 'Ink & Paper',
    layoutStyle: 'minimal',
    mood: 'dark',
    description: 'Dark mode minimal with silver type',
    isDark: true,
    backgroundColor: '#0C0C0C',
    cardColor: '#0C0C0C',
    accentColor: '#E5E7EB',
    textColor: '#F3F4F6',
  },
  {
    id: 'glass-ocean',
    name: 'Ocean Glass',
    layoutStyle: 'glass',
    mood: 'light',
    description: 'Frosted panels over sky blue',
    isDark: false,
    backgroundColor: '#DBEAFE',
    cardColor: '#FFFFFF',
    accentColor: '#2563EB',
    textColor: '#0F172A',
  },
  {
    id: 'glass-sunset',
    name: 'Sunset Glass',
    layoutStyle: 'glass',
    mood: 'bold',
    description: 'Peach glow with lilac frost',
    isDark: false,
    backgroundColor: '#FCE7F3',
    cardColor: '#FFFFFF',
    accentColor: '#9333EA',
    textColor: '#581C87',
  },
  {
    id: 'glass-noir',
    name: 'Smoke Glass',
    layoutStyle: 'glass',
    mood: 'dark',
    description: 'Smoked glass on charcoal',
    isDark: true,
    backgroundColor: '#0F172A',
    cardColor: '#1E293B',
    accentColor: '#38BDF8',
    textColor: '#F8FAFC',
  },
  {
    id: 'maximal-gold',
    name: 'Gilded Frame',
    layoutStyle: 'maximal',
    mood: 'bold',
    description: 'Heavy borders, golden energy',
    isDark: false,
    backgroundColor: '#FFFBEB',
    cardColor: '#FFFFFF',
    accentColor: '#D97706',
    textColor: '#451A03',
  },
  {
    id: 'maximal-neon',
    name: 'Neon Pulse',
    layoutStyle: 'maximal',
    mood: 'dark',
    description: 'Dark stage with hot pink pop',
    isDark: true,
    backgroundColor: '#0A0118',
    cardColor: '#1A0B2E',
    accentColor: '#F472B6',
    textColor: '#FAF5FF',
  },
  {
    id: 'maximal-coral',
    name: 'Coral Pop',
    layoutStyle: 'maximal',
    mood: 'soft',
    description: 'Playful coral frames & shadows',
    isDark: false,
    backgroundColor: '#FFF1F2',
    cardColor: '#FFFFFF',
    accentColor: '#E11D48',
    textColor: '#881337',
  },
  {
    id: 'neo-indigo',
    name: 'Indigo Block',
    layoutStyle: 'neo',
    mood: 'bold',
    description: 'Hard shadows, indigo punch',
    isDark: false,
    backgroundColor: '#EEF2FF',
    cardColor: '#FFFFFF',
    accentColor: '#4F46E5',
    textColor: '#1E1B4B',
  },
  {
    id: 'neo-lime',
    name: 'Lime Shock',
    layoutStyle: 'neo',
    mood: 'bold',
    description: 'Brutalist blocks with acid lime',
    isDark: false,
    backgroundColor: '#ECFCCB',
    cardColor: '#FFFFFF',
    accentColor: '#65A30D',
    textColor: '#14532D',
  },
  {
    id: 'neo-dark',
    name: 'Dark Block',
    layoutStyle: 'neo',
    mood: 'dark',
    description: 'High-contrast brutal dark mode',
    isDark: true,
    backgroundColor: '#18181B',
    cardColor: '#27272A',
    accentColor: '#FACC15',
    textColor: '#FAFAFA',
  },
];

const LEGACY_PRESET_IDS = {
  zoubaa: 'glass-ocean',
  minimal: 'minimal-mono',
  ocean: 'glass-ocean',
  sage: 'minimal-sage',
  sunset: 'glass-sunset',
  espresso: 'maximal-neon',
};

export const DEFAULT_THEME = THEME_PRESETS[0];

export function resolvePreset(presetId) {
  const normalizedId = LEGACY_PRESET_IDS[presetId] || presetId;
  return THEME_PRESETS.find((preset) => preset.id === normalizedId) || null;
}

export function normalizeThemeConfig(themeConfig) {
  const fallback = {
    preset: DEFAULT_THEME.id,
    layoutStyle: DEFAULT_THEME.layoutStyle,
    backgroundColor: DEFAULT_THEME.backgroundColor,
    cardColor: DEFAULT_THEME.cardColor,
    accentColor: DEFAULT_THEME.accentColor,
    textColor: DEFAULT_THEME.textColor,
    isDark: DEFAULT_THEME.isDark,
  };

  if (!themeConfig) return fallback;

  const preset = themeConfig.preset && themeConfig.preset !== 'custom'
    ? resolvePreset(themeConfig.preset)
    : null;

  const layoutStyle = themeConfig.layoutStyle || preset?.layoutStyle || fallback.layoutStyle;

  if (preset) {
    const normalized = {
      preset: preset.id,
      layoutStyle,
      backgroundColor: themeConfig.backgroundColor || preset.backgroundColor,
      cardColor: themeConfig.cardColor || preset.cardColor,
      accentColor: themeConfig.accentColor || preset.accentColor,
      textColor: themeConfig.textColor || preset.textColor,
    };
    normalized.isDark = preset.isDark ?? isColorDark(normalized.backgroundColor);
    return normalized;
  }

  const normalized = {
    preset: themeConfig.preset || 'custom',
    layoutStyle,
    backgroundColor: themeConfig.backgroundColor || fallback.backgroundColor,
    cardColor: themeConfig.cardColor || fallback.cardColor,
    accentColor: themeConfig.accentColor || fallback.accentColor,
    textColor: themeConfig.textColor || fallback.textColor,
  };
  normalized.isDark = isColorDark(normalized.backgroundColor);
  return normalized;
}

export function isColorDark(hex = '#FFFFFF') {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return false;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) < 140;
}

export function buildThemeConfig(theme) {
  return {
    preset: theme.preset,
    layoutStyle: theme.layoutStyle,
    backgroundColor: theme.backgroundColor,
    cardColor: theme.cardColor,
    accentColor: theme.accentColor,
    textColor: theme.textColor,
  };
}

export function getPresetsForLayout(layoutStyle) {
  return THEME_PRESETS.filter((preset) => preset.layoutStyle === layoutStyle);
}

export function getDefaultPresetForLayout(layoutStyle) {
  return THEME_PRESETS.find((preset) => preset.layoutStyle === layoutStyle) || DEFAULT_THEME;
}
