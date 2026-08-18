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
  { value: 'all', label: 'All links' },
  { value: 'active', label: 'Active' },
  { value: 'hidden', label: 'Hidden' },
];

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

export default function AdminLinksPage() {
  const [status, setStatus] = useState('all');
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [reasonPopoverLink, setReasonPopoverLink] = useState(null);
  const [modal, setModal] = useState(null);

  const fetchLinks = useCallback(
    (params) => {
      void refreshNonce;
      return ApiService.getAdminLinks(params);
    },
    [refreshNonce],
  );

  const {
    items,
    pagination,
    search,
    setSearch,
    isSearching,
    setPage,
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
      setModal(null);
    }
  };

  return (
    <>
      <AdminDataTable
        title="Links"
        description="Every destination button across the platform, with visibility controls."
        searchPlaceholder="Search title, URL, username, or email..."
        search={search}
        onSearchChange={setSearch}
        isSearching={isSearching}
        filters={(
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <AdminFilterPills options={STATUS_FILTERS} value={status} onChange={setStatus} />
          </div>
        )}
        actions={(
          <ExportCsvButton
            filename={`linkmakeup-links-${new Date().toISOString().slice(0, 10)}.csv`}
            columns={EXPORT_COLUMNS}
            fetchRows={() => ApiService.getAdminLinksExport({ search, status }).then((res) => res.data.items)}
          />
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
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-surface-muted border border-border flex items-center justify-center text-fg shrink-0">
                      <LinkIcon icon={entry.icon} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-fg hover:text-accent truncate block"
                      >
                        {entry.title}
                      </a>
                      <p className="text-xs text-fg-subtle truncate max-w-xs">{truncateText(entry.url, 64)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <p className="text-fg text-sm font-medium">{entry.username ? `@${entry.username}` : 'Unknown'}</p>
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
        confirmLabel="Delete link"
        confirmTone="danger"
        requireReason
        loading={actionLoading}
        onClose={() => setModal(null)}
        onConfirm={runDelete}
      />
    </>
  );
}
