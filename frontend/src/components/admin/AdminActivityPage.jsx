import { useCallback, useState } from 'react';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import ApiService from '../../services/api';
import AdminDataTable, { AdminFilterPills, AdminTableHead, AdminTableShell, useAdminList } from './AdminDataTable';
import ExportCsvButton from './ExportCsvButton';
import { formatAuditRow } from './auditFormatters';

const ACTIVITY_FILTERS = [
  { value: 'all', label: 'All activity' },
  { value: 'links', label: 'Links' },
  { value: 'profiles', label: 'Profiles' },
  { value: 'user', label: 'Users' },
];

const EXPORT_COLUMNS = [
  { key: 'createdAt', label: 'Time' },
  { key: 'actorEmail', label: 'Actor' },
  { key: 'actorType', label: 'Actor type' },
  { key: 'action', label: 'Action' },
  { key: 'targetType', label: 'Target type' },
  { key: 'targetId', label: 'Target ID' },
  { key: 'reason', label: 'Reason' },
];

export default function AdminActivityPage() {
  const [actionFilter, setActionFilter] = useState('all');
  const [actorInput, setActorInput] = useState('');
  const debouncedActor = useDebouncedValue(actorInput);

  const fetchLogs = useCallback(
    (params) => ApiService.getAdminAuditLogs({
      page: params.page,
      limit: params.limit,
      action: params.status,
<<<<<<< Updated upstream
      actor: params.search,
=======
      actor: debouncedActor,
>>>>>>> Stashed changes
    }),
    [debouncedActor],
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
  } = useAdminList(fetchLogs, { status: actionFilter });

  const rows = items.map(formatAuditRow);

  const exportLogs = useCallback(
    () => ApiService.getAdminAuditLogsCsv({ action: actionFilter, actor: debouncedActor }),
    [actionFilter, debouncedActor],
  );

  return (
    <AdminDataTable
      title="Activity log"
      description="Immutable record of admin moderation actions across the platform."
      searchPlaceholder="Search by actor email..."
      search={search}
      onSearchChange={setSearch}
      isSearching={isSearching}
      filters={(
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <AdminFilterPills
            options={ACTIVITY_FILTERS}
            value={actionFilter}
            onChange={setActionFilter}
          />
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            <input
              type="search"
              value={actorInput}
              onChange={(event) => setActorInput(event.target.value)}
              placeholder="Filter by actor email…"
              className="rounded-xl border border-border bg-surface-alt/70 px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 w-full sm:w-64"
            />
            <ExportCsvButton fetcher={exportLogs} label="Export CSV" className="shrink-0" />
          </div>
        </div>
      )}
      actions={(
        <ExportCsvButton
          filename={`linkmakeup-activity-${new Date().toISOString().slice(0, 10)}.csv`}
          columns={EXPORT_COLUMNS}
          fetchRows={() => ApiService.getAdminAuditLogsExport({ action: actionFilter, actor: search })
            .then((res) => res.data.items.map((entry) => ({
              ...entry,
              reason: entry.metadata?.reason || '',
            })))}
        />
      )}
      loading={loading}
      error={error}
      isEmpty={rows.length === 0}
      emptyMessage="No admin activity recorded yet."
      pagination={pagination}
      onPageChange={setPage}
      pageSize={limit}
      onPageSizeChange={setLimit}
    >
      <AdminTableShell>
        <AdminTableHead columns={['Time', 'Actor', 'Action', 'Summary', 'Reason']} />
        <tbody>
          {rows.map((entry) => (
            <tr key={entry.id} className="border-t border-border/70">
              <td className="px-5 py-3 text-fg-muted whitespace-nowrap">{entry.time}</td>
              <td className="px-5 py-3 text-fg">{entry.actor}</td>
              <td className="px-5 py-3 text-fg-muted">{entry.action}</td>
              <td className="px-5 py-3 text-fg">{entry.summary}</td>
              <td className="px-5 py-3 text-fg-muted max-w-xs truncate">{entry.reason}</td>
            </tr>
          ))}
        </tbody>
      </AdminTableShell>
    </AdminDataTable>
  );
}
