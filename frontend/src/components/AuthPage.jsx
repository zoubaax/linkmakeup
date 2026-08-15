import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import { env } from '../config/env';

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, profile, loading, setUser, setProfile } = useAuth();

  const [mode, setMode] = useState('signin');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!loading && user) {
      navigate(profile ? '/dashboard' : '/onboarding', { replace: true });
    }
  }, [loading, user, profile, navigate]);

  const handleGoogleAuth = async () => {
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
        navigate(response.data.profile ? '/dashboard' : '/onboarding', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col">

      {/* Nav */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-warm-border">
        <span className="font-serif text-2xl font-bold text-charcoal">
          Link<em className="text-terra not-italic">Makeup</em>
        </span>

        <div className="flex items-center gap-5">
          <button
            onClick={() => { setMode('signin'); setErrorMsg(''); }}
            className={`text-sm font-medium transition-colors ${mode === 'signin' ? 'text-terra' : 'text-charcoal-soft hover:text-charcoal'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            className="flex items-center gap-2 bg-charcoal text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <span className="bg-amber-warm text-white rounded px-1 py-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        
        {/* Badge */}
        <div className="inline-block mb-8 px-4 py-1.5 rounded-full bg-cream-dark border border-warm-border text-charcoal-soft text-xs font-medium">
          ✦ Your custom subdomain:{' '}
          <span className="text-terra font-semibold">username.{env.appDomain}</span>
        </div>

        <h1 className="font-serif font-bold text-charcoal leading-tight mb-6"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', maxWidth: '760px' }}>
          The link page that works{' '}
          <em className="text-terra italic">with you,</em>
          <br />not just for you
        </h1>

        <p className="text-charcoal-soft text-base leading-relaxed mb-10 max-w-md">
          Build your personalized link page, claim your custom subdomain, and manage everything from one beautiful dashboard.
        </p>

        {/* Google CTA */}
        <button
          onClick={handleGoogleAuth}
          disabled={googleLoading}
          className="flex items-center gap-3 bg-charcoal text-white font-semibold text-base px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg mb-4 min-w-56 justify-center"
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

        {/* Divider */}
        <div className="flex items-center gap-4 text-stone text-xs mb-4">
          <div className="h-px w-20 bg-warm-border" />
          or with email
          <div className="h-px w-20 bg-warm-border" />
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-sm bg-white border border-warm-border rounded-2xl p-7 shadow-sm">
          {/* Tabs */}
          <div className="flex p-1 bg-cream rounded-xl mb-5">
            {['signin', 'signup'].map((m) => (
              <button key={m} type="button"
                onClick={() => { setMode(m); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-white text-charcoal shadow-sm' : 'text-stone hover:text-charcoal-soft'}`}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'signup' && (
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Full Name" style={{ fontFamily: 'inherit' }}
                className="w-full px-3.5 py-2.5 bg-cream border border-warm-border rounded-xl text-sm text-charcoal placeholder:text-stone focus:outline-none focus:border-terra transition-colors" />
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address" required style={{ fontFamily: 'inherit' }}
              className="w-full px-3.5 py-2.5 bg-cream border border-warm-border rounded-xl text-sm text-charcoal placeholder:text-stone focus:outline-none focus:border-terra transition-colors" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" required style={{ fontFamily: 'inherit' }}
              className="w-full px-3.5 py-2.5 bg-cream border border-warm-border rounded-xl text-sm text-charcoal placeholder:text-stone focus:outline-none focus:border-terra transition-colors" />
            {mode === 'signup' && (
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password" required style={{ fontFamily: 'inherit' }}
                className="w-full px-3.5 py-2.5 bg-cream border border-warm-border rounded-xl text-sm text-charcoal placeholder:text-stone focus:outline-none focus:border-terra transition-colors" />
            )}
            <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-xl bg-terra hover:bg-terra-dark text-white font-bold text-sm mt-1 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? 'Processing...' : mode === 'signin' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>
        </div>

        <p className="text-stone text-xs mt-6">
          Join creators on{' '}
          <span className="text-terra font-semibold">username.{env.appDomain}</span>
        </p>
      </main>
    </div>
  );
}
