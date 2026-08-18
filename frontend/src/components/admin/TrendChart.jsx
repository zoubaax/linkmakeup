import { formatShortDate } from './formatters';

const W = 600;
const H = 210;
const PAD_TOP = 14;
const PAD_RIGHT = 12;
const PAD_BOTTOM = 26;
const PAD_LEFT = 36;

function DeltaChip({ delta }) {
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
      {`${Math.round(delta)}%`}
    </span>
  );
}

export default function TrendChart({ title, subtitle, series = [], delta, deltaLabel, emptyMessage = 'No activity recorded yet.' }) {
  const hasData = series.length > 0 && series[0].data.length > 0;
  const pointCount = hasData ? series[0].data.length : 0;
  const max = hasData ? Math.max(...series.flatMap((entry) => entry.data.map((point) => point.count)), 1) : 1;
  const plotW = W - PAD_LEFT - PAD_RIGHT;
  const plotH = H - PAD_TOP - PAD_BOTTOM;
  const baseY = PAD_TOP + plotH;

  const getX = (index) => {
    if (pointCount <= 1) return PAD_LEFT + plotW / 2;
    return PAD_LEFT + (index / (pointCount - 1)) * plotW;
  };
  const getY = (value) => PAD_TOP + (1 - value / max) * plotH;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => ({
    y: getY(max * fraction),
    label: Math.round(max * fraction),
  }));

  const labelIndexes = [];
  if (pointCount > 0) {
    const step = Math.ceil(pointCount / 7);
    for (let i = 0; i < pointCount; i += step) labelIndexes.push(i);
    if (labelIndexes[labelIndexes.length - 1] !== pointCount - 1) {
      labelIndexes.push(pointCount - 1);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-fg">{title}</h2>
          {subtitle && <p className="text-xs text-fg-muted mt-0.5">{subtitle}</p>}
        </div>
        {delta !== undefined && delta !== null && (
          <span className="inline-flex items-center gap-1.5">
            <DeltaChip delta={delta} />
            {deltaLabel && <span className="text-[10px] text-fg-subtle">{deltaLabel}</span>}
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {!hasData ? (
          <p className="text-sm text-fg-muted text-center py-10">{emptyMessage}</p>
        ) : (
          <>
            <div className="flex-1 min-h-0">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full max-h-56" role="img" aria-label={title}>
                {ticks.map((tick) => (
                  <g key={tick.label}>
                    <line
                      x1={PAD_LEFT}
                      x2={W - PAD_RIGHT}
                      y1={tick.y}
                      y2={tick.y}
                      className="stroke-border/70"
                      strokeWidth="1"
                    />
                    <text
                      x={PAD_LEFT - 8}
                      y={tick.y + 3}
                      textAnchor="end"
                      className="fill-fg-subtle text-[9px] font-medium tabular-nums"
                    >
                      {tick.label}
                    </text>
                  </g>
                ))}

                {labelIndexes.map((index) => (
                  <text
                    key={index}
                    x={getX(index)}
                    y={baseY + 16}
                    textAnchor="middle"
                    className="fill-fg-subtle text-[9px] font-medium"
                  >
                    {formatShortDate(series[0].data[index].date)}
                  </text>
                ))}

                {series.map((entry) => {
                  const points = entry.data.map((point, index) => ({
                    x: getX(index),
                    y: getY(point.count),
                    count: point.count,
                    date: point.date,
                  }));

                  const line = points
                    .map((p, index) => `${index === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                    .join(' ');
                  const area = `${line} L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`;

                  return (
                    <g key={entry.key} className={entry.colorClass}>
                      <path d={area} fill="currentColor" fillOpacity="0.09" stroke="none" />
                      <path d={line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                      {points.map((point) => (
                        <circle
                          key={point.date}
                          cx={point.x}
                          cy={point.y}
                          r="3"
                          fill="currentColor"
                          stroke="var(--color-surface)"
                          strokeWidth="1.5"
                        >
                          <title>{`${entry.label} · ${point.date}: ${point.count}`}</title>
                        </circle>
                      ))}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 pt-3 border-t border-border/70">
              {series.map((entry) => {
                const total = entry.data.reduce((sum, point) => sum + point.count, 0);
                return (
                  <span key={entry.key} className="inline-flex items-center gap-2 text-[11px] font-medium text-fg-muted">
                    <span className={`h-2 w-2 rounded-sm ${entry.swatchClass}`} />
                    <span className="text-fg">{total}</span>
                    {entry.label}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}