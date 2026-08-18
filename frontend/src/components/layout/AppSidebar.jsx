import { NavLink, useNavigate } from 'react-router-dom';
import { HiCalendarDays, HiBriefcase, HiArrowRightOnRectangle } from 'react-icons/hi2';
import { useAuth } from '../../contexts/AuthContext';
import { PROFILE_DETAILS_PATH } from '../../config/dashboardNav';
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

      {/* Cloudflare-style Nav Section */}
      <nav className={`flex-1 py-3 flex flex-col gap-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-3'}`}>
        <NavLink
          to="/dashboard"
          end
          title={collapsed ? 'Studio' : undefined}
          className={(state) => navLinkClassName(state, collapsed)}
          onClick={onNavigate}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <svg className="w-4 h-4 shrink-0 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {!collapsed && <span>Studio Overview</span>}
          </div>
          {!collapsed && (
            <svg className="w-3 h-3 text-fg-subtle shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </NavLink>

        {user && (
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
