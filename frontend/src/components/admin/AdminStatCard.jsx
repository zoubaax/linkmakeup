export default function AdminStatCard({ label, value, hint, icon, accent = 'accent' }) {
  const accentClasses = {
    accent: 'from-accent/15 to-accent/5 text-accent',
    blue: 'from-blue-500/15 to-blue-500/5 text-blue-600 dark:text-blue-400',
    amber: 'from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400',
    violet: 'from-violet-500/15 to-violet-500/5 text-violet-600 dark:text-violet-400',
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-2xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold text-fg tabular-nums">{value}</p>
          {hint && <p className="mt-1.5 text-xs text-fg-subtle">{hint}</p>}
        </div>
        {icon && (
          <div className={`shrink-0 rounded-xl bg-gradient-to-br p-2.5 ${accentClasses[accent] || accentClasses.accent}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
