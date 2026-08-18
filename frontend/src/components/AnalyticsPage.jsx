import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPublicUserUrl } from '../config/env';
import ApiService from '../services/api';
import AppLayout from './layout/AppLayout';
import PageHeader from './ui/PageHeader';
import AdminStatCard from './admin/AdminStatCard';
import { AdminFilterPills } from './admin/AdminDataTable';
import TrendChart from './admin/charts/TrendChart';
import DonutChart from './admin/charts/DonutChart';
import { LinkIcon } from './LinkIcon';
import {
  formatCompact,
  formatDateTime,
  formatPercent,
  truncateText,
} from './admin/formatters';

const PERIODS = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: 'all', label: 'All time' },
];

const DEVICE_COLORS = { mobile: '#6366f1', desktop: '#10b981', tablet: '#f59e0b' };

function formatNumberTotal(trend = []) {
  return trend.reduce((sum, point) => sum + (point.views || 0) + (point.clicks || 0), 0).toLocaleString();
}

export default function AnalyticsPage() {
  const { profile } = useAuth();
  const [period, setPeriod] = useState('30d');
  const [summary, setSummary] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalytics = useCallback(() => {
    setLoading(true);
    setError('');

    Promise.all([
      ApiService.getMyAnalyticsSummary(period),
      ApiService.getMyAnalyticsLinks(period),
    ])
      .then(([summaryRes, linksRes]) => {
        if (summaryRes.success) setSummary(summaryRes.data);
        if (linksRes.success) setLinks(linksRes.data.items || []);
      })
      .catch((err) => setError(err.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [period]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const totals = summary?.totals;
  const topLinks = totals?.topLinks || [];
  const devices = totals?.devices || { mobile: 0, desktop: 0, tablet: 0 };
  const referrers = totals?.referrers || [];
  const deviceData = [
    { label: 'Mobile', value: devices.mobile, color: DEVICE_COLORS.mobile },
    { label: 'Desktop', value: devices.desktop, color: DEVICE_COLORS.desktop },
    { label: 'Tablet', value: devices.tablet, color: DEVICE_COLORS.tablet },
  ];
  const maxTopClicks = Math.max(...topLinks.map((link) => link.clicks), 1);
  const maxReferrerCount = Math.max(...referrers.map((r) => r.count), 1);
  const publicUrl = profile?.username ? getPublicUserUrl(profile.username) : null;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <PageHeader
            title="Analytics"
            description="See how visitors discover your page, which links they click, and where traffic comes from."
          />
          <div className="flex flex-wrap items-center gap-2">
            {publicUrl && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors"
              >
                View live page
              </a>
            )}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors"
            >
              Back to Studio
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <AdminFilterPills options={PERIODS} value={period} onChange={setPeriod} />
          <button
            type="button"
            onClick={loadAnalytics}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors disabled:opacity-60"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading || !totals ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-surface p-5 animate-pulse"><div className="h-10 rounded-lg bg-surface-alt" /></div>
            <div className="rounded-2xl border border-border bg-surface p-5 animate-pulse"><div className="h-10 rounded-lg bg-surface-alt" /></div>
            <div className="rounded-2xl border border-border bg-surface p-5 animate-pulse"><div className="h-10 rounded-lg bg-surface-alt" /></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <AdminStatCard
                label="Page views"
                value={formatCompact(totals.views)}
                hint={period === 'all' ? 'All time' : `Last ${period}`}
                accent="accent"
              />
              <AdminStatCard
                label="Link clicks"
                value={formatCompact(totals.clicks)}
                hint={`${formatPercent(totals.ctr)} click-through rate`}
                accent="blue"
              />
              <AdminStatCard
                label="Click-through rate"
                value={formatPercent(totals.ctr)}
                hint={totals.lastActiveAt ? `Last activity ${formatDateTime(totals.lastActiveAt)}` : 'No activity yet'}
                accent="violet"
              />
            </div>

            <TrendChart
              trend={summary.trend || []}
              series={[
                { key: 'views', label: 'Page views', color: '#6366f1' },
                { key: 'clicks', label: 'Link clicks', color: '#10b981' },
              ]}
              title="Traffic over time"
              subtitle={`Daily views and clicks on @${profile?.username || 'your page'}`}
              footerLabel={`${formatNumberTotal(summary.trend)} events total`}
            />

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
              <DonutChart
                data={deviceData}
                title="Devices"
                subtitle="How visitors view your page"
                centerLabel="page views"
                centerValue={formatCompact(deviceData.reduce((sum, d) => sum + d.value, 0))}
              />

              <div className="rounded-2xl border border-border bg-surface overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="text-sm font-bold text-fg">Traffic sources</h2>
                  <p className="text-xs text-fg-muted mt-0.5">Where page views came from</p>
                </div>
                {referrers.length === 0 ? (
                  <div className="px-5 py-12 text-center text-sm text-fg-muted">No referrer data yet.</div>
                ) : (
                  <ul className="divide-y divide-border/70">
                    {referrers.map((entry) => (
                      <li key={entry.label} className="px-5 py-3 flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-fg capitalize">{entry.label}</p>
                          <div className="mt-1.5 h-1.5 rounded-full bg-surface-alt overflow-hidden">
                            <div
                              className="h-full rounded-full bg-indigo-500"
                              style={{ width: `${Math.max((entry.count / maxReferrerCount) * 100, 4)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-bold text-fg tabular-nums shrink-0">{entry.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-bold text-fg">Top clicked links</h2>
                <p className="text-xs text-fg-muted mt-0.5">Your most popular destination buttons</p>
              </div>
              {topLinks.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-fg-muted">No link clicks recorded yet.</div>
              ) : (
                <ol className="divide-y divide-border/70">
                  {topLinks.map((link, index) => (
                    <li key={link.linkId} className="px-5 py-3 flex items-center gap-3">
                      <span className="w-6 shrink-0 text-sm font-black text-fg-muted tabular-nums">{index + 1}</span>
                      <div className="min-w-0 flex-1">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-fg truncate block hover:text-accent"
                        >
                          {link.title || truncateText(link.url, 64)}
                        </a>
                        <div className="mt-1.5 h-1.5 rounded-full bg-surface-alt overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                            style={{ width: `${Math.max((link.clicks / maxTopClicks) * 100, 4)}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-fg tabular-nums">{link.clicks}</p>
                        <p className="text-[11px] text-fg-muted tabular-nums">{formatPercent(link.percentage)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </>
        )}

        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-bold text-fg">All links</h2>
            <p className="text-xs text-fg-muted mt-0.5">Click performance for every button on your page</p>
          </div>
          {links.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-fg-muted">
              No links yet.
              {' '}
              <Link to="/dashboard" className="text-accent hover:text-accent-hover font-semibold">Add links in Studio</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-surface-alt text-fg-muted">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">Link</th>
                    <th className="px-5 py-3 text-left font-semibold">Status</th>
                    <th className="px-5 py-3 text-left font-semibold">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id} className="border-t border-border/70">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <LinkIcon
                            icon={link.icon}
                            title={link.title}
                            url={link.url}
                            className="w-4 h-4 shrink-0"
                            imgClassName="w-4 h-4 object-contain"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-fg truncate">{link.title}</p>
                            <p className="text-xs text-fg-subtle truncate">{truncateText(link.url, 56)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                          link.isActive
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            : 'border-border bg-surface-alt text-fg-muted'
                        }`}
                        >
                          {link.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-fg tabular-nums font-semibold">{formatCompact(link.clicks)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
