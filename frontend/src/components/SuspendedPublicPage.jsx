import Logo from './ui/Logo';

export default function SuspendedPublicPage({ username, displayName, landingUrl }) {
  const label = displayName || username;

  return (
    <div className="min-h-screen bg-app flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-red-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400 mx-auto">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
            Temporarily unavailable
          </p>
          <h1 className="text-3xl font-bold text-fg tracking-tight">This page isn&apos;t live</h1>
          <p className="text-fg-muted leading-relaxed">
            <strong className="text-fg">{label}</strong>
            {username && (
              <span className="text-fg-subtle"> (@{username})</span>
            )}
            {' '}is not publicly accessible at the moment. The owner may be updating their page or it may be under review.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-5 text-left space-y-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-alt border border-border text-fg-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-fg">Are you the page owner?</p>
              <p className="text-sm text-fg-muted mt-0.5">Sign in to view your account status or contact support if you believe this is a mistake.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={landingUrl}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
          >
            Go to LinkMakeup
          </a>
          <a
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border bg-surface text-fg-muted hover:text-fg hover:bg-surface-alt font-semibold text-sm transition-colors w-full sm:w-auto"
          >
            Sign in
          </a>
        </div>

        <div className="pt-4 flex justify-center opacity-80">
          <Logo height={28} />
        </div>
      </div>
    </div>
  );
}
