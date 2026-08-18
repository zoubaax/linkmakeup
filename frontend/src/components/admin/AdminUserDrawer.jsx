import { useCallback, useEffect, useState } from 'react';
import { HiEnvelope, HiCheckCircle } from 'react-icons/hi2';
import ApiService from '../../services/api';
import { getPublicUserUrl } from '../../config/env';
import AdminActionModal from './AdminActionModal';
import AdminNotesPanel from './AdminNotesPanel';
import AdminStatusPill from './AdminStatusPill';
import AdminLinkReasonPopover from './AdminLinkReasonPopover';
import { formatDateTime, truncateText } from './formatters';
import { formatAuditRow } from './auditFormatters';

const TABS = [
  { id: 'summary', label: 'Summary' },
  { id: 'links', label: 'Links' },
  { id: 'notes', label: 'Notes' },
  { id: 'timeline', label: 'Timeline' },
];

export default function AdminUserDrawer({ userId, onClose, onUpdated }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [reminderSending, setReminderSending] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [reasonPopoverLink, setReasonPopoverLink] = useState(null);

  const loadDetail = useCallback(() => {
    if (!userId) return Promise.resolve();

    setLoading(true);
    setError('');

    return ApiService.getAdminUser(userId)
      .then((res) => {
        if (res.success) setDetail(res.data);
        else setError(res.message || 'Failed to load user');
      })
      .catch((err) => setError(err.message || 'Failed to load user'))
      .finally(() => setLoading(false));
  }, [userId]);

  const loadTimeline = useCallback(() => {
    if (!detail?.user?.id) return Promise.resolve();

    const targetIds = [detail.user.id];
    if (detail.profile?.id) targetIds.push(detail.profile.id);
    detail.links?.forEach((link) => targetIds.push(link.id));

    setTimelineLoading(true);
    return ApiService.getAdminAuditLogs({
      page: 1,
      limit: 30,
      targetIds,
    })
      .then((res) => {
        if (res.success) setTimeline(res.data.items || []);
      })
      .catch(() => setTimeline([]))
      .finally(() => setTimelineLoading(false));
  }, [detail]);

  useEffect(() => {
    if (!userId) return undefined;
    const handler = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [userId, onClose]);

  useEffect(() => {
    if (!userId) {
      setDetail(null);
      setError('');
      setReminderSent(false);
      setActiveTab('summary');
      return;
    }
    setReminderSent(false);
    setActiveTab('summary');
    loadDetail();
  }, [userId, loadDetail]);

  useEffect(() => {
    if (activeTab === 'timeline' && detail) loadTimeline();
  }, [activeTab, detail, loadTimeline]);

  const runAction = async (fn) => {
    setActionLoading(true);
    setError('');
    try {
      await fn();
      await loadDetail();
      onUpdated?.();
      if (activeTab === 'timeline') await loadTimeline();
    } catch (err) {
      setError(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
      setModal(null);
      setReasonPopoverLink(null);
    }
  };

  const sendReminder = async () => {
    if (!detail?.user?.id) return;
    setReminderSending(true);
    try {
      await ApiService.sendAdminOnboardingReminder(detail.user.id);
      setReminderSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reminder email');
    } finally {
      setReminderSending(false);
    }
  };

  const toggleLink = (link, reason) => runAction(
    () => ApiService.patchAdminLink(link.id, { isActive: !link.isActive, reason }),
  );

  if (!userId) return null;

  const copyEmail = async () => {
    if (!detail?.user?.email) return;
    try {
      await navigator.clipboard.writeText(detail.user.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const publicUrl = detail?.profile?.username
    ? getPublicUserUrl(detail.profile.username)
    : null;

  const noteTargetType = detail?.profile ? 'profile' : 'user';
  const noteTargetId = detail?.profile?.id || detail?.user?.id;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 bg-overlay z-[80]"
        aria-label="Close user detail"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 right-0 z-[90] w-full max-w-md bg-surface border-l border-border shadow-2xl flex flex-col animate-page-in">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
          <h2 className="text-sm font-bold text-fg">User detail</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-nav-hover transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="border-b border-border px-2 flex gap-1 overflow-x-auto shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-accent text-fg'
                  : 'border-transparent text-fg-muted hover:text-fg'
              }`}
            >
              {tab.label}
              {tab.id === 'links' && detail?.links ? ` (${detail.links.length})` : ''}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loading && (
            <div className="space-y-3 animate-pulse">
              <div className="h-16 rounded-xl bg-surface-alt" />
              <div className="h-24 rounded-xl bg-surface-alt" />
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {detail && activeTab === 'summary' && (
            <>
              <section className="rounded-2xl border border-border bg-surface-alt/50 p-4">
                <div className="flex items-start gap-3">
                  {detail.user.avatarUrl ? (
                    <img
                      src={detail.user.avatarUrl}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover border border-border shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-surface-muted border border-border flex items-center justify-center text-sm font-bold text-fg shrink-0">
                      {detail.user.name?.[0] || detail.user.email?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-fg truncate">{detail.user.name || 'Unnamed user'}</p>
                    <p className="text-sm text-fg-muted truncate">{detail.user.email}</p>
                    <p className="text-xs text-fg-subtle mt-1">Joined {formatDateTime(detail.user.createdAt)}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface transition-colors"
                  >
                    {copied ? 'Copied' : 'Copy email'}
                  </button>
                  {!detail.profile && (
                    <button
                      type="button"
                      disabled={reminderSending || reminderSent}
                      onClick={sendReminder}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-60 transition-colors"
                    >
                      {reminderSent ? (
                        <>
                          <HiCheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>Reminder Sent</span>
                        </>
                      ) : reminderSending ? (
                        <span>Sending email...</span>
                      ) : (
                        <>
                          <HiEnvelope className="w-3.5 h-3.5 shrink-0" />
                          <span>Send Setup Reminder</span>
                        </>
                      )}
                    </button>
                  )}
                  {publicUrl && (
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-accent-border bg-accent-subtle px-3 py-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
                    >
                      Open public page
                    </a>
                  )}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Profile</h3>
                  {detail.profile?.isSuspended && <AdminStatusPill status="suspended" />}
                  {!detail.profile && <AdminStatusPill status="awaiting" />}
                </div>
                {detail.profile ? (
                  <div className="rounded-2xl border border-border p-4 space-y-3">
                    <div>
                      <p className="font-semibold text-fg">@{detail.profile.username}</p>
                      <p className="text-sm text-fg-muted">{detail.profile.displayName}</p>
                      {detail.profile.bio && (
                        <p className="text-sm text-fg-subtle mt-1">{detail.profile.bio}</p>
                      )}
                      <p className="text-xs text-fg-subtle mt-2">Created {formatDateTime(detail.profile.createdAt)}</p>
                    </div>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => setModal({
                        type: detail.profile.isSuspended ? 'unsuspend' : 'suspend',
                        profileId: detail.profile.id,
                      })}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt disabled:opacity-50"
                    >
                      {detail.profile.isSuspended ? 'Restore public page' : 'Suspend public page'}
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-fg-muted text-center">
                    Awaiting profile setup
                  </div>
                )}
              </section>
            </>
          )}

          {detail && activeTab === 'links' && (
            <section>
              {detail.links.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-fg-muted text-center">
                  No links yet
                </div>
              ) : (
                <ul className="space-y-2">
                  {detail.links.map((link) => (
                    <li key={link.id} className="rounded-xl border border-border px-4 py-3 space-y-3 relative">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-fg truncate">{link.title}</p>
                          <p className="text-xs text-fg-subtle mt-0.5 truncate">{truncateText(link.url, 64)}</p>
                        </div>
                        <AdminStatusPill status={link.isActive ? 'active' : 'hidden'} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => setReasonPopoverLink(link)}
                          className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt disabled:opacity-50"
                        >
                          {link.isActive ? 'Hide' : 'Show'}
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => setModal({ type: 'deleteLink', linkId: link.id, linkTitle: link.title })}
                          className="rounded-lg border border-red-500/30 px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-500/10 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                      {reasonPopoverLink?.id === link.id && (
                        <AdminLinkReasonPopover
                          link={link}
                          loading={actionLoading}
                          onConfirm={(reason) => toggleLink(link, reason)}
                          onCancel={() => setReasonPopoverLink(null)}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {detail && activeTab === 'notes' && noteTargetId && (
            <AdminNotesPanel targetType={noteTargetType} targetId={noteTargetId} />
          )}

          {detail && activeTab === 'timeline' && (
            <section>
              {timelineLoading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-12 rounded-xl bg-surface-alt" />
                  <div className="h-12 rounded-xl bg-surface-alt" />
                </div>
              ) : timeline.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-fg-muted text-center">
                  No moderation history for this account
                </div>
              ) : (
                <ul className="space-y-2">
                  {timeline.map((entry) => {
                    const row = formatAuditRow(entry);
                    return (
                      <li key={entry.id} className="rounded-xl border border-border px-4 py-3">
                        <p className="text-sm font-medium text-fg">{row.summary}</p>
                        <p className="text-xs text-fg-subtle mt-1">
                          {row.actor} · {row.time}
                        </p>
                        {row.reason !== '—' && (
                          <p className="text-xs text-fg-muted mt-1">Reason: {row.reason}</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}
        </div>
      </aside>

      <AdminActionModal
        open={modal?.type === 'hideLink'}
        title="Hide link"
        description={modal?.linkTitle
          ? `"${modal.linkTitle}" will disappear from the owner's public page until restored.`
          : 'This link will disappear from the public page until restored.'}
        confirmLabel="Hide link"
        confirmTone="danger"
        requireReason={false}
        reasonLabel="Note (optional)"
        reasonPlaceholder="Optional note for the audit log…"
        loading={actionLoading}
        onClose={() => setModal(null)}
        onConfirm={(reason) => runAction(() => ApiService.patchAdminLink(
          modal.linkId,
          { isActive: false, reason: reason || undefined },
        ))}
      />

      <AdminActionModal
        open={modal?.type === 'deleteLink'}
        title="Delete link"
        description={modal?.linkTitle ? `Permanently delete "${modal.linkTitle}". This cannot be undone.` : 'Permanently delete this link.'}
        confirmLabel="Delete link"
        confirmTone="danger"
        requireReason
        loading={actionLoading}
        onClose={() => setModal(null)}
        onConfirm={(reason) => runAction(() => ApiService.deleteAdminLink(modal.linkId, { reason }))}
      />

      <AdminActionModal
        open={modal?.type === 'suspend'}
        title="Suspend public page"
        description="The profile will be hidden from username.linkmakeup.com. The owner can still access Studio."
        confirmLabel="Suspend profile"
        confirmTone="danger"
        requireReason
        loading={actionLoading}
        onClose={() => setModal(null)}
        onConfirm={(reason) => runAction(() => ApiService.patchAdminProfileSuspension(modal.profileId, { suspended: true, reason }))}
      />

      <AdminActionModal
        open={modal?.type === 'unsuspend'}
        title="Restore public page"
        description="The profile will become publicly visible again."
        confirmLabel="Restore profile"
        confirmTone="primary"
        requireReason
        loading={actionLoading}
        onClose={() => setModal(null)}
        onConfirm={(reason) => runAction(() => ApiService.patchAdminProfileSuspension(modal.profileId, { suspended: false, reason }))}
      />
    </>
  );
}
