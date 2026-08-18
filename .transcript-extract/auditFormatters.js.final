import { formatDateTime } from './formatters';

const ACTION_LABELS = {
  'link.toggle': 'Link visibility changed',
  'link.delete': 'Link deleted',
  'profile.suspend': 'Profile suspended',
  'profile.unsuspend': 'Profile restored',
};

export function formatAuditAction(action) {
  return ACTION_LABELS[action] || action;
}

export function formatAuditSummary(entry) {
  const label = entry.metadata?.targetLabel || entry.targetId;
  const action = formatAuditAction(entry.action);

  if (entry.action === 'link.toggle') {
    const state = entry.metadata?.newValue ? 'shown' : 'hidden';
    return `${action}: ${label} (${state})`;
  }

  if (entry.action === 'link.delete') {
    return `${action}: ${label}`;
  }

  if (entry.action === 'profile.suspend' || entry.action === 'profile.unsuspend') {
    return `${action}: ${label}`;
  }

  return `${action} · ${label}`;
}

export function formatAuditRow(entry) {
  return {
    id: entry.id,
    time: formatDateTime(entry.createdAt),
    actor: entry.actorEmail,
    action: formatAuditAction(entry.action),
    summary: formatAuditSummary(entry),
    reason: entry.metadata?.reason || '—',
  };
}
