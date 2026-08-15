import { getThemeVisuals } from '../../utils/themeStyles';
import { normalizeThemeConfig } from '../../utils/themePresets';

export default function ThemeMiniPreview({
  theme: themeInput,
  displayName = 'Your Name',
  avatarUrl = '',
  size = 'sm',
  className = '',
}) {
  const theme = normalizeThemeConfig(themeInput);
  const isLarge = size === 'md';
  const visuals = getThemeVisuals(theme, { compact: true });
  const layoutStyle = theme.layoutStyle || 'classic';

  const block = (extraClass = '') => (
    <div
      className={`overflow-hidden ${isLarge ? 'rounded-2xl' : 'rounded-xl'} ${className} relative`}
      style={visuals.page.style}
    >
      {visuals.showGlassOrbs && (
        <div
          className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-40 pointer-events-none"
          style={{ backgroundColor: theme.accentColor }}
        />
      )}
      <div className={`relative z-10 flex flex-col items-center ${isLarge ? 'p-4 gap-3' : 'p-2.5 gap-2'}`}>
        {renderLayout(layoutStyle, theme, visuals, isLarge, displayName, avatarUrl)}
      </div>
    </div>
  );

  return block();
}

function Avatar({ className, style, avatarUrl, alt = '' }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={alt}
        className={`${className} object-cover`}
        style={style}
      />
    );
  }
  return <div className={className} style={style} />;
}

function Name({ displayName, isLarge, style }) {
  if (!isLarge) return null;
  return (
    <span className="text-[10px] font-semibold tracking-wide uppercase" style={style}>
      {displayName}
    </span>
  );
}

function renderLayout(layoutStyle, theme, visuals, isLarge, displayName, avatarUrl) {
  const avatarSize = isLarge ? 'w-10 h-10' : 'w-6 h-6';
  const bar = (w, h, opacity = 0.8) => (
    <div
      className={`${h} rounded-full mx-auto`}
      style={{ backgroundColor: theme.textColor, opacity, width: w }}
    />
  );

  if (layoutStyle === 'minimal') {
    return (
      <>
        <Avatar
          avatarUrl={avatarUrl}
          alt={displayName}
          className={`${avatarSize} rounded-full border`}
          style={{ borderColor: `${theme.textColor}22`, backgroundColor: theme.accentColor }}
        />
        {bar(isLarge ? '4rem' : '2.5rem', isLarge ? 'h-2.5' : 'h-1.5')}
        {bar(isLarge ? '5rem' : '3rem', isLarge ? 'h-1.5' : 'h-1', 0.35)}
        <Name displayName={displayName} isLarge={isLarge} style={{ color: theme.accentColor }} />
        <div className="w-full mt-1 divide-y" style={{ borderColor: `${theme.textColor}18` }}>
          {[0, 1].map((i) => (
            <div key={i} className={`flex items-center gap-2 ${isLarge ? 'py-2' : 'py-1.5'}`}>
              <div className={`${isLarge ? 'w-7 h-7' : 'w-4 h-4'} rounded-md`} style={{ backgroundColor: `${theme.accentColor}22` }} />
              <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: theme.textColor, opacity: 0.55 }} />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (layoutStyle === 'glass') {
    return (
      <>
        <div
          className={`w-full ${isLarge ? 'rounded-2xl p-3' : 'rounded-lg p-2'} border backdrop-blur-md`}
          style={visuals.hero.style}
        >
          <Avatar
            avatarUrl={avatarUrl}
            alt={displayName}
            className={`${avatarSize} rounded-full mx-auto mb-2 border border-white/40`}
            style={{ backgroundColor: theme.accentColor }}
          />
          {bar(isLarge ? '4rem' : '2.5rem', isLarge ? 'h-2' : 'h-1.5')}
        </div>
        <div className={`w-full ${isLarge ? 'rounded-xl p-2.5' : 'rounded-lg p-1.5'} border backdrop-blur-md`} style={visuals.link.style}>
          <div className="flex items-center gap-2">
            <div className={`${isLarge ? 'w-7 h-7' : 'w-4 h-4'} rounded-lg`} style={{ backgroundColor: `${theme.accentColor}25` }} />
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: theme.textColor, opacity: 0.65 }} />
          </div>
        </div>
        <Name displayName={displayName} isLarge={isLarge} style={{ color: theme.accentColor }} />
      </>
    );
  }

  if (layoutStyle === 'maximal') {
    return (
      <>
        <div
          className={`w-full ${isLarge ? 'rounded-2xl p-3' : 'rounded-xl p-2'} border-[2.5px] shadow-lg`}
          style={{ ...visuals.hero.style, boxShadow: `0 8px 24px ${theme.accentColor}33` }}
        >
          <Avatar
            avatarUrl={avatarUrl}
            alt={displayName}
            className={`${isLarge ? 'w-11 h-11' : 'w-7 h-7'} rounded-full mx-auto mb-2 border-[2.5px]`}
            style={{ borderColor: theme.accentColor, backgroundColor: theme.accentColor }}
          />
          {bar(isLarge ? '4.5rem' : '2.75rem', isLarge ? 'h-3' : 'h-2', 0.9)}
        </div>
        <div className={`w-full ${isLarge ? 'rounded-xl p-2.5' : 'rounded-lg p-2'} border-[2px] shadow-md`} style={visuals.link.style}>
          <div className="flex items-center gap-2">
            <div className={`${isLarge ? 'w-8 h-8' : 'w-5 h-5'} rounded-xl border-2`} style={{ borderColor: `${theme.accentColor}44`, backgroundColor: `${theme.accentColor}15` }} />
            <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: theme.textColor, opacity: 0.75 }} />
          </div>
        </div>
        <Name displayName={displayName} isLarge={isLarge} style={{ color: theme.accentColor }} />
      </>
    );
  }

  if (layoutStyle === 'neo') {
    return (
      <>
        <div
          className={`w-full ${isLarge ? 'p-3' : 'p-2'} border-2 rounded-none`}
          style={{ ...visuals.hero.style, boxShadow: isLarge ? `4px 4px 0 0 ${theme.accentColor}` : `2px 2px 0 0 ${theme.accentColor}` }}
        >
          <Avatar
            avatarUrl={avatarUrl}
            alt={displayName}
            className={`${avatarSize} rounded-none mx-auto mb-2 border-2`}
            style={{ borderColor: theme.textColor, backgroundColor: theme.accentColor }}
          />
          {bar(isLarge ? '4rem' : '2.5rem', isLarge ? 'h-2.5' : 'h-1.5')}
        </div>
        <div
          className={`w-full ${isLarge ? 'p-2.5' : 'p-1.5'} border-2 rounded-none`}
          style={{ ...visuals.link.style, boxShadow: isLarge ? `3px 3px 0 0 ${theme.accentColor}` : `2px 2px 0 0 ${theme.accentColor}` }}
        >
          <div className="flex items-center gap-2">
            <div className={`${isLarge ? 'w-7 h-7' : 'w-4 h-4'} border-2 rounded-none`} style={{ borderColor: theme.textColor, backgroundColor: `${theme.accentColor}22` }} />
            <div className="flex-1 h-1.5 rounded-none" style={{ backgroundColor: theme.textColor, opacity: 0.7 }} />
          </div>
        </div>
        <Name displayName={displayName} isLarge={isLarge} style={{ color: theme.accentColor }} />
      </>
    );
  }

  // classic
  return (
    <>
      <div className={`w-full ${isLarge ? 'rounded-xl p-3' : 'rounded-lg p-2'} border shadow-sm`} style={visuals.hero.style}>
        <Avatar
          avatarUrl={avatarUrl}
          alt={displayName}
          className={`${avatarSize} rounded-full mx-auto mb-2 border-2 border-white/70`}
          style={{ backgroundColor: theme.accentColor }}
        />
        {bar(isLarge ? '4rem' : '2.5rem', isLarge ? 'h-2.5' : 'h-1.5')}
      </div>
      {[0, 1].map((i) => (
        <div key={i} className={`w-full ${isLarge ? 'rounded-xl p-2.5' : 'rounded-lg p-1.5'} border shadow-sm`} style={visuals.link.style}>
          <div className="flex items-center gap-2">
            <div className={`${isLarge ? 'w-7 h-7' : 'w-4 h-4'} rounded-md`} style={{ backgroundColor: `${theme.accentColor}22` }} />
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: theme.textColor, opacity: 0.65 }} />
          </div>
        </div>
      ))}
      <Name displayName={displayName} isLarge={isLarge} style={{ color: theme.accentColor }} />
    </>
  );
}
