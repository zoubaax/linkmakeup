import { useCallback, useEffect, useState } from 'react';
import ApiService from '../../services/api';
import { getPublicUserUrl } from '../../config/env';
import { SkeletonCard } from '../ui/Skeleton';
import AdminStatCard from './AdminStatCard';
import DonutChart from './DonutChart';
import TrendChart from './TrendChart';
import AdminDataTable, {
  AdminFilterPills,
  AdminTableHead,
  AdminTableShell,
  useAdminList,
} from './AdminDataTable';
import ExportCsvButton from './ExportCsvButton';
import { formatShortDate, formatNumber, truncateText, formatDateTime, formatCompact, formatPercent } from './formatters';

const PERIOD_FILTERS = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: 'all', label: 'All time' },
];

const STATUS_FILTERS = [
  { value: 'all', label: 'All pages' },
  { value: 'live', label: 'Live' },
  { value: 'suspended', label: 'Suspended' },
];

const SORT_OPTIONS = [
  { value: 'views', label: 'Most viewed' },
  { value: 'clicks', label: 'Most clicked' },
  { value: 'lastActiveAt', label: 'Recently active' },
  { value: 'username', label: 'Username (A-Z)' },
];

const EXPORT_COLUMNS = [
  { key: 'username', label: 'Username' },
  { key: 'displayName', label: 'Display Name' },
  { key: 'status', label: 'Status' },
  { key: 'pageViews', label: 'Page Views' },
  { key: 'linkClicks', label: 'Link Clicks' },
  { key: 'ctr', label: 'CTR (%)' },
  { key: 'last7Days', label: 'Last 7 Days' },
  { key: 'lastActiveAt', label: 'Last Active At' },
];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('30d');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('views');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPages = useCallback(
    (params) =>
      ApiService.getAdminAnalyticsPages({
        page: params.page,
        limit: params.limit,
        search: params.search,
        period,
        status,
        sort,
      }),
    [period, status, sort],
  );

  const {
    items: pages,
    pagination,
    search,
    setSearch,
    isSearching,
    setPage,
    limit,
    setLimit,
    loading: pagesLoading,
    error: pagesError,
    clearFilters,
  } = useAdminList(fetchPages, { status });

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    ApiService.getAdminAnalytics({ period })
      .then((res) => {
        if (!active) return;
        setAnalytics(res.data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Failed to load analytics overview');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [period]);

  const totals = analytics?.totals || {};
  const trend = analytics?.trend || [];
  const topLinks = totals?.topLinks || [];
  const devices = totals?.devices || { mobile: 0, desktop: 0, tablet: 0 };

  const deviceData = [
    { label: 'Mobile', value: devices.mobile || 0 },
    { label: 'Desktop', value: devices.desktop || 0 },
    { label: 'Tablet', value: devices.tablet || 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-fg">Analytics & Traffic</h1>
          <p className="text-xs text-fg-muted mt-1">Platform-wide page views, link clicks, device breakdown, and profile metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <AdminFilterPills options={PERIOD_FILTERS} value={period} onChange={setPeriod} />
        </div>
      </div>

      {loading && !analytics ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm font-semibold text-red-600">
          {error}
        </div>
      ) : (
        <>
          {/* Stat Overview Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AdminStatCard
              label="Page Views"
              value={formatCompact(totals.views || 0)}
              hint={`Total page views in past ${period}`}
              accent="accent"
            />
            <AdminStatCard
              label="Link Clicks"
              value={formatCompact(totals.clicks || 0)}
              hint={`Total button clicks in past ${period}`}
              accent="blue"
            />
            <AdminStatCard
              label="Click-Through Rate"
              value={formatPercent(totals.ctr || 0)}
              hint="Percentage of page views resulting in link clicks"
              accent="violet"
            />
            <AdminStatCard
              label="Engaged Profiles"
              value={formatCompact(totals.engagedProfiles || 0)}
              hint="Profiles with active page views or clicks"
              accent="amber"
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-border bg-surface p-6 shadow-2xs">
              <h2 className="text-sm font-bold text-fg mb-4">Traffic & Clicks Trend</h2>
              <TrendChart data={trend} />
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-2xs">
              <h2 className="text-sm font-bold text-fg mb-4">Device Breakdown</h2>
              <DonutChart data={deviceData} />
            </div>
          </div>

          {/* Top Clicked Links Table */}
          {topLinks.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-2xs">
              <h2 className="text-sm font-bold text-fg mb-4">Top Clicked Links</h2>
              <div className="divide-y divide-border">
                {topLinks.map((link) => (
                  <div key={link.linkId} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-fg text-sm truncate">{link.title}</p>
                      <p className="text-xs text-fg-subtle truncate">{link.url}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-fg text-sm tabular-nums">{formatCompact(link.clicks)} clicks</p>
                      <p className="text-xs text-fg-subtle tabular-nums">{link.percentage}% of all clicks</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Per-Page Stats Table */}
      <AdminDataTable
        title="Page Performance"
        description="Individual profile traffic breakdown and engagement rates."
        searchPlaceholder="Search by username or display name..."
        search={search}
        onSearchChange={setSearch}
        isSearching={isSearching}
        filters={(
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <AdminFilterPills options={STATUS_FILTERS} value={status} onChange={setStatus} />
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-fg-subtle">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-fg"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        actions={(
          <ExportCsvButton
            filename={`linkmakeup-analytics-${new Date().toISOString().slice(0, 10)}.csv`}
            columns={EXPORT_COLUMNS}
            fetchRows={() => ApiService.getAdminAnalyticsPagesExport({ search, status }).then((res) => res.data.items || [])}
          />
        )}
        loading={pagesLoading}
        error={pagesError}
        isEmpty={pages.length === 0}
        emptyMessage="No page stats match your filters."
        onClearFilters={clearFilters}
        pagination={pagination}
        onPageChange={setPage}
        pageSize={limit}
        onPageSizeChange={setLimit}
      >
        <AdminTableShell>
          <AdminTableHead columns={['Page', 'Status', 'Views', 'Clicks', 'CTR', 'Last 7 days', 'Last activity']} />
          <tbody>
            {pages.map((entry) => (
              <tr key={entry.id || entry.username} className="border-t border-border/70 hover:bg-surface-alt/60 transition-colors">
                <td className="px-5 py-3">
                  <a
                    href={getPublicUserUrl(entry.username)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-accent hover:text-accent-hover truncate block text-sm"
                  >
                    @{entry.username}
                  </a>
                  <p className="text-xs text-fg-subtle truncate">{entry.displayName}</p>
                </td>
                <td className="px-5 py-3">
                  {entry.isSuspended ? (
                    <span className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                      Suspended
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      Live
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-fg tabular-nums">{formatCompact(entry.views || entry.pageViews || 0)}</td>
                <td className="px-5 py-3 text-fg tabular-nums">{formatCompact(entry.clicks || entry.linkClicks || 0)}</td>
                <td className="px-5 py-3 text-fg-muted tabular-nums">{formatPercent(entry.ctr || 0)}</td>
                <td className="px-5 py-3 text-fg tabular-nums">{formatCompact(entry.last7 || entry.pageViews7d || 0)}</td>
                <td className="px-5 py-3 text-fg-muted whitespace-nowrap text-xs">{formatDateTime(entry.lastActiveAt)}</td>
              </tr>
            ))}
          </tbody>
        </AdminTableShell>
      </AdminDataTable>
    </div>
  );
}