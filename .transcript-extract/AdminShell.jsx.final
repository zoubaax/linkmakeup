import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../ui/Logo';
import { AdminNavLinks } from './adminNav';

export default function AdminShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-app text-fg">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-surface/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Logo height={28} />
              <div className="min-w-0">
                <p className="text-sm font-bold text-fg">Platform Admin</p>
                <p className="text-xs text-fg-muted truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-3 py-2 rounded-xl border border-border bg-surface-alt text-xs font-semibold text-fg-muted hover:text-fg"
              >
                Back to Studio
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-fg-muted hover:text-fg"
              >
                Sign out
              </button>
            </div>
          </div>
          <AdminNavLinks />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
