import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPublicUserUrl } from '../config/env';
import Logo from './ui/Logo';

export default function SuspendedAccountPage() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const publicUrl = getPublicUserUrl(profile?.username);

  useEffect(() => {
    document.title = 'Account Suspended | LinkMakeup';
  }, []);

  const handleSignOut = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-app flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-red-500/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-amber-500/8 blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-5 border-b border-border/70 bg-surface/80 backdrop-blur-md">
        <Logo height={32} />
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 mx-auto">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-600 dark:text-red-400">
                Account suspended
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-fg tracking-tight">
                Studio access is blocked
              </h1>
              <p className="text-fg-muted leading-relaxed max-w-md mx-auto">
                Your LinkMakeup account has been suspended. You cannot edit your page, manage links, or share your public profile until the suspension is lifted.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface/90 backdrop-blur-sm shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-border/80 bg-surface-alt/60">
              <p className="text-xs font-bold uppercase tracking-wider text-fg-subtle">Account details</p>
            </div>
            <dl className="divide-y divide-border/70">
              <div className="px-5 py-4 flex items-center justify-between gap-4">
                <dt className="text-sm text-fg-muted">Signed in as</dt>
                <dd className="text-sm font-semibold text-fg truncate">{user?.email}</dd>
              </div>
              {profile?.username && (
                <div className="px-5 py-4 flex items-center justify-between gap-4">
                  <dt className="text-sm text-fg-muted">Public page</dt>
                  <dd className="text-sm font-mono font-semibold text-fg-muted line-through decoration-red-500/40 truncate">
                    {publicUrl}
                  </dd>
                </div>
              )}
              {profile?.displayName && (
                <div className="px-5 py-4 flex items-center justify-between gap-4">
                  <dt className="text-sm text-fg-muted">Display name</dt>
                  <dd className="text-sm font-semibold text-fg truncate">{profile.displayName}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 space-y-3">
            <p className="text-sm font-bold text-fg">What this means</p>
            <ul className="space-y-2.5 text-sm text-fg-muted">
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                Your public bio page is hidden from visitors.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                Studio, link editing, and exports are unavailable while suspended.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                Contact support if you believe this was a mistake.
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <a
              href="mailto:support@linkmakeup.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Contact support
            </a>
            {publicUrl && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border bg-surface text-fg-muted hover:text-fg hover:bg-surface-alt font-semibold text-sm transition-colors"
              >
                View public notice
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
