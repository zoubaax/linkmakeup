import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import { getPublicUserUrl } from '../../config/env';
import { SkeletonCard } from '../ui/Skeleton';
import AdminStatCard from './AdminStatCard';
import DonutChart from './DonutChart';
import TrendChart from './TrendChart';
import AdminPageHeader from './AdminPageHeader';
import { formatDateTime, truncateText, formatCompact } from './formatters';
import { formatAuditSummary, formatAuditRow } from './auditFormatters';

const AUTO_REFRESH_KEY = 'admin-overview-auto-refresh';

function HealthCheckItem({ count, label, description, to, tone }) {
  const toneClasses = {
    amber: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400',
    red: 'border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400',
    blue: 'border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400',
  }[tone] || 'border-border bg-surface-alt text-fg';

  return (
    <Link
      to={to}
      className="rounded-xl border border-border bg-surface-alt/50 px-4 py-3 flex items-center gap-3 hover:bg-surface-alt transition-colors"
    >
      <div className="shrink-0">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-black tabular-nums ${toneClasses}`}>
          {count}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-fg">{label}</p>
        <p className="text-[11px] text-fg-muted truncate">{description}</p>
      </div>
      <svg className="w-4 h-4 text-fg-subtle shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

function RecentActivityTimeline({ entries = [] }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="px-5 py-10 text-center text-sm text-fg-muted">
        No moderation actions recorded yet.
      </div>
    );
  }

  const toneFor = (action) => {
    if (action.startsWith('link.')) return 'border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400';
    if (action.startsWith('profile.')) return 'border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400';
    return 'border-border bg-surface-alt text-fg-muted';
  };

  return (
    <ol className="divide-y divide-border/70">
      {entries.map((entry) => (
        <li key={entry.id} className="px-5 py-3.5 flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-surface-muted border border-border flex items-center justify-center text-xs font-bold text-fg shrink-0">
            {entry.actorEmail?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-fg truncate">{entry.actorEmail}</span>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${toneFor(entry.action)}`}>
                {entry.action.startsWith('link.') ? 'Link' : 'Profile'}
              </span>
            </div>
            <p className="text-xs text-fg-muted mt-0.5 truncate">{formatAuditSummary(entry)}</p>
          </div>
          <span className="text-[10px] text-fg-subtle whitespace-nowrap shrink-0">
            {formatDateTime(entry.createdAt)}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function AdminOverview() {
  const { user, profile } = useAuth();
  const { setAttentionItems } = useAdmin();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(
    () => sessionStorage.getItem(AUTO_REFRESH_KEY) === 'true',
  );

  const loadStats = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError('');

    ApiService.getAdminStats()
      .then((res) => {
        if (res.success) {
          setStats(res.data);
          if (res.data.attentionItems) {
            setAttentionItems(res.data.attentionItems);
          }
          setLastRefreshed(new Date());
        }
      })
      .catch((err) => setError(err.message || 'Failed to load admin stats'))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, [setAttentionItems]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    const interval = window.setInterval(() => loadStats(true), 60000);
    return () => window.clearInterval(interval);
  }, [autoRefresh, loadStats]);

  const toggleAutoRefresh = () => {
    setAutoRefresh((prev) => {
      const next = !prev;
      sessionStorage.setItem(AUTO_REFRESH_KEY, String(next));
      return next;
    });
  };

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

  if (error && !stats) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  const { totals = {}, signupTrend = [], recentActivity = [] } = stats;
  const displayName = profile?.displayName || user?.name || 'Admin';

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Welcome back, ${displayName.split(' ')[0]}`}
        subtitle="Platform command center — health, growth, and items needing attention."
        meta={(
          <>
            Platform status: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">OK</span>
            {lastRefreshed && (
              <>
                {' · '}
                Last refreshed {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {refreshing && ' · Refreshing…'}
              </>
            )}
          </>
        )}
        actions={(
          <>
            <button
              type="button"
              onClick={toggleAutoRefresh}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                autoRefresh
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-border bg-surface text-fg-muted hover:text-fg hover:bg-surface-alt'
              }`}
            >
              Auto-refresh {autoRefresh ? 'On' : 'Off'}
            </button>
            <button
              type="button"
              onClick={() => loadStats(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors disabled:opacity-60"
            >
              <svg className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </>
        )}
      />

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard
          label="Total Users"
          value={totals.users || 0}
          hint="Registered platform accounts"
          accent="accent"
          sparkline={signupTrend.map((point) => point.count || 0)}
        />
        <AdminStatCard
          label="Live Profiles"
          value={totals.profiles || 0}
          hint={`${totals.suspendedProfiles || 0} suspended`}
          accent="blue"
        />
        <AdminStatCard
          label="Total Links"
          value={totals.links || 0}
          hint={`${totals.activeLinks || 0} active links`}
          accent="violet"
        />
        <AdminStatCard
          label="Awaiting Setup"
          value={totals.usersAwaitingProfile || 0}
          hint="Accounts without username profile"
          accent="amber"
        />
      </div>

      {/* Main Grid: Health Check + Moderation Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-surface overflow-hidden h-full">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-bold text-fg">Health Checklist</h2>
              <p className="text-xs text-fg-muted mt-0.5">Quick actions & status highlights</p>
            </div>
            <div className="p-4 space-y-2.5">
              <HealthCheckItem
                count={totals.usersAwaitingProfile || 0}
                label="Accounts awaiting setup"
                description="Signed up without a public profile yet"
                to="/admin/users"
                tone="amber"
              />
              <HealthCheckItem
                count={totals.suspendedProfiles || 0}
                label="Suspended profiles"
                description="Public pages currently restricted"
                to="/admin/profiles"
                tone="red"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-fg">Recent Moderation Activity</h2>
              <Link to="/admin/activity" className="text-xs font-semibold text-accent hover:text-accent-hover">
                View audit logs
              </Link>
            </div>
            <RecentActivityTimeline entries={recentActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}
