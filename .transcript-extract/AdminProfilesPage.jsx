import { useCallback } from 'react';
import ApiService from '../../services/api';
import AdminDataTable, { AdminTableHead, useAdminList } from './AdminDataTable';
import { formatDateTime } from './formatters';

export default function AdminProfilesPage() {
  const fetchProfiles = useCallback((params) => ApiService.getAdminProfiles(params), []);

  const {
    items,
    pagination,
    search,
    setSearch,
    setPage,
    loading,
    error,
  } = useAdminList(fetchProfiles);

  return (
    <AdminDataTable
      title="Profiles"
      description="Public profile pages and their owners."
      searchPlaceholder="Search username, display name, or email..."
      search={search}
      onSearchChange={setSearch}
      loading={loading}
      error={error}
      isEmpty={items.length === 0}
      emptyMessage="No profiles found."
      pagination={pagination}
      onPageChange={setPage}
    >
      <table className="min-w-full text-sm">
        <AdminTableHead columns={['Username', 'Display name', 'Owner', 'Links', 'Created']} />
        <tbody className="divide-y divide-border/70">
          {items.map((entry) => (
            <tr key={entry.id} className="hover:bg-surface-alt/50">
              <td className="px-4 py-3 font-medium text-fg">{entry.username}</td>
              <td className="px-4 py-3 text-fg-muted">{entry.displayName}</td>
              <td className="px-4 py-3 text-fg-muted">{entry.email}</td>
              <td className="px-4 py-3 text-fg-muted">{entry.linkCount ?? 0}</td>
              <td className="px-4 py-3 text-fg-muted">{formatDateTime(entry.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminDataTable>
  );
}
