import { HiSparkles, HiBriefcase, HiCheckCircle, HiStar } from 'react-icons/hi2';
import { GoDotFill } from 'react-icons/go';

export const STATUS_PRESETS = [
  { id: 'available', text: 'Available for opportunities', icon: 'dot' },
  { id: 'collabs', text: 'Open for beauty collabs', icon: 'sparkles' },
  { id: 'freelance', text: 'Available for freelance & work', icon: 'briefcase' },
  { id: 'clients', text: 'Accepting new clients', icon: 'star' },
];

export function StatusPill({ statusBadge, className = "" }) {
  if (!statusBadge) return null;

  const cleanText = statusBadge.replace(/^[🟢💄💼🌟✨⚡️\s]+/, '').trim() || statusBadge;
  const lower = statusBadge.toLowerCase();

  let icon = <GoDotFill className="w-3 h-3 text-emerald-500 animate-pulse" />;
  if (lower.includes('collab') || lower.includes('beauty') || lower.includes('sparkle')) {
    icon = <HiSparkles className="w-3.5 h-3.5 text-amber-500" />;
  } else if (lower.includes('freelance') || lower.includes('work') || lower.includes('job')) {
    icon = <HiBriefcase className="w-3.5 h-3.5 text-blue-500" />;
  } else if (lower.includes('client') || lower.includes('star')) {
    icon = <HiStar className="w-3.5 h-3.5 text-purple-500" />;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-xs ${className}`}>
      {icon}
      <span>{cleanText}</span>
    </div>
  );
}
