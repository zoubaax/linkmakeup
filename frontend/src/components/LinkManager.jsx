import { useState } from 'react';
import ApiService from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { PLATFORM_PRESETS, getPlatformIcon } from './SocialIcons';

const inputClass =
  'px-3.5 py-2.5 bg-surface-alt border border-border rounded-xl text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-subtle transition-colors';

export default function LinkManager({ links, onLinksUpdated }) {
  const { success: toastSuccess, error: toastError } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIcon, setNewIcon] = useState('website');
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectPreset = (preset) => {
    setIsAdding(true);
    setNewTitle(preset.name);
    setNewSubtitle('');
    setNewUrl(preset.baseUrl);
    setNewIcon(preset.id);
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await ApiService.createLink({
        title: newTitle.trim(),
        subtitle: newSubtitle.trim(),
        url: newUrl.trim(),
        icon: newIcon,
        isActive: true,
      });
      if (response.success && response.data) {
        onLinksUpdated([...links, response.data]);
        setNewTitle(''); setNewSubtitle(''); setNewUrl(''); setNewIcon('website'); setIsAdding(false);
        toastSuccess('Link added');
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
    onLinksUpdated(links.map((l) => l.id === link.id ? { ...l, isActive: updated } : l));
    try { await ApiService.updateLink(link.id, { isActive: updated }); } catch (err) { console.error(err); }
  };

  const startEdit = (link) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditSubtitle(link.subtitle || '');
    setEditUrl(link.url);
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim() || !editUrl.trim()) return;
    onLinksUpdated(links.map((l) => l.id === id ? { ...l, title: editTitle.trim(), subtitle: editSubtitle.trim(), url: editUrl.trim() } : l));
    setEditingId(null);
    try {
      await ApiService.updateLink(id, { title: editTitle.trim(), subtitle: editSubtitle.trim(), url: editUrl.trim() });
    } catch (err) { console.error(err); }
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
    try { await ApiService.reorderLinks(updated.map((l) => l.id)); } catch (err) { console.error(err); }
  };

  const moveDown = async (index) => {
    if (index === links.length - 1) return;
    const updated = [...links];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onLinksUpdated(updated);
    try { await ApiService.reorderLinks(updated.map((l) => l.id)); } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
        <div>
          <h3 className="text-xl font-bold text-fg">Links</h3>
          <p className="text-fg-subtle text-xs mt-0.5">Add, edit, reorder, or hide links</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-lg leading-none">+</span>
          {isAdding ? 'Cancel' : 'Add Link'}
        </button>
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold text-fg-subtle uppercase tracking-wider mb-2">Quick Add</p>
        <div className="flex flex-wrap gap-2">
          {PLATFORM_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-alt text-fg-muted text-xs font-semibold hover:border-accent hover:text-accent transition-all hover:scale-[1.02]"
            >
              <span className="text-accent">{getPlatformIcon(preset.id, 'w-3.5 h-3.5')}</span>
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleAddLink} className="mb-5 p-4 rounded-xl bg-surface-alt border border-border flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-accent">{getPlatformIcon(newIcon, 'w-4 h-4')}</span>
            <span className="font-bold text-sm text-fg">New Link</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="text" placeholder="Title (e.g. Portfolio)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required className={inputClass} />
            <input type="text" placeholder="Subtitle (e.g. View my work)" value={newSubtitle} onChange={(e) => setNewSubtitle(e.target.value)} className={inputClass} />
            <input type="url" placeholder="URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} required className={inputClass} />
          </div>
          <button type="submit" disabled={loading} className="self-start px-5 py-2 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-bold text-sm transition-colors">
            {loading ? 'Saving...' : 'Save Link'}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-2.5">
        {links.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-border rounded-2xl">
            <p className="text-fg font-semibold text-sm mb-1">No links yet</p>
            <p className="text-fg-subtle text-xs">Click a preset or <strong className="text-fg-muted">+ Add Link</strong></p>
          </div>
        ) : (
          links.map((link, idx) => (
            <div
              key={link.id}
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                link.isActive ? 'bg-surface-alt border-border' : 'bg-surface-alt/50 border-border/60 opacity-60'
              }`}
            >
              <div className="flex flex-col gap-0.5 shrink-0">
                <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 rounded text-fg-subtle hover:text-fg disabled:opacity-20 transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                </button>
                <button type="button" onClick={() => moveDown(idx)} disabled={idx === links.length - 1} className="p-1 rounded text-fg-subtle hover:text-fg disabled:opacity-20 transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>

              <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-accent shrink-0">
                {getPlatformIcon(link.icon || link.title, 'w-4 h-4')}
              </div>

              {editingId === link.id ? (
                <div className="flex-1 flex flex-col gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input type="text" placeholder="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={`${inputClass} py-1.5`} />
                    <input type="text" placeholder="Subtitle" value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} className={`${inputClass} py-1.5`} />
                  </div>
                  <input type="url" placeholder="URL" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} className={`${inputClass} py-1.5`} />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleSaveEdit(link.id)} className="px-3 py-1 bg-primary text-primary-fg rounded-lg text-xs font-bold">Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1 bg-surface-muted text-fg-muted rounded-lg text-xs font-semibold">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-fg truncate">{link.title}</p>
                  {link.subtitle && (
                    <p className="text-xs text-fg-muted font-medium truncate">{link.subtitle}</p>
                  )}
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-[11px] text-fg-subtle hover:text-accent truncate block transition-colors">{link.url}</a>
                </div>
              )}

              <div className="flex items-center gap-2 shrink-0">
                {editingId !== link.id && (
                  <button type="button" onClick={() => startEdit(link)} className="p-1.5 text-fg-subtle hover:text-fg transition-colors" title="Edit">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleToggle(link)}
                  title="Toggle visibility"
                  className={`relative inline-flex w-10 h-6 rounded-full transition-colors shrink-0 ${link.isActive ? 'bg-primary' : 'bg-surface-muted'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${link.isActive ? 'left-5' : 'left-1'}`} />
                </button>

                <button type="button" onClick={() => handleDelete(link.id)} className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 hover:text-red-600 transition-colors" title="Delete">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
