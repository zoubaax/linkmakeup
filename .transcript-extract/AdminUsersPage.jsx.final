import { useCallback } from 'react';
import ApiService from '../../services/api';
import AdminDataTable, { AdminTableHead, useAdminList } from './AdminDataTable';
import { formatDateTime } from './formatters';

export default function AdminUsersPage() {
  const fetchUsers = useCallback((params) => ApiService.getAdminUsers(params), []);

  const {
    items,
    pagination,
    search,
    setSearch,
    setPage,
    loading,
    error,
  } = useAdminList(fetchUsers);

  return (
    <AdminDataTable
      title="Users"
      description="All accounts on the platform."
      searchPlaceholder="Search by email or name..."
      search={search}
      onSearchChange={setSearch}
      loading={loading}
      error={error}
      isEmpty={items.length === 0}
      emptyMessage="No users found."
      pagination={pagination}
      onPageChange={setPage}
    >
      <table className="min-w-full text-sm">
        <AdminTableHead columns={['Email', 'Name', 'Username', 'Links', 'Joined']} />
        <tbody className="divide-y divide-border/70">
          {items.map((entry) => (
            <tr key={entry.id} className="hover:bg-surface-alt/50">
              <td className="px-4 py-3 font-medium text-fg">{entry.email}</td>
              <td className="px-4 py-3 text-fg-muted">{entry.name || '—'}</td>
              <td className="px-4 py-3 text-fg-muted">{entry.username || '—'}</td>
              <td className="px-4 py-3 text-fg-muted">{entry.linkCount ?? 0}</td>
              <td className="px-4 py-3 text-fg-muted">{formatDateTime(entry.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminDataTable>
  );
}
