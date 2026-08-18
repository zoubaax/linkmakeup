import { useCallback, useState } from 'react';
import ApiService from '../../services/api';
import AdminActionModal from './AdminActionModal';
import AdminDataTable, {
  AdminFilterPills,
  AdminTableHead,
  AdminTableShell,
  useAdminList,
} from './AdminDataTable';
import { formatDateTime, truncateText } from './formatters';

const LINK_FILTERS = [
  { value: 'all', label: 'All links' },
  { value: 'active', label: 'Active' },
  { value: 'hidden', label: 'Hidden' },
];

export default function AdminLinksPage() {
  const [status, setStatus] = useState('all');
  const [reloadKey, setReloadKey] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const fetchLinks = useCallback(
    (params) => ApiService.getAdminLinks(params),
    [reloadKey],
  );

  const {
    items,
    pagination,
    search,
    setSearch,
    isSearching,
    setPage,
    loading,
    error,
  } = useAdminList(fetchLinks, { status });

  const refresh = () => setReloadKey((value) => value + 1);

  const runAction = async (fn) => {
    setActionLoading(true);
    try {
      await fn();
      refresh();
    } finally {
      setActionLoading(false);
      setModal(null);
    }
  };

  return (
    <>
      <AdminDataTable
        title="Links"
        description="Every link created across the platform, including hidden entries."
        searchPlaceholder="Search title, URL, username, or email..."
        search={search}
        onSearchChange={setSearch}
        isSearching={isSearching}
        filters={(
          <AdminFilterPills
            options={LINK_FILTERS}
            value={status}
            onChange={setStatus}
          />
        )}
        loading={loading}
        error={error}
        isEmpty={items.length === 0}
        emptyMessage="No links match your search or filter."
        pagination={pagination}
        onPageChange={setPage}
      >
        <AdminTableShell>
          <AdminTableHead columns={['Link', 'Owner', 'Status', 'Position', 'Created', 'Actions']} />
          <tbody>
            {items.map((entry) => (
              <tr key={entry.id} className="border-t border-border/70">
                <td className="px-5 py-3 min-w-[240px]">
                  <div className="font-medium text-fg">{entry.title}</div>
                  {entry.subtitle && (
                    <div className="text-xs text-fg-muted mt-0.5">{entry.subtitle}</div>
                  )}
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-accent hover:text-accent-hover mt-1 inline-block max-w-md truncate"
                  >
                    {truncateText(entry.url, 72)}
                  </a>
                </td>
                <td className="px-5 py-3">
                  <div className="text-fg-muted">{entry.username ? `@${entry.username}` : '—'}</div>
                  {entry.email && <div className="text-xs text-fg-subtle truncate max-w-[180px]">{entry.email}</div>}
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${entry.isActive ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'border-border bg-surface-alt text-fg-muted'}`}>
                    {entry.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-5 py-3 text-fg tabular-nums">{entry.position}</td>
                <td className="px-5 py-3 text-fg-muted whitespace-nowrap">{formatDateTime(entry.createdAt)}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => runAction(() => ApiService.patchAdminLink(entry.id, { isActive: !entry.isActive }))}
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
        confirmLabel="Delete link"
        confirmTone="danger"
        requireReason
        loading={actionLoading}
        onClose={() => setModal(null)}
        onConfirm={(reason) => runAction(() => ApiService.deleteAdminLink(modal.linkId, { reason }))}
      />
    </>
  );
}
