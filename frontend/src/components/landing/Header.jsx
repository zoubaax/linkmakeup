import { Link, useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import { useTheme } from '../../contexts/ThemeContext';

export default function Header({ user, profile }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full max-w-7xl mx-auto py-3 sm:py-4 px-2 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/" className="group transition-transform hover:scale-105 inline-flex items-center shrink-0">
        <Logo className="h-10 sm:h-[52px]" />
      </Link>

      {/* Right Navigation */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-4 text-xs font-semibold tracking-wider uppercase text-[var(--lm-fg-muted)]">
          <a href="#why" className="hover:text-emerald-600 transition-colors">Why Us</a>
          <span className="text-[var(--lm-border-strong)]">•</span>
          <a href="#features" className="hover:text-emerald-600 transition-colors">Server Specs</a>
          <span className="text-[var(--lm-border-strong)]">•</span>
          <a href="#presets" className="hover:text-emerald-600 transition-colors">Theme Studio</a>
        </div>

        {user ? (
          <button
            type="button"
            onClick={() => navigate(profile ? '/dashboard' : '/onboarding')}
            className="px-3.5 sm:px-5 py-2 rounded-xl bg-[var(--lm-inverted)] text-[var(--lm-inverted-fg)] font-bold text-xs hover:opacity-90 transition-all shadow-xs shrink-0"
          >
            Studio →
          </button>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* Theme Toggle */}
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

            {/* Sign In */}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-2.5 sm:px-4 py-2 rounded-xl text-xs font-semibold text-[var(--lm-fg-muted)] hover:text-[var(--lm-fg)] transition-colors"
            >
              Sign In
            </button>

            {/* Get Started CTA */}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="group flex items-center gap-2 p-1.5 sm:pr-4 rounded-xl bg-[var(--lm-inverted)] text-[var(--lm-inverted-fg)] hover:opacity-90 font-semibold text-xs transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <span className="hidden sm:inline">Get Started</span>
            </button>

          </div>
        )}
      </div>
    </header>
  );
}
