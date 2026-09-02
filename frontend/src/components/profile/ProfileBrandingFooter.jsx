import { getCopyrightLine, getMarketingSiteUrl } from '../../utils/pageExport';
import logoIcon from '../../assets/logo-icon.svg';

export default function ProfileBrandingFooter({
  compact = false,
  className = '',
  style,
  linkTarget = '_blank',
}) {
  const copyrightLine = getCopyrightLine();
  const marketingUrl = getMarketingSiteUrl();

  return (
    <div
      style={style}
      className={`mt-8 flex flex-col items-center gap-2 z-30 relative ${className}`}
    >
      {/* Powered by — clickable to marketing site, logo-icon.svg */}
      <a
        href={marketingUrl}
        target={linkTarget}
        rel="noopener noreferrer"
        aria-label="Powered by LinkMakeup — visit linkmakeup.com"
        className={[
          'inline-flex items-center gap-2 rounded-full border transition-all cursor-pointer',
          'hover:opacity-100 hover:shadow-sm hover:scale-[1.02] active:scale-[0.99]',
          compact ? 'px-2.5 py-1 gap-1.5' : 'px-3.5 py-1.5 gap-2',
        ].join(' ')}
        style={{
          borderColor: 'color-mix(in srgb, currentColor 14%, transparent)',
          backgroundColor: 'color-mix(in srgb, currentColor 6%, transparent)',
          opacity: 0.85,
        }}
      >
        <span className={['font-medium tracking-[0.14em] uppercase opacity-60', compact ? 'text-[8px]' : 'text-[9px]'].join(' ')}>Powered by</span>
        <span className="w-px h-3 rounded-full shrink-0" style={{ backgroundColor: 'color-mix(in srgb, currentColor 18%, transparent)' }} aria-hidden="true" />
        <img src={logoIcon} alt="LinkMakeup" width={14} height={14} className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} style={{ display: 'block' }} />
        <span className={compact ? 'text-[10px] font-semibold tracking-tight' : 'text-[11px] font-semibold tracking-tight'}>linkmakeup.com</span>
      </a>

      <a
        href={marketingUrl}
        target={linkTarget}
        rel="noopener noreferrer"
        className={[
          'text-center font-medium opacity-40 hover:opacity-100 transition-opacity tracking-wide hover:underline cursor-pointer',
          compact ? 'text-[7px]' : 'text-[9px]',
        ].join(' ')}
      >
        {copyrightLine}
      </a>
    </div>
  );
}
