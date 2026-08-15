import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import { env } from '../config/env';
import AppLayout from './layout/AppLayout';
import { validateImageFile } from '../utils/imageUpload';
import { generateAvatarDataUrl, DUMMY_NAMES } from '../utils/avatar';
import ImageCropper from './ui/ImageCropper';
import Stepper, { Step } from './ui/Stepper';
import LiveMobilePreview from './LiveMobilePreview';
import Logo from './ui/Logo';
import { THEME_PRESETS } from '../utils/themePresets';
import { LAYOUT_STYLES } from '../utils/themeStyles';
import { PLATFORM_PRESETS, getPlatformPreset, getPlatformIcon } from './SocialIcons';
import { HiPlus, HiTrash, HiOutlineSparkles, HiXMark, HiEye, HiChevronDown, HiChevronUp, HiSwatch } from 'react-icons/hi2';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setProfile } = useAuth();

  const avatarSeed = user?.name && !DUMMY_NAMES.has(user.name) ? user.name : user?.email || 'user';
  const defaultAvatarUrl = generateAvatarDataUrl(avatarSeed);

  // Form State
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState(
    user?.name && !DUMMY_NAMES.has(user.name) ? user.name : ''
  );
  const [role, setRole] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || defaultAvatarUrl);
  const [avatarShape, setAvatarShape] = useState('circle');
  const [layoutStyle, setLayoutStyle] = useState('minimal');
  const [presetTheme, setPresetTheme] = useState('minimal-mono');

  // Custom Colors State
  const [customColors, setCustomColors] = useState({
    backgroundColor: '#0b0f19',
    cardColor: '#161e2e',
    textColor: '#f8fafc',
    accentColor: '#10b981',
  });
  const [showCustomColors, setShowCustomColors] = useState(false);

  // Links State (Default: LinkedIn & GitHub)
  const [initialLinks, setInitialLinks] = useState([
    { title: 'LinkedIn', url: 'https://linkedin.com/in/', icon: 'linkedin' },
    { title: 'GitHub', url: 'https://github.com/', icon: 'github' },
  ]);

  // Modal State
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const [avatarError, setAvatarError] = useState(false);
  const [availability, setAvailability] = useState({ loading: false, available: null, reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cropSrc, setCropSrc] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
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

  // Subdomain Availability check
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

  // Initial links helper functions
  const handleLinkChange = (index, field, value) => {
    setInitialLinks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSelectPresetTheme = (preset) => {
    setPresetTheme(preset.id);
    setCustomColors({
      backgroundColor: preset.backgroundColor,
      cardColor: preset.cardColor,
      textColor: preset.textColor,
      accentColor: preset.accentColor,
    });
  };

  const handleSelectPlatform = (platformObj) => {
    if (editingIndex !== null) {
      // Change icon of existing link
      setInitialLinks((prev) => {
        const copy = [...prev];
        copy[editingIndex] = {
          ...copy[editingIndex],
          icon: platformObj.icon || platformObj.id,
          title: copy[editingIndex].title === 'My New Link' ? platformObj.name : copy[editingIndex].title,
        };
        return copy;
      });
      setEditingIndex(null);
    } else {
      // Add new link with chosen platform
      setInitialLinks((prev) => [
        ...prev,
        {
          title: platformObj.name,
          url: platformObj.baseUrl || 'https://',
          icon: platformObj.icon || platformObj.id,
        },
      ]);
    }
    setPickerOpen(false);
  };

  const handleRemoveLink = (index) => {
    setInitialLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Complete Setup: Save Profile + Initial Links + Redirect to Studio
  const handleCompleteSetup = async () => {
    if (!availability.available) {
      setErrorMsg('Please choose an available username first.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const themeConfig = {
        preset: presetTheme,
        layoutStyle,
        cardColor: customColors.cardColor,
        textColor: customColors.textColor,
        accentColor: customColors.accentColor,
        backgroundColor: customColors.backgroundColor,
      };

      // 1. Create User Profile
      const res = await ApiService.createProfile({
        username: username.trim().toLowerCase(),
        displayName: displayName.trim() || username.trim(),
        role: role.trim(),
        avatarUrl,
        avatarShape,
        themeConfig,
      });

      if (res.success && res.data) {
        setProfile(res.data);

        // 2. Create Initial Links (Filter non-empty links)
        const validLinks = initialLinks.filter((l) => l.url.trim());
        for (let i = 0; i < validLinks.length; i++) {
          const link = validLinks[i];
          try {
            await ApiService.createLink({
              title: link.title || 'My Link',
              url: link.url.startsWith('http') ? link.url : `https://${link.url}`,
              icon: link.icon || 'globe',
              position: i,
            });
          } catch (linkErr) {
            console.error('Failed to create onboarding link:', linkErr);
          }
        }

        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewProfileObj = {
    displayName: displayName || 'Your Name',
    username: username || 'yourname',
    role: role || 'Digital Creator',
    avatarUrl,
    avatarShape,
    themeConfig: {
      preset: presetTheme,
      layoutStyle,
      cardColor: customColors.cardColor,
      textColor: customColors.textColor,
      accentColor: customColors.accentColor,
      backgroundColor: customColors.backgroundColor,
    },
  };

  const previewLinksList = initialLinks
    .filter((l) => l.url.trim())
    .map((l, idx) => ({
      id: `preview-${idx}`,
      title: l.title || 'My Link',
      url: l.url,
      icon: l.icon || 'globe',
      isActive: true,
    }));

  const inputClass =
    'w-full px-3.5 py-2.5 bg-surface-alt border border-border rounded-xl text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-emerald-500 transition-colors font-medium';

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-4rem)]">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Logo height={34} className="mx-auto mb-2" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-fg tracking-tight">Create Your Bio Link Page</h1>
          <p className="text-xs sm:text-sm text-fg-subtle mt-1">
            Set up your handle, profile details, first links, and design.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-md mx-auto mb-4 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Floating Mobile Preview Toggle Button (Shown ONLY on Step 4) */}
        {activeStep === 4 && (
          <div className="lg:hidden flex justify-center mb-4 animate-fade-in">
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              <HiEye className="w-4 h-4" />
              <span>View Live Page Preview</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start max-w-5xl mx-auto">
          
          {/* Left: 4-Step Animated Stepper Onboarding */}
          <div className="w-full">
            <Stepper
              initialStep={1}
              onStepChange={(step) => setActiveStep(step)}
              onFinalStepCompleted={handleCompleteSetup}
              backButtonText="← Previous"
              nextButtonText={activeStep === 4 ? (isSubmitting ? 'Launching...' : '🚀 Launch Page') : 'Next Step →'}
              nextButtonProps={{
                disabled: (activeStep === 2 && !availability.available) || isSubmitting,
              }}
            >
              {/* STEP 1: Avatar & Display Name */}
              <Step>
                <div className="flex flex-col gap-4 py-1">
                  <div className="text-left">
                    <h2 className="text-base font-bold text-fg">Step 1: Your Profile Identity</h2>
                    <p className="text-xs text-fg-subtle mt-0.5">Upload your avatar photo, enter your name, and role headline.</p>
                  </div>

                  <div className="flex flex-col items-center justify-center py-2 gap-3 bg-surface-alt/50 border border-border/70 rounded-2xl p-4">
                    <div
                      className="relative w-20 h-20 rounded-full border-2 border-border-strong overflow-hidden cursor-pointer group bg-surface-alt shadow-xs"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload profile photo"
                    >
                      <img
                        src={avatarUrl}
                        alt="Avatar preview"
                        onError={handleAvatarError}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:underline"
                      >
                        Upload photo
                      </button>
                      {isCustomAvatar && (
                        <button
                          type="button"
                          onClick={resetAvatar}
                          className="text-fg-muted text-xs font-medium underline hover:text-fg"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-left">
                    <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Ahmed Nassiri"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="text-left">
                    <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider mb-1.5">
                      Role / Bio Headline
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Full-Stack Developer & Creator"
                      className={inputClass}
                    />
                    <p className="text-[11px] text-fg-subtle mt-1">Short subtitle shown right below your name on your page.</p>
                  </div>
                </div>
              </Step>

              {/* STEP 2: Subdomain / Handle */}
              <Step>
                <div className="flex flex-col gap-4 py-1 text-left">
                  <div>
                    <h2 className="text-base font-bold text-fg">Step 2: Choose your Subdomain Handle</h2>
                    <p className="text-xs text-fg-subtle mt-0.5">This will be your official web address.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider mb-1.5">
                      Subdomain URL
                    </label>
                    <div className="flex items-center border border-border rounded-xl bg-surface-alt focus-within:border-emerald-500 transition-colors overflow-hidden">
                      <span className="hidden sm:block px-3 text-fg-subtle text-xs font-mono select-none shrink-0">https://</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                        placeholder="yourname"
                        required
                        className="flex-1 min-w-0 py-2.5 px-3 sm:px-0 bg-transparent text-fg font-bold text-sm focus:outline-none placeholder:text-fg-subtle font-mono"
                      />
                      <span className="px-3 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono select-none shrink-0">.{env.appDomain}</span>
                    </div>

                    {username && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold">
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
                </div>
              </Step>

              {/* STEP 3: Add Your First Links */}
              <Step>
                <div className="flex flex-col gap-3 py-1 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold text-fg">Step 3: Add Your First Links</h2>
                      <p className="text-xs text-fg-subtle mt-0.5">Choose your platforms & social links.</p>
                    </div>

                    {/* Add Link Button (Opens Social Icon Picker Modal) */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingIndex(null);
                        setPickerOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-2xs transition-transform active:scale-95 shrink-0"
                    >
                      <HiPlus className="w-4 h-4" />
                      <span>Add Link</span>
                    </button>
                  </div>

                  {/* Links List */}
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {initialLinks.length === 0 ? (
                      <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-surface-alt/30 flex flex-col items-center justify-center gap-2">
                        <p className="text-xs text-fg-subtle">No links added yet.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingIndex(null);
                            setPickerOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-500"
                        >
                          + Select a Platform Link
                        </button>
                      </div>
                    ) : (
                      initialLinks.map((link, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-border/80 bg-surface-alt/50 space-y-2 relative group">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {/* Clickable Icon Button to Change Platform */}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingIndex(idx);
                                  setPickerOpen(true);
                                }}
                                title="Change platform icon"
                                className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-fg hover:border-emerald-500 transition-colors shrink-0 shadow-2xs"
                              >
                                {getPlatformIcon(link.icon, 'w-4 h-4')}
                              </button>
                              
                              <input
                                type="text"
                                value={link.title}
                                onChange={(e) => handleLinkChange(idx, 'title', e.target.value)}
                                placeholder="Link Title"
                                className="w-full text-xs font-bold bg-transparent text-fg focus:outline-none border-b border-transparent focus:border-emerald-500"
                              />
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => handleRemoveLink(idx)}
                              className="p-1 rounded text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                              title="Remove link"
                            >
                              <HiTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs text-fg font-mono focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Step>

              {/* STEP 4: Choose Design & Colors */}
              <Step>
                <div className="flex flex-col gap-4 py-1 text-left">
                  <div>
                    <h2 className="text-base font-bold text-fg">Step 4: Choose Design & Colors</h2>
                    <p className="text-xs text-fg-subtle mt-0.5">Select layout style, color palette, or customize your colors.</p>
                  </div>

                  {/* Photo Shape Selection */}
                  <div>
                    <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider mb-1.5">
                      Photo Shape
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'circle', label: 'Circle' },
                        { id: 'rounded', label: 'Rounded' },
                        { id: 'square', label: 'Square' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAvatarShape(item.id)}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                            avatarShape === item.id
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                              : 'border-border bg-surface-alt text-fg-muted hover:text-fg'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* UI Layout Style Selection */}
                  <div>
                    <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider mb-1.5">
                      UI Layout Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {LAYOUT_STYLES.slice(0, 6).map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setLayoutStyle(style.id)}
                          className={`py-2.5 px-2.5 rounded-xl border text-xs font-bold transition-all truncate ${
                            layoutStyle === style.id
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                              : 'border-border bg-surface-alt text-fg-muted hover:text-fg'
                          }`}
                        >
                          {style.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme Presets */}
                  <div>
                    <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider mb-1.5">
                      Color Palette
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                      {THEME_PRESETS.slice(0, 6).map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPresetTheme(preset)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                            presetTheme === preset.id
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                              : 'border-border bg-surface-alt text-fg-muted hover:text-fg'
                          }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full shrink-0 border border-black/20"
                            style={{ backgroundColor: preset.backgroundColor }}
                          />
                          <span className="truncate">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Expandable Custom Colors Picker Accordion */}
                  <div className="border border-border/80 rounded-2xl bg-surface-alt/40 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowCustomColors(!showCustomColors)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-fg hover:bg-surface-alt transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <HiSwatch className="w-4 h-4 text-violet-500" />
                        <span>Custom Color Pickers</span>
                      </span>
                      {showCustomColors ? <HiChevronUp className="w-4 h-4" /> : <HiChevronDown className="w-4 h-4" />}
                    </button>

                    {showCustomColors && (
                      <div className="p-3.5 border-t border-border/60 grid grid-cols-2 gap-3 animate-fade-in">
                        {[
                          { key: 'backgroundColor', label: 'Background' },
                          { key: 'cardColor', label: 'Card / Buttons' },
                          { key: 'textColor', label: 'Text Color' },
                          { key: 'accentColor', label: 'Accent Color' },
                        ].map(({ key, label }) => (
                          <div key={key}>
                            <label className="block text-[10px] font-bold text-fg-muted uppercase mb-1">
                              {label}
                            </label>
                            <div className="flex items-center gap-2 bg-surface p-1.5 rounded-xl border border-border focus-within:border-emerald-500 transition-colors">
                              {/* Native colour swatch — click to open OS picker */}
                              <input
                                type="color"
                                value={customColors[key]}
                                onChange={(e) => setCustomColors((p) => ({ ...p, [key]: e.target.value }))}
                                className="w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent shrink-0"
                              />
                              {/* Editable hex text field */}
                              <input
                                type="text"
                                value={customColors[key]}
                                maxLength={7}
                                spellCheck={false}
                                placeholder="#000000"
                                onChange={(e) => {
                                  const val = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                                  setCustomColors((p) => ({ ...p, [key]: val }));
                                }}
                                onBlur={(e) => {
                                  // Validate hex on blur; reset to current if invalid
                                  const valid = /^#[0-9A-Fa-f]{6}$/.test(e.target.value);
                                  if (!valid) setCustomColors((p) => ({ ...p, [key]: p[key] }));
                                }}
                                className="flex-1 min-w-0 bg-transparent text-[11px] font-mono font-semibold text-fg uppercase focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Step>

            </Stepper>
          </div>

          {/* Right Column: Sticky Live Mobile Preview (Desktop View) */}
          <div className="hidden lg:block sticky top-20">
            <div className="text-center mb-3">
              <span className="px-3 py-1 rounded-full bg-surface border border-border text-xs text-fg-muted font-bold inline-flex items-center gap-1.5">
                <HiOutlineSparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Live Onboarding Preview</span>
              </span>
            </div>
            <LiveMobilePreview profile={previewProfileObj} links={previewLinksList} />
          </div>

        </div>

      </div>

      {/* Platform Selector Modal */}
      {pickerOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-overlay"
            aria-label="Close platform selector"
            onClick={() => {
              setPickerOpen(false);
              setEditingIndex(null);
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Select Platform"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm rounded-3xl border border-border bg-surface shadow-2xl p-5 animate-scale-in">
              <div className="flex items-center justify-between gap-3 mb-3 border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-bold text-fg">Select Platform Icon</h3>
                  <p className="text-xs text-fg-subtle">Pick a social platform for your link</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPickerOpen(false);
                    setEditingIndex(null);
                  }}
                  className="p-1.5 rounded-full text-fg-muted hover:text-fg hover:bg-surface-alt"
                >
                  <HiXMark className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of Platforms */}
              <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {PLATFORM_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPlatform(preset)}
                    className="flex items-center gap-2.5 p-2.5 rounded-2xl border border-border bg-surface-alt hover:bg-nav-hover hover:border-emerald-500/60 text-xs font-bold text-fg transition-all text-left group"
                  >
                    <div className="w-7 h-7 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      {getPlatformIcon(preset.icon || preset.id, 'w-4 h-4')}
                    </div>
                    <span className="truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Live Preview Modal Drawer */}
      {previewModalOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-overlay backdrop-blur-xs"
            aria-label="Close mobile live preview"
            onClick={() => setPreviewModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Live Page Preview"
            className="fixed inset-x-0 bottom-0 top-12 z-50 flex items-center justify-center p-3 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm h-full max-h-[640px] rounded-3xl border border-border bg-surface shadow-2xl p-4 flex flex-col items-center justify-between animate-slide-up">
              <div className="w-full flex items-center justify-between border-b border-border pb-2 mb-2">
                <span className="text-xs font-bold text-fg flex items-center gap-1.5">
                  <HiOutlineSparkles className="w-4 h-4 text-emerald-500" />
                  <span>Live Page Preview</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  className="p-1.5 rounded-full text-fg-muted hover:text-fg hover:bg-surface-alt"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 w-full overflow-hidden flex items-center justify-center py-2">
                <LiveMobilePreview profile={previewProfileObj} links={previewLinksList} />
              </div>
            </div>
          </div>
        </>
      )}

      {cropSrc && (
        <ImageCropper src={cropSrc} onCancel={closeCropper} onCrop={handleCropConfirm} />
      )}
    </AppLayout>
  );
}
