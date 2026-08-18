import { NavLink } from 'react-router-dom';
import { STUDIO_NAV } from '../../config/dashboardNav';

export default function StudioNav() {
  return (
    <nav
      aria-label="Studio sections"
      className="border-b border-border/80 bg-surface/80 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {STUDIO_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => [
                'shrink-0 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-accent-subtle text-fg border border-accent-border shadow-2xs'
                  : 'text-fg-muted hover:text-fg hover:bg-surface-alt border border-transparent',
              ].join(' ')}
            >
              <span className="sm:hidden">{item.shortLabel}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
