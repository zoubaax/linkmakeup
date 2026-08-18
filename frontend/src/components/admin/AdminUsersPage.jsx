import { useCallback, useState } from 'react';
import ApiService from '../../services/api';
import AdminDataTable, {
  AdminFilterPills,
  AdminTableHead,
  AdminTableShell,
  useAdminList,
} from './AdminDataTable';
import AdminUserDrawer from './AdminUserDrawer';
import { formatDateTime } from './formatters';

const USER_FILTERS = [
  { value: 'all', label: 'All users' },
  { value: 'with_profile', label: 'Has profile' },
  { value: 'awaiting_profile', label: 'Awaiting setup' },
];

export default function AdminUsersPage() {
  const [status, setStatus] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = useCallback(
    (params) => ApiService.getAdminUsers(params),
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
  } = useAdminList(fetchUsers, { status });

  return (
    <>
      <AdminDataTable
        title="Users"
        description="All accounts on the platform, including onboarding status and link counts."
        searchPlaceholder="Search by email or name..."
        search={search}
        onSearchChange={setSearch}
        isSearching={isSearching}
        filters={(
          <AdminFilterPills
            options={USER_FILTERS}
            value={status}
            onChange={setStatus}
          />
        )}
        loading={loading}
        error={error}
        isEmpty={items.length === 0}
        emptyMessage="No users match your search or filter."
        pagination={pagination}
        onPageChange={setPage}
      >
        <AdminTableShell>
          <AdminTableHead columns={['User', 'Profile', 'Links', 'Joined', '']} />
          <tbody>
            {items.map((entry) => (
              <tr
                key={entry.id}
                className="border-t border-border/70 hover:bg-surface-alt/60 cursor-pointer transition-colors"
                onClick={() => setSelectedUserId(entry.id)}
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
                        {entry.name?.[0] || entry.email?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-fg truncate">{entry.name || 'Unnamed user'}</p>
                      <p className="text-xs text-fg-subtle truncate">{entry.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  {entry.username ? (
                    <span className="inline-flex items-center rounded-full border border-accent-border bg-accent-subtle px-2.5 py-0.5 text-xs font-semibold text-accent">
                      @{entry.username}
                    </span>
                  ) : (
                    <span className="text-fg-muted">Awaiting setup</span>
                  )}
                </td>
                <td className="px-5 py-3 text-fg tabular-nums">{entry.linkCount}</td>
                <td className="px-5 py-3 text-fg-muted whitespace-nowrap">{formatDateTime(entry.createdAt)}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedUserId(entry.id);
                    }}
                    className="text-xs font-semibold text-accent hover:text-accent-hover"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTableShell>
      </AdminDataTable>

      <AdminUserDrawer
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </>
  );
}
