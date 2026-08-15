import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PROFILE_DETAILS_PATH } from '../../config/dashboardNav';
import ThemeToggle from '../ThemeToggle';
const NAV_LINKS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
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
    'flex items-center rounded-lg text-sm font-medium transition-all duration-200',
    collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
    isActive
      ? 'bg-nav-active text-fg ring-1 ring-inset ring-accent-border shadow-sm'
      : 'text-fg-muted hover:text-fg hover:bg-nav-hover',
  ].join(' ');
}

function SidebarContent({ onNavigate, collapsed, onToggleCollapse }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const visibleLinks = NAV_LINKS.filter((link) => !link.auth || user);

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
      <NavLink
        to="/dashboard"
        onClick={onNavigate}
        title={collapsed ? 'LinkMakeup' : undefined}
        className={`flex items-center border-b border-border mb-2 transition-all ${collapsed ? 'justify-center px-2 py-4' : 'gap-3 px-3 py-4'}`}
      >
        <div className="w-9 h-9 rounded-lg bg-surface-muted border border-border-strong flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-accent">L</span>
        </div>
        {!collapsed && (
          <span className="font-semibold text-fg tracking-tight">
            Link<span className="text-accent">Makeup</span>
          </span>
        )}
      </NavLink>

      <nav className={`flex-1 py-2 flex flex-col gap-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-3'}`}>
        {visibleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            title={collapsed ? link.label : undefined}
            className={(state) => navLinkClassName(state, collapsed)}
            onClick={onNavigate}
          >
            {link.icon}
            {!collapsed && link.label}
          </NavLink>
        ))}

        {user && (
          <div className={collapsed ? 'mt-3 pt-3 border-t border-border space-y-1' : 'mt-4 pt-4 border-t border-border space-y-1'}>
            {!collapsed && (
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                Profile
              </p>
            )}
            <NavLink
              to={PROFILE_DETAILS_PATH}
              title={collapsed ? 'Profile Details' : undefined}
              className={(state) => navLinkClassName(state, collapsed)}
              onClick={onNavigate}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {!collapsed && 'Profile Details'}
            </NavLink>
          </div>
        )}
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
              className={`w-full rounded-lg border border-border-strong bg-surface text-fg-muted text-sm font-medium hover:bg-nav-hover transition-colors ${collapsed ? 'p-2 flex justify-center' : 'px-3 py-2 text-left'}`}
            >
              {collapsed ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              ) : (
                'Sign Out'
              )}
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
