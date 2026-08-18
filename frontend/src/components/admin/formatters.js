export function formatDateTime(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatShortDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export function formatNumber(value) {
  return new Intl.NumberFormat().format(value ?? 0);
}

export function truncateText(value, maxLength = 48) {
  if (!value) return '—';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}
