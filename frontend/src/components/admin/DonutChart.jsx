export default function DonutChart({ title, subtitle, segments = [], centerLabel = 'Total' }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div>
        <h3 className="text-sm font-bold text-fg">{title}</h3>
        {subtitle && <p className="text-[11px] text-fg-muted mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4 mt-3">
        <div className="relative shrink-0">
          <svg viewBox="0 0 40 40" className="w-20 h-20">
            <circle cx="20" cy="20" r="15.5" fill="none" strokeWidth="9" className="stroke-surface-muted" />
            <g transform="rotate(-90 20 20)">
              {segments.map((segment) => {
                const fraction = total > 0 ? segment.value / total : 0;
                const dash = fraction * 100;
                return (
                  <circle
                    key={segment.label}
                    cx="20"
                    cy="20"
                    r="15.5"
                    fill="none"
                    strokeWidth="9"
                    pathLength={100}
                    strokeDasharray={`${dash} ${100 - dash}`}
                    className={segment.strokeClass}
                  >
                    <title>{`${segment.label}: ${segment.value}`}</title>
                  </circle>
                );
              })}
            </g>
            <text x="20" y="22" textAnchor="middle" className="fill-fg text-sm font-black tabular-nums">
              {total}
            </text>
          </svg>
          <p className="text-center text-[9px] font-semibold uppercase tracking-wide text-fg-subtle mt-1">
            {centerLabel}
          </p>
        </div>

        <ul className="flex-1 min-w-0 space-y-1.5">
          {segments.map((segment) => {
            const percent = total > 0 ? Math.round((segment.value / total) * 100) : 0;
            return (
              <li key={segment.label} className="flex items-center gap-2 text-xs">
                <span className={`h-2 w-2 rounded-full shrink-0 ${segment.swatchClass}`} />
                <span className="text-fg-muted truncate flex-1">{segment.label}</span>
                <span className="text-fg font-bold tabular-nums">{segment.value}</span>
                <span className="text-fg-subtle tabular-nums w-8 text-right">{percent}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}