import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAdmin } from '../../contexts/AdminContext';
import { PROFILE_DETAILS_PATH } from '../../config/dashboardNav';
import ApiService from '../../services/api';
import useDebouncedValue from '../../hooks/useDebouncedValue';

const ADMIN_COMMANDS = [
  { id: 'admin-overview', label: 'Admin Overview', hint: 'Platform health & growth', path: '/admin' },
  { id: 'admin-users', label: 'Admin · Users', hint: 'Accounts & onboarding', path: '/admin/users' },
  { id: 'admin-profiles', label: 'Admin · Profiles', hint: 'Public pages & suspension', path: '/admin/profiles' },
  { id: 'admin-links', label: 'Admin · Links', hint: 'Destination buttons', path: '/admin/links' },
  { id: 'admin-analytics', label: 'Admin · Analytics', hint: 'Views, clicks & engagement', path: '/admin/analytics' },
  { id: 'admin-activity', label: 'Admin · Activity', hint: 'Audit log', path: '/admin/activity' },
  { id: 'studio', label: 'Back to Studio', hint: 'Manage your profile', path: '/dashboard' },
  { id: 'profile', label: 'Edit Profile', hint: 'Avatar, name & bio', path: PROFILE_DETAILS_PATH },
];

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

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setSearchResults(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || debouncedQuery.trim().length < 2) {
      setSearchResults(null);
      setSearchLoading(false);
      return undefined;
    }

    let cancelled = false;
    setSearchLoading(true);

    ApiService.adminSearch(debouncedQuery.trim())
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
    if (!query.trim()) {
      return [...ADMIN_COMMANDS, { id: 'theme', label: 'Toggle theme', hint: 'Light / dark mode', action: 'theme' }];
    }
    const q = query.toLowerCase();
    return ADMIN_COMMANDS.filter(
      (item) => item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q),
    );
  }, [query]);

  const searchItems = useMemo(() => {
    if (!searchResults) return [];
    const items = [];

    searchResults.users?.forEach((user) => {
      items.push({
        id: `user-${user.id}`,
        label: user.email,
        hint: user.username ? `@${user.username}` : user.name || 'User account',
        action: () => openUserDrawer(user.id),
      });
    });

    searchResults.profiles?.forEach((profile) => {
      items.push({
        id: `profile-${profile.id}`,
        label: `@${profile.username}`,
        hint: profile.displayName,
        action: () => openUserDrawer(profile.userId),
      });
    });

    searchResults.links?.forEach((link) => {
      items.push({
        id: `link-${link.id}`,
        label: link.title,
        hint: link.username ? `@${link.username}` : link.url,
        action: () => navigate(`/admin/links?search=${encodeURIComponent(link.title)}`),
      });
    });

    return items;
  }, [searchResults, openUserDrawer, navigate]);

  const displayItems = debouncedQuery.trim().length >= 2 ? searchItems : commandItems;
  const isSearchMode = debouncedQuery.trim().length >= 2;

  useEffect(() => {
    setActiveIndex(0);
  }, [displayItems.length, debouncedQuery]);

  const runItem = useCallback((item) => {
    if (item.action === 'theme') {
      toggleTheme();
    } else if (typeof item.action === 'function') {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
    onClose();
  }, [navigate, onClose, toggleTheme]);

  useEffect(() => {
    if (!open) return undefined;

    const handler = (e) => {
      if (displayItems.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % displayItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + displayItems.length) % displayItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = displayItems[activeIndex];
        if (item) runItem(item);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, displayItems, activeIndex, runItem]);

  if (!open) return null;

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
            placeholder="Search commands or platform records…"
            className="flex-1 py-3.5 bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
          />
          <kbd className="hidden sm:inline text-[10px] font-medium text-fg-subtle bg-surface-alt border border-border px-1.5 py-0.5 rounded">Esc</kbd>
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {searchLoading && isSearchMode && (
            <p className="px-4 py-6 text-center text-sm text-fg-muted">Searching…</p>
          )}

          {!searchLoading && displayItems.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-fg-muted">
              {isSearchMode ? 'No results found' : 'No commands found'}
            </p>
          )}

          {!searchLoading && displayItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => runItem(item)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                index === activeIndex ? 'bg-accent-subtle' : 'hover:bg-nav-hover'
              }`}
            >
              <span className="text-sm font-medium text-fg truncate">{item.label}</span>
              <span className="text-xs text-fg-subtle truncate shrink-0 max-w-[45%]">{item.hint}</span>
            </button>
          ))}
        </div>

        <div className="px-4 py-2 border-t border-border bg-surface-alt text-[11px] text-fg-subtle flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><kbd className="font-medium bg-surface border border-border px-1 py-0.5 rounded">↑↓</kbd> navigate</span>
          <span className="inline-flex items-center gap-1"><kbd className="font-medium bg-surface border border-border px-1 py-0.5 rounded">↵</kbd> select</span>
          <span className="inline-flex items-center gap-1"><kbd className="font-medium bg-surface border border-border px-1 py-0.5 rounded">?</kbd> shortcuts</span>
        </div>
      </div>
    </>
  );
}
