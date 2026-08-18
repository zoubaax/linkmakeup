import { useCallback, useEffect, useState } from 'react';
import ApiService from '../../services/api';
import { formatDateTime } from './formatters';

export default function AdminNotesPanel({ targetType, targetId }) {
  const [notes, setNotes] = useState([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadNotes = useCallback(() => {
    if (!targetType || !targetId) return Promise.resolve();

    setLoading(true);
    setError('');

    return ApiService.getAdminNotes({ targetType, targetId })
      .then((res) => {
        if (res.success) setNotes(res.data.items || []);
      })
      .catch((err) => setError(err.message || 'Failed to load notes'))
      .finally(() => setLoading(false));
  }, [targetType, targetId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError('');
    try {
      const res = await ApiService.createAdminNote({ targetType, targetId, body: trimmed });
      if (res.success) {
        setBody('');
        await loadNotes();
      }
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (noteId) => {
    setError('');
    try {
      await ApiService.deleteAdminNote(noteId);
      await loadNotes();
    } catch (err) {
      setError(err.message || 'Failed to delete note');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="admin-note-body" className="block text-xs font-semibold uppercase tracking-wider text-fg-muted">
          Add internal note
        </label>
        <textarea
          id="admin-note-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Visible only to platform admins…"
          className="w-full rounded-xl border border-border bg-surface-alt/70 px-3 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
        />
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-fg hover:bg-primary-hover disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Save note'}
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-16 rounded-xl bg-surface-alt" />
          <div className="h-16 rounded-xl bg-surface-alt" />
        </div>
      ) : notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-sm text-fg-muted text-center">
          No internal notes yet
        </div>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.id} className="rounded-xl border border-border px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-fg whitespace-pre-wrap">{note.body}</p>
                  <p className="text-[11px] text-fg-subtle mt-2">
                    {note.authorEmail} · {formatDateTime(note.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(note.id)}
                  className="shrink-0 text-[11px] font-semibold text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
