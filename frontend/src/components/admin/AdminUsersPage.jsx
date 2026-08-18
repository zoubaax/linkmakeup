import { useCallback, useState } from 'react';
import ApiService from '../../services/api';
import { useAdmin } from '../../contexts/AdminContext';
import { useToast } from '../../contexts/ToastContext';
import AdminDataTable, {
  AdminFilterPills,
  AdminTableHead,
  AdminTableShell,
  useAdminList,
} from './AdminDataTable';
import AdminUserDrawer from './AdminUserDrawer';
import AdminRowActions from './AdminRowActions';
import AdminStatusPill from './AdminStatusPill';
import ExportCsvButton from './ExportCsvButton';
import { formatDateTime } from './formatters';
import { HiEnvelope, HiPaperAirplane, HiCheckCircle } from 'react-icons/hi2';

const USER_FILTERS = [
  { value: 'all', label: 'All users' },
  { value: 'with_profile', label: 'Has profile' },
  { value: 'awaiting_profile', label: 'Awaiting setup' },
];

const EXPORT_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'email', label: 'Email' },
  { key: 'name', label: 'Name' },
  { key: 'username', label: 'Username' },
  { key: 'linkCount', label: 'Links' },
  { key: 'createdAt', label: 'Joined' },
];

export default function AdminUsersPage() {
  const [status, setStatus] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [bulkSending, setBulkSending] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [sentUserIds, setSentUserIds] = useState(new Set());
  const { openUserDrawer } = useAdmin();
  const { showToast } = useToast();

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
    page,
    setPage,
    limit,
    setLimit,
    clearFilters,
    loading,
    error,
  } = useAdminList(fetchUsers, { status, limit: 10 });

  const handleBulkRemind = async () => {
    setBulkSending(true);
    setToastMessage('');
    try {
      const res = await ApiService.sendAdminBulkOnboardingReminders();
      if (res.success) {
        setToastMessage(`Sent onboarding setup reminder emails to ${res.data.sentCount} users!`);
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to send bulk reminders');
    } finally {
      setBulkSending(false);
    }
  };

  const handleSingleRemind = async (userId) => {
    try {
      const res = await ApiService.sendAdminOnboardingReminder(userId);
      if (res.success) {
        setSentUserIds((prev) => new Set(prev).add(userId));
        showToast(`Reminder email sent to ${res.data.email}`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to send reminder', 'error');
    }
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    showToast('Copied email to clipboard', 'info');
  };

  return (
    <>
      {toastMessage && (
        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button type="button" onClick={() => setToastMessage('')} className="text-emerald-500 hover:text-emerald-700">✕</button>
        </div>
      )}

      <AdminDataTable
        title="Users"
        description="All accounts on the platform, including onboarding status and link counts."
        searchPlaceholder="Search by email or name..."
        search={search}
        onSearchChange={setSearch}
        isSearching={isSearching}
        filters={(
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <AdminFilterPills
              options={USER_FILTERS}
              value={status}
              onChange={setStatus}
            />
            <button
              type="button"
              disabled={bulkSending}
              onClick={handleBulkRemind}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-60 transition-all shadow-2xs active:scale-95 ml-auto"
            >
              <HiPaperAirplane className="w-3.5 h-3.5 shrink-0" />
              <span>{bulkSending ? 'Sending emails...' : 'Notify All Awaiting Setup'}</span>
            </button>
          </div>
        )}
        actions={(
          <ExportCsvButton
            filename={`linkmakeup-users-${new Date().toISOString().slice(0, 10)}.csv`}
            columns={EXPORT_COLUMNS}
            fetchRows={() => ApiService.getAdminUsersExport({ search, status }).then((res) => res.data.items)}
          />
        )}
        loading={loading}
        error={error}
        isEmpty={items.length === 0}
        emptyMessage="No users match your search or filter."
        onClearFilters={clearFilters}
        pagination={pagination}
        onPageChange={setPage}
        pageSize={limit}
        onPageSizeChange={setLimit}
      >
        <AdminTableShell>
          <AdminTableHead columns={['User', 'Profile', 'Links', 'Joined', 'Actions']} />
          <tbody>
            {items.map((entry) => (
              <tr
                key={entry.id}
                className="border-t border-border/70 hover:bg-surface-alt/60 cursor-pointer transition-colors"
                onClick={() => openUserDrawer(entry.id)}
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
                    <AdminStatusPill status="live" label={`@${entry.username}`} />
                  ) : (
                    <AdminStatusPill status="awaiting" />
                  )}
                </td>
                <td className="px-5 py-3 text-fg tabular-nums">{entry.linkCount}</td>
                <td className="px-5 py-3 text-fg-muted whitespace-nowrap">{formatDateTime(entry.createdAt)}</td>
                <td className="px-5 py-3 text-right">
                  <AdminRowActions
                    items={[
                      { label: 'View detail', onClick: () => openUserDrawer(entry.id) },
                      { label: 'Copy email', onClick: () => copyEmail(entry.email) },
                      ...(!entry.username ? [{
                        label: sentUserIds.has(entry.id) ? 'Reminder sent' : 'Send reminder',
                        disabled: sentUserIds.has(entry.id),
                        onClick: () => handleSingleRemind(entry.id),
                      }] : []),
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTableShell>
      </AdminDataTable>
    </>
  );
}
