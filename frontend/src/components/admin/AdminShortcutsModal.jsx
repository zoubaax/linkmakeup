import { useEffect } from 'react';

const SHORTCUTS = [
  { keys: ['⌘K', 'Ctrl+K'], description: 'Open command palette / search' },
  { keys: ['G then O'], description: 'Go to Overview' },
  { keys: ['G then U'], description: 'Go to Users' },
  { keys: ['G then P'], description: 'Go to Profiles' },
  { keys: ['G then L'], description: 'Go to Links' },
  { keys: ['G then A'], description: 'Go to Activity' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['Esc'], description: 'Close drawer, modal, or palette' },
];

export default function AdminShortcutsModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button type="button" className="fixed inset-0 bg-overlay z-[100]" aria-label="Close shortcuts" onClick={onClose} />
      <div className="fixed left-1/2 top-[18%] z-[110] w-[min(100%-2rem,28rem)] -translate-x-1/2 rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-bold text-fg">Keyboard shortcuts</h2>
          <p className="text-xs text-fg-muted mt-1">Navigate the admin console faster</p>
        </div>
        <ul className="divide-y divide-border/70 max-h-80 overflow-y-auto">
          {SHORTCUTS.map((shortcut) => (
            <li key={shortcut.description} className="flex items-center justify-between gap-4 px-5 py-3">
              <span className="text-sm text-fg-muted">{shortcut.description}</span>
              <div className="flex flex-wrap items-center gap-1 justify-end">
                {shortcut.keys.map((key) => (
                  <kbd key={key} className="text-[10px] font-mono font-medium bg-surface-alt border border-border px-1.5 py-0.5 rounded text-fg">
                    {key}
                  </kbd>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <div className="px-5 py-3 border-t border-border bg-surface-alt text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
