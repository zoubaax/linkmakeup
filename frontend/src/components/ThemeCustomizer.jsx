import { useState } from 'react';
import ApiService from '../services/api';
import { THEME_PRESETS, DEFAULT_THEME } from '../utils/themePresets';
import { useToast } from '../contexts/ToastContext';

export default function ThemeCustomizer({ profile, onThemeUpdated }) {
  const { success: toastSuccess } = useToast();
  const currentTheme = profile?.themeConfig || DEFAULT_THEME;

  const [activePreset, setActivePreset] = useState(currentTheme.preset || 'default');
  const [backgroundColor, setBackgroundColor] = useState(currentTheme.backgroundColor || DEFAULT_THEME.backgroundColor);
  const [cardColor, setCardColor] = useState(currentTheme.cardColor || DEFAULT_THEME.cardColor);
  const [accentColor, setAccentColor] = useState(currentTheme.accentColor || DEFAULT_THEME.accentColor);
  const [textColor, setTextColor] = useState(currentTheme.textColor || DEFAULT_THEME.textColor);

  const saveThemeConfig = async (newTheme) => {
    try {
      const res = await ApiService.updateProfile({ themeConfig: newTheme });
      if (res.success) {
        toastSuccess('Theme saved');
      }
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  };

  const handleSelectPreset = (preset) => {
    setActivePreset(preset.id);
    setBackgroundColor(preset.backgroundColor);
    setCardColor(preset.cardColor);
    setAccentColor(preset.accentColor);
    setTextColor(preset.textColor);

    const newTheme = {
      preset: preset.id,
      backgroundColor: preset.backgroundColor,
      cardColor: preset.cardColor,
      accentColor: preset.accentColor,
      textColor: preset.textColor,
    };

    onThemeUpdated?.(newTheme);
    saveThemeConfig(newTheme);
  };

  const handleColorChange = (key, value) => {
    setActivePreset('custom');
    let updated = {
      preset: 'custom',
      backgroundColor,
      cardColor,
      accentColor,
      textColor,
      [key]: value,
    };

    if (key === 'backgroundColor') setBackgroundColor(value);
    if (key === 'cardColor') setCardColor(value);
    if (key === 'accentColor') setAccentColor(value);
    if (key === 'textColor') setTextColor(value);

    onThemeUpdated?.(updated);
    saveThemeConfig(updated);
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
        <div>
          <h3 className="text-xl font-bold text-fg">Theme & Colors</h3>
          <p className="text-fg-subtle text-xs mt-0.5">Customize how visitors see your page</p>
        </div>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2.5">
          Theme Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {THEME_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all text-center ${
                  isSelected
                    ? 'border-accent bg-surface-alt ring-2 ring-accent/20 shadow-sm'
                    : 'border-border bg-surface-alt hover:border-accent/50'
                }`}
              >
                <div
                  className="w-full h-9 rounded-xl flex items-center justify-center p-1 border border-black/10 shadow-inner"
                  style={{ backgroundColor: preset.backgroundColor }}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-white/60 shadow-sm"
                    style={{ backgroundColor: preset.accentColor }}
                  />
                </div>
                <span className="text-xs font-bold text-fg truncate w-full">{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold text-fg-muted uppercase tracking-wider">
            Fine-Tune Custom Colors
          </label>
          {activePreset === 'custom' && (
            <span className="text-[10px] bg-accent-subtle text-accent px-2.5 py-0.5 rounded-full font-bold">
              Custom Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Background Color */}
          <div className="p-3 bg-surface-alt border border-border rounded-xl flex flex-col gap-1.5 hover:border-accent/40 transition-colors">
            <span className="text-xs text-fg-subtle font-medium">Canvas Background</span>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent overflow-hidden"
              />
              <span className="font-mono text-xs text-fg font-bold">{backgroundColor.toUpperCase()}</span>
            </div>
          </div>

          {/* Card Color */}
          <div className="p-3 bg-surface-alt border border-border rounded-xl flex flex-col gap-1.5 hover:border-accent/40 transition-colors">
            <span className="text-xs text-fg-subtle font-medium">Link Card Surface</span>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={cardColor}
                onChange={(e) => handleColorChange('cardColor', e.target.value)}
                className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent overflow-hidden"
              />
              <span className="font-mono text-xs text-fg font-bold">{cardColor.toUpperCase()}</span>
            </div>
          </div>

          {/* Accent Color */}
          <div className="p-3 bg-surface-alt border border-border rounded-xl flex flex-col gap-1.5 hover:border-accent/40 transition-colors">
            <span className="text-xs text-fg-subtle font-medium">Brand Accent</span>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent overflow-hidden"
              />
              <span className="font-mono text-xs text-fg font-bold">{accentColor.toUpperCase()}</span>
            </div>
          </div>

          {/* Text Color */}
          <div className="p-3 bg-surface-alt border border-border rounded-xl flex flex-col gap-1.5 hover:border-accent/40 transition-colors">
            <span className="text-xs text-fg-subtle font-medium">Text Color</span>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent overflow-hidden"
              />
              <span className="font-mono text-xs text-fg font-bold">{textColor.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
