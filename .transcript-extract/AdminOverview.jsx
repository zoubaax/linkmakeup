import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/api';
import { SkeletonCard } from '../ui/Skeleton';
import AdminStatCard from './AdminStatCard';
import { formatDateTime, formatNumber } from './formatters';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ApiService.getAdminStats()
      .then((res) => {
        if (res.success) setStats(res.data);
        else setError(res.message || 'Failed to load admin stats');
      })
      .catch((err) => setError(err.message || 'Failed to load admin stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  const totals = stats?.totals || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-fg">Overview</h1>
        <p className="text-sm text-fg-muted mt-1">Platform health and recent signups.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard label="Users" value={formatNumber(totals.users)} />
        <AdminStatCard label="Profiles" value={formatNumber(totals.profiles)} />
        <AdminStatCard label="Links" value={formatNumber(totals.links)} />
        <AdminStatCard label="Active links" value={formatNumber(totals.activeLinks)} hint="Visible on public pages" />
      </div>

      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-fg">Recent signups</h2>
          <Link to="/admin/users" className="text-xs font-semibold text-accent hover:text-accent-hover">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-alt text-fg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Username</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {(stats?.recentSignups || []).map((entry) => (
                <tr key={entry.id} className="hover:bg-surface-alt/50">
                  <td className="px-4 py-3 font-medium text-fg">{entry.email}</td>
                  <td className="px-4 py-3 text-fg-muted">{entry.username || '—'}</td>
                  <td className="px-4 py-3 text-fg-muted">{formatDateTime(entry.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
