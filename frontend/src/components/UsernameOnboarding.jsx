import { useState, useEffect, useRef } from 'react';
import ApiService from '../services/api';

export default function UsernameOnboarding({ user, onProfileCreated, onSignOut }) {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState(
    user?.name && user.name !== 'Google Authenticated User' && user.name !== 'Google User'
      ? user.name
      : ''
  );
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.email || 'user')}`
  );
  const [availability, setAvailability] = useState({ loading: false, available: null, reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  // Handle local image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target?.result;
      if (base64Image) {
        setAvatarUrl(base64Image);
        setErrorMsg('');
      }
    };
    reader.readAsDataURL(file);
  };

  // Check username availability as user types
  useEffect(() => {
    if (!username.trim()) {
      setAvailability({ loading: false, available: null, reason: 'Enter a username' });
      return;
    }

    setAvailability({ loading: true, available: null, reason: 'Checking availability...' });

    const timeoutId = setTimeout(async () => {
      try {
        const response = await ApiService.checkUsernameAvailability(username.trim());
        if (response.success && response.data) {
          setAvailability({
            loading: false,
            available: response.data.available,
            reason: response.data.reason,
          });
        }
      } catch (err) {
        setAvailability({
          loading: false,
          available: false,
          reason: err.message || 'Error checking availability',
        });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!availability.available) {
      setErrorMsg('Please choose an available username.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await ApiService.createProfile({
        username: username.trim().toLowerCase(),
        displayName: displayName.trim() || username.trim(),
        avatarUrl,
      });

      if (response.success && response.data) {
        onProfileCreated(response.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-violet-950/40 backdrop-blur-xl space-y-6">
        
        {/* Profile Picture Upload Header */}
        <div className="text-center space-y-3">
          <div className="relative group w-20 h-20 rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-amber-400 mx-auto p-0.5 shadow-xl shadow-violet-500/25 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img
              src={avatarUrl}
              alt={displayName || user?.email}
              className="w-full h-full rounded-full object-cover border-2 border-slate-950 bg-slate-900"
            />
            <div className="absolute inset-0 rounded-full bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
              Upload
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <div>
            <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
              Step 2 of 2: Personalize Your Page
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-2">
              Choose Your Username
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Signed in as <strong className="text-slate-200">{user?.email}</strong>
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-300 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Claim Your LinkMakeup Subdomain URL <span className="text-rose-400">*</span>
            </label>
            <div className="flex items-center px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 focus-within:border-violet-500 transition-colors">
              <span className="text-slate-500 text-xs font-mono select-none">https://</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="mohammed"
                className="flex-1 bg-transparent px-1 text-white font-bold text-sm focus:outline-none placeholder:text-slate-700"
                required
              />
              <span className="text-violet-400 font-mono text-xs font-bold select-none">
                .linkmakeup.com
              </span>
            </div>

            {/* Live Availability Status */}
            {username && (
              <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
                <span
                  className={`w-2 h-2 rounded-full ${
                    availability.loading
                      ? 'bg-amber-400 animate-ping'
                      : availability.available
                      ? 'bg-emerald-400'
                      : 'bg-rose-500'
                  }`}
                />
                <span
                  className={
                    availability.available
                      ? 'text-emerald-400 font-semibold'
                      : availability.available === false
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }
                >
                  {availability.reason}
                </span>
              </div>
            )}
          </div>

          {/* Display Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Display Name <span className="text-rose-400">*</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-1.5">
              The public headline shown on top of your profile
            </p>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Mohammed Zoubaa"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !availability.available}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white font-extrabold text-sm tracking-wide transition-all shadow-xl shadow-violet-950/50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating Your Profile...
              </>
            ) : (
              'Launch My LinkMakeup Page 🚀'
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={onSignOut}
            className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors"
          >
            Sign out and switch account
          </button>
        </div>
      </div>
    </div>
  );
}
