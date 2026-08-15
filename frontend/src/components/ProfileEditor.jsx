import { useEffect, useRef, useState } from 'react';
import ApiService from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { validateImageFile } from '../utils/imageUpload';
import ImageCropper from './ui/ImageCropper';

import { StatusPill } from './StatusPill';

const inputClass =
  'w-full px-3.5 py-2.5 bg-surface-alt border border-border rounded-xl text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-subtle transition-colors';

export default function ProfileEditor({ profile, onProfileUpdated }) {
  const { success: toastSuccess, error: toastError } = useToast();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [role, setRole] = useState(profile?.role || '');
  const [statusBadge, setStatusBadge] = useState(profile?.statusBadge || 'Available for opportunities');
  const [showStatusBadge, setShowStatusBadge] = useState(profile?.showStatusBadge !== false);
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [avatarShape, setAvatarShape] = useState(profile?.avatarShape || 'circle');
  const [avatarSize, setAvatarSize] = useState(profile?.avatarSize || 'medium');
  const [loading, setLoading] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const fileInputRef = useRef(null);
  const cropUrlRef = useRef(null);

  useEffect(() => () => {
    if (cropUrlRef.current) URL.revokeObjectURL(cropUrlRef.current);
  }, []);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setRole(profile.role || '');
      setStatusBadge(profile.statusBadge || '');
      setShowStatusBadge(profile.showStatusBadge !== false);
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatarUrl || '');
      setAvatarShape(profile.avatarShape || 'circle');
      setAvatarSize(profile.avatarSize || 'medium');
    }
  }, [profile]);

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

  const queueImageForCrop = (file) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }
    setErrorMsg('');
    openCropper(URL.createObjectURL(file));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    queueImageForCrop(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) queueImageForCrop(file);
  };

  const handleCropConfirm = async (croppedUrl) => {
    closeCropper();
    setAvatarUrl(croppedUrl);
    setSavingAvatar(true);
    setErrorMsg('');

    try {
      const response = await ApiService.updateProfile({ avatarUrl: croppedUrl });
      if (!response.success || !response.data) {
        throw new Error('Failed to save profile photo.');
      }
      onProfileUpdated?.({ ...profile, ...response.data });
      toastSuccess('Profile photo saved');
    } catch (err) {
      const msg = err.message || 'Failed to save profile photo.';
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleAvatarShapeChange = async (shape) => {
    setAvatarShape(shape);
    // Optimistic update — update Live Preview immediately, don't wait for API
    onProfileUpdated?.({ ...profile, avatarShape: shape });
    try {
      const response = await ApiService.updateProfile({ avatarShape: shape });
      if (response.success && response.data) {
        // Force the shape we sent — API may return stale value
        onProfileUpdated?.({ ...profile, ...response.data, avatarShape: shape });
        toastSuccess('Avatar shape updated');
      }
    } catch {
      // Revert optimistic update on error
      setAvatarShape(profile?.avatarShape || 'circle');
      onProfileUpdated?.({ ...profile, avatarShape: profile?.avatarShape || 'circle' });
      toastError('Failed to save avatar shape.');
    }
  };

  const handleAvatarSizeChange = async (size) => {
    setAvatarSize(size);
    onProfileUpdated?.({ ...profile, avatarSize: size });
    try {
      const response = await ApiService.updateProfile({ avatarSize: size });
      if (response.success && response.data) {
        onProfileUpdated?.({ ...profile, ...response.data, avatarSize: size });
        toastSuccess('Photo size updated');
      }
    } catch {
      setAvatarSize(profile?.avatarSize || 'medium');
      onProfileUpdated?.({ ...profile, avatarSize: profile?.avatarSize || 'medium' });
      toastError('Failed to save photo size.');
    }
  };

  const getShapeClass = (shape) => {
    if (shape === 'square') return 'rounded-lg';
    if (shape === 'rounded') return 'rounded-2xl';
    return 'rounded-full';
  };

  const STATUS_PRESETS = [
    'Available for opportunities',
    'Open for beauty collabs',
    'Available for freelance & work',
    'Accepting new clients',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await ApiService.updateProfile({
        displayName: displayName.trim(),
        role: role.trim(),
        statusBadge: statusBadge.trim(),
        showStatusBadge,
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
      });
      if (!response.success || !response.data) {
        throw new Error('Failed to update profile.');
      }
      toastSuccess('Profile saved');
      onProfileUpdated?.({ ...profile, ...response.data });
    } catch (err) {
      const msg = err.message || 'Failed to update profile.';
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="profile-details"
      aria-labelledby="profile-details-heading"
      className="scroll-mt-24 bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="pb-4 mb-5 border-b border-border">
        <h3 id="profile-details-heading" className="text-xl font-bold text-fg">
          Profile Details
        </h3>
        <p className="text-fg-subtle text-xs mt-0.5">Update your avatar, display name & bio</p>
      </div>

      {errorMsg && (
        <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">Profile Picture</label>
          <div
            className={`flex items-center gap-4 p-3 rounded-xl border-2 border-dashed transition-colors ${dragOver ? 'border-accent bg-accent-subtle' : 'border-border'}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-14 h-14 ${getShapeClass(avatarShape)} overflow-hidden border-2 border-border-strong cursor-pointer shrink-0 group relative transition-all duration-200`}
            >
              <img src={avatarUrl || profile?.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-overlay flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={savingAvatar}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-surface-alt text-fg-muted text-xs font-semibold hover:bg-nav-hover transition-colors disabled:opacity-40"
              >
                {savingAvatar ? 'Saving photo…' : 'Upload photo'}
              </button>
              <p className="text-fg-subtle text-xs mt-1">JPG, PNG, WebP · max 5MB · saved after you crop</p>
            </div>
          </div>
        </div>

        {/* Avatar Shape & Size Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">Photo Shape</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'circle', label: 'Circle', preview: 'rounded-full' },
                { id: 'rounded', label: 'Rounded', preview: 'rounded-lg' },
                { id: 'square', label: 'Square', preview: 'rounded-none' },
              ].map(({ id, label, preview }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleAvatarShapeChange(id)}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    avatarShape === id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold ring-2 ring-emerald-500/20'
                      : 'border-border bg-surface-alt text-fg-muted hover:text-fg hover:border-border-strong'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 border-2 border-current ${preview}`} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">Photo Size</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'small', label: 'Small' },
                { id: 'medium', label: 'Medium' },
                { id: 'large', label: 'Large' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleAvatarSizeChange(id)}
                  className={`flex items-center justify-center py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all ${
                    avatarSize === id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold ring-2 ring-emerald-500/20'
                      : 'border-border bg-surface-alt text-fg-muted hover:text-fg hover:border-border-strong'
                  }`}
                >
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-1.5">Display Name</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className={inputClass} placeholder="Mohammed Zoubaa" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-1.5">Role / Job Title</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className={inputClass} placeholder="Full-Stack Developer & Software Engineer" />
          </div>
        </div>

        {/* Status Badge Control */}
        <div className="p-4 rounded-xl bg-surface-alt border border-border flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-fg uppercase tracking-wider block">Status Pill Badge</span>
              <span className="text-[11px] text-fg-subtle">Show or hide an active status badge under your profile header</span>
            </div>
            <button
              type="button"
              onClick={() => setShowStatusBadge(!showStatusBadge)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                showStatusBadge ? 'bg-primary' : 'bg-surface-muted'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  showStatusBadge ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {showStatusBadge && (
            <div className="pt-2 flex flex-col gap-3 border-t border-border/60">
              <div>
                <span className="text-xs font-semibold text-fg-muted block mb-1.5">Quick Status Presets</span>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setStatusBadge(preset)}
                      className={`p-1 rounded-xl transition-all ${
                        statusBadge.replace(/^[🟢💄💼🌟✨⚡️\s]+/, '').trim() === preset
                          ? 'ring-2 ring-accent/40 scale-[1.02]'
                          : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      <StatusPill statusBadge={preset} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-fg-muted">Custom Status Text</span>
                  <span className="text-xs text-fg-subtle flex items-center gap-1">
                    Preview: <StatusPill statusBadge={statusBadge} />
                  </span>
                </div>
                <input
                  type="text"
                  value={statusBadge}
                  onChange={(e) => setStatusBadge(e.target.value)}
                  placeholder="Available for opportunities..."
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-1.5">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} placeholder="Tell visitors what you do..." className={`${inputClass} resize-none`} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="self-start px-5 py-2.5 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {cropSrc && (
        <ImageCropper src={cropSrc} onCancel={closeCropper} onCrop={handleCropConfirm} />
      )}
    </section>
  );
}
