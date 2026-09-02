import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAdmin } from '../../contexts/AdminContext';
import { PROFILE_DETAILS_PATH } from '../../config/dashboardNav';
import ApiService from '../../services/api';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { highlightMatch, normalizeQuery, scoreCommand, tokenize } from '../../utils/search';

const ADMIN_COMMANDS = [
  { id: 'admin-overview', label: 'Admin Overview', hint: 'Platform health & growth', path: '/admin', keywords: 'dashboard overview stats' },
  { id: 'admin-users', label: 'Admin · Users', hint: 'Accounts & onboarding', path: '/admin/users', keywords: 'users accounts members email' },
  { id: 'admin-profiles', label: 'Admin · Profiles', hint: 'Public pages & suspension', path: '/admin/profiles', keywords: 'profiles pages usernames suspend ban' },
  { id: 'admin-links', label: 'Admin · Links', hint: 'Destination buttons', path: '/admin/links', keywords: 'links urls buttons destinations' },
  { id: 'admin-analytics', label: 'Admin · Analytics', hint: 'Views, clicks & engagement', path: '/admin/analytics', keywords: 'analytics views clicks stats trends' },
  { id: 'admin-activity', label: 'Admin · Activity', hint: 'Audit log', path: '/admin/activity', keywords: 'activity audit log history trail' },
  { id: 'admin-orders', label: 'Admin · Orders', hint: 'NFC card orders', path: '/admin/orders', keywords: 'orders nfc cards purchases' },
  { id: 'studio', label: 'Back to Studio', hint: 'Manage your profile', path: '/dashboard', keywords: 'studio dashboard links editor' },
  { id: 'profile', label: 'Edit Profile', hint: 'Avatar, name & bio', path: PROFILE_DETAILS_PATH, keywords: 'profile edit avatar bio' },
];

const RECENT_KEY = 'linkmakeup_admin_recent_searches';

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
  return <>{parts.map((p, i) => (
    <span key={i} className={p.match ? 'bg-amber-200 dark:bg-amber-500/30 rounded px-0.5' : ''}>{p.text}</span>
  ))}</>;
}

export default function AdminCommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 250);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const { openUserDrawer } = useAdmin();
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setSearchResults(null);
      setRecent(loadRecent());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // intelligent backend search – supports prefixes like "user:", "profile:", "link:"
  useEffect(() => {
    const raw = debouncedQuery.trim();
    if (!open || raw.length < 2) {
      setSearchResults(null);
      setSearchLoading(false);
      return undefined;
    }

    // strip prefix for backend
    let backendQuery = raw;
    const prefixMatch = raw.match(/^(user|profile|link|email|username):\s*(.*)$/i);
    if (prefixMatch) backendQuery = prefixMatch[2] || '';

    // short queries that are just prefix with no value => don't search backend
    if (!backendQuery || backendQuery.length < 2) {
      setSearchResults(null);
      setSearchLoading(false);
      return undefined;
    }

    let cancelled = false;
    setSearchLoading(true);

    ApiService.adminSearch(backendQuery.trim())
      .then((res) => {
        if (!cancelled && res.success) setSearchResults(res.data);
      })
      .catch(() => {
        if (!cancelled) setSearchResults({ users: [], profiles: [], links: [] });
      })
      .finally(() => {
        if (!cancelled) setSearchLoading(false);
      });

    return () => { cancelled = true; };
  }, [open, debouncedQuery]);

  const commandItems = useMemo(() => {
    const q = query.trim();
    if (!q) {
      return [...ADMIN_COMMANDS, { id: 'theme', label: 'Toggle theme', hint: 'Light / dark mode', action: 'theme', keywords: 'theme dark light mode' }];
    }
    // support ">" prefix forces command-only mode
    const effective = q.startsWith('>') ? q.slice(1).trim() : q;
    const tokens = tokenize(effective);
    if (!tokens.length) return ADMIN_COMMANDS;

    // score and rank
    const scored = ADMIN_COMMANDS.map((item) => {
      const targets = [item.label, item.hint, item.id, item.keywords || ''];
      // also handle prefix hint: if query starts with "user:" only score user-related
      const { score } = (() => {
        // tiny helper inline to avoid import cycle - reuse scoreCommand logic but with keywords
        const all = targets.join(' ');
        // use scoreCommand-like but with extended targets
        const t = normalizeQuery(effective);
        if (!t) return { score: 0 };
        // reuse shared: build temp item
        const tmp = { label: item.label, hint: `${item.hint} ${item.keywords || ''}`, id: item.id };
        return { score: scoreCommand(tmp, effective) };
      })();
      // boost if label prefix
      let boost = 0;
      if (normalizeQuery(item.label).startsWith(normalizeQuery(effective))) boost = 8;
      return { item, score: Math.min(100, score + boost) };
    })
      .filter((x) => x.score >= 32)
      .sort((a, b) => b.score - a.score);

    // handle explicit filter words like "user:" inside query – keep only relevant
    const lower = q.toLowerCase();
    if (lower.startsWith('user:') || lower.includes(' user')) {
      // already scored, just keep users command high – no extra filter needed
    }

    if (scored.length === 0) return [];
    // if ">" mode, return only commands; otherwise also commands
    return scored.map((s) => ({ ...s.item, _score: s.score }));
  }, [query]);

  const searchItems = useMemo(() => {
    if (!searchResults) return [];
    const raw = debouncedQuery.trim();
    const prefixMatch = raw.match(/^(user|profile|link|email|username):\s*(.*)$/i);
    const prefix = prefixMatch ? prefixMatch[1].toLowerCase() : null;
    const items = [];

    const includeUsers = !prefix || prefix === 'user' || prefix === 'email' || prefix === 'username';
    const includeProfiles = !prefix || prefix === 'profile' || prefix === 'username';
    const includeLinks = !prefix || prefix === 'link';

    if (includeUsers) {
      searchResults.users?.forEach((user) => {
        items.push({
          id: `user-${user.id}`,
          label: user.email,
          hint: user.username ? `@${user.username}` : user.name || 'User account',
          group: 'Users',
          action: () => openUserDrawer(user.id),
        });
      });
    }

    if (includeProfiles) {
      searchResults.profiles?.forEach((profile) => {
        items.push({
          id: `profile-${profile.id}`,
          label: `@${profile.username}`,
          hint: profile.displayName || profile.email || 'Profile',
          group: 'Profiles',
          action: () => openUserDrawer(profile.userId),
        });
      });
    }

    if (includeLinks) {
      searchResults.links?.forEach((link) => {
        items.push({
          id: `link-${link.id}`,
          label: link.title,
          hint: link.username ? `@${link.username}` : link.url,
          group: 'Links',
          action: () => navigate(`/admin/links?search=${encodeURIComponent(link.title)}`),
        });
      });
    }

    return items;
  }, [searchResults, openUserDrawer, navigate, debouncedQuery]);

  // Decide what to show: if debounced >=2 and backend returned something, merge commands + results (commands first but ranked)
  const isSearchMode = debouncedQuery.trim().length >= 2;
  const hasBackendQuery = useMemo(() => {
    const raw = debouncedQuery.trim();
    const m = raw.match(/^(user|profile|link|email|username):\s*(.*)$/i);
    const effective = m ? m[2] : raw;
    return effective.trim().length >= 2;
  }, [debouncedQuery]);

  const displayGroups = useMemo(() => {
    if (!isSearchMode || !hasBackendQuery) {
      // command-only mode
      return commandItems.length ? [{ title: null, items: commandItems }] : [];
    }
    const groups = [];
    if (commandItems.length) groups.push({ title: 'Commands', items: commandItems });
    // group searchItems by group name
    const byGroup = {};
    for (const it of searchItems) {
      const g = it.group || 'Results';
      if (!byGroup[g]) byGroup[g] = [];
      byGroup[g].push(it);
    }
    for (const [title, items] of Object.entries(byGroup)) {
      if (items.length) groups.push({ title, items });
    }
    return groups;
  }, [isSearchMode, hasBackendQuery, commandItems, searchItems]);

  const flatDisplay = useMemo(() => displayGroups.flatMap((g) => g.items), [displayGroups]);

  useEffect(() => {
    setActiveIndex(0);
  }, [flatDisplay.length, debouncedQuery]);

  const runItem = useCallback((item) => {
    if (item?.label && typeof item.label === 'string') saveRecent(query.trim());
    if (item.action === 'theme') {
      toggleTheme();
    } else if (typeof item.action === 'function') {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
    onClose();
  }, [navigate, onClose, toggleTheme, query]);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => {
      if (flatDisplay.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % flatDisplay.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + flatDisplay.length) % flatDisplay.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = flatDisplay[activeIndex];
        if (item) runItem(item);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, flatDisplay, activeIndex, runItem]);

  if (!open) return null;

  const showRecent = !query.trim() && recent.length > 0;

  return (
    <>
      <button type="button" className="fixed inset-0 bg-overlay z-[80]" aria-label="Close command palette" onClick={onClose} />
      <div className="fixed left-1/2 top-[12%] z-[90] w-[min(100%-2rem,36rem)] -translate-x-1/2 rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <svg className="w-5 h-5 text-fg-subtle shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “users”, “ig”, “suspend”, “user: gmail”… — fuzzy & prefix aware"
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
          <div className="px-4 py-2 border-b border-border bg-surface-alt/50 flex flex-wrap gap-1.5">
            <span className="text-[11px] text-fg-subtle mr-1">Try:</span>
            {['> users', 'user: gmail', 'profile: @', 'link: github', 'suspend'].map((ex) => (
              <button key={ex} type="button" onClick={() => setQuery(ex.replace('>','').trim() + ' ')} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface border border-border text-fg-subtle hover:text-fg hover:border-accent transition-colors">
                {ex}
              </button>
            ))}
          </div>
        )}

        <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {showRecent && (
            <div className="px-2 pb-2">
              <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Recent</p>
              <div className="flex flex-wrap gap-1.5 px-2 pb-2">
                {recent.map((r) => (
                  <button key={r} type="button" onClick={() => setQuery(r)} className="text-xs px-2.5 py-1 rounded-full bg-surface-alt border border-border text-fg-muted hover:text-fg transition-colors">{r}</button>
                ))}
              </div>
            </div>
          )}

          {searchLoading && isSearchMode && hasBackendQuery && (
            <p className="px-4 py-6 text-center text-sm text-fg-muted flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-fg-subtle border-t-transparent rounded-full animate-spin" /> Searching…
            </p>
          )}

          {!searchLoading && flatDisplay.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-fg-muted">{isSearchMode ? 'No results — try a different spelling or use prefix “user:”, “profile:”, “link:”' : 'No commands found'}</p>
              {isSearchMode && <button type="button" onClick={() => setQuery('')} className="mt-2 text-xs font-semibold text-primary hover:underline">Clear search</button>}
            </div>
          )}

          {!searchLoading && displayGroups.map((group) => (
            <div key={group.title || 'commands'}>
              {group.title && <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">{group.title}</p>}
              {group.items.map((item) => {
                const flatIdx = flatDisplay.indexOf(item);
                const active = flatIdx === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => runItem(item)}
                    onMouseEnter={() => setActiveIndex(flatIdx)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${active ? 'bg-accent-subtle' : 'hover:bg-nav-hover'}`}
                  >
                    <span className="text-sm font-medium text-fg truncate"><Highlight text={item.label} query={query} /></span>
                    <span className="text-xs text-fg-subtle truncate shrink-0 max-w-[45%]"><Highlight text={item.hint} query={query} /></span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="px-4 py-2 border-t border-border bg-surface-alt text-[11px] text-fg-subtle flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1"><kbd className="font-medium bg-surface border border-border px-1 py-0.5 rounded">↑↓</kbd> navigate</span>
          <span className="inline-flex items-center gap-1"><kbd className="font-medium bg-surface border border-border px-1 py-0.5 rounded">↵</kbd> select</span>
          <span className="hidden sm:inline-flex items-center gap-1"><kbd className="font-medium bg-surface border border-border px-1 py-0.5 rounded">⌘K</kbd> toggle</span>
          <span className="inline-flex items-center gap-1 text-fg-muted ml-auto">prefix: user: profile: link: &gt;</span>
        </div>
      </div>
    </>
  );
}
