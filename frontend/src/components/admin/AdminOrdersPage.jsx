import { useState, useCallback, useEffect } from 'react';
import ApiService from '../../services/api';
import AdminDataTable, { AdminFilterPills, AdminTableHead, AdminTableShell } from './AdminDataTable';
import AdminStatCard from './AdminStatCard';
import { formatDateTime } from './formatters';
import { useToast } from '../../contexts/ToastContext';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_STYLES = {
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  contacted: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

export default function AdminOrdersPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    setError('');

    ApiService.getAdminOrders({ page, limit, search, status: statusFilter })
      .then((res) => {
        if (res.success) {
          setOrders(res.data.items || []);
          setPagination(res.data.pagination || null);
        } else {
          setError(res.message || 'Failed to fetch orders');
        }
      })
      .catch((err) => setError(err.message || 'Failed to fetch orders'))
      .finally(() => setLoading(false));
  }, [page, limit, search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const res = await ApiService.updateAdminOrderStatus(orderId, newStatus);
      if (res.success) {
        toastSuccess('Order status updated');
      }
    } catch (err) {
      console.error(err);
      toastError('Failed to update status');
      fetchOrders();
    }
  };

  const columns = ['Customer', 'Phone / WhatsApp', 'City & Address', 'Status', 'Date'];

  return (
    <div className="space-y-6">
      {/* Top Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          label="Total Card Orders"
          value={pagination?.total || orders.length}
          hint="All time customer orders"
          accent="accent"
        />
        <AdminStatCard
          label="Pending Delivery"
          value={orders.filter((o) => o.status === 'pending').length}
          hint="Requires customer contact"
          accent="blue"
        />
        <AdminStatCard
          label="Delivered Cards"
          value={orders.filter((o) => o.status === 'delivered').length}
          hint="Fulfilled orders"
          accent="violet"
        />
      </div>

      <AdminDataTable
        title="Card Orders"
        description="View and fulfill customer NFC Smart Card orders."
        searchPlaceholder="Search by customer name, phone, or city..."
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        filters={
          <AdminFilterPills
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          />
        }
        loading={loading}
        error={error}
        isEmpty={orders.length === 0}
        emptyMessage="No card orders found."
        onClearFilters={() => {
          setSearch('');
          setStatusFilter('all');
        }}
        pagination={pagination}
        onPageChange={setPage}
        pageSize={limit}
        onPageSizeChange={setLimit}
      >
        <AdminTableShell>
          <AdminTableHead columns={columns} />
          <tbody className="divide-y divide-border/60">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-surface-alt/40 transition-colors">
                {/* Customer */}
                <td className="px-5 py-3.5">
                  <div>
                    <p className="font-bold text-fg text-xs">{order.fullName}</p>
                    <p className="font-mono text-[10px] text-fg-subtle truncate max-w-[140px]">{order.id}</p>
                  </div>
                </td>

                {/* Phone & WhatsApp */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${order.phone.replace(/[\s()-]/g, '')}`}
                      className="text-xs font-semibold text-fg hover:text-accent transition-colors"
                    >
                      {order.phone}
                    </a>
                    <a
                      href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${order.fullName}, regarding your NFC Smart Card order on LinkMakeup...`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded-md transition-colors"
                      title="Open WhatsApp chat"
                    >
                      💬 WA
                    </a>
                  </div>
                </td>

                {/* City & Address */}
                <td className="px-5 py-3.5">
                  <div>
                    <p className="text-xs font-bold text-fg">{order.city}</p>
                    <p className="text-[11px] text-fg-subtle truncate max-w-[200px]" title={order.address}>
                      {order.address}
                    </p>
                  </div>
                </td>

                {/* Status Dropdown */}
                <td className="px-5 py-3.5">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`text-xs font-bold rounded-lg border px-2.5 py-1 focus:outline-none focus:ring-1 transition-all ${
                      STATUS_STYLES[order.status] || STATUS_STYLES.pending
                    }`}
                  >
                    <option value="pending" className="bg-surface text-fg">Pending</option>
                    <option value="contacted" className="bg-surface text-fg">Contacted</option>
                    <option value="delivered" className="bg-surface text-fg">Delivered</option>
                    <option value="cancelled" className="bg-surface text-fg">Cancelled</option>
                  </select>
                </td>

                {/* Date */}
                <td className="px-5 py-3.5 text-xs text-fg-subtle tabular-nums whitespace-nowrap">
                  {formatDateTime(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTableShell>
      </AdminDataTable>
    </div>
  );
}
