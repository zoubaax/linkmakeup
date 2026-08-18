import { useCallback, useEffect, useState } from 'react';
import ApiService from '../../services/api';
import { getPublicUserUrl } from '../../config/env';
import { SkeletonCard } from '../ui/Skeleton';
import AdminStatCard from './AdminStatCard';
import DonutChart from './DonutChart';
import TrendChart from './TrendChart';
import AdminDataTable, {
  AdminTableHead,
  AdminTableShell,
  useAdminList,
} from './AdminDataTable';
import ExportCsvButton from './ExportCsvButton';
import { formatShortDate, formatNumber, truncateText } from './formatters';

const PLATFORM_COLORS = [
  { strokeClass: 'stroke-emerald-500', swatchClass: 'bg-emerald-500' },
  { strokeClass: 'stroke-blue-500', swatchClass: 'bg-blue-500' },
  { strokeClass: 'stroke-violet-500', swatchClass: 'bg-violet-500' },
  { strokeClass: 'stroke-amber-500', swatchClass: 'bg-amber-500' },
  { strokeClass: 'stroke-red-500', swatchClass: 'bg-red-500' },
  { strokeClass: 'stroke-cyan-500', swatchClass: 'bg-cyan-500' },
  { strokeClass: 'stroke-fuchsia-500', swatchClass: 'bg-fuchsia-500' },
  { strokeClass: 'stroke-slate-500', swatchClass: 'bg-slate-500' },
];

const EXPORT_COLUMNS = [
  { key: 'profileId', label: 'Profile ID' },
  { key: 'username', label: 'Username' },
  { key: 'displayName', label: 'Display name' },
  { key: 'pageViews', label: 'Page views' },
  { key: 'pageViews7d', label: 'Page views (7d)' },
  { key: 'linkClicks', label: 'Link clicks' },
  { key: 'linkClicks7d', label: 'Link clicks (7d)' },
  { key: 'ctr', label: 'Click-through rate %' },
];

function sumTrend(trend) {
  return trend.reduce((sum, point) => sum + point.count, 0);
}

function deltaBetween(trend) {
  if (!trend || trend.length < 14) return null;
  const last7 = sumTrend(trend.slice(-7));
  const prev7 = sumTrend(trend.slice(0, 7));
  if (prev7 <= 0) return last7 > 0 ? 100 : 0;
  return ((last7 - prev7) / prev7) * 100;
}

function formatPct(value, fallback = '—') {
  if (value === null || value === undefined || Number.isNaN(value)) return fallback;
  return `${value.toFixed(1)}%`;
}

function ProgressBar({ value, max, colorClass = 'bg-accent' }) {
  const width = max > 0 ? Math.max(4, (value / max) * 100) : 0;
  return (
    <div className="h-1.5 w-full rounded-full bg-surface-muted overflow-hidden">
      <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${width}%` }} />
    </div>
  );
}

function TopListCard({ title, subtitle, emptyMessage, children }) {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-bold text-fg">{title}</h2>
        {subtitle && <p className="text-xs text-fg-muted mt-0.5">{subtitle}</p>}
      </div>
      {children.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-fg-muted">{emptyMessage}</div>
      ) : (
        <ol className="divide-y divide-border/70">{children}</ol>
      )}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(() => {
    setLoading(true);
    setError('');
    ApiService.getAdminAnalytics()
      .then((res) => {
        if (res.success) setAnalytics(res.data);
      })
      .catch((err) => setError(err.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const fetchPages = useCallback((params) => ApiService.getAdminAnalyticsPages(params), []);

  const {
    items,
    pagination,
    search,
    setSearch,
    isSearching,
    setPage,
    loading: pagesLoading,
    error: pagesError,
  } = useAdminList(fetchPages);

  if (loading && !analytics) {
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

  if (error && !analytics) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
        {error}
      </div>
    );
  }

  const totals = analytics?.totals;
  const trends = analytics?.trends;
  const topPlatforms = analytics?.topPlatforms || [];
  const topPages = analytics?.topPages || [];
  const topLinks = analytics?.topLinks || [];

  const pageViewsDelta = deltaBetween(trends?.pageViews);
  const linkClicksDelta = deltaBetween(trends?.linkClicks);
  const ctrDelta = totals?.ctr7d !== null && totals?.ctr !== null
    ? totals.ctr - totals.ctr7d
    : null;

  const maxLinkClicks = Math.max(...topLinks.map((entry) => entry.clicks), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-fg tracking-tight">Analytics</h1>
          <p className="text-sm text-fg-muted mt-1">
            Visitors of public pages, per-link clicks and platform breakdown.
          </p>
        </div>
        <button
          type="button"
          onClick={loadAnalytics}
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
          label="Page views"
          value={formatNumber(totals?.pageViews)}
          hint={`${formatNumber(totals?.pageViews7d)} this week`}
          delta={pageViewsDelta}
          accent="accent"
          sparkline={(trends?.pageViews || []).map((point) => point.count)}
          icon={(
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        />
        <AdminStatCard
          label="Link clicks"
          value={formatNumber(totals?.linkClicks)}
          hint={`${formatNumber(totals?.linkClicks7d)} this week`}
          delta={linkClicksDelta}
          accent="violet"
          sparkline={(trends?.linkClicks || []).map((point) => point.count)}
          icon={(
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          )}
        />
        <AdminStatCard
          label="Click-through rate"
          value={formatPct(totals?.ctr)}
          hint={`${formatPct(totals?.ctr7d)} this week`}
          delta={ctrDelta}
          deltaLabel="vs this week"
          accent="blue"
          icon={(
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )}
        />
        <AdminStatCard
          label="Active pages"
          value={formatNumber(totals?.activePages7d)}
          hint="Profiles with visits this week"
          accent="amber"
          icon={(
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart
            title="Visits & clicks"
            subtitle="Page views and link clicks per day (last 14 days)"
            delta={pageViewsDelta}
            deltaLabel="vs last week"
            series={[
              { key: 'views', label: 'Views', colorClass: 'text-accent', swatchClass: 'bg-accent', data: trends?.pageViews || [] },
              { key: 'clicks', label: 'Clicks', colorClass: 'text-violet-500', swatchClass: 'bg-violet-500', data: trends?.linkClicks || [] },
            ]}
          />
        </div>

        <div className="lg:col-span-1">
          <DonutChart
            title="Top platforms"
            subtitle="Link clicks by destination platform"
            centerLabel="Clicks"
            segments={topPlatforms.map((entry, index) => ({
              label: entry.platform === 'other' ? 'Other' : entry.platform || 'Other',
              value: entry.clicks,
              ...PLATFORM_COLORS[index % PLATFORM_COLORS.length],
            }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopListCard
          title="Top pages"
          subtitle="Public profiles with the most visitors"
          emptyMessage="No page views recorded yet."
        >
          {topPages.map((entry) => (
            <li key={entry.profileId} className="px-5 py-3.5 flex items-center gap-3">
              {entry.avatarUrl ? (
                <img
                  src={entry.avatarUrl}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover border border-border shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-surface-muted border border-border flex items-center justify-center text-xs font-bold text-fg shrink-0">
                  {entry.username?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <a
                  href={getPublicUserUrl(entry.username)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-fg hover:text-accent truncate block"
                >
                  @{entry.username}
                </a>
                <p className="text-xs text-fg-muted truncate">{entry.displayName}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <ProgressBar value={entry.pageViews} max={topPages[0]?.pageViews || 0} />
                  <span className="text-[10px] text-fg-subtle tabular-nums shrink-0">{formatNumber(entry.pageViews)} views</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-fg tabular-nums">{formatNumber(entry.linkClicks)}</p>
                <p className="text-[10px] text-fg-subtle">clicks</p>
                <p className="text-[10px] text-fg-muted tabular-nums mt-0.5">{formatPct(entry.ctr)}</p>
              </div>
            </li>
          ))}
        </TopListCard>

        <TopListCard
          title="Top links"
          subtitle="Most-clicked links across all public pages"
          emptyMessage="No link clicks recorded yet."
        >
          {topLinks.map((entry) => (
            <li key={entry.linkId} className="px-5 py-3.5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl border border-border bg-surface-alt flex items-center justify-center text-[10px] font-black uppercase text-fg-muted shrink-0">
                {entry.icon?.[0] || entry.title?.[0] || '?'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-fg truncate">{entry.title}</p>
                <p className="text-xs text-fg-muted truncate">
                  {truncateText(entry.url, 52)} · <span className="text-accent">@{entry.username}</span>
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <ProgressBar value={entry.clicks} max={maxLinkClicks} colorClass="bg-violet-500" />
                  <span className="text-[10px] text-fg-subtle tabular-nums shrink-0">{formatNumber(entry.clicks)}</span>
                </div>
              </div>
            </li>
          ))}
        </TopListCard>
      </div>

      <AdminDataTable
        title="All pages"
        description="Visitor and click counts per public profile."
        searchPlaceholder="Search by username or display name..."
        search={search}
        onSearchChange={setSearch}
        isSearching={isSearching}
        actions={(
          <ExportCsvButton
            filename={`linkmakeup-analytics-pages-${new Date().toISOString().slice(0, 10)}.csv`}
            columns={EXPORT_COLUMNS}
            fetchRows={() => ApiService.getAdminAnalyticsPagesExport({ search })
              .then((res) => res.data.items)}
          />
        )}
        loading={pagesLoading}
        error={pagesError}
        isEmpty={items.length === 0}
        emptyMessage="No pages match your search yet."
        pagination={pagination}
        onPageChange={setPage}
      >
        <AdminTableShell>
          <AdminTableHead columns={['Page', 'Views (7d)', 'Clicks (7d)', 'CTR', '']} />
          <tbody>
            {items.map((entry) => (
              <tr key={entry.profileId} className="border-t border-border/70 hover:bg-surface-alt/60 transition-colors">
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
                        {entry.username?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-fg truncate">{entry.displayName}</p>
                      <p className="text-xs text-fg-subtle truncate">@{entry.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-fg tabular-nums">
                  {formatNumber(entry.pageViews)}
                  <span className="text-fg-subtle"> · {formatNumber(entry.pageViews7d)}</span>
                </td>
                <td className="px-5 py-3 text-fg tabular-nums">
                  {formatNumber(entry.linkClicks)}
                  <span className="text-fg-subtle"> · {formatNumber(entry.linkClicks7d)}</span>
                </td>
                <td className="px-5 py-3 text-fg tabular-nums">{formatPct(entry.ctr)}</td>
                <td className="px-5 py-3 text-right">
                  <a
                    href={getPublicUserUrl(entry.username)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-accent hover:text-accent-hover"
                  >
                    View page
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTableShell>
      </AdminDataTable>

      {analytics && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface/60 px-4 py-3 text-xs text-fg-subtle">
          <span>
            Weekly trend · {trends?.pageViews?.[0] ? formatShortDate(trends.pageViews[0].date) : ''}
            {trends?.pageViews?.[0] && trends?.pageViews?.[trends.pageViews.length - 1] ? ` — ${formatShortDate(trends.pageViews[trends.pageViews.length - 1].date)}` : ''}
          </span>
          <span className="hidden sm:inline">
            Tracking is first-party and fire-and-forget; counts may exclude ad-blocked visits.
          </span>
        </div>
      )}
    </div>
  );
}