import { useState } from 'react';

export default function AdminLinkReasonPopover({ link, loading, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');
  const [skipReason, setSkipReason] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm(skipReason ? undefined : reason.trim() || undefined);
  };

  return (
    <div className="absolute left-0 right-0 top-full mt-2 z-10 rounded-xl border border-border bg-surface shadow-xl p-3">
      <form onSubmit={handleSubmit} className="space-y-2">
        <p className="text-xs font-semibold text-fg">
          {link.isActive ? 'Hide link' : 'Show link'}
          {' — '}
          <span className="text-fg-muted font-normal">optional reason</span>
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          disabled={skipReason}
          placeholder="Why are you changing visibility?"
          className="w-full rounded-lg border border-border bg-surface-alt/70 px-2.5 py-2 text-xs text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none disabled:opacity-50"
        />
        <label className="flex items-center gap-2 text-[11px] text-fg-muted">
          <input
            type="checkbox"
            checked={skipReason}
            onChange={(e) => setSkipReason(e.target.checked)}
            className="rounded border-border"
          />
          Skip reason
        </label>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-fg-muted hover:text-fg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || (!skipReason && reason.trim().length > 0 && reason.trim().length < 3)}
            className="rounded-lg bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-fg disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Confirm'}
          </button>
        </div>
      </form>
    </div>
  );
}
