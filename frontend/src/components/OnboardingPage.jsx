import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import { env } from '../config/env';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setProfile } = useAuth();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.email || 'user')}`
  );
  const [availability, setAvailability] = useState({ loading: false, available: null, reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErrorMsg('Please select a valid image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setErrorMsg('Image must be under 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = (evt) => { if (evt.target?.result) { setAvatarUrl(evt.target.result); setErrorMsg(''); } };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!username.trim()) { setAvailability({ loading: false, available: null, reason: '' }); return; }
    setAvailability({ loading: true, available: null, reason: 'Checking...' });
    const timer = setTimeout(async () => {
      try {
        const res = await ApiService.checkUsernameAvailability(username.trim());
        if (res.success && res.data) setAvailability({ loading: false, available: res.data.available, reason: res.data.reason });
      } catch (err) {
        setAvailability({ loading: false, available: false, reason: err.message });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!availability.available) { setErrorMsg('Please choose an available username.'); return; }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await ApiService.createProfile({
        username: username.trim().toLowerCase(),
        displayName: displayName.trim() || username.trim(),
        avatarUrl,
      });
      if (res.success && res.data) {
        setProfile(res.data);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col items-center justify-center px-4 py-12">

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 px-8 py-4 border-b border-warm-border bg-cream/90 backdrop-blur-md z-50 flex items-center justify-between">
        <span className="font-serif text-xl font-bold text-charcoal">
          Link<em className="text-terra not-italic">Makeup</em>
        </span>
        <span className="text-stone text-xs font-medium">Step 2 of 2</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md mt-16 bg-white border border-warm-border rounded-3xl p-8 shadow-sm">

        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-3 mb-7">
          <div
            className="relative w-20 h-20 rounded-full border-2 border-warm-border overflow-hidden cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="text-terra text-xs font-semibold hover:underline">
            Upload photo
          </button>

          <div className="text-center mt-1">
            <h1 className="font-serif text-2xl font-bold text-charcoal">Choose your username</h1>
            <p className="text-stone text-sm mt-1">
              Signed in as <strong className="text-charcoal-soft">{user?.email}</strong>
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-soft uppercase tracking-wider mb-1.5">
              Your Subdomain
            </label>
            <div className="flex items-center border border-warm-border rounded-xl bg-cream focus-within:border-terra transition-colors overflow-hidden">
              <span className="px-3 text-stone text-sm select-none shrink-0">https://</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="yourname"
                required
                className="flex-1 py-2.5 bg-transparent text-charcoal font-bold text-sm focus:outline-none placeholder:text-stone-light"
              />
              <span className="px-3 text-terra font-bold text-sm select-none shrink-0">.{env.appDomain}</span>
            </div>

            {username && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium">
                <span className={`w-2 h-2 rounded-full shrink-0 ${availability.loading ? 'bg-amber-warm animate-pulse' : availability.available ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className={availability.available ? 'text-emerald-600' : availability.available === false ? 'text-red-600' : 'text-stone'}>
                  {availability.reason}
                </span>
              </div>
            )}
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-soft uppercase tracking-wider mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              required
              className="w-full px-3.5 py-2.5 bg-cream border border-warm-border rounded-xl text-sm text-charcoal placeholder:text-stone focus:outline-none focus:border-terra transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !availability.available}
            className="w-full py-3.5 rounded-xl bg-terra hover:bg-terra-dark text-white font-extrabold text-sm mt-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating your page...' : 'Launch My Page 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}
