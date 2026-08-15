import { useState, useEffect } from 'react';
import ApiService from '../services/api';
import UsernameOnboarding from './UsernameOnboarding';

export default function AuthPage() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking'); // 'connected' | 'error' | 'checking'
  
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    // Check backend health and session state
    ApiService.checkHealth()
      .then(() => {
        if (isMounted) setApiStatus('connected');
        // Fetch real logged-in user from Neon PostgreSQL session
        return ApiService.getCurrentUser();
      })
      .then((res) => {
        if (isMounted && res?.success && res.data?.user) {
          setUser(res.data.user);
          setUserProfile(res.data.profile || null);
        }
      })
      .catch(() => {
        if (isMounted) setApiStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Google OAuth Redirect
  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setErrorMsg('');
    try {
      const response = await ApiService.getGoogleAuthUrl();
      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      setErrorMsg(err.message || 'Google Auth initiation failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Email / Password Login or Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const response = await ApiService.signupWithEmail({ email, password, name });
        if (response.success && response.data) {
          setUser(response.data.user);
          setUserProfile(response.data.profile || null);
        }
      } else {
        const response = await ApiService.loginWithEmail({ email, password });
        if (response.success && response.data) {
          setUser(response.data.user);
          setUserProfile(response.data.profile || null);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await ApiService.logout();
      setUser(null);
      setUserProfile(null);
      setSuccessMsg('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans antialiased selection:bg-violet-500 selection:text-white">
      
      {/* Background Gradients */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-violet-600/25 via-fuchsia-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 p-[2px] shadow-lg shadow-violet-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-tr from-violet-400 to-fuchsia-300 text-lg">
              L
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Link<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">Makeup</span>
          </span>
        </div>

        {/* API Health Status */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium backdrop-blur-md">
          <span
            className={`w-2 h-2 rounded-full ${
              apiStatus === 'connected'
                ? 'bg-emerald-400 animate-pulse'
                : apiStatus === 'error'
                ? 'bg-rose-500'
                : 'bg-amber-400 animate-ping'
            }`}
          />
          <span className="text-slate-400">
            API: {apiStatus === 'connected' ? 'Connected' : apiStatus === 'error' ? 'Offline' : 'Connecting...'}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        {user && !userProfile ? (
          /* Step 2: Username Onboarding Flow for Real User */
          <UsernameOnboarding
            user={user}
            onProfileCreated={(createdProfile) => setUserProfile(createdProfile)}
            onSignOut={handleLogout}
          />
        ) : user && userProfile ? (
          /* Completed Profile View */
          <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 mx-auto p-0.5 shadow-xl shadow-violet-500/20">
              <img
                src={userProfile.avatarUrl || user.avatarUrl}
                alt={userProfile.displayName}
                className="w-full h-full rounded-full object-cover border-2 border-slate-950"
              />
            </div>

            <div>
              <div className="px-3 py-1 inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                🎉 Your LinkMakeup Page is Live!
              </div>
              <h2 className="text-2xl font-bold text-white">{userProfile.displayName}</h2>
              <a
                href={`https://${userProfile.username}.linkmakeup.com`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 font-mono text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 hover:underline"
              >
                https://{userProfile.username}.linkmakeup.com
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Step 1: Login / Sign Up Form */
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero Description */}
            <div className="md:col-span-6 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300 backdrop-blur-md">
                ✨ Your custom vanity domain: username.linkmakeup.com
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {mode === 'signin' ? 'Welcome Back to' : 'Create Your Account on'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
                  LinkMakeup
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md mx-auto md:mx-0">
                Sign up with Google or Email & Password. Next, pick your custom <strong className="text-slate-200">username.linkmakeup.com</strong> profile!
              </p>

              <div className="pt-2 flex flex-col gap-3 text-xs sm:text-sm font-medium text-slate-300">
                <div className="flex items-center justify-center md:justify-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</div>
                  <span>Google OAuth 2.0 & Email Authentication</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</div>
                  <span>Real-Time Subdomain Availability Check</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</div>
                  <span>Neon PostgreSQL Data Storage</span>
                </div>
              </div>
            </div>

            {/* Right Auth Card */}
            <div className="md:col-span-6 w-full max-w-md mx-auto">
              <div className="p-8 rounded-3xl bg-slate-900/85 border border-slate-800 shadow-2xl shadow-violet-950/30 backdrop-blur-xl relative">
                
                <div className="space-y-5">
                  
                  {/* Mode Switcher Tabs */}
                  <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        mode === 'signin'
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        mode === 'signup'
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-bold text-white">
                      {mode === 'signin' ? 'Sign in to LinkMakeup' : 'Create your Account'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {mode === 'signin' ? 'Welcome back! Enter your details.' : 'Register with your email or Google account.'}
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-300">
                      {errorMsg}
                    </div>
                  )}

                  {successMsg && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300">
                      {successMsg}
                    </div>
                  )}

                  {/* Primary Google Auth Button */}
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={googleLoading}
                    className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-700 hover:border-violet-500/60 hover:bg-slate-900 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-3 shadow-lg group relative overflow-hidden"
                  >
                    {googleLoading ? (
                      <span className="flex items-center gap-2 text-xs">
                        <svg className="animate-spin h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Redirecting to Google...
                      </span>
                    ) : (
                      <>
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                          <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                          <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
                          <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                        </svg>
                        <span>Continue with Google</span>
                      </>
                    )}
                  </button>

                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-slate-800 w-full" />
                    <span className="bg-slate-900 px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider relative">
                      or use email
                    </span>
                  </div>

                  {/* Email & Password Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {mode === 'signup' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                        required
                      />
                    </div>

                    {mode === 'signup' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                          required
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs tracking-wide transition-all shadow-lg shadow-violet-900/30 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Processing...
                        </>
                      ) : mode === 'signin' ? (
                        'Sign In & Continue'
                      ) : (
                        'Create Account & Pick Username'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-600 z-10">
        © {new Date().getFullYear()} LinkMakeup. All rights reserved.
      </footer>
    </div>
  );
}
