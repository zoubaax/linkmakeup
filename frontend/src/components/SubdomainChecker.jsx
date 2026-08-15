import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export default function SubdomainChecker({ onSelectUsername }) {
  const [username, setUsername] = useState('mohammed');
  const [status, setStatus] = useState({ loading: false, available: null, reason: '' });

  useEffect(() => {
    if (!username.trim()) {
      setStatus({ loading: false, available: null, reason: '' });
      return;
    }

    setStatus({ loading: true, available: null, reason: 'Checking availability...' });
    
    const timeoutId = setTimeout(async () => {
      try {
        const response = await ApiService.checkUsernameAvailability(username.trim());
        if (response.success && response.data) {
          setStatus({
            loading: false,
            available: response.data.available,
            reason: response.data.reason,
          });
          if (onSelectUsername) {
            onSelectUsername(username.trim());
          }
        }
      } catch (err) {
        setStatus({
          loading: false,
          available: false,
          reason: err.message || 'Error connecting to availability service.',
        });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [username, onSelectUsername]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative group p-1.5 rounded-2xl bg-gradient-to-r from-violet-600/40 via-fuchsia-500/40 to-pink-500/40 backdrop-blur-xl border border-slate-800/80 shadow-2xl shadow-violet-900/20">
        <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800/50">
          
          {/* Subdomain Input Field */}
          <div className="flex-1 flex items-center w-full px-3 py-2 bg-slate-900/80 rounded-lg border border-slate-800 focus-within:border-violet-500 transition-colors">
            <span className="text-slate-400 font-mono text-sm select-none">https://</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              placeholder="yourname"
              className="flex-1 bg-transparent px-1.5 py-1 text-white font-semibold placeholder:text-slate-600 focus:outline-none text-base sm:text-lg"
            />
            <span className="text-violet-400 font-semibold font-mono text-sm sm:text-base select-none">
              .linkmakeup.com
            </span>
          </div>

          {/* Action / Availability Button */}
          <button
            type="button"
            className={`w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shrink-0 ${
              status.available
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:shadow-lg hover:shadow-emerald-500/25'
                : status.available === false
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90'
            }`}
          >
            {status.loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Checking...
              </>
            ) : status.available ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                Claim URL
              </>
            ) : (
              'Check Username'
            )}
          </button>
        </div>
      </div>

      {/* Real-time Status Badge Feedback */}
      {status.reason && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium">
          <span
            className={`w-2 h-2 rounded-full ${
              status.loading
                ? 'bg-amber-400 animate-ping'
                : status.available
                ? 'bg-emerald-400'
                : 'bg-rose-400'
            }`}
          />
          <span
            className={
              status.available
                ? 'text-emerald-400'
                : status.available === false
                ? 'text-rose-400'
                : 'text-slate-400'
            }
          >
            {status.reason}
          </span>
        </div>
      )}
    </div>
  );
}
