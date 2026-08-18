import { useCallback } from 'react';
import ApiService from '../../services/api';
import AdminDataTable, { AdminTableHead, useAdminList } from './AdminDataTable';
import { formatDateTime } from './formatters';

export default function AdminLinksPage() {
  const fetchLinks = useCallback((params) => ApiService.getAdminLinks(params), []);

  const {
    items,
    pagination,
    search,
    setSearch,
    setPage,
    loading,
    error,
  } = useAdminList(fetchLinks);

  return (
    <AdminDataTable
      title="Links"
      description="All links across the platform."
      searchPlaceholder="Search title, URL, or username..."
      search={search}
      onSearchChange={setSearch}
      loading={loading}
      error={error}
      isEmpty={items.length === 0}
      emptyMessage="No links found."
      pagination={pagination}
      onPageChange={setPage}
    >
      <table className="min-w-full text-sm">
        <AdminTableHead columns={['Title', 'Owner', 'Status', 'Created']} />
        <tbody className="divide-y divide-border/70">
          {items.map((entry) => (
            <tr key={entry.id} className="hover:bg-surface-alt/50">
              <td className="px-4 py-3">
                <p className="font-medium text-fg">{entry.title}</p>
                <p className="text-xs text-fg-subtle truncate max-w-md">{entry.url}</p>
              </td>
              <td className="px-4 py-3 text-fg-muted">{entry.username || entry.email}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${entry.isActive ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
                  {entry.isActive ? 'Active' : 'Hidden'}
                </span>
              </td>
              <td className="px-4 py-3 text-fg-muted">{formatDateTime(entry.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminDataTable>
  );
}
