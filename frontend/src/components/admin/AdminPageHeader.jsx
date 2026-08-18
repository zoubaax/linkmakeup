export default function AdminPageHeader({
  title,
  subtitle,
  meta,
  actions,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        {title && <h1 className="text-xl font-black text-fg tracking-tight">{title}</h1>}
        {subtitle && <p className="text-sm text-fg-muted mt-1">{subtitle}</p>}
        {meta && <p className="text-xs text-fg-subtle mt-2">{meta}</p>}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
