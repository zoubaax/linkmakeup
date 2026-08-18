import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiPencilSquare, HiArrowRightOnRectangle } from 'react-icons/hi2';
import AppSidebar, { MobileSidebarToggle } from './AppSidebar';
import CommandPalette from '../ui/CommandPalette';
import ToastContainer from '../ui/ToastContainer';
import ThemeToggle from '../ThemeToggle';
import { useCommandPaletteShortcut } from '../../hooks/useKeyboardShortcut';
import { useAuth } from '../../contexts/AuthContext';
import { PROFILE_DETAILS_PATH } from '../../config/dashboardNav';
import StudioNav from './StudioNav';

const PAGE_TITLES = {
  '/': 'Sign In',
  '/dashboard': 'Studio Overview',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/profile': 'Profile Identity',
  '/admin': 'Admin Overview',
  '/admin/users': 'Admin Users',
  '/admin/profiles': 'Admin Profiles',
  '/admin/activity': 'Admin Activity',
  '/onboarding': 'Setup',
};

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/admin')) return 'Platform Admin';
  if (pathname !== '/' && !pathname.includes('/')) return 'Profile';
  return 'Link Make Up';
}

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === 'true');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { profile, user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  }, []);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  useCommandPaletteShortcut(openPalette);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await logout();
    window.location.href = '/';
  };

  const handleEditProfile = () => {
    setUserMenuOpen(false);
    navigate(PROFILE_DETAILS_PATH);
  };

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
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 sm:px-6 h-14 border-b border-border/80 bg-surface/95 backdrop-blur-md">
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

            {/* Theme Toggle Icon (Mobile & Desktop) */}
            <div className="flex items-center">
              <ThemeToggle />
            </div>

            {/* Interactive User Profile Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-1 p-0.5 rounded-full hover:ring-2 hover:ring-emerald-500/50 transition-all border border-transparent focus:outline-none"
                aria-label="User Menu"
              >
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="User"
                    className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 border border-emerald-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs">
                    {user?.name?.[0] || 'U'}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface border border-border/90 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Profile Header Card */}
                  <div className="px-4 py-2.5 border-b border-border/80 flex items-center gap-3">
                    {profile?.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt="User"
                        className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-emerald-600 border border-emerald-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {user?.name?.[0] || 'U'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-fg truncate">
                        {profile?.displayName || user?.name || 'Creator'}
                      </p>
                      <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 truncate">
                        @{profile?.username || 'user'}
                      </p>
                      {user?.email && (
                        <p className="text-[10px] text-fg-muted truncate mt-0.5">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions List */}
                  <div className="py-1">
                    {/* Edit Profile */}
                    <button
                      type="button"
                      onClick={handleEditProfile}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-semibold text-fg hover:bg-surface-alt transition-colors text-left"
                    >
                      <HiPencilSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Edit Profile</span>
                    </button>
                  </div>

                  {/* Logout Footer */}
                  <div className="border-t border-border/80 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                    >
                      <HiArrowRightOnRectangle className="w-4 h-4 shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {pathname.startsWith('/dashboard') && <StudioNav />}

        <main className="flex-1 min-h-0 animate-page-in">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <ToastContainer />
    </div>
  );
}
