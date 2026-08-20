import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiCalendarDays, HiBriefcase, HiArrowRightOnRectangle } from 'react-icons/hi2';
import { useAuth } from '../../contexts/AuthContext';
import { PROFILE_DETAILS_PATH, ANALYTICS_PATH, THEME_PATH, STUDIO_NAV } from '../../config/dashboardNav';
import ThemeToggle from '../ThemeToggle';
import Logo from '../ui/Logo';

const NAV_LINKS = [
  {
    to: '/dashboard',
    label: 'Studio',
    auth: true,
    end: true,
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
];

function navLinkClassName({ isActive }, collapsed) {
  return [
    'flex items-center justify-between rounded-lg text-xs font-semibold transition-all duration-150',
    collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
    isActive
      ? 'bg-surface-alt text-fg font-bold shadow-2xs border border-border/70'
      : 'text-fg-muted hover:text-fg hover:bg-surface-alt/60',
  ].join(' ');
}

function SidebarContent({ onNavigate, collapsed, onToggleCollapse, openPalette }) {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [studioOpen, setStudioOpen] = useState(true);

  const handleSignOut = async () => {
    onNavigate?.();
    await logout();
    window.location.href = '/';
  };

  const handleSignIn = () => {
    onNavigate?.();
    navigate('/');
  };

  return (
    <>
      {/* Sidebar Top Brand Header */}
      <div className="h-14 px-4 border-b border-border/80 flex items-center justify-between shrink-0">
        <NavLink to="/dashboard" onClick={onNavigate} className="inline-flex items-center py-0.5">
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

      {/* Nav Section */}
      <nav className={`flex-1 py-3 flex flex-col gap-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-3'}`}>
        {/* Collapsible Studio Group */}
        {user && (
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => setStudioOpen(!studioOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt/60 cursor-pointer ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <svg className="w-4 h-4 shrink-0 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                {!collapsed && <span>My Studio</span>}
              </div>
              {!collapsed && (
                <svg
                  className={`w-3.5 h-3.5 text-fg-subtle transition-transform duration-200 ${studioOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              )}
            </button>

            {/* Indented Tree Items */}
            {studioOpen && (
              <div className={`${collapsed ? '' : 'ml-4 pl-2.5 border-l border-border/70'} flex flex-col gap-1 my-0.5`}>
                {STUDIO_NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    title={collapsed ? item.shortLabel : undefined}
                    className={({ isActive }) => [
                      'flex items-center justify-between rounded-lg text-xs font-semibold transition-all duration-150',
                      collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2',
                      isActive
                        ? 'bg-surface-alt text-fg font-bold border border-border/70 shadow-2xs'
                        : 'text-fg-muted hover:text-fg hover:bg-surface-alt/60',
                    ].join(' ')}
                    onClick={onNavigate}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.to === '/dashboard' && (
                        <svg className="w-3.5 h-3.5 shrink-0 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      )}
                      {item.to === THEME_PATH && (
                        <svg className="w-3.5 h-3.5 shrink-0 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      )}
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics & Profile Navigation (Standalone below Studio) */}
        {user && (
          <>
            <NavLink
              to={ANALYTICS_PATH}
              title={collapsed ? 'Analytics' : undefined}
              className={(state) => navLinkClassName(state, collapsed)}
              onClick={onNavigate}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <svg className="w-4 h-4 shrink-0 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {!collapsed && <span>Analytics</span>}
              </div>
              {!collapsed && (
                <svg className="w-3 h-3 text-fg-subtle shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </NavLink>

            <NavLink
              to={PROFILE_DETAILS_PATH}
              title={collapsed ? 'Profile Identity' : undefined}
              className={(state) => navLinkClassName(state, collapsed)}
              onClick={onNavigate}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <svg className="w-4 h-4 shrink-0 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {!collapsed && <span>Profile Identity</span>}
              </div>
              {!collapsed && (
                <svg className="w-3 h-3 text-fg-subtle shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </NavLink>
          </>
        )}

        {user?.isAdmin && (
          <NavLink
            to="/admin"
            title={collapsed ? 'Platform Admin' : undefined}
            className={(state) => navLinkClassName(state, collapsed)}
            onClick={onNavigate}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <svg className="w-4 h-4 shrink-0 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              {!collapsed && <span>Platform Admin</span>}
            </div>
            {!collapsed && (
              <svg className="w-3 h-3 text-fg-subtle shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </NavLink>
        )}

        {/* Calendar (Coming Soon) */}
        <div
          title={collapsed ? 'Calendar (Soon)' : undefined}
          className={`flex items-center justify-between rounded-lg text-xs font-semibold text-fg-subtle/80 hover:bg-surface-alt/40 cursor-not-allowed transition-all ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <HiCalendarDays className="w-4 h-4 shrink-0 text-fg-muted" />
            {!collapsed && <span>Calendar</span>}
          </div>
          {!collapsed && (
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Soon
            </span>
          )}
        </div>

        {/* Custom Portfolio (Coming Soon) */}
        <div
          title={collapsed ? 'Custom Portfolio (Soon)' : undefined}
          className={`flex items-center justify-between rounded-lg text-xs font-semibold text-fg-subtle/80 hover:bg-surface-alt/40 cursor-not-allowed transition-all ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <HiBriefcase className="w-4 h-4 shrink-0 text-fg-muted" />
            {!collapsed && <span>Custom Portfolio</span>}
          </div>
          {!collapsed && (
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Soon
            </span>
          )}
        </div>
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

        {user ? (
          <div className="space-y-2">
            {!collapsed && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-alt text-xs text-fg-muted truncate">
                <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
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
        ) : (
          <button
            type="button"
            onClick={handleSignIn}
            title={collapsed ? 'Sign In' : undefined}
            className={`w-full rounded-lg bg-primary text-primary-fg hover:bg-primary-hover text-sm font-semibold transition-colors ${collapsed ? 'p-2' : 'px-3 py-2.5'}`}
          >
            {collapsed ? (
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            ) : (
              'Sign In'
            )}
          </button>
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

export default function AppSidebar({ mobileOpen, onMobileClose, collapsed, onToggleCollapse }) {
  const widthClass = collapsed ? 'lg:w-[4.5rem]' : 'lg:w-64';

  return (
    <>
      <aside className={`hidden lg:flex lg:flex-col ${widthClass} lg:shrink-0 lg:sticky lg:top-0 lg:h-screen border-r border-border bg-surface transition-[width] duration-200`}>
        <div className="flex flex-col h-full">
          <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 bg-overlay z-40"
          aria-label="Close sidebar overlay"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={[
          'lg:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-border bg-surface shadow-xl transition-transform duration-200 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        aria-hidden={!mobileOpen}
      >
        <div className="flex flex-col h-full">
          <SidebarContent onNavigate={onMobileClose} collapsed={false} />
        </div>
      </aside>
    </>
  );
}

export function MobileSidebarToggle({ onClick, open }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-nav-hover transition-colors"
      aria-label={open ? 'Close sidebar' : 'Open sidebar'}
      aria-expanded={open}
    >
      {open ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  );
}

export function DesktopSidebarRail({ collapsed, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="hidden lg:flex p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-nav-hover transition-colors"
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <svg className={`w-5 h-5 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
    </button>
  );
}
