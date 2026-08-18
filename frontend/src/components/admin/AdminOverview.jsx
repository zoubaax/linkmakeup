import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import { getPublicUserUrl } from '../../config/env';
import { SkeletonCard } from '../ui/Skeleton';
import AdminStatCard from './AdminStatCard';
<<<<<<< Updated upstream
import DonutChart from './DonutChart';
import TrendChart from './TrendChart';
import { formatDateTime, truncateText } from './formatters';
import { formatAuditSummary } from './auditFormatters';
=======
import AdminPageHeader from './AdminPageHeader';
import SignupChart from './SignupChart';
import { formatDateTime, formatCompact } from './formatters';
import { formatAuditRow } from './auditFormatters';

const AUTO_REFRESH_KEY = 'admin-overview-auto-refresh';
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
function RecentActivityTimeline({ entries }) {
  if (entries.length === 0) {
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
=======
function QuickActionCard({ title, description, onClick, to }) {
  const className = 'rounded-2xl border border-border bg-surface p-4 text-left hover:bg-surface-alt hover:border-accent-border/50 transition-all group';
  const inner = (
    <>
      <p className="text-sm font-bold text-fg group-hover:text-accent">{title}</p>
      <p className="text-xs text-fg-muted mt-1">{description}</p>
    </>
  );

  if (to) {
    return <Link to={to} className={className}>{inner}</Link>;
  }

  return (
    <button type="button" onClick={onClick} className={`${className} w-full`}>
      {inner}
    </button>
>>>>>>> Stashed changes
  );
}

export default function AdminOverview() {
  const { user, profile } = useAuth();
  const { setAttentionItems } = useAdmin();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
<<<<<<< Updated upstream
  const [lastUpdated, setLastUpdated] = useState(null);
=======
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(
    () => sessionStorage.getItem(AUTO_REFRESH_KEY) === 'true',
  );
  const [bulkSending, setBulkSending] = useState(false);
>>>>>>> Stashed changes

  const loadStats = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError('');

    ApiService.getAdminStats()
      .then((res) => {
        if (res.success) {
          setStats(res.data);
<<<<<<< Updated upstream
          setLastUpdated(new Date());
=======
          setAttentionItems(res.data.attentionItems || []);
          setLastRefreshed(new Date());
>>>>>>> Stashed changes
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

  const handleBulkRemind = async () => {
    setBulkSending(true);
    try {
      const res = await ApiService.sendAdminBulkOnboardingReminders();
      if (res.success) loadStats(true);
    } catch (err) {
      setError(err.message || 'Failed to send reminders');
    } finally {
      setBulkSending(false);
    }
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

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const { totals, signupTrend, recentUsers, recentProfiles } = stats;
=======
  const { totals, signupTrend, profileTrend, linkTrend, recentUsers, recentProfiles, recentLinks, recentActivity = [] } = stats;
  const signupsDelta = totals.signupsPrev7Days > 0
    ? ((totals.signupsLast7Days - totals.signupsPrev7Days) / totals.signupsPrev7Days) * 100
    : (totals.signupsLast7Days > 0 ? 100 : 0);
>>>>>>> Stashed changes

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-fg tracking-tight">Platform overview</h1>
          <p className="text-sm text-fg-muted mt-1">
            Health, growth and moderation at a glance.
            {lastUpdated && <span className="text-fg-subtle"> · Updated {formatDateTime(lastUpdated)}</span>}
          </p>
        </div>
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
=======
  const {
    totals,
    deltas,
    analyticsSnapshot,
    attentionItems,
    signupTrend,
    recentUsers,
    recentProfiles,
    recentLinks,
    recentActivity,
  } = stats;

  const activityRows = (recentActivity || []).map(formatAuditRow);
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
>>>>>>> Stashed changes

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard
          label="Total users"
          value={totals.users}
<<<<<<< Updated upstream
          hint={`${totals.signupsLast7Days} joined this week`}
          delta={signupsDelta}
=======
          hint={`${totals.signupsLast7Days} joined in the last 7 days`}
          delta={deltas?.signupsLast7Days}
>>>>>>> Stashed changes
          accent="accent"
          sparkline={signupTrend.map((point) => point.count)}
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
          hint={`${totals.activeLinks} active · ${totals.hiddenLinks} hidden · ${totals.avgLinksPerProfile} avg / profile`}
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

<<<<<<< Updated upstream
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart
            title="Platform activity"
            subtitle="Accounts, profiles and links created per day"
            delta={signupsDelta}
            deltaLabel="vs last week"
            series={[
              { key: 'signups', label: 'Signups', colorClass: 'text-accent', swatchClass: 'bg-accent', data: signupTrend },
              { key: 'profiles', label: 'Profiles', colorClass: 'text-blue-500', swatchClass: 'bg-blue-500', data: profileTrend },
              { key: 'links', label: 'Links', colorClass: 'text-violet-500', swatchClass: 'bg-violet-500', data: linkTrend },
            ]}
          />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <DonutChart
            title="Onboarding"
            subtitle="Accounts with or without a public page"
            centerLabel="Users"
            segments={[
              { label: 'With profile', value: totals.profiles, strokeClass: 'stroke-emerald-500', swatchClass: 'bg-emerald-500' },
              { label: 'Awaiting setup', value: totals.usersWithoutProfile, strokeClass: 'stroke-amber-500', swatchClass: 'bg-amber-500' },
            ]}
          />
          <DonutChart
            title="Link health"
            subtitle="Visible vs hidden public links"
            centerLabel="Links"
            segments={[
              { label: 'Active', value: totals.activeLinks, strokeClass: 'stroke-emerald-500', swatchClass: 'bg-emerald-500' },
              { label: 'Hidden', value: totals.hiddenLinks, strokeClass: 'stroke-amber-500', swatchClass: 'bg-amber-500' },
            ]}
          />
          <DonutChart
            title="Profile health"
            subtitle="Public pages by moderation state"
            centerLabel="Profiles"
            segments={[
              { label: 'Live', value: totals.profiles - totals.suspendedProfiles, strokeClass: 'stroke-emerald-500', swatchClass: 'bg-emerald-500' },
              { label: 'Suspended', value: totals.suspendedProfiles, strokeClass: 'stroke-red-500', swatchClass: 'bg-red-500' },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-surface overflow-hidden h-full">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-bold text-fg">Health checklist</h2>
              <p className="text-xs text-fg-muted mt-0.5">Things that may need attention</p>
            </div>
            <div className="p-4 space-y-2.5">
              <HealthCheckItem
                count={totals.usersWithoutProfile}
                label="Accounts awaiting setup"
                description="Signed up without a public profile yet"
                to="/admin/users"
                tone="amber"
              />
              <HealthCheckItem
                count={totals.suspendedProfiles}
                label="Suspended public pages"
                description="Profiles hidden from the public web"
                to="/admin/profiles"
                tone="red"
              />
              <HealthCheckItem
                count={totals.hiddenLinks}
                label="Hidden links"
                description="Links moderated off public pages"
                to="/admin/links"
                tone="blue"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-surface overflow-hidden h-full">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-fg">Recent admin activity</h2>
                <p className="text-xs text-fg-muted mt-0.5">Latest moderation actions</p>
              </div>
              <Link to="/admin/activity" className="text-xs font-semibold text-accent hover:text-accent-hover shrink-0">
                View all
              </Link>
            </div>
            <RecentActivityTimeline entries={recentActivity} />
=======
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
        <div className="2xl:col-span-2">
          <SignupChart trend={signupTrend} />
        </div>
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-bold text-fg">Needs attention</h2>
            <p className="text-xs text-fg-muted mt-0.5">Actionable items across the platform</p>
          </div>
          {attentionItems?.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-fg-muted">All clear — nothing urgent</div>
          ) : (
            <ul className="divide-y divide-border/70">
              {attentionItems.map((item) => (
                <li key={item.type}>
                  <Link
                    to={item.href}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-surface-alt transition-colors"
                  >
                    <span className="text-sm font-medium text-fg">{item.label}</span>
                    <span className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-bold tabular-nums">
                      {item.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {analyticsSnapshot && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminStatCard
            label="Page views (24h)"
            value={formatCompact(analyticsSnapshot.views24h)}
            hint={`${analyticsSnapshot.viewsDelta >= 0 ? '+' : ''}${analyticsSnapshot.viewsDelta} vs prior 24h`}
            accent="accent"
          />
          <AdminStatCard
            label="Link clicks (24h)"
            value={formatCompact(analyticsSnapshot.clicks24h)}
            hint={`${analyticsSnapshot.clicksDelta >= 0 ? '+' : ''}${analyticsSnapshot.clicksDelta} vs prior 24h`}
            accent="blue"
          />
        </div>
      )}

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        <ActivityTable
          title="Recent activity"
          viewAllTo="/admin/activity"
          columns={['Time', 'Actor', 'Summary']}
          rows={activityRows}
          emptyMessage="No admin activity recorded yet."
          renderRow={(entry) => (
            <tr key={entry.id} className="border-t border-border/70">
              <td className="px-5 py-3 text-fg-muted whitespace-nowrap">{entry.time}</td>
              <td className="px-5 py-3 text-fg">{entry.actor}</td>
              <td className="px-5 py-3 text-fg-muted">{entry.summary}</td>
            </tr>
          )}
        />

        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-bold text-fg">Quick actions</h2>
            <p className="text-xs text-fg-muted mt-0.5">Common admin workflows</p>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <QuickActionCard
              title="Notify awaiting setup"
              description={bulkSending ? 'Sending emails…' : 'Email all users without a profile'}
              onClick={handleBulkRemind}
            />
            <QuickActionCard
              title="Review suspended"
              description="Profiles hidden from public view"
              to="/admin/profiles?status=suspended"
            />
            <QuickActionCard
              title="Open analytics"
              description="Views, clicks, and engagement"
              to="/admin/analytics"
            />
            <QuickActionCard
              title="Browse users"
              description="Search accounts and onboarding status"
              to="/admin/users"
            />
>>>>>>> Stashed changes
          </div>
        </div>
      </div>

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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======

      <ActivityTable
        title="Recent links"
        viewAllTo="/admin/links"
        columns={['Title', 'Owner', 'Status', 'Created']}
        rows={recentLinks}
        emptyMessage="No links created yet."
        renderRow={(entry) => (
          <tr key={entry.id} className="border-t border-border/70">
            <td className="px-5 py-3">
              <div className="font-medium text-fg">{entry.title}</div>
              <div className="text-xs text-fg-subtle mt-0.5">{truncateText(entry.url, 56)}</div>
            </td>
            <td className="px-5 py-3 text-fg-muted">{entry.username ? `@${entry.username}` : '—'}</td>
            <td className="px-5 py-3">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${entry.isActive ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'border-border bg-surface-alt text-fg-muted'}`}>
                {entry.isActive ? 'Active' : 'Hidden'}
              </span>
            </td>
            <td className="px-5 py-3 text-fg-muted">{formatDateTime(entry.createdAt)}</td>
          </tr>
        )}
      />
>>>>>>> Stashed changes
=======

      {recentLinks?.length > 0 && (
        <ActivityTable
          title="Recent links"
          viewAllTo="/admin/links"
          columns={['Title', 'Owner', 'Status', 'Created']}
          rows={recentLinks}
          emptyMessage="No links yet."
          renderRow={(entry) => (
            <tr key={entry.id} className="border-t border-border/70">
              <td className="px-5 py-3 font-medium text-fg">{entry.title}</td>
              <td className="px-5 py-3 text-fg-muted">{entry.username ? `@${entry.username}` : '—'}</td>
              <td className="px-5 py-3 text-fg-muted">{entry.isActive ? 'Active' : 'Hidden'}</td>
              <td className="px-5 py-3 text-fg-muted">{formatDateTime(entry.createdAt)}</td>
            </tr>
          )}
        />
      )}
>>>>>>> Stashed changes
    </div>
  );
}
