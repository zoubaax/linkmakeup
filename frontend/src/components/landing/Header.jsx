import { Link, useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';

export default function Header({ user, profile }) {
  const navigate = useNavigate();

  return (
    <header className="w-full max-w-7xl mx-auto py-4 px-2 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/" className="group transition-transform hover:scale-105 inline-flex items-center">
        <Logo height={44} />
      </Link>

      {/* Right Navigation */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-600 tracking-wider uppercase">
          <a href="#features" className="hover:text-emerald-600 transition-colors">Server Specs</a>
          <span className="text-slate-300">•</span>
          <a href="#presets" className="hover:text-emerald-600 transition-colors">Theme Studio</a>
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
  );
}
