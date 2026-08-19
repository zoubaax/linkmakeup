import { formatShortDate } from '../formatters';

export default function TrendChart({
  trend = [],
  series = [],
  title = 'Trend',
  subtitle,
  footerLabel,
}) {
  const maxValue = Math.max(
    ...trend.flatMap((point) => series.map((s) => point[s.key] ?? 0)),
    1,
  );

  const labelStep = Math.max(1, Math.ceil(trend.length / 12));

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-fg">{title}</h2>
          {subtitle && <p className="text-xs text-fg-muted mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {series.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-fg-muted">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
          {footerLabel && (
            <span className="text-xs font-medium text-fg-subtle tabular-nums">{footerLabel}</span>
          )}
        </div>
      </div>

      <div className="px-5 py-5 overflow-x-auto custom-scrollbar">
        {trend.length === 0 ? (
          <p className="text-sm text-fg-muted text-center py-8">No data yet</p>
        ) : (
          <div className="flex items-end gap-1.5 h-40 min-w-[340px]">
            {trend.map((point, index) => (
              <div key={point.date} className="flex-1 min-w-[12px] sm:min-w-0 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end h-32 gap-0.5">
                  {series.map((s) => {
                    const value = point[s.key] ?? 0;
                    const heightPct = Math.max((value / maxValue) * 100, value > 0 ? 6 : 1);
                    return (
                      <div
                        key={s.key}
                        className="w-full max-w-8 rounded-sm transition-all"
                        style={{ height: `${heightPct}%`, backgroundColor: s.color }}
                        title={`${point.date} · ${s.label}: ${value}`}
                      />
                    );
                  })}
                </div>
                <span
                  className={`text-[10px] text-fg-subtle truncate w-full text-center ${
                    index % labelStep !== 0 && index !== trend.length - 1 ? 'invisible' : ''
                  }`}
                >
                  {formatShortDate(point.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}