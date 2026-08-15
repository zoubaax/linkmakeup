import { useState, useRef } from 'react';
import ApiService from '../services/api';

export default function ProfileEditor({ profile, onProfileUpdated }) {
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const response = await ApiService.updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
      });
      if (response.success) {
        setSuccessMsg('Profile updated!');
        onProfileUpdated?.({ ...profile, displayName: displayName.trim(), bio: bio.trim(), avatarUrl: avatarUrl.trim() });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-warm-border rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-warm-border">
        <div>
          <h3 className="font-serif text-xl font-bold text-charcoal">Profile Details</h3>
          <p className="text-stone text-xs mt-0.5">Update your avatar, display name & bio</p>
        </div>
        <img
          src={avatarUrl || profile?.avatarUrl}
          alt={displayName}
          className="w-11 h-11 rounded-full object-cover border-2 border-warm-border"
        />
      </div>

      {successMsg && (
        <div className="mb-4 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Avatar Upload */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-soft uppercase tracking-wider mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-14 h-14 rounded-full overflow-hidden border-2 border-warm-border cursor-pointer shrink-0 group relative"
            >
              <img src={avatarUrl || profile?.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <div>
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-warm-border bg-cream text-charcoal-soft text-xs font-semibold hover:bg-cream-dark transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Image
              </button>
              <p className="text-stone text-xs mt-1">JPG, PNG, WebP · max 5MB</p>
            </div>
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-soft uppercase tracking-wider mb-1.5">Display Name</label>
          <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required
            className="w-full px-3.5 py-2.5 bg-cream border border-warm-border rounded-xl text-sm text-charcoal focus:outline-none focus:border-terra transition-colors" />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-soft uppercase tracking-wider mb-1.5">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2}
            placeholder="Tell visitors what you do..."
            className="w-full px-3.5 py-2.5 bg-cream border border-warm-border rounded-xl text-sm text-charcoal focus:outline-none focus:border-terra transition-colors resize-none placeholder:text-stone" />
        </div>

        <button type="submit" disabled={loading}
          className="self-start px-5 py-2.5 rounded-xl bg-terra hover:bg-terra-dark text-white font-bold text-sm transition-colors disabled:opacity-60">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
