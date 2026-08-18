import { useCallback, useState } from 'react';
import ApiService from '../../services/api';
import AdminDataTable, { AdminFilterPills, AdminTableHead, AdminTableShell, useAdminList } from './AdminDataTable';
import ExportCsvButton from './ExportCsvButton';
import { formatAuditRow } from './auditFormatters';

const ACTIVITY_FILTERS = [
  { value: 'all', label: 'All activity' },
  { value: 'links', label: 'Links' },
  { value: 'profiles', label: 'Profiles' },
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

  const fetchLogs = useCallback(
    (params) => ApiService.getAdminAuditLogs({
      page: params.page,
      limit: params.limit,
      action: params.status,
      actor: params.search,
    }),
    [],
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
  } = useAdminList(fetchLogs, { status: actionFilter });

  const rows = items.map(formatAuditRow);

  return (
    <AdminDataTable
      title="Activity log"
      description="Immutable record of admin moderation actions across the platform."
      searchPlaceholder="Search by actor email..."
      search={search}
      onSearchChange={setSearch}
      isSearching={isSearching}
      filters={(
        <AdminFilterPills
          options={ACTIVITY_FILTERS}
          value={actionFilter}
          onChange={setActionFilter}
        />
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
