import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import Logo from './ui/Logo';
import { useTheme } from '../contexts/ThemeContext';
import { HiBolt, HiPaintBrush, HiLink, HiChartBar } from 'react-icons/hi2';
import {
  clearReturnTo,
  resolvePostLoginPath,
  saveReturnTo,
} from '../utils/authRedirect';

// ─── Left Panel: Product Showcase ─────────────────────────────────────────────
function ShowcasePanel() {
  const features = [
    { icon: <HiBolt className="w-5 h-5 text-emerald-400" />, label: 'Sub-50ms edge delivery', sub: 'Served via Cloudflare Workers globally' },
    { icon: <HiPaintBrush className="w-5 h-5 text-emerald-400" />, label: 'Live Theme Studio', sub: 'Real-time preview — no compile delay' },
    { icon: <HiLink className="w-5 h-5 text-emerald-400" />, label: 'Custom subdomain', sub: 'username.linkmakeup.com — instant SSL' },
    { icon: <HiChartBar className="w-5 h-5 text-emerald-400" />, label: 'One unified dashboard', sub: 'All your links, analytics & settings' },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-12 bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-950 text-white relative overflow-hidden">
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/8 rounded-full blur-2xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Logo */}
      <div>
        <Logo className="h-10 brightness-0 invert" />
      </div>

      {/* Center content */}
      <div className="space-y-10 relative z-10">

        {/* Headline */}
        <div className="space-y-3">
          <h2 className="text-3xl xl:text-4xl font-serif font-normal leading-[1.15] text-white">
            Your link page,<br />
            <span className="text-emerald-400 italic">built for how creators actually work.</span>
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
            One dashboard. One subdomain. Real-time everything.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-3">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/8 backdrop-blur-sm">
              <span className="shrink-0 mt-0.5">{f.icon}</span>
              <div>
                <div className="text-sm font-semibold text-white">{f.label}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

// ─── Main Auth Page ────────────────────────────────────────────────────────────
export default function AuthPage({ initialMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, profile, loading, setUser, setProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const defaultMode = initialMode || (location.pathname === '/signup' ? 'signup' : 'signin');
  const [mode, setMode] = useState(defaultMode);

  useEffect(() => {
    if (location.pathname === '/signup') setMode('signup');
    else if (location.pathname === '/login') setMode('signin');
  }, [location.pathname]);

  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const returnTo = searchParams.get('returnTo');

  useEffect(() => { if (returnTo) saveReturnTo(returnTo); }, [returnTo]);

  useEffect(() => {
    if (!loading && user) {
      const destination = resolvePostLoginPath(returnTo, profile, user);
      clearReturnTo();
      navigate(destination, { replace: true });
    }
  }, [loading, user, profile, navigate, returnTo]);

  const handleGoogleAuth = async () => {
    if (returnTo) saveReturnTo(returnTo);
    setGoogleLoading(true);
    setErrorMsg('');
    try {
      const response = await ApiService.getGoogleAuthUrl();
      if (response.success && response.data?.url) window.location.href = response.data.url;
    } catch (err) {
      setErrorMsg(err.message || 'Google Auth failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (mode === 'signup') {
      if (password !== confirmPassword) { setErrorMsg('Passwords do not match.'); return; }
      if (password.length < 6) { setErrorMsg('Password must be at least 6 characters.'); return; }
    }
    setSubmitting(true);
    try {
      const response = mode === 'signup'
        ? await ApiService.signupWithEmail({ email, password, name })
        : await ApiService.loginWithEmail({ email, password });
      if (response.success && response.data) {
        const userObj = response.data.user;
        let profileObj = response.data.profile || null;

        if (!profileObj) {
          try {
            const meResponse = await ApiService.getMe();
            if (meResponse.success && meResponse.data) profileObj = meResponse.data.profile || null;
          } catch {}
        }

        setUser(userObj);
        setProfile(profileObj);
        const destination = resolvePostLoginPath(returnTo, profileObj, userObj);
        clearReturnTo();
        navigate(destination, { replace: true });
      } else {
        setErrorMsg(response.error || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  const inputClass =
    'w-full px-4 py-3 bg-[var(--lm-surface-alt)] border border-[var(--lm-border)] rounded-xl text-sm text-[var(--lm-fg)] placeholder:text-[var(--lm-fg-subtle)] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors';

  return (
    <div className="min-h-screen bg-[var(--lm-app)] text-[var(--lm-fg)] font-sans flex transition-colors duration-300 selection:bg-emerald-600 selection:text-white">
      
      {/* ── Left: Product Showcase (desktop only) ── */}
      <div className="hidden lg:block w-[45%] shrink-0">
        <ShowcasePanel />
      </div>

      {/* ── Right: Auth Form ── */}
      <div className="flex-1 flex flex-col min-h-screen w-full">

        {/* Top bar */}
        <header className="flex items-center justify-between px-4 sm:px-10 py-4 sm:py-5 shrink-0">
          {/* Logo (mobile only — hidden on desktop since left panel has it) */}
          <Link to="/" className="lg:hidden">
            <Logo className="h-8 sm:h-9" />
          </Link>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--lm-fg-muted)] hover:text-[var(--lm-fg)] hover:bg-[var(--lm-surface-muted)] transition-all"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <Link
              to="/"
              className="text-xs font-semibold text-[var(--lm-fg-muted)] hover:text-[var(--lm-fg)] transition-colors"
            >
              ← Home
            </Link>
          </div>
        </header>

        {/* Auth form centered */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-10 py-6 sm:py-8">
          <div className="w-full max-w-sm mx-auto">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl font-serif font-semibold text-[var(--lm-fg)] mb-1">
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="text-sm text-[var(--lm-fg-muted)]">
                {mode === 'signup'
                  ? 'Claim your subdomain and build your presence.'
                  : 'Sign in to manage your LinkMakeup dashboard.'}
              </p>
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-[var(--lm-surface)] border border-[var(--lm-border)] text-[var(--lm-fg)] font-semibold text-sm py-3 rounded-xl hover:bg-[var(--lm-surface-alt)] transition-all shadow-xs mb-4 disabled:opacity-60"
            >
              {googleLoading ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
              )}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 text-[var(--lm-fg-subtle)] text-xs mb-4">
              <div className="h-px w-full bg-[var(--lm-border)]" />
              <span className="shrink-0">or</span>
              <div className="h-px w-full bg-[var(--lm-border)]" />
            </div>

            {/* Sign In / Sign Up toggle */}
            <div className="flex p-1 bg-[var(--lm-surface-alt)] rounded-xl mb-5 border border-[var(--lm-border)]">
              {['signin', 'signup'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMode(m); setErrorMsg(''); navigate(m === 'signup' ? '/signup' : '/login'); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    mode === m
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-[var(--lm-fg-muted)] hover:text-[var(--lm-fg)]'
                  }`}
                >
                  {m === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-400/30 text-red-500 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {mode === 'signup' && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className={inputClass}
                />
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className={inputClass}
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className={inputClass + ' pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--lm-fg-subtle)] hover:text-[var(--lm-fg)] transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {mode === 'signup' && (
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  className={inputClass}
                />
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm mt-1 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 shadow-md"
              >
                {submitting ? 'Processing...' : mode === 'signin' ? 'Sign In →' : 'Claim Your Subdomain →'}
              </button>
            </form>

            {/* Footer note */}
            <p className="mt-6 text-center text-xs text-[var(--lm-fg-subtle)]">
              {mode === 'signin' ? (
                <>Don't have an account? <button onClick={() => { setMode('signup'); navigate('/signup'); }} className="text-emerald-600 font-semibold hover:underline">Sign up free</button></>
              ) : (
                <>Already have an account? <button onClick={() => { setMode('signin'); navigate('/login'); }} className="text-emerald-600 font-semibold hover:underline">Sign in</button></>
              )}
            </p>
          </div>
        </div>

        {/* Bottom footer */}
        <footer className="px-6 sm:px-10 py-4 text-center text-xs text-[var(--lm-fg-subtle)] shrink-0">
          © LinkMakeup · <Link to="/" className="hover:text-emerald-600 transition-colors">Back to home</Link>
        </footer>
      </div>
    </div>
  );
}
