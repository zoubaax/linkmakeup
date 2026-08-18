const ACCENT_STYLES = {
  accent: 'border-accent-border bg-accent-subtle text-accent',
  blue: 'border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400',
  violet: 'border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-400',
  amber: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400',
};

export default function AdminStatCard({ label, value, hint, accent = 'accent', icon }) {
  const accentClass = ACCENT_STYLES[accent] || ACCENT_STYLES.accent;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-2xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-fg-subtle">{label}</p>
          <p className="text-3xl font-black text-fg mt-2 tabular-nums">{value}</p>
          {hint && <p className="text-xs text-fg-muted mt-2 leading-relaxed">{hint}</p>}
        </div>
        {icon && (
          <div className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accentClass}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
