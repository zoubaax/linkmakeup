import { useCallback, useState } from 'react';
import ApiService from '../../services/api';
import { getPublicUserUrl } from '../../config/env';
import AdminActionModal from './AdminActionModal';
import AdminDataTable, { AdminFilterPills, AdminTableHead, AdminTableShell, useAdminList } from './AdminDataTable';
import AdminUserDrawer from './AdminUserDrawer';
import ExportCsvButton from './ExportCsvButton';
import { formatDateTime, truncateText } from './formatters';

const PROFILE_FILTERS = [
  { value: 'all', label: 'All profiles' },
  { value: 'live', label: 'Live' },
  { value: 'suspended', label: 'Suspended' },
];

const EXPORT_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'username', label: 'Username' },
  { key: 'displayName', label: 'Display name' },
  { key: 'email', label: 'Email' },
  { key: 'isSuspended', label: 'Suspended' },
  { key: 'linkCount', label: 'Links' },
  { key: 'activeLinkCount', label: 'Active links' },
  { key: 'bio', label: 'Bio' },
  { key: 'createdAt', label: 'Created' },
];

export default function AdminProfilesPage() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [status, setStatus] = useState('all');

  const fetchProfiles = useCallback(
    (params) => ApiService.getAdminProfiles(params),
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
  } = useAdminList(fetchProfiles, { status });

  const refresh = () => setReloadKey((value) => value + 1);

  const runSuspension = async (reason) => {
    setActionLoading(true);
    try {
      await ApiService.patchAdminProfileSuspension(modal.profileId, {
        suspended: modal.suspended,
        reason,
      });
      refresh();
    } finally {
      setActionLoading(false);
      setModal(null);
    }
  };

  return (
    <>
      <AdminDataTable
        title="Profiles"
        description="Public LinkMakeup pages — each username maps to username.linkmakeup.com."
        searchPlaceholder="Search username, display name, or email..."
        search={search}
        onSearchChange={setSearch}
        isSearching={isSearching}
        filters={(
          <AdminFilterPills
            options={PROFILE_FILTERS}
            value={status}
            onChange={setStatus}
          />
        )}
        actions={(
          <ExportCsvButton
            filename={`linkmakeup-profiles-${new Date().toISOString().slice(0, 10)}.csv`}
            columns={EXPORT_COLUMNS}
            fetchRows={() => ApiService.getAdminProfilesExport({ search, status })
              .then((res) => res.data.items)}
          />
        )}
        loading={loading}
        error={error}
        isEmpty={items.length === 0}
        emptyMessage="No profiles match your search."
        pagination={pagination}
        onPageChange={setPage}
      >
        <AdminTableShell>
          <AdminTableHead columns={['Profile', 'Owner', 'Status', 'Links', 'Bio', 'Created', 'Actions']} />
          <tbody>
            {items.map((entry) => (
              <tr
                key={entry.id}
                className="border-t border-border/70 hover:bg-surface-alt/60 cursor-pointer transition-colors"
                onClick={() => setSelectedUserId(entry.userId)}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {entry.avatarUrl ? (
                      <img
                        src={entry.avatarUrl}
                        alt=""
                        className="h-9 w-9 rounded-full object-cover border border-border shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-surface-muted border border-border flex items-center justify-center text-xs font-bold text-fg shrink-0">
                        {entry.displayName?.[0] || entry.username?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <a
                        href={getPublicUserUrl(entry.username)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="font-medium text-accent hover:text-accent-hover truncate block"
                      >
                        {entry.username}
                      </a>
                      <p className="text-xs text-fg-subtle truncate">{entry.displayName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-fg-muted truncate max-w-[180px]">{entry.email || '—'}</td>
                <td className="px-5 py-3">
                  {entry.isSuspended ? (
                    <span className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                      Suspended
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      Live
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-fg tabular-nums">
                  {entry.activeLinkCount}
                  <span className="text-fg-subtle"> / {entry.linkCount}</span>
                </td>
                <td className="px-5 py-3 text-fg-muted max-w-[220px] truncate">{truncateText(entry.bio, 64)}</td>
                <td className="px-5 py-3 text-fg-muted whitespace-nowrap">{formatDateTime(entry.createdAt)}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} role="presentation">
                    <button
                      type="button"
                      onClick={() => setSelectedUserId(entry.userId)}
                      className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => setModal({
                        profileId: entry.id,
                        username: entry.username,
                        suspended: !entry.isSuspended,
                      })}
                      className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt disabled:opacity-50"
                    >
                      {entry.isSuspended ? 'Restore' : 'Suspend'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTableShell>
      </AdminDataTable>

      <AdminUserDrawer
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
        onUpdated={refresh}
      />

      <AdminActionModal
        open={Boolean(modal)}
        title={modal?.suspended ? 'Suspend public page' : 'Restore public page'}
        description={modal?.suspended
          ? `@${modal?.username} will be hidden from the public web.`
          : `@${modal?.username} will become publicly visible again.`}
        confirmLabel={modal?.suspended ? 'Suspend profile' : 'Restore profile'}
        confirmTone={modal?.suspended ? 'danger' : 'primary'}
        requireReason
        loading={actionLoading}
        onClose={() => setModal(null)}
        onConfirm={runSuspension}
      />
    </>
  );
}
