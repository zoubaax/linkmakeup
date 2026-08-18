import { useEffect, useState } from 'react';

export default function AdminActionModal({
  open,
  title,
  description,
  confirmLabel,
  confirmTone = 'danger',
  requireReason = false,
  reasonLabel = 'Reason',
  reasonPlaceholder = 'Explain why this action is necessary…',
  onConfirm,
  onClose,
  loading = false,
}) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (open) setReason('');
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (event) => {
      if (event.key === 'Escape' && !loading) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, loading, onClose]);

  if (!open) return null;

  const confirmClasses = confirmTone === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-primary hover:bg-primary-hover text-primary-fg';

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm(requireReason ? reason.trim() : reason.trim() || undefined);
  };

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 bg-overlay z-[100]"
        aria-label="Close dialog"
        onClick={loading ? undefined : onClose}
      />
      <div className="fixed left-1/2 top-[20%] z-[110] w-[min(100%-2rem,28rem)] -translate-x-1/2 rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-bold text-fg">{title}</h2>
            {description && <p className="text-sm text-fg-muted mt-1">{description}</p>}
          </div>

          {requireReason && (
            <div className="px-5 py-4">
              <label htmlFor="admin-action-reason" className="block text-xs font-semibold uppercase tracking-wider text-fg-muted mb-2">
                {reasonLabel}
              </label>
              <textarea
                id="admin-action-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
                minLength={3}
                placeholder={reasonPlaceholder}
                className="w-full rounded-xl border border-border bg-surface-alt/70 px-3 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
              />
            </div>
          )}

          <div className="px-5 py-4 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-border px-3.5 py-2 text-sm font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (requireReason && reason.trim().length < 3)}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold disabled:opacity-50 ${confirmClasses}`}
            >
              {loading ? 'Working…' : confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
