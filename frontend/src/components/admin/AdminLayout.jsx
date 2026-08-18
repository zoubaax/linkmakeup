import { Outlet } from 'react-router-dom';
import { AdminProvider } from '../../contexts/AdminContext';
import AdminShell from './AdminShell';

export default function AdminLayout() {
  return (
    <AdminProvider>
      <AdminShell>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          <Outlet />
        </div>
      </AdminShell>
    </AdminProvider>
  );
}
