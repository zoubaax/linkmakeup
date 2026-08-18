export default function AdminEmptyState({
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  icon,
}) {
  return (
    <div className="px-5 py-14 text-center">
      {icon && (
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface-alt text-fg-muted">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-fg">{title}</p>
      {description && <p className="text-sm text-fg-muted mt-1 max-w-sm mx-auto">{description}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
