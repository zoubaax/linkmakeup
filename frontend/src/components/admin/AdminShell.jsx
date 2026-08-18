<<<<<<< Updated upstream
import { useState, useCallback, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HiPencilSquare, HiArrowRightOnRectangle, HiArrowLeft } from 'react-icons/hi2';
=======
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HiArrowRightOnRectangle } from 'react-icons/hi2';
>>>>>>> Stashed changes
import { useAuth } from '../../contexts/AuthContext';
import CommandPalette from '../ui/CommandPalette';
import ToastContainer from '../ui/ToastContainer';
import ThemeToggle from '../ThemeToggle';
import Logo from '../ui/Logo';
<<<<<<< Updated upstream
import { useCommandPaletteShortcut } from '../../hooks/useKeyboardShortcut';
=======
import ToastContainer from '../ui/ToastContainer';
import { MobileSidebarToggle } from '../layout/AppSidebar';
>>>>>>> Stashed changes
import { ADMIN_NAV } from './adminNav';
import { PROFILE_DETAILS_PATH } from '../../config/dashboardNav';

<<<<<<< Updated upstream
const ADMIN_PAGE_TITLES = {
  '/admin': 'Admin Overview',
  '/admin/users': 'Admin Users',
  '/admin/profiles': 'Admin Profiles',
  '/admin/activity': 'Admin Activity',
=======
const SECTION_TITLES = {
  '/admin': 'Overview',
  '/admin/analytics': 'Analytics',
  '/admin/users': 'Users',
  '/admin/profiles': 'Profiles',
  '/admin/links': 'Links',
  '/admin/activity': 'Activity',
>>>>>>> Stashed changes
};

function getAdminPageTitle(pathname) {
  return ADMIN_PAGE_TITLES[pathname] || 'Platform Admin';
}

<<<<<<< Updated upstream
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
      localStorage.setItem('admin-sidebar-collapsed', String(next));
      return next;
    });
  }, []);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  useCommandPaletteShortcut(openPalette);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
=======
function navLinkClassName({ isActive }, collapsed) {
  return [
    'flex items-center justify-between rounded-lg text-xs font-semibold transition-all duration-150',
    collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
    isActive
      ? 'bg-surface-alt text-fg font-bold shadow-2xs border border-border/70'
      : 'text-fg-muted hover:text-fg hover:bg-surface-alt/60',
  ].join(' ');
}

function SidebarContent({ collapsed = false, onNavigate, onToggleCollapse }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    onNavigate?.();
>>>>>>> Stashed changes
    await logout();
    window.location.href = '/';
  };

<<<<<<< Updated upstream
  const handleEditProfile = () => {
    setUserMenuOpen(false);
    navigate(PROFILE_DETAILS_PATH);
=======
  const handleBackToStudio = () => {
    onNavigate?.();
    navigate('/dashboard');
  };

  return (
    <>
      {/* Sidebar Top Brand Header */}
      <div className="h-14 px-4 border-b border-border/80 flex items-center justify-between shrink-0">
        <NavLink to="/admin" onClick={onNavigate} className="inline-flex items-center py-0.5">
          <Logo height={30} />
        </NavLink>

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex p-1.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-surface-alt transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Cloudflare-style Nav Section */}
      <nav className={`flex-1 py-3 flex flex-col gap-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-3'}`}>
        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={collapsed ? item.label : undefined}
            onClick={onNavigate}
            className={(state) => navLinkClassName(state, collapsed)}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {item.icon}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </div>
            {!collapsed && (
              <svg className="w-3 h-3 text-fg-subtle shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={`border-t border-border space-y-3 ${collapsed ? 'px-2 py-3' : 'px-3 py-4'}`}>
        {!collapsed ? (
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-fg-subtle uppercase tracking-wider">Theme</span>
            <ThemeToggle />
          </div>
        ) : (
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        )}

        {user && (
          <div className="space-y-2">
            {!collapsed ? (
              <button
                type="button"
                onClick={handleBackToStudio}
                title="Back to Studio"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-alt text-xs text-fg-muted truncate hover:text-fg hover:bg-surface-alt/80 transition-colors text-left"
              >
                <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                <span className="truncate">Back to Studio</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBackToStudio}
                title="Back to Studio"
                className="w-full flex justify-center p-2.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-surface-alt transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              title={collapsed ? 'Sign Out' : undefined}
              className={`w-full rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all flex items-center justify-center gap-2 shadow-2xs ${collapsed ? 'p-2.5' : 'px-3 py-2.5'}`}
            >
              <HiArrowRightOnRectangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        )}

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`hidden lg:flex w-full items-center rounded-lg text-fg-subtle hover:text-fg hover:bg-nav-hover transition-colors ${collapsed ? 'justify-center p-2' : 'gap-2 px-3 py-2 text-xs font-medium'}`}
          >
            <svg className={`w-4 h-4 shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!collapsed && 'Collapse'}
          </button>
        )}
      </div>
    </>
  );
}

export default function AdminShell({ children }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('admin-sidebar-collapsed') === 'true',
  );

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('admin-sidebar-collapsed', String(next));
      return next;
    });
>>>>>>> Stashed changes
  };

  return (
    <div className="min-h-screen bg-app text-fg font-sans flex">
<<<<<<< Updated upstream
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* DEDICATED ADMIN SIDEBAR (Same design as user sidebar) */}
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
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex p-1.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-surface-alt transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
=======
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex lg:flex-col ${collapsed ? 'lg:w-[4.5rem]' : 'lg:w-64'} lg:shrink-0 lg:sticky lg:top-0 lg:h-screen border-r border-border bg-surface transition-[width] duration-200`}>
        <div className="flex flex-col h-full">
          <SidebarContent collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
>>>>>>> Stashed changes
        </div>
      </aside>

<<<<<<< Updated upstream
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
=======
      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 bg-overlay z-40"
          aria-label="Close sidebar overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={[
          'lg:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-border bg-surface shadow-xl transition-transform duration-200 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        aria-hidden={!mobileOpen}
      >
        <div className="flex flex-col h-full">
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
>>>>>>> Stashed changes
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
<<<<<<< Updated upstream
        {/* DEDICATED ADMIN TOP HEADER BAR (Exact same as user AppLayout header) */}
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
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
=======
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 sm:px-6 h-14 border-b border-border/80 bg-surface/95 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <MobileSidebarToggle open={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
            <p className="text-sm font-bold text-fg truncate">{getSectionTitle(pathname)}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-accent-border bg-accent-subtle px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Admin
            </span>
            <ThemeToggle />
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-surface-muted border border-border flex items-center justify-center text-xs font-bold text-fg shrink-0">
                {user?.name?.[0] || 'A'}
              </div>
            )}
          </div>
>>>>>>> Stashed changes
        </header>

        {/* Page Content */}
        <main className="flex-1 min-h-0 animate-page-in">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <ToastContainer />
    </div>
  );
}