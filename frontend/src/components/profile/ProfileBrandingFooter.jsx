import { getCopyrightLine, getMarketingSiteUrl } from '../../utils/pageExport';

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
      className={`mt-6 flex flex-col items-center gap-1.5 z-30 relative ${className}`}
    >
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
