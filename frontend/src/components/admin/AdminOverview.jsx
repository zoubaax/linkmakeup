import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/api';
import { getPublicUserUrl } from '../../config/env';
import { SkeletonCard } from '../ui/Skeleton';
import AdminStatCard from './AdminStatCard';
import SignupChart from './SignupChart';
import { formatDateTime, truncateText } from './formatters';
import { formatAuditSummary } from './auditFormatters';

function ActivityTable({ title, viewAllTo, columns, rows, renderRow, emptyMessage }) {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-fg">{title}</h2>
        {viewAllTo && (
          <Link to={viewAllTo} className="text-xs font-semibold text-accent hover:text-accent-hover">
            View all
          </Link>
        )}
      </div>
      {rows.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-fg-muted">{emptyMessage}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-alt text-fg-muted">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-5 py-3 text-left font-semibold whitespace-nowrap">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>{rows.map(renderRow)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(() => {
    setLoading(true);
    setError('');
    ApiService.getAdminStats()
      .then((res) => {
        if (res.success) setStats(res.data);
      })
      .catch((err) => setError(err.message || 'Failed to load admin stats'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  const { totals, signupTrend, recentUsers, recentProfiles } = stats;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={loadStats}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard
          label="Total users"
          value={totals.users}
          hint={`${totals.signupsLast7Days} joined in the last 7 days`}
          accent="accent"
          icon={(
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        />
        <AdminStatCard
          label="Profiles live"
          value={totals.profiles}
          hint={`${totals.profileCompletionRate}% onboarding completion`}
          accent="blue"
          icon={(
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        />
        <AdminStatCard
          label="Total links"
          value={totals.links}
          hint={`${totals.activeLinks} active · ${totals.avgLinksPerProfile} avg / profile`}
          accent="violet"
          icon={(
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
        />
        <AdminStatCard
          label="Awaiting setup"
          value={totals.usersWithoutProfile}
          hint="Signed up but no public profile yet"
          accent="amber"
          icon={(
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        />
      </div>

      <SignupChart trend={signupTrend} />

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        <ActivityTable
          title="Recent signups"
          viewAllTo="/admin/users"
          columns={['Email', 'Profile', 'Joined']}
          rows={recentUsers}
          emptyMessage="No signups yet."
          renderRow={(entry) => (
            <tr key={entry.id} className="border-t border-border/70">
              <td className="px-5 py-3 text-fg">{entry.email}</td>
              <td className="px-5 py-3 text-fg-muted">{entry.username ? `@${entry.username}` : 'Not created'}</td>
              <td className="px-5 py-3 text-fg-muted">{formatDateTime(entry.createdAt)}</td>
            </tr>
          )}
        />

        <ActivityTable
          title="Recent profiles"
          viewAllTo="/admin/profiles"
          columns={['Username', 'Display name', 'Created']}
          rows={recentProfiles}
          emptyMessage="No profiles created yet."
          renderRow={(entry) => (
            <tr key={entry.id} className="border-t border-border/70">
              <td className="px-5 py-3">
                <a
                  href={getPublicUserUrl(entry.username)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-accent hover:text-accent-hover"
                >
                  {entry.username}
                </a>
              </td>
              <td className="px-5 py-3 text-fg-muted">{entry.displayName}</td>
              <td className="px-5 py-3 text-fg-muted">{formatDateTime(entry.createdAt)}</td>
            </tr>
          )}
        />
      </div>
    </div>
  );
}
