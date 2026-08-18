import { formatShortDate } from './formatters';

export default function SignupChart({ trend = [] }) {
  const maxCount = Math.max(...trend.map((point) => point.count), 1);

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-fg">Signup trend</h2>
          <p className="text-xs text-fg-muted mt-0.5">New accounts over the last 14 days</p>
        </div>
        <span className="text-xs font-medium text-fg-subtle tabular-nums">
          {trend.reduce((sum, point) => sum + point.count, 0)} total
        </span>
      </div>

      <div className="px-5 py-5">
        {trend.length === 0 ? (
          <p className="text-sm text-fg-muted text-center py-8">No signup data yet</p>
        ) : (
          <div className="flex items-end gap-1.5 h-36">
            {trend.map((point) => {
              const height = Math.max((point.count / maxCount) * 100, point.count > 0 ? 8 : 2);
              return (
                <div key={point.date} className="flex-1 min-w-0 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-semibold text-fg-muted tabular-nums">
                    {point.count > 0 ? point.count : ''}
                  </span>
                  <div className="w-full flex items-end justify-center h-24">
                    <div
                      className="w-full max-w-8 rounded-t-md bg-gradient-to-t from-accent to-accent/60 transition-all"
                      style={{ height: `${height}%` }}
                      title={`${point.date}: ${point.count} signup${point.count === 1 ? '' : 's'}`}
                    />
                  </div>
                  <span className="text-[10px] text-fg-subtle truncate w-full text-center">
                    {formatShortDate(point.date)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
