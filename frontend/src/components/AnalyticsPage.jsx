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

              {/* Traffic Sources Card - Vercel / Plausible Style */}
              <div className="rounded-2xl border border-border bg-surface overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-fg">Traffic sources</h2>
                    <p className="text-xs text-fg-muted mt-0.5">Where page views came from</p>
                  </div>
                  <span className="text-[11px] font-semibold text-fg-subtle bg-surface-alt border border-border px-2 py-0.5 rounded-lg">
                    {referrers.length} sources
                  </span>
                </div>
                {referrers.length === 0 ? (
                  <div className="px-5 py-12 text-center text-sm text-fg-muted">No referrer data yet.</div>
                ) : (
                  <ul className="p-3 space-y-2">
                    {referrers.map((entry) => {
                      const percentage = Math.round((entry.count / Math.max(totals.views, 1)) * 100);
                      return (
                        <li
                          key={entry.label}
                          className="relative rounded-xl border border-border/60 bg-surface-alt/40 p-3 flex items-center justify-between gap-3 overflow-hidden group hover:border-accent-border/50 transition-all"
                        >
                          {/* Soft background fill bar */}
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-indigo-500/10 dark:bg-indigo-500/20 transition-all duration-500"
                            style={{ width: `${Math.max(percentage, 3)}%` }}
                          />
                          <div className="relative flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0 text-xs shadow-xs">
                              {entry.label?.toLowerCase() === 'direct' ? '🌐' : entry.label?.toLowerCase() === 'nfc' ? '💳' : '🔗'}
                            </div>
                            <span className="text-xs font-bold text-fg capitalize truncate">{entry.label}</span>
                          </div>
                          <div className="relative flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-fg tabular-nums">{entry.count} views</span>
                            <span className="text-[10px] font-semibold text-fg-subtle bg-surface/80 border border-border/80 px-1.5 py-0.5 rounded-md tabular-nums">
                              {percentage}%
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* Top Clicked Links Card - Modern Ranked Rows */}
            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-fg">Top clicked links</h2>
                  <p className="text-xs text-fg-muted mt-0.5">Your most popular destination buttons</p>
                </div>
                <span className="text-[11px] font-semibold text-fg-subtle bg-surface-alt border border-border px-2 py-0.5 rounded-lg">
                  {topLinks.length} links
                </span>
              </div>
              {topLinks.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-fg-muted">No link clicks recorded yet.</div>
              ) : (
                <ul className="p-3 space-y-2">
                  {topLinks.map((link, index) => {
                    const percentage = link.percentage || Math.round((link.clicks / Math.max(totals.clicks, 1)) * 100);
                    return (
                      <li
                        key={link.linkId || link.url}
                        className="relative rounded-xl border border-border/60 bg-surface-alt/40 p-3 flex items-center justify-between gap-3 overflow-hidden group hover:border-accent-border/50 transition-all"
                      >
                        {/* Soft background fill bar */}
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-emerald-500/10 dark:bg-emerald-500/20 transition-all duration-500"
                          style={{ width: `${Math.max(percentage, 3)}%` }}
                        />
                        <div className="relative flex items-center gap-3 min-w-0">
                          <span className="w-5 h-5 rounded-md bg-surface border border-border text-[10px] font-black text-fg-muted flex items-center justify-center shrink-0 shadow-xs tabular-nums">
                            #{index + 1}
                          </span>
                          <LinkIcon
                            icon={link.icon}
                            title={link.title}
                            url={link.url}
                            className="w-4 h-4 shrink-0"
                            imgClassName="w-4 h-4 object-contain"
                          />
                          <div className="min-w-0">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-fg truncate block hover:text-accent"
                            >
                              {link.title || truncateText(link.url, 48)}
                            </a>
                            <span className="text-[10px] text-fg-subtle truncate block">{truncateText(link.url, 40)}</span>
                          </div>
                        </div>
                        <div className="relative flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold text-fg tabular-nums">{link.clicks} clicks</span>
                          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md tabular-nums">
                            {percentage}%
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
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
