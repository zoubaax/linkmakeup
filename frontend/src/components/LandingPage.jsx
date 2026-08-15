import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import Iridescence from './ui/Iridescence';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleGoogleAuth = async () => {
    try {
      const response = await ApiService.getGoogleAuthUrl();
      if (response.success && response.data?.url) window.location.href = response.data.url;
    } catch (err) {
      console.error('Google Auth failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-4 sm:p-8 flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      
      {/* Top Navbar Header */}
      <header className="w-full max-w-7xl mx-auto py-4 px-2 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-serif font-bold text-2xl tracking-tight text-slate-900">
          Link<span className="text-emerald-600">Makeup</span>
        </Link>

        {/* Right Navigation */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 text-xs font-semibold text-slate-700 tracking-wide uppercase">
            <Link to="/discussions" className="hover:text-emerald-600 transition-colors">Discussions</Link>
            <span className="text-slate-300">•</span>
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <span className="text-slate-300">•</span>
            <a href="#presets" className="hover:text-emerald-600 transition-colors">Presets</a>
          </div>

          {user ? (
            <button
              type="button"
              onClick={() => navigate(profile ? '/dashboard' : '/onboarding')}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black transition-all shadow-xs"
            >
              Go to Dashboard →
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="group flex items-center gap-2.5 p-1.5 pr-4 rounded-xl bg-slate-900 text-white hover:bg-black font-semibold text-xs transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <span>Get Started</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Parley-Style Floating Hero Card Container with Soft Emerald Tint */}
      <div className="relative w-full max-w-7xl mx-auto rounded-[36px] sm:rounded-[44px] border border-emerald-100/80 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/30 shadow-xl shadow-emerald-950/5 flex flex-col justify-between my-4 min-h-[72vh]">
        
        {/* Background WebGL Iridescence Canvas */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Iridescence
            color={[0.02, 0.58, 0.40]} // Emerald green tone
            mouseReact={true}
            amplitude={0.15}
            speed={0.8}
          />
        </div>

        {/* Soft light overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/90 via-white/75 to-emerald-50/60 backdrop-blur-[1px]" />

        {/* Content Container */}
        <div className="relative z-10 p-8 sm:p-14 md:p-20 flex flex-col items-center justify-center text-center my-auto w-full">
          
          <div className="space-y-6 w-full max-w-5xl mx-auto text-center">
            
            {/* Headline - Clean 2 lines */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-slate-900 leading-[1.08] tracking-tight max-w-4xl mx-auto">
              The link page that works&nbsp;<em className="italic font-serif text-emerald-600">with</em>
              <br className="hidden sm:inline" />
              you, not just for you
            </h1>

            {/* Subtext */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
              LinkMakeup empowers creators and developers — claim your custom subdomain, customize themes in real-time, and manage everything from one dashboard.
            </p>

            {/* Parley Chevron Button & Google Auth */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="group flex items-center gap-3 p-2 pr-6 rounded-2xl bg-slate-900 text-white hover:bg-black font-semibold text-sm transition-all shadow-md hover:scale-105 active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <span>Get started free</span>
              </button>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shadow-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                Continue with Google
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Trust Section */}
      <footer className="w-full max-w-7xl mx-auto py-6 text-center space-y-4">
        <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
          Trusted by 200+ creators & developers
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all text-sm font-serif font-bold text-slate-800">
          <span>Cloudplex</span>
          <span>•</span>
          <span>TYTOTONE</span>
          <span>•</span>
          <span>Bloopglow</span>
          <span>•</span>
          <span>Zingzap</span>
          <span>•</span>
          <span>Junotwig</span>
        </div>
      </footer>

    </div>
  );
}
