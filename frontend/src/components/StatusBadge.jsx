const STATUS_STYLES = {
  open: {
    label: 'Open',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  },
  active: {
    label: 'Active',
    dot: 'bg-blue-500',
    badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  },
  scheduled: {
    label: 'Scheduled',
    dot: 'bg-amber-500',
    badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  },
};

export default function StatusBadge({ status }) {
  const config = STATUS_STYLES[status] ?? STATUS_STYLES.open;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${config.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export { STATUS_STYLES };
