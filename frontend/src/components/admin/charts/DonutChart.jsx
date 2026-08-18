const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function DonutChart({ data = [], title, subtitle, centerLabel, centerValue }) {
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

  let offset = 0;
  const segments = data
    .filter((item) => item.value > 0)
    .map((item) => {
      const fraction = total > 0 ? item.value / total : 0;
      const dash = fraction * CIRCUMFERENCE;
      const segment = { ...item, fraction, dash, offset };
      offset += dash;
      return segment;
    });

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-bold text-fg">{title}</h2>
        {subtitle && <p className="text-xs text-fg-muted mt-0.5">{subtitle}</p>}
      </div>

      <div className="px-5 py-5 flex flex-col items-center gap-5">
        {segments.length === 0 ? (
          <p className="text-sm text-fg-muted text-center py-8">No data yet</p>
        ) : (
          <>
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="14" className="stroke-surface-alt" />
                {segments.map((segment, index) => (
                  <circle
                    key={`${segment.label}-${index}`}
                    cx="50"
                    cy="50"
                    r={RADIUS}
                    fill="none"
                    strokeWidth="14"
                    stroke={segment.color}
                    strokeDasharray={`${Math.max(segment.dash - 1, 0.5)} ${CIRCUMFERENCE}`}
                    strokeDashoffset={-segment.offset}
                    className="transition-all duration-300"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-fg tabular-nums">{centerValue ?? total}</span>
                <span className="text-[11px] font-semibold text-fg-muted">{centerLabel || 'total'}</span>
              </div>
            </div>

            <ul className="w-full space-y-2">
              {segments.map((segment) => (
                <li key={`${segment.label}-${segment.dash}`} className="flex items-center justify-between gap-3 text-xs">
                  <span className="inline-flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: segment.color }} />
                    <span className="text-fg truncate">{segment.label}</span>
                  </span>
                  <span className="text-fg-muted tabular-nums shrink-0">
                    {segment.value} · {Math.round(segment.fraction * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}