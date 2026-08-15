import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import AppSidebar, { MobileSidebarToggle, DesktopSidebarRail } from './AppSidebar';
import CommandPalette from '../ui/CommandPalette';
import ToastContainer from '../ui/ToastContainer';
import { useCommandPaletteShortcut } from '../../hooks/useKeyboardShortcut';

const PAGE_TITLES = {
  '/': 'Sign In',
  '/dashboard': 'Dashboard',
  '/onboarding': 'Setup',
};

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname !== '/' && !pathname.includes('/')) return 'Profile';
  return 'LinkMakeup';
}

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === 'true');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { pathname } = useLocation();

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  }, []);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  useCommandPaletteShortcut(openPalette);

  return (
    <div className="min-h-screen bg-app text-fg font-sans flex">
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 h-14 border-b border-border bg-app/95 backdrop-blur-md">
          <MobileSidebarToggle open={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-fg truncate lg:hidden">{getPageTitle(pathname)}</p>
            <p className="hidden lg:block text-sm font-semibold text-fg">{getPageTitle(pathname)}</p>
          </div>
          <button
            type="button"
            onClick={openPalette}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-alt text-fg-muted text-sm hover:bg-nav-hover hover:text-fg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden md:inline text-[10px] font-medium bg-surface border border-border px-1.5 py-0.5 rounded ml-1">⌘K</kbd>
          </button>
          <button
            type="button"
            onClick={openPalette}
            className="sm:hidden p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-nav-hover transition-colors"
            aria-label="Open command palette"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <DesktopSidebarRail collapsed={collapsed} onToggle={toggleCollapsed} />
        </header>

        <main className="flex-1 min-h-0 animate-page-in">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <ToastContainer />
    </div>
  );
}
