import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PROFILE_DETAILS_PATH, ANALYTICS_PATH } from '../../config/dashboardNav';
import ApiService from '../../services/api';
import { highlightMatch, scoreCommand } from '../../utils/search';

const RECENT_KEY = 'linkmakeup_dashboard_recent';

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function saveRecent(q) {
  const clean = String(q || '').trim();
  if (clean.length < 2) return;
  try {
    const prev = loadRecent().filter((x) => x !== clean);
    const next = [clean, ...prev].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch { /* ignore */ }
}

function Highlight({ text, query }) {
  const parts = highlightMatch(text, query);
  return <>{parts.map((p, i) => <span key={i} className={p.match ? 'bg-amber-200 dark:bg-amber-500/30 rounded px-0.5' : ''}>{p.text}</span>)}</>;
}

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState([]);
  const [myLinks, setMyLinks] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleTheme } = useTheme();
  const listRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setRecent(loadRecent());
      // Lazy-load user's links for intelligent deep search
      if (user) {
        ApiService.getUserLinks()
          .then((res) => { if (res.success) setMyLinks(res.data || []); })
          .catch(() => setMyLinks([]));
      } else {
        setMyLinks([]);
      }
    }
  }, [open, user]);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const baseCommands = useMemo(() => {
    const items = [
      user
        ? { id: 'dashboard', label: 'Go to Studio', hint: 'Manage design & links', keywords: 'studio links dashboard content home', action: () => navigate('/dashboard') }
        : { id: 'signin', label: 'Sign In', hint: 'Access your account', keywords: 'login signin auth', action: () => navigate('/login') },
      ...(user
        ? [
          { id: 'profile', label: 'Profile Details', hint: 'Avatar, name & bio', keywords: 'profile identity avatar bio name photo edit', action: () => navigate(PROFILE_DETAILS_PATH) },
          { id: 'theme', label: 'Appearance & Theme', hint: 'Colors, fonts & background', keywords: 'appearance theme design colors fonts background style customize', action: () => navigate('/dashboard/theme') },
          { id: 'analytics', label: 'Analytics', hint: 'Views, clicks & traffic', keywords: 'analytics views clicks traffic stats metrics insights ctr', action: () => navigate(ANALYTICS_PATH) },
        ]
        : []),
      ...(user?.isAdmin
        ? [
          { id: 'admin', label: 'Platform Admin', hint: 'Users, profiles & links', keywords: 'admin platform moderation users profiles links', action: () => navigate('/admin') },
          { id: 'admin-users', label: 'Admin · Users', hint: 'Browse all accounts', keywords: 'admin users accounts members email', action: () => navigate('/admin/users') },
          { id: 'admin-profiles', label: 'Admin · Profiles', hint: 'Public pages & usernames', keywords: 'admin profiles pages usernames public', action: () => navigate('/admin/profiles') },
          { id: 'admin-links', label: 'Admin · Links', hint: 'Moderate destination buttons', keywords: 'admin links moderation url buttons', action: () => navigate('/admin/links') },
          { id: 'admin-activity', label: 'Admin · Activity', hint: 'Audit log of moderation actions', keywords: 'admin activity audit log history trail', action: () => navigate('/admin/activity') },
          { id: 'admin-analytics', label: 'Admin · Analytics', hint: 'Platform-wide engagement', keywords: 'admin analytics engagement views clicks', action: () => navigate('/admin/analytics') },
        ]
        : []),
      { id: 'toggle-theme', label: 'Toggle theme', hint: 'Light / dark mode', keywords: 'theme dark light mode appearance toggle', action: toggleTheme },
    ];

    // Inject personal links as searchable items — intelligent: jumps to studio + opens link manager focus
    const linkItems = (myLinks || []).map((link) => ({
      id: `my-link-${link.id}`,
      label: link.title,
      hint: link.url,
      keywords: `${link.title} ${link.subtitle || ''} ${link.icon || ''} ${link.url}`,
      group: 'My Links',
      action: () => {
        navigate('/dashboard');
        // gentle nudge: after nav, scroll to links section
        setTimeout(() => document.getElementById('links')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
      },
    }));

    return [...items, ...linkItems];
  }, [user, navigate, toggleTheme, myLinks]);

  const ranked = useMemo(() => {
    const q = query.trim();
    if (!q) return baseCommands.map((c) => ({ item: c, score: 100 }));
    const scored = baseCommands
      .map((c) => {
        // score across label + hint + keywords + id
        const tmp = { label: c.label, hint: `${c.hint} ${c.keywords || ''}`, id: c.id };
        let s = scoreCommand(tmp, q);
        // boost exact label prefix (typed "prof" -> Profile first)
        if (c.label.toLowerCase().startsWith(q.toLowerCase())) s = Math.min(100, s + 10);
        // also score against keywords separately for alias tolerance
        if (c.keywords) {
          const kwTmp = { label: c.keywords, hint: '', id: '' };
          const kwScore = scoreCommand(kwTmp, q);
          s = Math.max(s, kwScore);
        }
        return { item: c, score: s };
      })
      .filter((x) => x.score >= 30)
      .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label));
    return scored;
  }, [query, baseCommands]);

  const displayItems = ranked.map((r) => ({ ...r.item, _score: r.score }));
  const groups = useMemo(() => {
    if (!displayItems.length) return [];
    // group by personal links vs navigation
    const nav = displayItems.filter((i) => i.group !== 'My Links');
    const links = displayItems.filter((i) => i.group === 'My Links');
    const out = [];
    if (nav.length) out.push({ title: query.trim() ? null : 'Quick navigation', items: nav });
    if (links.length) out.push({ title: 'My Links', items: links });
    if (out.length === 0) out.push({ title: null, items: displayItems });
    return out;
  }, [displayItems, query]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => { setActiveIndex(0); }, [query, flat.length]);

  const run = useCallback((item) => {
    if (item?.label) saveRecent(query.trim() || item.label);
    // Execute action — support either function or legacy action
    const act = item.action;
    if (typeof act === 'function') act();
    onClose();
  }, [onClose, query]);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => {
      if (flat.length === 0) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => (i + 1) % flat.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => (i - 1 + flat.length) % flat.length); }
      else if (e.key === 'Enter') { e.preventDefault(); const it = flat[activeIndex]; if (it) run(it); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, flat, activeIndex, run]);

  // Keep active item scrolled into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${activeIndex}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!open) return null;

  const showRecent = !query.trim() && recent.length > 0;

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
            placeholder="Try “theme”, “analytics”, “dark mode”, or your link title…"
            className="flex-1 py-3.5 bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} className="p-1 rounded-full text-fg-subtle hover:text-fg hover:bg-surface-alt transition-colors" aria-label="Clear">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          ) : null}
          <kbd className="hidden sm:inline text-[10px] font-medium text-fg-subtle bg-surface-alt border border-border px-1.5 py-0.5 rounded">Esc</kbd>
        </div>

        {!query.trim() && (
          <div className="px-4 py-2 border-b border-border bg-surface-alt/40 flex flex-wrap gap-1.5">
            <span className="text-[11px] text-fg-subtle mr-1">Try:</span>
            {['theme', 'analytics', 'profile', 'dark mode', 'admin'].map((ex) => (
              <button key={ex} type="button" onClick={() => setQuery(ex)} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface border border-border text-fg-subtle hover:text-fg hover:border-accent transition-colors">{ex}</button>
            ))}
          </div>
        )}

        {showRecent && (
          <div className="px-2 pb-2 pt-2 border-b border-border/60">
            <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Recent</p>
            <div className="flex flex-wrap gap-1.5 px-2 pb-1">
              {recent.map((r) => (
                <button key={r} type="button" onClick={() => setQuery(r)} className="text-xs px-2.5 py-1 rounded-full bg-surface-alt border border-border text-fg-muted hover:text-fg transition-colors">{r}</button>
              ))}
            </div>
          </div>
        )}

        <div ref={listRef} className="max-h-72 overflow-y-auto py-2">
          {displayItems.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-fg-muted">No commands found</p>
              <p className="text-xs text-fg-subtle mt-1">Try a different spelling — search is typo & alias tolerant (e.g. “anlytics”, “them”)</p>
              {query && <button type="button" onClick={() => setQuery('')} className="mt-3 text-xs font-semibold text-primary hover:underline">Clear search</button>}
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.title || 'main'}>
                {group.title && <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">{group.title}</p>}
                {group.items.map((cmd) => {
                  const flatIdx = flat.indexOf(cmd);
                  const active = flatIdx === activeIndex;
                  return (
                    <button
                      key={cmd.id}
                      data-idx={flatIdx}
                      type="button"
                      onClick={() => run(cmd)}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${active ? 'bg-accent-subtle' : 'hover:bg-nav-hover'}`}
                    >
                      <span className="text-sm font-medium text-fg truncate"><Highlight text={cmd.label} query={query} /></span>
                      <span className="text-xs text-fg-subtle truncate shrink-0 max-w-[45%]"><Highlight text={cmd.hint} query={query} /></span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="px-4 py-2 border-t border-border bg-surface-alt text-[11px] text-fg-subtle flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1"><kbd className="font-medium bg-surface border border-border px-1 py-0.5 rounded">↑↓</kbd> navigate</span>
          <span className="inline-flex items-center gap-1"><kbd className="font-medium bg-surface border border-border px-1 py-0.5 rounded">↵</kbd> select</span>
          <span className="inline-flex items-center gap-1"><kbd className="font-medium bg-surface border border-border px-1 py-0.5 rounded">/</kbd> typo tolerant</span>
          <span className="ml-auto hidden sm:inline text-fg-muted">⌘K to toggle</span>
        </div>
      </div>
    </>
  );
}
