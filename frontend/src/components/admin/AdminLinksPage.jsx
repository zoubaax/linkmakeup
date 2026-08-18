<<<<<<< Updated upstream
import { useCallback, useEffect, useMemo, useState } from 'react';
import ApiService from '../../services/api';
import { getPublicUserUrl } from '../../config/env';
import AdminActionModal from './AdminActionModal';
import AdminDataTable, { AdminFilterPills, useAdminList } from './AdminDataTable';
import AdminUserDrawer from './AdminUserDrawer';
import ExportCsvButton from './ExportCsvButton';
import { LinkIcon } from '../LinkIcon';
import { formatDateTime, formatNumber, truncateText } from './formatters';
import { getDomainFromUrl } from '../../utils/linkIcon';

const LINK_FILTERS = [
=======
import { useCallback, useState } from 'react';
import ApiService from '../../services/api';
import AdminActionModal from './AdminActionModal';
import AdminDataTable, {
  AdminFilterPills,
  AdminTableHead,
  AdminTableShell,
  useAdminList,
} from './AdminDataTable';
import AdminLinkReasonPopover from './AdminLinkReasonPopover';
import AdminStatusPill from './AdminStatusPill';
import ExportCsvButton from './ExportCsvButton';
import { LinkIcon } from '../LinkIcon';
import { formatDateTime, truncateText } from './formatters';

const STATUS_FILTERS = [
>>>>>>> Stashed changes
  { value: 'all', label: 'All links' },
  { value: 'active', label: 'Active' },
  { value: 'hidden', label: 'Hidden' },
];

<<<<<<< Updated upstream
const EXPORT_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'subtitle', label: 'Subtitle' },
  { key: 'url', label: 'URL' },
  { key: 'isActive', label: 'Active' },
  { key: 'position', label: 'Position' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'createdAt', label: 'Created' },
];

function LinkStatusBadge({ isActive }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold shrink-0',
        isActive
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
      ].join(' ')}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      {isActive ? 'Live' : 'Hidden'}
    </span>
  );
}

function groupLinksByUser(items) {
  const groups = new Map();

  for (const link of items) {
    const key = link.userId || link.email || 'unknown';
    if (!groups.has(key)) {
      groups.set(key, {
        userId: link.userId,
        username: link.username,
        email: link.email,
        links: [],
      });
    }
    groups.get(key).links.push(link);
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      links: [...group.links].sort((a, b) => a.position - b.position),
    }))
    .sort((a, b) => {
      const aLabel = a.username || a.email || '';
      const bLabel = b.username || b.email || '';
      return aLabel.localeCompare(bLabel);
    });
}

function LinksSummary({ items, pagination, statusFilter }) {
  const pageActive = items.filter((entry) => entry.isActive).length;
  const pageHidden = items.length - pageActive;
  const userCount = new Set(items.map((entry) => entry.userId || entry.email)).size;
  const filterLabel = LINK_FILTERS.find((option) => option.value === statusFilter)?.label ?? 'All links';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="rounded-xl border border-border bg-surface-alt/50 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Total links</p>
        <p className="text-2xl font-bold text-fg tabular-nums mt-1">{formatNumber(pagination?.total ?? 0)}</p>
        <p className="text-xs text-fg-muted mt-0.5">Matching “{filterLabel.toLowerCase()}”</p>
      </div>
      <div className="rounded-xl border border-border bg-surface-alt/50 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Users on page</p>
        <p className="text-2xl font-bold text-fg tabular-nums mt-1">{formatNumber(userCount)}</p>
        <p className="text-xs text-fg-muted mt-0.5">
          {pageActive} live · {pageHidden} hidden
        </p>
      </div>
      <div className="rounded-xl border border-border bg-surface-alt/50 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Grouped view</p>
        <p className="text-sm text-fg-muted mt-2 leading-relaxed">
          Links are grouped by owner so you can moderate one user&apos;s page at a time.
        </p>
      </div>
    </div>
  );
}

function CopyUrlButton({ url }) {
  const [copied, setCopied] = useState(false);

  const copy = async (event) => {
    event.stopPropagation();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-[10px] font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors"
      title="Copy URL"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function UserLinkGroup({
  group,
  expanded,
  onToggle,
  onViewOwner,
  actionLoading,
  activeLinkId,
  onHide,
  onShow,
  onDelete,
}) {
  const liveCount = group.links.filter((link) => link.isActive).length;
  const hiddenCount = group.links.length - liveCount;
  const displayName = group.username ? `@${group.username}` : group.email || 'Unknown user';
  const initial = group.username?.[0] || group.email?.[0]?.toUpperCase() || '?';

  return (
    <section className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-border bg-surface-alt/40">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-center gap-3 min-w-0 text-left group"
          aria-expanded={expanded}
        >
          <div className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center text-sm font-bold text-fg shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {group.username ? (
                <a
                  href={getPublicUserUrl(group.username)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="font-semibold text-fg hover:text-accent transition-colors truncate"
                >
                  @{group.username}
                </a>
              ) : (
                <span className="font-semibold text-fg truncate">{displayName}</span>
              )}
              <span className="inline-flex items-center rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold text-fg-muted tabular-nums">
                {group.links.length} link{group.links.length === 1 ? '' : 's'}
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {liveCount} live
              </span>
              {hiddenCount > 0 && (
                <span className="inline-flex items-center rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400 tabular-nums">
                  {hiddenCount} hidden
                </span>
              )}
            </div>
            {group.email && group.username && (
              <p className="text-xs text-fg-subtle truncate mt-0.5">{group.email}</p>
            )}
          </div>
          <svg
            className={`w-4 h-4 text-fg-subtle shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {group.userId && (
          <button
            type="button"
            onClick={() => onViewOwner(group.userId)}
            className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface transition-colors"
          >
            View owner
          </button>
        )}
      </div>

      {expanded && (
        <ul className="divide-y divide-border/70">
          {group.links.map((entry) => {
            const domain = getDomainFromUrl(entry.url);
            const isRowBusy = actionLoading && activeLinkId === entry.id;

            return (
              <li
                key={entry.id}
                className={[
                  'px-4 sm:px-5 py-4 transition-colors',
                  isRowBusy ? 'bg-surface-alt/80' : 'hover:bg-surface-alt/40',
                ].join(' ')}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="h-9 w-9 rounded-xl border border-border bg-surface flex items-center justify-center shrink-0 overflow-hidden">
                      <LinkIcon
                        icon={entry.icon}
                        title={entry.title}
                        url={entry.url}
                        className="w-4 h-4"
                        imgClassName="h-5 w-5 object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-fg truncate">{entry.title}</p>
                        <LinkStatusBadge isActive={entry.isActive} />
                        <span className="text-[10px] text-fg-subtle tabular-nums">#{entry.position + 1}</span>
                      </div>
                      {entry.subtitle && (
                        <p className="text-xs text-fg-muted mt-0.5 truncate">{entry.subtitle}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {domain && (
                          <span className="inline-flex items-center rounded-md bg-surface-alt border border-border px-1.5 py-0.5 text-[10px] font-medium text-fg-subtle">
                            {domain}
                          </span>
                        )}
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-accent hover:text-accent-hover truncate max-w-md"
                          title={entry.url}
                        >
                          {truncateText(entry.url, 48)}
                        </a>
                        <CopyUrlButton url={entry.url} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 lg:pl-4">
                    <span className="text-xs text-fg-muted whitespace-nowrap hidden sm:inline">
                      {formatDateTime(entry.createdAt)}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => {
                          if (entry.isActive) {
                            onHide(entry);
                            return;
                          }
                          onShow(entry);
                        }}
                        className={[
                          'rounded-lg border px-2.5 py-1 text-[11px] font-semibold disabled:opacity-50 transition-colors',
                          entry.isActive
                            ? 'border-border text-fg-muted hover:text-fg hover:bg-surface-alt'
                            : 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10',
                        ].join(' ')}
                      >
                        {isRowBusy ? '…' : entry.isActive ? 'Hide' : 'Show'}
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => onDelete(entry)}
                        className="rounded-lg border border-red-500/30 px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function AdminLinksPage() {
  const [status, setStatus] = useState('all');
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeLinkId, setActiveLinkId] = useState(null);
  const [modal, setModal] = useState(null);
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());

  const fetchLinks = useCallback(
    (params) => ApiService.getAdminLinks(params),
    [reloadKey],
=======
export default function AdminLinksPage() {
  const [status, setStatus] = useState('all');
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [reasonPopoverLink, setReasonPopoverLink] = useState(null);

  const fetchLinks = useCallback(
    (params) => {
      void refreshNonce;
      return ApiService.getAdminLinks({
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: params.status,
      });
    },
    [refreshNonce],
>>>>>>> Stashed changes
  );

  const {
    items,
    pagination,
    search,
    setSearch,
    isSearching,
    setPage,
<<<<<<< Updated upstream
    loading,
    error,
  } = useAdminList(fetchLinks, { status });

  const userGroups = useMemo(() => groupLinksByUser(items), [items]);

  useEffect(() => {
    setCollapsedGroups(new Set());
  }, [pagination?.page, status, search]);

  const refresh = () => setReloadKey((value) => value + 1);

  const runAction = async (linkId, fn) => {
    setActionLoading(true);
    setActiveLinkId(linkId);
    try {
      await fn();
      refresh();
    } finally {
      setActionLoading(false);
      setActiveLinkId(null);
=======
    limit,
    setLimit,
    loading,
    error,
    clearFilters,
  } = useAdminList(fetchLinks, { status });

  const refresh = () => setRefreshNonce((value) => value + 1);

  const runToggle = async (link, reason) => {
    setActionLoading(true);
    try {
      await ApiService.patchAdminLink(link.id, { isActive: !link.isActive, reason });
      refresh();
    } catch (err) {
      console.error('Link toggle failed:', err.message);
    } finally {
      setActionLoading(false);
      setReasonPopoverLink(null);
    }
  };

  const runDelete = async (reason) => {
    setActionLoading(true);
    try {
      await ApiService.deleteAdminLink(modal.linkId, { reason });
      refresh();
    } catch (err) {
      console.error('Link delete failed:', err.message);
    } finally {
      setActionLoading(false);
>>>>>>> Stashed changes
      setModal(null);
    }
  };

<<<<<<< Updated upstream
  const toggleGroup = (groupKey) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) next.delete(groupKey);
      else next.add(groupKey);
      return next;
    });
  };

  const groupKey = (group) => group.userId || group.email || 'unknown';

  const emptyMessage = useMemo(() => {
    if (search.trim()) return 'No links match your search.';
    if (status === 'active') return 'No active links on the platform yet.';
    if (status === 'hidden') return 'No hidden links — everything is live.';
    return 'No links have been created yet.';
  }, [search, status]);

  return (
    <>
      <div className="space-y-4 mb-6">
        <LinksSummary items={items} pagination={pagination} statusFilter={status} />
      </div>

      <AdminDataTable
        title="Links by user"
        description="Each section is one account — expand to review and moderate their links together."
=======
  const exportLinks = useCallback(
    () => ApiService.getAdminLinksCsv({ search, status }),
    [search, status],
  );

  return (
    <>
      <AdminDataTable
        title="Links"
        description="Every destination button across the platform, with visibility controls."
>>>>>>> Stashed changes
        searchPlaceholder="Search title, URL, username, or email..."
        search={search}
        onSearchChange={setSearch}
        isSearching={isSearching}
        filters={(
<<<<<<< Updated upstream
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <AdminFilterPills options={LINK_FILTERS} value={status} onChange={setStatus} />
            {userGroups.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCollapsedGroups(new Set())}
                  className="text-xs font-semibold text-fg-muted hover:text-fg"
                >
                  Expand all
                </button>
                <span className="text-fg-subtle">·</span>
                <button
                  type="button"
                  onClick={() => setCollapsedGroups(new Set(userGroups.map(groupKey)))}
                  className="text-xs font-semibold text-fg-muted hover:text-fg"
                >
                  Collapse all
                </button>
              </div>
            )}
          </div>
        )}
        actions={(
          <ExportCsvButton
            filename={`linkmakeup-links-${new Date().toISOString().slice(0, 10)}.csv`}
            columns={EXPORT_COLUMNS}
            fetchRows={() => ApiService.getAdminLinksExport({ search, status })
              .then((res) => res.data.items)}
          />
        )}
        loading={loading}
        error={error}
        isEmpty={items.length === 0}
        emptyMessage={emptyMessage}
        pagination={pagination}
        onPageChange={setPage}
      >
        <div className="p-4 sm:p-5 space-y-4">
          {userGroups.map((group) => (
            <UserLinkGroup
              key={groupKey(group)}
              group={group}
              expanded={!collapsedGroups.has(groupKey(group))}
              onToggle={() => toggleGroup(groupKey(group))}
              onViewOwner={setSelectedUserId}
              actionLoading={actionLoading}
              activeLinkId={activeLinkId}
              onHide={(entry) => setModal({ type: 'hide', linkId: entry.id, linkTitle: entry.title })}
              onShow={(entry) => runAction(entry.id, () => ApiService.patchAdminLink(entry.id, { isActive: true }))}
              onDelete={(entry) => setModal({ type: 'delete', linkId: entry.id, linkTitle: entry.title })}
            />
          ))}
        </div>
      </AdminDataTable>

      <AdminUserDrawer
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
        onUpdated={refresh}
      />

      <AdminActionModal
        open={modal?.type === 'hide'}
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
        onConfirm={(reason) => runAction(
          modal.linkId,
          () => ApiService.patchAdminLink(modal.linkId, { isActive: false, reason: reason || undefined }),
        )}
      />

      <AdminActionModal
        open={modal?.type === 'delete'}
        title="Delete link"
        description={modal?.linkTitle
          ? `Permanently delete "${modal.linkTitle}". This cannot be undone.`
          : 'Permanently delete this link.'}
=======
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <AdminFilterPills options={STATUS_FILTERS} value={status} onChange={setStatus} />
            <ExportCsvButton fetcher={exportLinks} filename="links.csv" className="ml-auto" />
          </div>
        )}
        loading={loading}
        error={error}
        isEmpty={items.length === 0}
        emptyMessage="No links match your search or filter."
        onClearFilters={clearFilters}
        pagination={pagination}
        onPageChange={setPage}
        pageSize={limit}
        onPageSizeChange={setLimit}
      >
        <AdminTableShell>
          <AdminTableHead columns={['Link', 'Owner', 'Status', 'Created', 'Actions']} />
          <tbody>
            {items.map((entry) => (
              <tr key={entry.id} className="border-t border-border/70 hover:bg-surface-alt/60 transition-colors">
                <td className="px-5 py-3 min-w-[260px]">
                  <div className="flex items-center gap-3">
                    <LinkIcon
                      icon={entry.icon}
                      title={entry.title}
                      url={entry.url}
                      className="w-4 h-4"
                      imgClassName="w-4 h-4 object-contain"
                    />
                    <div className="min-w-0">
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-fg hover:text-accent truncate block"
                      >
                        {entry.title}
                      </a>
                      <p className="text-xs text-fg-subtle truncate">{truncateText(entry.url, 72)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <p className="text-fg text-sm">{entry.username ? `@${entry.username}` : 'Unknown'}</p>
                  <p className="text-xs text-fg-subtle truncate max-w-[200px]">{entry.email || '—'}</p>
                </td>
                <td className="px-5 py-3">
                  <AdminStatusPill status={entry.isActive ? 'active' : 'hidden'} />
                </td>
                <td className="px-5 py-3 text-fg-muted whitespace-nowrap">{formatDateTime(entry.createdAt)}</td>
                <td className="px-5 py-3 relative">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => setReasonPopoverLink(entry)}
                      className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt disabled:opacity-50"
                    >
                      {entry.isActive ? 'Hide' : 'Show'}
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => setModal({ linkId: entry.id, linkTitle: entry.title })}
                      className="rounded-lg border border-red-500/30 px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                  {reasonPopoverLink?.id === entry.id && (
                    <AdminLinkReasonPopover
                      link={entry}
                      loading={actionLoading}
                      onConfirm={(reason) => runToggle(entry, reason)}
                      onCancel={() => setReasonPopoverLink(null)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTableShell>
      </AdminDataTable>

      <AdminActionModal
        open={Boolean(modal)}
        title="Delete link"
        description={modal?.linkTitle ? `Permanently delete "${modal.linkTitle}". This cannot be undone.` : 'Permanently delete this link.'}
>>>>>>> Stashed changes
        confirmLabel="Delete link"
        confirmTone="danger"
        requireReason
        loading={actionLoading}
        onClose={() => setModal(null)}
<<<<<<< Updated upstream
        onConfirm={(reason) => runAction(
          modal.linkId,
          () => ApiService.deleteAdminLink(modal.linkId, { reason }),
        )}
=======
        onConfirm={runDelete}
>>>>>>> Stashed changes
      />
    </>
  );
}
