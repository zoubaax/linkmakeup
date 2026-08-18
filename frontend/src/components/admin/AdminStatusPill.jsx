const STATUS_STYLES = {
  live: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  active: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  suspended: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
  hidden: 'border-border bg-surface-alt text-fg-muted',
  awaiting: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  awaiting_profile: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
};

const STATUS_LABELS = {
  live: 'Live',
  active: 'Active',
  suspended: 'Suspended',
  hidden: 'Hidden',
  awaiting: 'Awaiting setup',
  awaiting_profile: 'Awaiting setup',
};

export default function AdminStatusPill({ status, label, className = '' }) {
  const key = status || 'live';
  const styles = STATUS_STYLES[key] || STATUS_STYLES.live;
  const text = label || STATUS_LABELS[key] || key;

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${styles} ${className}`}>
      {text}
    </span>
  );
}
