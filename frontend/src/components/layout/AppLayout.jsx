import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import AppSidebar, { MobileSidebarToggle, DesktopSidebarRail } from './AppSidebar';
import CommandPalette from '../ui/CommandPalette';
import ToastContainer from '../ui/ToastContainer';
import { useCommandPaletteShortcut } from '../../hooks/useKeyboardShortcut';

const PAGE_TITLES = {
  '/': 'Sign In',
  '/dashboard': 'Studio',
  '/dashboard/profile': 'Profile Details',
  '/admin': 'Platform Admin',
  '/admin/users': 'Platform Admin',
  '/admin/profiles': 'Platform Admin',
  '/admin/links': 'Platform Admin',
  '/admin/activity': 'Platform Admin',
  '/onboarding': 'Setup',
};

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/admin')) return 'Platform Admin';
  if (pathname !== '/' && !pathname.includes('/')) return 'Profile';
  return 'LinkMakeup';
}

import { useAuth } from '../../contexts/AuthContext';

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === 'true');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { pathname } = useLocation();
  const { profile, user } = useAuth();

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  }, []);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  useCommandPaletteShortcut(openPalette);

  const domainName = profile?.username ? `${profile.username}.linkmakeup.com` : 'linkmakeup.com';

  return (
    <div className="min-h-screen bg-app text-fg font-sans flex">
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
        openPalette={openPalette}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Cloudflare-style Top Navigation Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 sm:px-6 h-13 border-b border-border/80 bg-surface/95 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <MobileSidebarToggle open={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
            <p className="text-sm font-bold text-fg truncate">{getPageTitle(pathname)}</p>
          </div>

          {/* Cloudflare Right Header Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Search Button */}
            <button
              type="button"
              onClick={openPalette}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface-alt hover:bg-nav-hover text-xs font-semibold text-fg transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
              <kbd className="text-[9px] font-mono font-medium bg-surface border border-border px-1.5 py-0.5 rounded text-fg-muted ml-0.5">⌘K</kbd>
            </button>

            {/* Support */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-fg-muted hover:text-fg transition-colors px-2 py-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Support</span>
            </a>

            {/* User Profile Avatar */}
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="User"
                className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-surface-muted border border-border flex items-center justify-center text-xs font-bold text-fg shrink-0">
                {user?.name?.[0] || 'U'}
              </div>
            )}

            <DesktopSidebarRail collapsed={collapsed} onToggle={toggleCollapsed} />
          </div>
        </header>

        <main className="flex-1 min-h-0 animate-page-in">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <ToastContainer />
    </div>
  );
}
