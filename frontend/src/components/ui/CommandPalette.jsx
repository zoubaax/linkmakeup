import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PROFILE_DETAILS_PATH } from '../../config/dashboardNav';

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const commands = useMemo(() => {
    const items = [
      user
        ? { id: 'dashboard', label: 'Go to Studio', hint: 'Manage design & links', action: () => navigate('/dashboard') }
        : { id: 'signin', label: 'Sign In', hint: 'Access your account', action: () => navigate('/login') },
      ...(user
        ? [{ id: 'profile', label: 'Profile Details', hint: 'Avatar, name & bio', action: () => navigate(PROFILE_DETAILS_PATH) }]
        : []),
      { id: 'theme', label: 'Toggle theme', hint: 'Light / dark mode', action: toggleTheme },
    ];
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q));
  }, [query, user, navigate, toggleTheme]);

  if (!open) return null;

  const run = (action) => {
    action();
    onClose();
  };

  return (
    <>
      <button type="button" className="fixed inset-0 bg-overlay z-[80]" aria-label="Close command palette" onClick={onClose} />
      <div className="fixed left-1/2 top-[15%] z-[90] w-[min(100%-2rem,32rem)] -translate-x-1/2 rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <svg className="w-5 h-5 text-fg-subtle shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 py-3.5 bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
          />
          <kbd className="hidden sm:inline text-[10px] font-medium text-fg-subtle bg-surface-alt border border-border px-1.5 py-0.5 rounded">Esc</kbd>
        </div>
        <ul className="max-h-64 overflow-y-auto py-2">
          {commands.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-fg-muted">No commands found</li>
          ) : (
            commands.map((cmd) => (
              <li key={cmd.id}>
                <button
                  type="button"
                  onClick={() => run(cmd.action)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-nav-hover transition-colors"
                >
                  <span className="text-sm font-medium text-fg">{cmd.label}</span>
                  <span className="text-xs text-fg-subtle">{cmd.hint}</span>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="px-4 py-2 border-t border-border bg-surface-alt text-[11px] text-fg-subtle flex items-center gap-2">
          <kbd className="font-medium bg-surface border border-border px-1.5 py-0.5 rounded">⌘K</kbd>
          <span>Quick navigation</span>
        </div>
      </div>
    </>
  );
}
