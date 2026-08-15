import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import { env } from '../config/env';
import AppLayout from './layout/AppLayout';
import { validateImageFile } from '../utils/imageUpload';
import { generateAvatarDataUrl, DUMMY_NAMES } from '../utils/avatar';
import ImageCropper from './ui/ImageCropper';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setProfile } = useAuth();

  const avatarSeed = user?.name && !DUMMY_NAMES.has(user.name) ? user.name : user?.email || 'user';
  const defaultAvatarUrl = generateAvatarDataUrl(avatarSeed);

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState(
    user?.name && !DUMMY_NAMES.has(user.name) ? user.name : ''
  );
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || defaultAvatarUrl);
  const [avatarError, setAvatarError] = useState(false);
  const [availability, setAvailability] = useState({ loading: false, available: null, reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cropSrc, setCropSrc] = useState(null);
  const fileInputRef = useRef(null);
  const cropUrlRef = useRef(null);

  const isCustomAvatar = avatarUrl !== defaultAvatarUrl;

  useEffect(() => () => {
    if (cropUrlRef.current) URL.revokeObjectURL(cropUrlRef.current);
  }, []);

  const openCropper = (url) => {
    if (cropUrlRef.current) URL.revokeObjectURL(cropUrlRef.current);
    cropUrlRef.current = url;
    setCropSrc(url);
  };

  const closeCropper = () => {
    if (cropUrlRef.current) {
      URL.revokeObjectURL(cropUrlRef.current);
      cropUrlRef.current = null;
    }
    setCropSrc(null);
  };

  const resetAvatar = () => {
    setAvatarUrl(defaultAvatarUrl);
    setAvatarError(false);
  };

  const handleAvatarError = () => {
    if (!avatarError) {
      setAvatarError(true);
      resetAvatar();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }
    e.target.value = '';
    setErrorMsg('');
    openCropper(URL.createObjectURL(file));
  };

  const handleCropConfirm = (croppedUrl) => {
    setAvatarUrl(croppedUrl);
    setAvatarError(false);
    closeCropper();
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

  const inputClass =
    'w-full px-3.5 py-2.5 bg-surface-alt border border-border rounded-xl text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-emerald-500 transition-colors';

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center px-3 py-8 sm:px-4 sm:py-12">
        <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-5 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
              Step 2 of 2
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 mb-7">
            <div
              className="relative w-20 h-20 rounded-full border-2 border-border-strong overflow-hidden cursor-pointer group bg-surface-alt"
              onClick={() => fileInputRef.current?.click()}
              title="Upload a profile photo"
            >
              <img
                src={avatarUrl}
                alt="Avatar preview"
                onError={handleAvatarError}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-overlay flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-accent text-xs font-semibold hover:opacity-80 transition-opacity"
              >
                Upload photo
              </button>
              {isCustomAvatar && (
                <button
                  type="button"
                  onClick={resetAvatar}
                  className="text-fg-muted text-xs font-medium underline underline-offset-2 hover:text-fg transition-colors"
                >
                  Remove photo
                </button>
              )}
            </div>

            <div className="text-center mt-1">
              <h1 className="text-2xl font-bold text-fg">Choose your username</h1>
              <p className="text-fg-muted text-sm mt-1 break-words">
                Signed in as <strong className="text-fg break-all">{user?.email}</strong>
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-1.5">
                Your Subdomain
              </label>
              <div className="flex items-center border border-border rounded-xl bg-surface-alt focus-within:border-emerald-500 transition-colors overflow-hidden">
                <span className="hidden sm:block px-3 text-fg-subtle text-sm select-none shrink-0">https://</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="yourname"
                  required
                  className="flex-1 min-w-0 py-2.5 px-1 sm:px-0 bg-transparent text-fg font-bold text-sm focus:outline-none placeholder:text-fg-subtle"
                />
                <span className="px-2 sm:px-3 text-accent font-bold text-xs sm:text-sm select-none shrink-0">.{env.appDomain}</span>
              </div>

              {username && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      availability.loading ? 'bg-amber-500 animate-pulse' : availability.available ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  />
                  <span className={availability.available ? 'text-emerald-600 dark:text-emerald-400' : availability.available === false ? 'text-red-600 dark:text-red-400' : 'text-fg-subtle'}>
                    {availability.reason}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your Name" required className={inputClass} />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !availability.available}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm mt-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating your page...' : 'Launch My Page'}
            </button>
          </form>
        </div>
      </div>
      {cropSrc && (
        <ImageCropper src={cropSrc} onCancel={closeCropper} onCrop={handleCropConfirm} />
      )}
    </AppLayout>
  );
}
