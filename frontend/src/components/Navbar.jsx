import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export default function Navbar() {
  const [apiStatus, setApiStatus] = useState('checking'); // 'connected', 'error', 'checking'

  useEffect(() => {
    let isMounted = true;
    ApiService.checkHealth()
      .then(() => {
        if (isMounted) setApiStatus('connected');
      })
      .catch(() => {
        if (isMounted) setApiStatus('error');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 p-[2px] shadow-lg shadow-violet-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-transparent bg-clip-text bg-gradient-to-tr from-violet-400 to-fuchsia-300 text-lg">
              L
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Link<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">Makeup</span>
          </span>
          
          {/* API Connection Health Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium">
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
              API: {apiStatus === 'connected' ? 'Connected' : apiStatus === 'error' ? 'Offline' : 'Checking...'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">Live Preview</a>
          <a href="#dashboard" className="hover:text-white transition-colors">Dashboard Demo</a>
          <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:inline-flex text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Sign In
          </button>
          <button className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-sm shadow-xl shadow-violet-500/20">
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 group-hover:opacity-90 transition-opacity" />
            <span className="relative px-4 py-2 rounded-[11px] bg-slate-950 flex items-center gap-2 text-white group-hover:bg-slate-900 transition-colors">
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z" />
              </svg>
              Continue with Google
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
