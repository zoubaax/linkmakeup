import { useEffect, useRef, useState } from 'react';
import ApiService from '../services/api';
import {
  buildThemeConfig,
  DEFAULT_THEME,
  getPresetsForLayout,
  MOOD_FILTERS,
  normalizeThemeConfig,
  resolvePreset,
} from '../utils/themePresets';
import { LAYOUT_STYLES } from '../utils/themeStyles';
import { useToast } from '../contexts/ToastContext';
import ThemeMiniPreview from './ui/ThemeMiniPreview';

const COLOR_FIELDS = [
  { key: 'backgroundColor', label: 'Background', hint: 'Page canvas' },
  { key: 'cardColor', label: 'Cards', hint: 'Profile & links' },
  { key: 'accentColor', label: 'Accent', hint: 'Buttons & highlights' },
  { key: 'textColor', label: 'Text', hint: 'Headlines & body' },
];

export default function ThemeCustomizer({ profile, onThemeUpdated }) {
  const { success: toastSuccess, error: toastError } = useToast();
  const initialTheme = normalizeThemeConfig(profile?.themeConfig);

  const [theme, setTheme] = useState(initialTheme);
  const [moodFilter, setMoodFilter] = useState('all');
  const [advancedOpen, setAdvancedOpen] = useState(initialTheme.preset === 'custom');
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [palettesOpen, setPalettesOpen] = useState(false);
  const [saveState, setSaveState] = useState('idle');
  const saveTimerRef = useRef(null);

  useEffect(() => {
    setTheme(normalizeThemeConfig(profile?.themeConfig));
  }, [profile?.themeConfig]);

  useEffect(() => () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
  }, []);

  const layoutPresets = getPresetsForLayout(theme.layoutStyle);
  const filteredPresets = (moodFilter === 'all' ? layoutPresets : layoutPresets.filter((p) => p.mood === moodFilter));

  const activeLayout = LAYOUT_STYLES.find((s) => s.id === theme.layoutStyle) || LAYOUT_STYLES[0];
  const activePreset = theme.preset !== 'custom' ? resolvePreset(theme.preset) : null;

  const persistTheme = (nextTheme, { immediate = false, notify = false } = {}) => {
    onThemeUpdated?.(nextTheme);

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    const runSave = async () => {
      setSaveState('saving');
      try {
        const res = await ApiService.updateProfile({ themeConfig: buildThemeConfig(nextTheme) });
        if (!res.success || !res.data?.themeConfig) {
          throw new Error('Failed to save page look.');
        }
        onThemeUpdated?.(normalizeThemeConfig(res.data.themeConfig));
        setSaveState('saved');
        if (notify) toastSuccess('Page look updated');
      } catch (err) {
        setSaveState('error');
        toastError(err.message || 'Failed to save page look.');
      }
    };

    if (immediate) {
      void runSave();
      return;
    }

    setSaveState('pending');
    saveTimerRef.current = setTimeout(runSave, 350);
  };

  const applyTheme = (nextTheme, options) => {
    setTheme(normalizeThemeConfig(nextTheme));
    persistTheme(normalizeThemeConfig(nextTheme), options);
  };

  const handleSelectLayout = (layoutStyle) => {
    const defaultForLayout = getPresetsForLayout(layoutStyle)[0];
    if (!defaultForLayout) return;

    applyTheme(
      {
        preset: defaultForLayout.id,
        layoutStyle,
        backgroundColor: defaultForLayout.backgroundColor,
        cardColor: defaultForLayout.cardColor,
        accentColor: defaultForLayout.accentColor,
        textColor: defaultForLayout.textColor,
      },
      { immediate: true, notify: true }
    );
  };

  const handleSelectPreset = (preset) => {
    applyTheme(
      {
        preset: preset.id,
        layoutStyle: preset.layoutStyle,
        backgroundColor: preset.backgroundColor,
        cardColor: preset.cardColor,
        accentColor: preset.accentColor,
        textColor: preset.textColor,
      },
      { immediate: true, notify: true }
    );
  };

  const handleColorChange = (key, value) => {
    applyTheme({
      ...theme,
      preset: 'custom',
      [key]: value,
    });
  };

  const handleResetColors = () => {
    const resetTarget = activePreset || getPresetsForLayout(theme.layoutStyle)[0] || DEFAULT_THEME;
    handleSelectPreset(resetTarget);
  };

  return (
    <section id="page-look" aria-labelledby="page-look-heading" className="scroll-mt-24 bg-surface border border-border rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 pb-4 mb-5 border-b border-border">
        <div className="min-w-0">
          <h3 id="page-look-heading" className="text-lg sm:text-xl font-bold text-fg">Page Look</h3>
          <p className="text-fg-subtle text-xs mt-0.5 max-w-md">
            Choose a UI type — glass, minimalist, maximalist & more — then pick a palette.
          </p>
        </div>
        <span
          className={`shrink-0 inline-flex text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
            saveState === 'error'
              ? 'border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10'
              : saveState === 'saving' || saveState === 'pending'
                ? 'border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-500/10'
                : 'border-border text-fg-subtle bg-surface-alt'
          }`}
        >
          {saveState === 'saving' || saveState === 'pending' ? 'Saving…' : saveState === 'error' ? 'Save failed' : 'Live preview'}
        </span>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden mb-3">
        <button
          type="button"
          onClick={() => setLayoutOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-surface-alt hover:bg-nav-hover transition-colors text-left"
        >
          <div>
            <span className="text-sm font-bold text-fg block">UI Type</span>
            <span className="text-[11px] text-fg-subtle">
              {activeLayout.name} — {activeLayout.tagline}
            </span>
          </div>
          <svg
            className={`w-4 h-4 text-fg-muted transition-transform shrink-0 ${layoutOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {layoutOpen && (
          <div className="p-4 border-t border-border bg-surface">
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {LAYOUT_STYLES.map((layout) => {
                const isSelected = theme.layoutStyle === layout.id;
                const sample = getPresetsForLayout(layout.id)[0];
                return (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() => handleSelectLayout(layout.id)}
                    className={`flex items-center gap-3 md:flex-col md:items-stretch text-left rounded-2xl border p-2.5 transition-all ${
                      isSelected
                        ? 'border-accent bg-accent-subtle/40 ring-2 ring-accent/25'
                        : 'border-border bg-surface-alt hover:border-accent/40'
                    }`}
                  >
                    <div className="shrink-0 md:w-full">
                      <ThemeMiniPreview
                        theme={{ ...sample, layoutStyle: layout.id }}
                        size="sm"
                        className="md:mb-2 border border-black/5"
                      />
                    </div>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold text-fg">{layout.name}</span>
                      <span className="hidden md:block text-[10px] text-fg-subtle leading-snug mt-0.5">{layout.tagline}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border overflow-hidden mb-3">
        <button
          type="button"
          onClick={() => setPalettesOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-surface-alt hover:bg-nav-hover transition-colors text-left"
        >
          <div>
            <span className="text-sm font-bold text-fg block">Palette</span>
            <span className="text-[11px] text-fg-subtle">
              {activePreset ? activePreset.name : 'Custom'} — {filteredPresets.length} options for {activeLayout.name}
            </span>
          </div>
          <svg
            className={`w-4 h-4 text-fg-muted transition-transform shrink-0 ${palettesOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {palettesOpen && (
          <div className="p-4 border-t border-border bg-surface">
            <div className="flex flex-wrap gap-2 mb-3">
              {MOOD_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setMoodFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    moodFilter === filter.id
                      ? 'bg-primary text-primary-fg'
                      : 'bg-surface-alt border border-border text-fg-muted hover:text-fg hover:bg-nav-hover'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredPresets.map((preset) => {
                const isSelected = theme.preset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`group text-left rounded-2xl border p-3 transition-all ${
                      isSelected
                        ? 'border-accent bg-accent-subtle/40 ring-2 ring-accent/25 shadow-sm'
                        : 'border-border bg-surface-alt hover:border-accent/40 hover:shadow-sm'
                    }`}
                  >
                    <ThemeMiniPreview theme={preset} size="sm" className="mb-3 border border-black/5" />
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-fg truncate">{preset.name}</p>
                        <p className="text-[11px] text-fg-subtle mt-0.5 leading-snug">{preset.description}</p>
                      </div>
                      {isSelected && (
                        <span className="shrink-0 w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <button
          type="button"
          onClick={() => setAdvancedOpen((open) => !open)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-surface-alt hover:bg-nav-hover transition-colors text-left"
        >
          <div>
            <span className="text-sm font-bold text-fg block">Adjust colors</span>
            <span className="text-[11px] text-fg-subtle">Fine-tune palette without changing UI type</span>
          </div>
          <svg
            className={`w-4 h-4 text-fg-muted transition-transform ${advancedOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {advancedOpen && (
          <div className="p-4 border-t border-border bg-surface">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COLOR_FIELDS.map(({ key, label, hint }) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-alt hover:border-accent/40 focus-within:border-accent transition-colors"
                >
                  <input
                    type="color"
                    value={theme[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-10 h-10 rounded-xl border border-border cursor-pointer bg-transparent overflow-hidden shrink-0"
                    title={`Pick ${label} color`}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-bold text-fg block">{label}</span>
                    <span className="text-[11px] text-fg-subtle block mb-1">{hint}</span>
                    
                    {/* Editable Hex Code Input */}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={theme[key]}
                        maxLength={7}
                        spellCheck={false}
                        placeholder="#000000"
                        onChange={(e) => {
                          const val = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                          handleColorChange(key, val);
                        }}
                        onBlur={(e) => {
                          const valid = /^#[0-9A-Fa-f]{6}$/.test(e.target.value);
                          if (!valid) {
                            // Reset back to current valid theme color if invalid hex
                            handleColorChange(key, theme[key]);
                          }
                        }}
                        className="w-full px-2 py-1 rounded-lg bg-surface border border-border text-xs font-mono font-bold text-fg uppercase focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {theme.preset === 'custom' && (
              <button
                type="button"
                onClick={handleResetColors}
                className="mt-3 text-xs font-semibold text-accent hover:opacity-80 transition-opacity"
              >
                Reset palette for {activeLayout.name}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
