const ACCENT_STYLES = {
  accent: 'border-accent-border bg-accent-subtle text-accent',
  blue: 'border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400',
  violet: 'border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-400',
  amber: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400',
};

<<<<<<< Updated upstream
function formatDelta(delta) {
  const rounded = Math.round(delta);
  return `${rounded > 0 ? '+' : ''}${rounded}%`;
}

function DeltaBadge({ delta }) {
  if (delta === null || delta === undefined || Number.isNaN(delta)) return null;

  const positive = delta >= 0;
  return (
    <span
      className={[
        'inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10px] font-bold tabular-nums',
        positive
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          : 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
      ].join(' ')}
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        {positive ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        )}
      </svg>
      {formatDelta(delta)}
    </span>
  );
}

function Sparkline({ values, accentClass }) {
  if (!values || values.length < 2) return null;
  const max = Math.max(...values, 1);

  return (
    <div className="flex items-end gap-0.5 h-8 mt-3">
      {values.map((value, index) => {
        const height = value === 0 ? 6 : Math.max((value / max) * 100, 12);
        return (
          <div
            key={index}
            className={`w-full rounded-t-sm ${accentClass}`}
            style={{ height: `${height}%` }}
            title={String(value)}
          />
        );
      })}
    </div>
  );
}

export default function AdminStatCard({
  label,
  value,
  hint,
  accent = 'accent',
  icon,
  delta,
  deltaLabel = 'vs last week',
  sparkline,
}) {
=======
const DELTA_STYLES = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-red-600 dark:text-red-400',
  flat: 'text-fg-subtle',
};

export default function AdminStatCard({ label, value, hint, accent = 'accent', icon, delta }) {
>>>>>>> Stashed changes
  const accentClass = ACCENT_STYLES[accent] || ACCENT_STYLES.accent;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-2xs flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-fg-subtle">{label}</p>
<<<<<<< Updated upstream
          <div className="flex items-center gap-2 mt-2">
            <p className="text-3xl font-black text-fg tabular-nums">{value}</p>
            {delta !== undefined && <DeltaBadge delta={delta} />}
          </div>
          <p className="text-xs text-fg-muted mt-2 leading-relaxed">
            {hint}
            {delta !== undefined && deltaLabel && (
              <span className="text-fg-subtle"> · {deltaLabel}</span>
            )}
          </p>
=======
          <p className="text-3xl font-black text-fg mt-2 tabular-nums">{value}</p>
          {delta && (
            <p className={`text-xs font-semibold mt-1.5 tabular-nums ${DELTA_STYLES[delta.direction] || DELTA_STYLES.flat}`}>
              {delta.direction === 'up' && '▲ '}
              {delta.direction === 'down' && '▼ '}
              {delta.direction === 'flat' && '— '}
              {delta.change > 0 ? `+${delta.change}` : delta.change}
              {delta.label && <span className="text-fg-subtle font-medium"> {delta.label}</span>}
            </p>
          )}
          {hint && <p className="text-xs text-fg-muted mt-2 leading-relaxed">{hint}</p>}
>>>>>>> Stashed changes
        </div>
        {icon && (
          <div className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accentClass}`}>
            {icon}
          </div>
        )}
      </div>
      {sparkline && <Sparkline values={sparkline} accentClass={accentClass} />}
    </div>
  );
}
