import { getCopyrightLine, getMarketingDomain, getMarketingSiteUrl } from '../../utils/pageExport';
import logoIcon from '../../assets/logo-icon.svg';

export default function ProfileBrandingFooter({
  compact = false,
  className = '',
  style,
  linkTarget = '_top',
}) {
  const marketingUrl = getMarketingSiteUrl();
  const domain = getMarketingDomain();
  const copyrightLine = getCopyrightLine();

  const brandLinkClassName = [
    'inline-flex items-center justify-center',
    'rounded-md transition-all duration-200',
    'hover:text-emerald-600 hover:scale-[1.03] active:scale-[0.98]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40',
  ].join(' ');

  return (
    <div
      style={style}
      className={`mt-6 flex flex-col items-center gap-1.5 z-30 relative ${className}`}
    >
      <div
        className={[
          'inline-flex items-center gap-2 rounded-full border',
          'border-current/10 bg-current/[0.04] backdrop-blur-sm',
          'shadow-[0_1px_8px_rgba(0,0,0,0.04)]',
          'transition-all duration-300 hover:border-current/15 hover:bg-current/[0.06]',
          'opacity-70 hover:opacity-100',
          compact ? 'px-2.5 py-1 gap-1.5' : 'px-3.5 py-1.5 gap-2',
        ].join(' ')}
      >
        <span
          className={[
            'font-medium uppercase tracking-[0.14em] opacity-45 select-none',
            compact ? 'text-[7px]' : 'text-[9px]',
          ].join(' ')}
        >
          Powered by
        </span>

        <span
          aria-hidden="true"
          className={[
            'rounded-full bg-current/15 shrink-0',
            compact ? 'h-2.5 w-px' : 'h-3 w-px',
          ].join(' ')}
        />

        <a
          href={marketingUrl}
          target={linkTarget}
          rel="noopener noreferrer"
          className={brandLinkClassName}
          title="Create your own bio link page on LinkMakeup"
        >
          <img
            src={logoIcon}
            alt="LinkMakeup"
            className={[
              'object-contain drop-shadow-sm',
              compact ? 'h-3 w-3' : 'h-3.5 w-3.5',
            ].join(' ')}
          />
        </a>

        <a
          href={marketingUrl}
          target={linkTarget}
          rel="noopener noreferrer"
          className={[
            brandLinkClassName,
            'font-semibold tracking-tight',
            compact ? 'text-[9px]' : 'text-[11px]',
          ].join(' ')}
          title="Create your own bio link page on LinkMakeup"
        >
          {domain}
        </a>
      </div>

      <p
        className={[
          'text-center font-medium opacity-40 select-none tracking-wide',
          compact ? 'text-[7px]' : 'text-[9px]',
        ].join(' ')}
      >
        {copyrightLine}
      </p>
    </div>
  );
}
