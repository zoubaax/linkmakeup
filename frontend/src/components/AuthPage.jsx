import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import { env } from '../config/env';
import {
  clearReturnTo,
  resolvePostLoginPath,
  saveReturnTo,
} from '../utils/authRedirect';

export default function AuthPage({ initialMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, profile, loading, setUser, setProfile } = useAuth();

  const defaultMode = initialMode || (location.pathname === '/signup' ? 'signup' : 'signin');
  const [mode, setMode] = useState(defaultMode);

  useEffect(() => {
    if (location.pathname === '/signup') setMode('signup');
    else if (location.pathname === '/login') setMode('signin');
  }, [location.pathname]);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const returnTo = searchParams.get('returnTo');

  useEffect(() => {
    if (returnTo) saveReturnTo(returnTo);
  }, [returnTo]);

  useEffect(() => {
    if (!loading && user) {
      const destination = resolvePostLoginPath(returnTo, Boolean(profile));
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
        setUser(response.data.user);
        setProfile(response.data.profile || null);
        const destination = resolvePostLoginPath(returnTo, Boolean(response.data.profile));
        clearReturnTo();
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  const inputClass =
    'w-full px-3.5 py-2.5 bg-surface-alt border border-border rounded-xl text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-subtle transition-colors';

  return (
    <div className="min-h-screen bg-app text-fg font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-30">
        <span className="font-bold text-xl tracking-tight text-fg">
          Link<span className="text-accent">Makeup</span>
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(''); navigate('/login'); }}
            className={`text-sm font-medium transition-colors ${mode === 'signin' ? 'text-accent font-semibold' : 'text-fg-muted hover:text-fg'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); navigate('/signup'); }}
            className="px-4 py-2 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-4xl mx-auto w-full">
        <div className="inline-block mb-8 px-4 py-1.5 rounded-full bg-surface border border-border text-fg-muted text-xs font-medium shadow-xs">
          Your custom subdomain:{' '}
          <span className="text-accent font-semibold">username.{env.appDomain}</span>
        </div>

        <h1
          className="font-bold text-fg leading-tight mb-6 tracking-tight"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', maxWidth: '720px' }}
        >
          The link page that works <span className="text-accent">with you</span>
        </h1>

        <p className="text-fg-muted text-base sm:text-lg leading-relaxed mb-10 max-w-md">
          Build your personalized link page, claim your custom subdomain, and manage everything from one dashboard.
        </p>

        {returnTo && (
          <p className="mb-4 text-sm text-fg-muted bg-accent-subtle border border-accent-border px-4 py-2 rounded-lg">
            Sign in to continue where you left off.
          </p>
        )}

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={googleLoading}
          className="flex items-center gap-3 bg-inverted text-inverted-fg font-semibold text-base px-8 py-3.5 rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg mb-4 min-w-64 justify-center disabled:opacity-60"
        >
          {googleLoading ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
            </svg>
          )}
          Continue with Google
        </button>

        <div className="flex items-center gap-4 text-fg-subtle text-xs mb-4">
          <div className="h-px w-20 bg-border" />
          or with email
          <div className="h-px w-20 bg-border" />
        </div>

        <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-7 shadow-sm text-left">
          <div className="flex p-1 bg-surface-alt rounded-xl mb-5">
            {['signin', 'signup'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setErrorMsg('');
                  navigate(m === 'signup' ? '/signup' : '/login');
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m ? 'bg-nav-active text-fg shadow-sm' : 'text-fg-subtle hover:text-fg-muted'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'signup' && (
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className={inputClass} />
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required className={inputClass} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className={inputClass} />
            {mode === 'signup' && (
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" required className={inputClass} />
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-bold text-sm mt-1 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
