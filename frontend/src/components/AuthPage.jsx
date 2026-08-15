import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import { env } from '../config/env';
import Iridescence from './ui/Iridescence';
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
        const userObj = response.data.user;
        let profileObj = response.data.profile || null;

        // If profile wasn't attached, fetch /auth/me to get user profile
        if (!profileObj && mode === 'signin') {
          try {
            const meRes = await ApiService.getCurrentUser();
            if (meRes?.data?.profile) profileObj = meRes.data.profile;
          } catch {
            // fallback
          }
        }

        setUser(userObj);
        setProfile(profileObj);

        const hasProfile = Boolean(profileObj);
        const destination = resolvePostLoginPath(returnTo, hasProfile);
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
    'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-8 flex flex-col items-center justify-between selection:bg-emerald-600 selection:text-white">
      
      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto py-4 px-2 flex items-center justify-between">
        <Link to="/" className="font-serif font-bold text-2xl tracking-tight text-slate-900">
          Link<span className="text-emerald-600">Makeup</span>
        </Link>
        <Link to="/" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
          ← Back to Home
        </Link>
      </header>

      {/* Main Centered Auth Container */}
      <div className="relative w-full max-w-md mx-auto my-auto py-8">
        
        {/* Background WebGL Iridescence Canvas */}
        <div className="absolute inset-0 z-0 opacity-30 rounded-3xl overflow-hidden">
          <Iridescence
            color={[0.02, 0.58, 0.40]}
            mouseReact={true}
            amplitude={0.15}
            speed={0.8}
          />
        </div>

        {/* Auth Card */}
        <div className="relative z-10 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 shadow-2xl text-left animate-page-in">
          
          <div className="text-center mb-6">
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              {mode === 'signup'
                ? 'Claim your custom subdomain and build your profile'
                : 'Sign in to manage your LinkMakeup dashboard'}
            </p>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200">
            {['signin', 'signup'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setErrorMsg('');
                  navigate(m === 'signup' ? '/signup' : '/login');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === m
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-800 font-semibold text-sm py-3 rounded-xl hover:bg-slate-50 transition-all shadow-xs mb-4 disabled:opacity-60"
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

          <div className="flex items-center gap-4 text-slate-400 text-xs mb-4">
            <div className="h-px w-full bg-slate-200" />
            <span>or</span>
            <div className="h-px w-full bg-slate-200" />
          </div>

          {errorMsg && (
            <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-400/30 text-red-600 text-xs font-medium">
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
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm mt-1 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 shadow-md"
            >
              {submitting ? 'Processing...' : mode === 'signin' ? 'Sign In to Dashboard' : 'Claim Your Subdomain'}
            </button>
          </form>
        </div>
      </div>

      <footer className="w-full max-w-7xl mx-auto py-4 text-center text-xs text-slate-400">
        © LinkMakeup — All rights reserved.
      </footer>
    </div>
  );
}
