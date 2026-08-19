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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 space-y-5 sm:space-y-6">
        {/* Header & Page Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <PageHeader
            title="Analytics"
            description="See how visitors discover your page, which links they click, and where traffic comes from."
          />
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {publicUrl && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Live page</span>
              </a>
            )}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Studio</span>
            </Link>
          </div>
        </div>

        {/* Filter Pills & Refresh Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface border border-border rounded-2xl p-3 shadow-xs">
          <div className="overflow-x-auto custom-scrollbar pb-1 sm:pb-0 max-w-full">
            <AdminFilterPills options={PERIODS} value={period} onChange={setPeriod} />
          </div>
          <button
            type="button"
            onClick={loadAnalytics}
            disabled={loading}
            className="self-end sm:self-auto shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-alt px-3.5 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors disabled:opacity-60"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-border bg-surface p-5 animate-pulse"><div className="h-10 rounded-lg bg-surface-alt" /></div>
            <div className="rounded-2xl border border-border bg-surface p-5 animate-pulse"><div className="h-10 rounded-lg bg-surface-alt" /></div>
            <div className="rounded-2xl border border-border bg-surface p-5 animate-pulse"><div className="h-10 rounded-lg bg-surface-alt" /></div>
          </div>
        ) : (
          <>
            {/* Top Overview Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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

            {/* Traffic Over Time Chart */}
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

            {/* Devices & Traffic Sources Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <DonutChart
                data={deviceData}
                title="Devices"
                subtitle="How visitors view your page"
                centerLabel="page views"
                centerValue={formatCompact(deviceData.reduce((sum, d) => sum + d.value, 0))}
              />

              {/* Traffic Sources Card */}
              <div className="rounded-2xl border border-border bg-surface overflow-hidden flex flex-col">
                <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-fg">Traffic sources</h2>
                    <p className="text-xs text-fg-muted mt-0.5">Where page views came from</p>
                  </div>
                  <span className="text-[11px] font-semibold text-fg-subtle bg-surface-alt border border-border px-2 py-0.5 rounded-lg shrink-0">
                    {referrers.length} sources
                  </span>
                </div>
                {referrers.length === 0 ? (
                  <div className="px-5 py-12 text-center text-sm text-fg-muted">No referrer data yet.</div>
                ) : (
                  <ul className="p-3 space-y-2 flex-1 overflow-y-auto">
                    {referrers.map((entry) => {
                      const percentage = Math.round((entry.count / Math.max(totals.views, 1)) * 100);
                      return (
                        <li
                          key={entry.label}
                          className="relative rounded-xl border border-border/60 bg-surface-alt/40 p-2.5 sm:p-3 flex items-center justify-between gap-2.5 overflow-hidden group hover:border-accent-border/50 transition-all"
                        >
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-indigo-500/10 dark:bg-indigo-500/20 transition-all duration-500 pointer-events-none"
                            style={{ width: `${Math.max(percentage, 3)}%` }}
                          />
                          <div className="relative flex items-center gap-2.5 min-w-0 flex-1">
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

            {/* Top Clicked Links Card */}
            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-fg">Top clicked links</h2>
                  <p className="text-xs text-fg-muted mt-0.5">Your most popular destination buttons</p>
                </div>
                <span className="text-[11px] font-semibold text-fg-subtle bg-surface-alt border border-border px-2 py-0.5 rounded-lg shrink-0">
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
                        className="relative rounded-xl border border-border/60 bg-surface-alt/40 p-2.5 sm:p-3 flex items-center justify-between gap-2.5 overflow-hidden group hover:border-accent-border/50 transition-all"
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-emerald-500/10 dark:bg-emerald-500/20 transition-all duration-500 pointer-events-none"
                          style={{ width: `${Math.max(percentage, 3)}%` }}
                        />
                        <div className="relative flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                          <span className="w-5 h-5 rounded-md bg-surface border border-border text-[10px] font-black text-fg-muted flex items-center justify-center shrink-0 shadow-xs tabular-nums">
                            #{index + 1}
                          </span>
                          <LinkIcon
                            icon={link.icon}
                            title={link.title}
                            url={link.url}
                            className="w-4 h-4 shrink-0 text-accent"
                            imgClassName="w-4 h-4 object-contain"
                          />
                          <div className="min-w-0 flex-1">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-fg truncate block hover:text-accent"
                            >
                              {link.title || truncateText(link.url, 32)}
                            </a>
                            <span className="text-[10px] text-fg-subtle truncate block">{truncateText(link.url, 32)}</span>
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

        {/* All Links List / Responsive Table */}
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border">
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
            <>
              {/* Mobile Card List (< md) */}
              <div className="block md:hidden divide-y divide-border/60">
                {links.map((link) => (
                  <div key={link.id} className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent shrink-0 p-1.5">
                        <LinkIcon
                          icon={link.icon}
                          title={link.title}
                          url={link.url}
                          className="w-4 h-4"
                          imgClassName="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-fg truncate">{link.title}</p>
                        <p className="text-[10px] text-fg-subtle truncate">{truncateText(link.url, 32)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                        link.isActive
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'border-border bg-surface-alt text-fg-muted'
                      }`}
                      >
                        {link.isActive ? 'Active' : 'Hidden'}
                      </span>
                      <span className="text-xs font-bold text-fg tabular-nums">{formatCompact(link.clicks)} clicks</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (>= md) */}
              <div className="hidden md:block overflow-x-auto">
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
                      <tr key={link.id} className="border-t border-border/70 hover:bg-surface-alt/40 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <LinkIcon
                              icon={link.icon}
                              title={link.title}
                              url={link.url}
                              className="w-4 h-4 shrink-0 text-accent"
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
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
