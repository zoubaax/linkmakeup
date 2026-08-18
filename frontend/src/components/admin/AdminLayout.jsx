import { Outlet } from 'react-router-dom';
import PageHeader from '../ui/PageHeader';
import AdminShell from './AdminShell';

export default function AdminLayout() {
  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <PageHeader
          title="Platform Admin"
          description="Monitor users, profiles, and links across LinkMakeup. Access is enforced server-side via ADMIN_EMAILS."
          badge={(
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-border bg-accent-subtle px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Live
            </span>
          )}
        />
        <Outlet />
      </div>
    </AdminShell>
  );
}
