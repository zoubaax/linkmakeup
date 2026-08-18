import { useState, useCallback, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HiPencilSquare, HiArrowRightOnRectangle, HiArrowLeft } from 'react-icons/hi2';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import ToastContainer from '../ui/ToastContainer';
import ThemeToggle from '../ThemeToggle';
import Logo from '../ui/Logo';
import { useCommandPaletteShortcut } from '../../hooks/useKeyboardShortcut';
import useAdminShortcuts from '../../hooks/useAdminShortcuts';
import AdminCommandPalette from './AdminCommandPalette';
import AdminAttentionBell from './AdminAttentionBell';
import AdminShortcutsModal from './AdminShortcutsModal';
import AdminUserDrawer from './AdminUserDrawer';
import { ADMIN_NAV } from './adminNav';
import { PROFILE_DETAILS_PATH } from '../../config/dashboardNav';

const ADMIN_PAGE_TITLES = {
  '/admin': 'Admin Overview',
  '/admin/users': 'Admin Users',
  '/admin/profiles': 'Admin Profiles',
  '/admin/links': 'Admin Links',
  '/admin/analytics': 'Admin Analytics',
  '/admin/activity': 'Admin Activity',
};

function getAdminPageTitle(pathname) {
  return ADMIN_PAGE_TITLES[pathname] || 'Platform Admin';
}

function navLinkClassName(state, collapsed) {
  return [
    'flex items-center justify-between rounded-xl text-xs font-semibold transition-all',
    collapsed ? 'px-2 py-2.5 justify-center' : 'px-3 py-2.5',
    state.isActive
      ? 'bg-accent-subtle text-accent border border-accent-border shadow-2xs'
      : 'text-fg-muted hover:text-fg hover:bg-surface-alt',
  ].join(' ');
}

export default function AdminShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('admin-sidebar-collapsed') === 'true');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { profile, user, logout } = useAuth();
  const { drawerUserId, closeUserDrawer } = useAdmin();

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
      localStorage.setItem('admin-sidebar-collapsed', String(next));
      return next;
    });
  }, []);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const openShortcuts = useCallback(() => setShortcutsOpen(true), []);
  useCommandPaletteShortcut(openPalette);
  useAdminShortcuts({ onOpenPalette: openPalette, onOpenShortcuts: openShortcuts });

  const handleEditProfile = () => {
    setUserMenuOpen(false);
    navigate(PROFILE_DETAILS_PATH);
  };

  const handleSignOut = () => {
    setUserMenuOpen(false);
    logout();
  };

  return (
    <div className="min-h-screen bg-app text-fg font-sans flex">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* DEDICATED ADMIN SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-surface transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:z-auto ${
          collapsed ? 'lg:w-16' : 'lg:w-60'
        } ${mobileOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className={`h-14 border-b border-border/80 flex items-center justify-between ${collapsed ? 'px-2 justify-center' : 'px-4'}`}>
          <div className="flex items-center gap-2 min-w-0">
            <Logo height={24} />
            {!collapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Admin
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex p-1.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-surface-alt transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Admin Navigation Section */}
        <nav className={`flex-1 py-3 flex flex-col gap-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-3'}`}>
          {!collapsed && (
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
              Platform Management
            </p>
          )}

          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              className={(state) => navLinkClassName(state, collapsed)}
              onClick={() => setMobileOpen(false)}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="shrink-0 text-fg-muted">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </div>
              {!collapsed && (
                <svg className="w-3 h-3 text-fg-subtle shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Pinned Bottom Actions Footer */}
        <div className={`border-t border-border mt-auto shrink-0 ${collapsed ? 'p-2' : 'p-3'}`}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            title={collapsed ? 'Back to Studio' : undefined}
            className={`w-full flex items-center gap-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all ${
              collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
            }`}
          >
            <HiArrowLeft className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            {!collapsed && <span>Back to Studio</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* DEDICATED ADMIN TOP HEADER BAR */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 sm:px-6 h-14 border-b border-border/80 bg-surface/95 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle mobile menu"
              className="p-2 rounded-xl text-fg-muted hover:text-fg hover:bg-surface-alt lg:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <button
              type="button"
              onClick={toggleCollapsed}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:flex p-1.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-surface-alt transition-colors shrink-0"
            >
              <svg className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>

            <p className="text-sm font-bold text-fg truncate">{getAdminPageTitle(pathname)}</p>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <AdminAttentionBell />

            {/* Quick Back to Studio Header Button */}
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-all active:scale-95 shrink-0"
            >
              <HiArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Studio</span>
            </button>

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

            {/* Theme Toggle */}
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
                    {user?.name?.[0] || 'A'}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface border border-border/90 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-border/80 flex items-center gap-3">
                    {profile?.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt="User"
                        className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-emerald-600 border border-emerald-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {user?.name?.[0] || 'A'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-fg truncate">
                        {profile?.displayName || user?.name || 'Admin'}
                      </p>
                      <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 truncate">
                        @{profile?.username || 'admin'}
                      </p>
                      {user?.email && (
                        <p className="text-[10px] text-fg-muted truncate mt-0.5">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={handleEditProfile}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 text-xs font-semibold text-fg hover:bg-surface-alt transition-colors text-left"
                    >
                      <HiPencilSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Edit Profile</span>
                    </button>
                  </div>

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

        {/* Page Content */}
        <main className="flex-1 min-h-0 animate-page-in p-6 sm:p-8">{children}</main>
      </div>

      <AdminCommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <AdminShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <AdminUserDrawer userId={drawerUserId} onClose={closeUserDrawer} />
      <ToastContainer />
    </div>
  );
}