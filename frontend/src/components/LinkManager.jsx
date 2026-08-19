import { useState, useEffect } from 'react';
import { HiGlobeAlt, HiComputerDesktop } from 'react-icons/hi2';
import ApiService from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { PLATFORM_PRESETS, getDefaultSubtitle, getPlatformIcon } from './SocialIcons';
import { LinkIcon } from './LinkIcon';
import { getFaviconIconValue, iconForLinkUrl, isPlatformIcon } from '../utils/linkIcon';

const inputClass =
  'w-full px-4 py-3 bg-surface-alt border border-border rounded-xl text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-subtle transition-all';

export default function LinkManager({ links, onLinksUpdated }) {
  const { success: toastSuccess, error: toastError } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIcon, setNewIcon] = useState('website');
  const [portfolioIconType, setPortfolioIconType] = useState('favicon'); // 'favicon' | 'portfolio'
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const openAddModal = () => {
    setSelectedPreset(null);
    setSearchQuery('');
    setNewTitle('');
    setNewUrl('');
    setNewIcon('website');
    setPortfolioIconType('favicon');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPreset(null);
    setSearchQuery('');
    setErrorMsg('');
  };

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setNewTitle(preset.name);
    setNewUrl(preset.baseUrl);
    setNewIcon(preset.id);
    setPortfolioIconType('favicon');
  };

  const handleNewUrlChange = (value) => {
    setNewUrl(value);
    if (selectedPreset?.id === 'website' && !isPlatformIcon(newIcon)) {
      setNewIcon(getFaviconIconValue(value));
    }
  };

  const getLinkUrl = (value, icon) => {
    const cleanValue = value.trim();
    if (icon === 'email') return cleanValue.startsWith('mailto:') ? cleanValue : `mailto:${cleanValue}`;
    if (icon === 'phone') return cleanValue.startsWith('tel:') ? cleanValue : `tel:${cleanValue.replace(/[\s()-]/g, '')}`;
    return cleanValue;
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    setLoading(true);
    setErrorMsg('');
    const url = getLinkUrl(newUrl, newIcon);
    let icon = iconForLinkUrl(url, newIcon);

    if (selectedPreset?.id === 'portfolio') {
      icon = portfolioIconType === 'favicon' ? getFaviconIconValue(url) : 'portfolio';
    }

    try {
      const response = await ApiService.createLink({
        title: newTitle.trim(),
        subtitle: getDefaultSubtitle(selectedPreset?.id || newIcon, newTitle),
        url,
        icon,
        isActive: true,
      });

      if (response.success && response.data) {
        onLinksUpdated([...links, response.data]);
        closeModal();
        toastSuccess(`${newTitle} added!`);
      }
    } catch (err) {
      const msg = err.message || 'Failed to create link.';
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (link) => {
    const updated = !link.isActive;
    onLinksUpdated(links.map((l) => (l.id === link.id ? { ...l, isActive: updated } : l)));
    try {
      await ApiService.updateLink(link.id, { isActive: updated });
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (link) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditIcon(link.icon);
    setEditUrl(link.icon === 'email' ? link.url.replace(/^mailto:/i, '') : link.icon === 'phone' ? link.url.replace(/^tel:/i, '') : link.url);
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim() || !editUrl.trim()) return;
    const link = links.find((l) => l.id === id);
    const url = getLinkUrl(editUrl, editIcon || link?.icon);
    const icon = editIcon || iconForLinkUrl(url, link?.icon);

    onLinksUpdated(
      links.map((l) =>
        l.id === id
          ? {
              ...l,
              title: editTitle.trim(),
              subtitle: getDefaultSubtitle(icon, editTitle),
              url,
              icon,
            }
          : l
      )
    );
    setEditingId(null);

    try {
      await ApiService.updateLink(id, {
        title: editTitle.trim(),
        subtitle: getDefaultSubtitle(icon, editTitle),
        url,
        icon,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    onLinksUpdated(links.filter((l) => l.id !== id));
    try {
      await ApiService.deleteLink(id);
      toastSuccess('Link removed');
    } catch (err) {
      console.error(err);
      toastError('Failed to delete link');
    }
  };

  const moveUp = async (index) => {
    if (index === 0) return;
    const updated = [...links];
    [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
    onLinksUpdated(updated);
    try {
      await ApiService.reorderLinks(updated.map((l) => l.id));
    } catch (err) {
      console.error(err);
    }
  };

  const moveDown = async (index) => {
    if (index === links.length - 1) return;
    const updated = [...links];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onLinksUpdated(updated);
    try {
      await ApiService.reorderLinks(updated.map((l) => l.id));
    } catch (err) {
      console.error(err);
    }
  };

  const allPresets = PLATFORM_PRESETS;

  const filteredPresets = allPresets.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="links" aria-labelledby="links-heading" className="scroll-mt-24 bg-surface border border-border rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-border">
        <div className="min-w-0">
          <h3 id="links-heading" className="text-lg sm:text-xl font-bold text-fg">Links</h3>
          <p className="text-fg-subtle text-xs mt-0.5 truncate">Add, edit, reorder, or hide links on your profile</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
        >
          <span className="text-lg leading-none">+</span>
          Add Link
        </button>
      </div>

      {/* Links List */}
      <div className="flex flex-col gap-2.5">
        {links.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-border rounded-2xl bg-surface-alt/30">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <p className="text-fg font-bold text-sm mb-1">No links added yet</p>
            <p className="text-fg-subtle text-xs mb-4">Click below to pick from Instagram, Snapchat, Discord, Telegram, or add a custom URL.</p>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-fg font-bold text-xs hover:bg-primary-hover transition-all"
            >
              + Add Your First Link
            </button>
          </div>
        ) : (
          links.map((link, idx) => (
            <div
              key={link.id}
              className={`flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl border transition-all ${
                link.isActive ? 'bg-surface-alt border-border hover:border-border/80' : 'bg-surface-alt/40 border-border/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                {/* Order Handles */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 rounded text-fg-subtle hover:text-fg disabled:opacity-20 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button type="button" onClick={() => moveDown(idx)} disabled={idx === links.length - 1} className="p-1 rounded text-fg-subtle hover:text-fg disabled:opacity-20 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>

                {/* Platform Icon Badge */}
                <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-accent shrink-0 overflow-hidden p-2 shadow-sm">
                  <LinkIcon icon={link.icon} title={link.title} url={link.url} className="w-5 h-5" imgClassName="w-full h-full object-contain" />
                </div>

                {/* Content / Edit View */}
                {editingId === link.id ? (
                  <div className="flex-1 flex flex-col gap-2 my-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input type="text" placeholder="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={`${inputClass} py-2`} />
                      <p className="px-3.5 py-2 bg-surface border border-border rounded-xl text-xs text-fg-muted flex items-center font-medium">
                        {getDefaultSubtitle(link.icon, editTitle)}
                      </p>
                    </div>
                    <input
                      type={link.icon === 'email' ? 'email' : link.icon === 'phone' ? 'tel' : 'url'}
                      placeholder={link.icon === 'email' ? 'Email address' : link.icon === 'phone' ? 'Phone number' : 'URL'}
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className={`${inputClass} py-2`}
                    />
                    <div className="flex gap-2 mt-1">
                      <button type="button" onClick={() => handleSaveEdit(link.id)} className="px-3.5 py-1.5 bg-primary text-primary-fg rounded-lg text-xs font-bold hover:bg-primary-hover transition-colors">Save</button>
                      <button type="button" onClick={() => setEditingId(null)} className="px-3.5 py-1.5 bg-surface-muted text-fg-muted rounded-lg text-xs font-semibold hover:bg-surface-muted/80 transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-fg truncate">{link.title}</p>
                    <p className="text-xs text-fg-muted font-medium truncate">{getDefaultSubtitle(link.icon, link.title)}</p>
                    <a href={link.url} target="_blank" rel="noreferrer" className="text-[11px] text-fg-subtle hover:text-accent truncate block transition-colors mt-0.5">{link.url}</a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end sm:justify-end gap-1.5 sm:gap-2 shrink-0 self-end sm:self-auto w-full sm:w-auto">
                {editingId !== link.id && (
                  <button type="button" onClick={() => startEdit(link)} className="p-2 rounded-lg hover:bg-surface-muted text-fg-subtle hover:text-fg transition-colors" title="Edit link">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleToggle(link)}
                  title="Toggle visibility"
                  className={`relative inline-flex w-11 h-6 rounded-full transition-colors shrink-0 ${link.isActive ? 'bg-primary' : 'bg-surface-muted'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${link.isActive ? 'left-6' : 'left-1'}`} />
                </button>

                <button type="button" onClick={() => handleDelete(link.id)} className="p-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Delete link">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* POPUP MODAL FOR ADDING A LINK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {selectedPreset && (
                  <button
                    type="button"
                    onClick={() => setSelectedPreset(null)}
                    className="p-1.5 rounded-lg border border-border hover:bg-surface-muted text-fg-subtle hover:text-fg transition-colors shrink-0"
                    title="Back to platforms"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <div className="min-w-0">
                  <h4 className="text-lg font-bold text-fg truncate">
                    {selectedPreset ? `Add ${selectedPreset.name}` : 'Add a Link'}
                  </h4>
                  <p className="text-xs text-fg-subtle truncate">
                    {selectedPreset ? 'Enter your URL or username below' : 'Choose a platform from our list'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-xl text-fg-subtle hover:text-fg hover:bg-surface-muted transition-colors shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
              {errorMsg && (
                <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {!selectedPreset ? (
                /* STEP 1: SELECT PLATFORM PRESET */
                <div className="flex flex-col gap-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-fg-subtle pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search platform (e.g. Snapchat, Discord, Telegram...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`${inputClass} pl-10 py-2.5`}
                    />
                  </div>

                  {/* Platform Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {filteredPresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-surface-alt hover:bg-surface hover:border-primary hover:shadow-sm transition-all group text-left cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-surface-muted border border-border text-fg group-hover:bg-primary group-hover:text-primary-fg group-hover:border-primary flex items-center justify-center shrink-0 shadow-xs transition-all">
                          {getPlatformIcon(preset.id, 'w-4 h-4')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-fg group-hover:text-primary truncate transition-colors">{preset.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {filteredPresets.length === 0 && (
                    <div className="py-8 text-center text-fg-subtle text-xs">
                      No matching platform found.
                    </div>
                  )}
                </div>
              ) : (
                /* STEP 2: ENTER LINK DETAILS */
                <form onSubmit={handleAddLink} className="flex flex-col gap-4">
                  {/* Selected Platform Badge */}
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/10">
                    <div className="w-10 h-10 rounded-xl bg-primary text-primary-fg flex items-center justify-center shrink-0 shadow-xs">
                      {getPlatformIcon(selectedPreset.id, 'w-5 h-5')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-fg">{selectedPreset.name}</p>
                      <p className="text-xs text-fg-subtle">
                        Subtitle: <strong className="text-primary font-semibold">{getDefaultSubtitle(selectedPreset.id, newTitle)}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-fg-subtle uppercase tracking-wider mb-1.5">Link Title</label>
                      <input
                        type="text"
                        placeholder="Title (e.g. My Snapchat)"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-fg-subtle uppercase tracking-wider mb-1.5">
                        {selectedPreset.id === 'email' ? 'Email Address' : selectedPreset.id === 'phone' ? 'Phone Number' : 'URL or Handle'}
                      </label>
                      <input
                        type={selectedPreset.id === 'email' ? 'email' : selectedPreset.id === 'phone' ? 'tel' : 'text'}
                        placeholder={selectedPreset.baseUrl ? `${selectedPreset.baseUrl}yourusername` : 'https://example.com'}
                        value={newUrl}
                        onChange={(e) => handleNewUrlChange(e.target.value)}
                        required
                        autoFocus
                        className={inputClass}
                      />
                    </div>

                    {selectedPreset.id === 'portfolio' && (
                      <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-surface-alt border border-border mt-1">
                        <label className="block text-[11px] font-bold text-fg-subtle uppercase tracking-wider">
                          Choose Icon Display
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPortfolioIconType('favicon')}
                            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              portfolioIconType === 'favicon'
                                ? 'bg-primary/10 border-primary text-primary shadow-xs'
                                : 'bg-surface border-border text-fg-muted hover:text-fg hover:bg-surface-muted'
                            }`}
                          >
                            <HiGlobeAlt className="w-4 h-4 shrink-0" />
                            <span>Real Favicon</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPortfolioIconType('portfolio')}
                            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              portfolioIconType === 'portfolio'
                                ? 'bg-primary/10 border-primary text-primary shadow-xs'
                                : 'bg-surface border-border text-fg-muted hover:text-fg hover:bg-surface-muted'
                            }`}
                          >
                            <HiComputerDesktop className="w-4 h-4 shrink-0" />
                            <span>Portfolio Icon</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPreset(null)}
                      className="px-4 py-3 rounded-xl border border-border bg-surface-alt text-fg font-semibold text-xs hover:bg-surface-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-5 py-3 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-bold text-sm transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                      {loading ? 'Adding...' : 'Add Link to Profile'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

