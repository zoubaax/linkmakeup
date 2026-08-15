import { useState } from 'react';

export default function DashboardDemo() {
  const [links, setLinks] = useState([
    { id: '1', title: 'GitHub Portfolio', url: 'https://github.com/zoubaax', isActive: true, position: 0 },
    { id: '2', title: 'LinkedIn Profile', url: 'https://linkedin.com/in/zoubaax', isActive: true, position: 1 },
    { id: '3', title: 'Personal Website', url: 'https://linkmakeup.com', isActive: false, position: 2 },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleToggle = (id) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );
  };

  const handleDelete = (id) => {
    setLinks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      url: newUrl.trim(),
      isActive: true,
      position: links.length,
    };

    setLinks([...links, newItem]);
    setNewTitle('');
    setNewUrl('');
    setIsAdding(false);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...links];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setLinks(updated);
  };

  const moveDown = (index) => {
    if (index === links.length - 1) return;
    const updated = [...links];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setLinks(updated);
  };

  return (
    <div className="w-full bg-slate-900/60 rounded-3xl border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">Link Manager</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-xs font-semibold text-violet-300">
              Interactive Dashboard Demo
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Add, reorder, and toggle visible links on your public profile.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          {isAdding ? 'Cancel' : 'Add New Link'}
        </button>
      </div>

      {/* Add Link Form */}
      {isAdding && (
        <form onSubmit={handleAddLink} className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
          <h4 className="text-sm font-bold text-slate-200">New Link Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Title (e.g. My Portfolio)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              required
            />
            <input
              type="url"
              placeholder="URL (e.g. https://github.com/...)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto self-end px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors"
          >
            Save Link
          </button>
        </form>
      )}

      {/* Links List */}
      <div className="mt-6 flex flex-col gap-3">
        {links.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            No links added yet. Click &quot;Add New Link&quot; above!
          </div>
        ) : (
          links.map((link, idx) => (
            <div
              key={link.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                link.isActive
                  ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              {/* Left Controls & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveUp(idx)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-20"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    disabled={idx === links.length - 1}
                    onClick={() => moveDown(idx)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-20"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <div className="min-w-0">
                  <h4 className="font-semibold text-slate-200 text-sm truncate">{link.title}</h4>
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-violet-400 truncate block">
                    {link.url}
                  </a>
                </div>
              </div>

              {/* Right Controls (Toggle & Delete) */}
              <div className="flex items-center gap-4 shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.isActive}
                    onChange={() => handleToggle(link.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>

                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Delete Link"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
