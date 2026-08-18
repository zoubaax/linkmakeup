<<<<<<< Updated upstream
import { and, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { analyticsEvents, links, profiles } from '../models/schema.js';

const PAGE_VIEW = 'page_view';
const LINK_CLICK = 'link_click';

const round2 = (n) => Math.round(n * 100) / 100;

const pct = (numerator, denominator) =>
  denominator > 0 ? round2((numerator / denominator) * 100) : null;

function dailyTrendBuilder(rows, type) {
  const map = new Map();
  for (const row of rows) {
    if (row.eventType !== type) continue;
    const raw = row.day;
    const key = raw instanceof Date ? raw.toISOString().slice(0, 10) : String(raw).slice(0, 10);
    map.set(key, row.count);
  }
  const days = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const key = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i))
      .toISOString()
      .slice(0, 10);
    days.push({ date: key, count: map.get(key) || 0 });
  }
  return days;
}

function sumCounts(trend) {
  return trend.reduce((sum, item) => sum + item.count, 0);
}

const pageStatsProjection = {
  profileId: profiles.id,
  username: profiles.username,
  displayName: profiles.displayName,
  avatarUrl: profiles.avatarUrl,
  pageViews: sql`count(*) filter (where ${analyticsEvents.eventType} = '${sql.raw(PAGE_VIEW)}')::int`,
  pageViews7d: sql`count(*) filter (where ${analyticsEvents.eventType} = '${sql.raw(PAGE_VIEW)}' and ${analyticsEvents.createdAt} >= now() - interval '7 days')::int`,
  linkClicks: sql`count(*) filter (where ${analyticsEvents.eventType} = '${sql.raw(LINK_CLICK)}')::int`,
  linkClicks7d: sql`count(*) filter (where ${analyticsEvents.eventType} = '${sql.raw(LINK_CLICK)}' and ${analyticsEvents.createdAt} >= now() - interval '7 days')::int`,
};

export default class AnalyticsService {
  static async recordPageView({ profileId, source, userAgent }) {
    const [existingProfile] = await db
      .select({ id: profiles.id, isSuspended: profiles.isSuspended })
      .from(profiles)
      .where(and(eq(profiles.id, profileId), eq(profiles.isSuspended, false)))
      .limit(1);

    if (!existingProfile) return { recorded: false };

    await db.insert(analyticsEvents).values({
      profileId,
      eventType: PAGE_VIEW,
      source: source || null,
      userAgent: userAgent || null,
    });
=======
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { analyticsEvents, links, profiles } from '../models/schema.js';
import { ApiError } from '../utils/apiResponse.js';
import { buildDaySeries } from '../utils/trend.js';

const PERIOD_DAYS = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  all: null,
};

const ALL_TREND_DAYS = 90;

const EVENT_TYPES = new Set(['page_view', 'link_click']);

function cleanPeriod(value) {
  const period = String(value || '30d');
  return Object.prototype.hasOwnProperty.call(PERIOD_DAYS, period) ? period : '30d';
}

function periodWhere(period) {
  const days = PERIOD_DAYS[period];
  if (!days) return undefined;
  return sql`${analyticsEvents.createdAt} >= now() - make_interval(days => ${days})`;
}

export function roundToOne(value) {
  return Math.round(value * 10) / 10;
}

export function computeCtr(clicks, views) {
  return views > 0 ? roundToOne((clicks / views) * 100) : 0;
}

export function detectDeviceType(userAgent = '') {
  const ua = String(userAgent);
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return 'mobile';
  return 'desktop';
}

function formatTimestamp(value) {
  if (!value) return '';
  return typeof value === 'string' ? value : value.toISOString();
}

export class AnalyticsService {
  static async recordEvent({ username, eventType, linkId, referrer, deviceType }) {
    if (!username || !EVENT_TYPES.has(eventType)) {
      return { recorded: false };
    }

    const cleanUsername = String(username).toLowerCase().trim();
    const [profile] = await db
      .select({ id: profiles.id, userId: profiles.userId, isSuspended: profiles.isSuspended })
      .from(profiles)
      .where(sql`lower(${profiles.username}) = ${cleanUsername}`)
      .limit(1);

    if (!profile || profile.isSuspended) {
      return { recorded: false };
    }

    let resolvedLinkId = null;
    if (eventType === 'link_click') {
      if (!linkId) return { recorded: false };
      const [link] = await db
        .select({ id: links.id })
        .from(links)
        .where(and(eq(links.id, linkId), eq(links.userId, profile.userId)))
        .limit(1);
      if (!link) return { recorded: false };
      resolvedLinkId = link.id;
    }

    // Omit the uuid link_id column when null: the Neon driver serializes a
    // null uuid param as an empty string, which Postgres rejects.
    const values = {
      profileId: profile.id,
      eventType,
      referrer: referrer || null,
      deviceType: deviceType || null,
      ...(resolvedLinkId ? { linkId: resolvedLinkId } : {}),
    };

    await db.insert(analyticsEvents).values(values);
>>>>>>> Stashed changes

    return { recorded: true };
  }

<<<<<<< Updated upstream
  static async recordLinkClick({ profileId, linkId, source, userAgent }) {
    const [matchedLink] = await db
      .select({ id: links.id, icon: links.icon })
      .from(links)
      .innerJoin(profiles, and(eq(profiles.userId, links.userId), eq(profiles.id, profileId)))
      .where(and(eq(links.id, linkId), eq(links.isActive, true)))
      .limit(1);

    if (!matchedLink) return { recorded: false };

    await db.insert(analyticsEvents).values({
      profileId,
      linkId,
      eventType: LINK_CLICK,
      platform: matchedLink.icon || 'other',
      source: source || null,
      userAgent: userAgent || null,
    });

    return { recorded: true };
  }

  static async getAdminAnalytics() {
    const [totals] = await db
      .select({
        pageViews: sql`count(*) filter (where ${analyticsEvents.eventType} = '${sql.raw(PAGE_VIEW)}')::int`,
        pageViews7d: sql`count(*) filter (where ${analyticsEvents.eventType} = '${sql.raw(PAGE_VIEW)}' and ${analyticsEvents.createdAt} >= now() - interval '7 days')::int`,
        linkClicks: sql`count(*) filter (where ${analyticsEvents.eventType} = '${sql.raw(LINK_CLICK)}')::int`,
        linkClicks7d: sql`count(*) filter (where ${analyticsEvents.eventType} = '${sql.raw(LINK_CLICK)}' and ${analyticsEvents.createdAt} >= now() - interval '7 days')::int`,
        activePages7d: sql`(select count(*) from (select distinct ${analyticsEvents.profileId} from ${analyticsEvents} where ${analyticsEvents.eventType} = '${sql.raw(PAGE_VIEW)}' and ${analyticsEvents.createdAt} >= now() - interval '7 days') as active_pages)::int`,
      })
      .from(analyticsEvents);

    const trendRows = await db
      .select({
        day: sql`date_trunc('day', ${analyticsEvents.createdAt})::date`,
        eventType: analyticsEvents.eventType,
        count: sql`count(*)::int`,
      })
      .from(analyticsEvents)
      .where(sql`${analyticsEvents.createdAt} >= now() - interval '14 days'`)
      .groupBy(sql`date_trunc('day', ${analyticsEvents.createdAt})::date`, analyticsEvents.eventType)
      .orderBy(sql`date_trunc('day', ${analyticsEvents.createdAt})::date`);

    const pageViewsTrend = dailyTrendBuilder(trendRows, PAGE_VIEW);
    const linkClicksTrend = dailyTrendBuilder(trendRows, LINK_CLICK);

    const topPlatformsPromise = db
      .select({
        platform: sql`coalesce(${analyticsEvents.platform}, 'other')`,
        clicks: sql`count(*)::int`,
      })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.eventType, LINK_CLICK))
      .groupBy(sql`coalesce(${analyticsEvents.platform}, 'other')`)
      .orderBy(sql`count(*) desc`)
      .limit(8);

    const topPagesPromise = db
      .select({
        ...pageStatsProjection,
      })
      .from(profiles)
      .leftJoin(analyticsEvents, eq(analyticsEvents.profileId, profiles.id))
      .groupBy(
        profiles.id,
        profiles.username,
        profiles.displayName,
        profiles.avatarUrl,
      )
      .orderBy(sql`${pageStatsProjection.pageViews} desc`)
      .limit(5);

    const topLinksPromise = db
      .select({
        linkId: links.id,
        title: links.title,
        url: links.url,
        icon: links.icon,
        username: profiles.username,
        clicks: sql`count(*)::int`,
      })
      .from(analyticsEvents)
      .innerJoin(links, eq(links.id, analyticsEvents.linkId))
      .innerJoin(profiles, eq(profiles.id, analyticsEvents.profileId))
      .where(eq(analyticsEvents.eventType, LINK_CLICK))
      .groupBy(links.id, links.title, links.url, links.icon, profiles.username)
      .orderBy(sql`count(*) desc`)
      .limit(8);

    const [topPlatforms, topPages, topLinks] = await Promise.all([
      topPlatformsPromise,
      topPagesPromise,
      topLinksPromise,
    ]);

    return {
      totals: {
        pageViews: totals?.pageViews ?? 0,
        pageViews7d: totals?.pageViews7d ?? 0,
        linkClicks: totals?.linkClicks ?? 0,
        linkClicks7d: totals?.linkClicks7d ?? 0,
        ctr: pct(totals?.linkClicks ?? 0, totals?.pageViews ?? 0),
        ctr7d: pct(totals?.linkClicks7d ?? 0, totals?.pageViews7d ?? 0),
        activePages7d: totals?.activePages7d ?? 0,
      },
      trends: {
        pageViews: pageViewsTrend,
        linkClicks: linkClicksTrend,
      },
      topPlatforms,
      topPages: topPages.map((row) => ({
        ...row,
        ctr: pct(row.linkClicks ?? 0, row.pageViews ?? 0),
      })),
      topLinks,
    };
  }

  static async listPageStats({ page = 1, limit = 20, search = '' }) {
    const cleanPage = Math.max(1, parseInt(page, 10) || 1);
    const cleanLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (cleanPage - 1) * cleanLimit;

    const searchTerm = search?.trim();
    let profileFilter = null;
    if (searchTerm) {
      const pattern = `%${searchTerm}%`;
      profileFilter = or(
        ilike(profiles.username, pattern),
        ilike(profiles.displayName, pattern),
      );
    }

    const rowsPromise = db
      .select({
        ...pageStatsProjection,
      })
      .from(profiles)
      .leftJoin(analyticsEvents, eq(analyticsEvents.profileId, profiles.id))
      .where(profileFilter ?? undefined)
      .groupBy(
        profiles.id,
        profiles.username,
        profiles.displayName,
        profiles.avatarUrl,
      )
      .orderBy(sql`${pageStatsProjection.pageViews} desc`)
      .limit(cleanLimit)
      .offset(offset);

    const countPromise = db
      .select({ count: sql`count(*)::int` })
      .from(profiles)
      .where(profileFilter ?? undefined);

    const [rows, [countRow]] = await Promise.all([rowsPromise, countPromise]);
    const total = countRow?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / cleanLimit));

    return {
      items: rows.map((row) => ({
        ...row,
        ctr: pct(row.linkClicks ?? 0, row.pageViews ?? 0),
        ctr7d: pct(row.linkClicks7d ?? 0, row.pageViews7d ?? 0),
      })),
      pagination: {
        page: cleanPage,
        limit: cleanLimit,
        total,
        totalPages,
        hasNextPage: cleanPage < totalPages,
        hasPrevPage: cleanPage > 1,
      },
    };
  }
=======
  static async getSummary({ period = '30d' } = {}) {
    return AnalyticsService.getPlatformSummary({ period });
  }

  static async getProfileSummary({ profileId, period = '30d' } = {}) {
    if (!profileId) {
      throw new ApiError('Profile not found', 404);
    }

    const resolvedPeriod = cleanPeriod(period);
    const periodFilter = periodWhere(resolvedPeriod);
    const profileFilter = eq(analyticsEvents.profileId, profileId);
    const where = periodFilter ? and(periodFilter, profileFilter) : profileFilter;
    const days = PERIOD_DAYS[resolvedPeriod] || ALL_TREND_DAYS;

    const [[totalsRow], trendRows, deviceRows, referrerRows, topLinkRows, [lastActiveRow]] = await Promise.all([
      db
        .select({
          views: sql`count(*) filter (where ${analyticsEvents.eventType} = 'page_view')::int`.as('views'),
          clicks: sql`count(*) filter (where ${analyticsEvents.eventType} = 'link_click')::int`.as('clicks'),
        })
        .from(analyticsEvents)
        .where(where),
      db
        .select({
          day: sql`date_trunc('day', ${analyticsEvents.createdAt})::date`.as('day'),
          views: sql`count(*) filter (where ${analyticsEvents.eventType} = 'page_view')::int`.as('views'),
          clicks: sql`count(*) filter (where ${analyticsEvents.eventType} = 'link_click')::int`.as('clicks'),
        })
        .from(analyticsEvents)
        .where(where)
        .groupBy(sql`date_trunc('day', ${analyticsEvents.createdAt})::date`)
        .orderBy(sql`date_trunc('day', ${analyticsEvents.createdAt})::date`),
      db
        .select({
          deviceType: analyticsEvents.deviceType,
          count: sql`count(*)::int`.as('count'),
        })
        .from(analyticsEvents)
        .where(and(where, eq(analyticsEvents.eventType, 'page_view')))
        .groupBy(analyticsEvents.deviceType)
        .orderBy(desc(sql`count(*)`)),
      db
        .select({
          referrer: analyticsEvents.referrer,
          count: sql`count(*)::int`.as('count'),
        })
        .from(analyticsEvents)
        .where(and(where, eq(analyticsEvents.eventType, 'page_view')))
        .groupBy(analyticsEvents.referrer)
        .orderBy(desc(sql`count(*)`))
        .limit(8),
      db
        .select({
          linkId: links.id,
          title: links.title,
          url: links.url,
          icon: links.icon,
          clicks: sql`count(*)::int`.as('clicks'),
        })
        .from(analyticsEvents)
        .innerJoin(links, eq(links.id, analyticsEvents.linkId))
        .where(and(where, eq(analyticsEvents.eventType, 'link_click')))
        .groupBy(links.id)
        .orderBy(desc(sql`count(*)`))
        .limit(10),
      db
        .select({ lastActiveAt: sql`max(${analyticsEvents.createdAt})`.as('lastActiveAt') })
        .from(analyticsEvents)
        .where(profileFilter),
    ]);

    const views = totalsRow.views;
    const clicks = totalsRow.clicks;
    const totalClicks = Math.max(clicks, 1);
    const topLinks = topLinkRows.map((link) => ({
      ...link,
      percentage: roundToOne((link.clicks / totalClicks) * 100),
    }));

    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    deviceRows.forEach((row) => {
      if (row.deviceType && Object.prototype.hasOwnProperty.call(devices, row.deviceType)) {
        devices[row.deviceType] = row.count;
      }
    });

    const referrers = referrerRows.map((row) => ({
      label: row.referrer || 'direct',
      count: row.count,
    }));

    return {
      period: resolvedPeriod,
      totals: {
        views,
        clicks,
        ctr: computeCtr(clicks, views),
        lastActiveAt: lastActiveRow?.lastActiveAt || null,
        topLinks,
        devices,
        referrers,
      },
      trend: buildDaySeries(trendRows, days),
    };
  }

  static async getProfileLinkStats({ profileId, userId, period = '30d' } = {}) {
    if (!profileId || !userId) {
      throw new ApiError('Profile not found', 404);
    }

    const resolvedPeriod = cleanPeriod(period);
    const periodFilter = periodWhere(resolvedPeriod);

    const eventJoin = periodFilter
      ? and(eq(analyticsEvents.linkId, links.id), periodFilter)
      : eq(analyticsEvents.linkId, links.id);

    const rows = await db
      .select({
        id: links.id,
        title: links.title,
        url: links.url,
        icon: links.icon,
        isActive: links.isActive,
        position: links.position,
        clicks: sql`count(${analyticsEvents.id}) filter (where ${analyticsEvents.eventType} = 'link_click')::int`.as('clicks'),
      })
      .from(links)
      .leftJoin(analyticsEvents, eventJoin)
      .where(eq(links.userId, userId))
      .groupBy(links.id)
      .orderBy(asc(links.position), desc(sql`count(${analyticsEvents.id}) filter (where ${analyticsEvents.eventType} = 'link_click')`));

    return rows.map((row) => ({
      ...row,
      clicks: row.clicks ?? 0,
    }));
  }

  static async getPlatformSummary({ period = '30d' } = {}) {
    const resolvedPeriod = cleanPeriod(period);
    const where = periodWhere(resolvedPeriod);
    const days = PERIOD_DAYS[resolvedPeriod] || ALL_TREND_DAYS;

    const [[totalsRow], engagedRow, trendRows, deviceRows, topLinkRows] = await Promise.all([
      db
        .select({
          views: sql`count(*) filter (where ${analyticsEvents.eventType} = 'page_view')::int`.as('views'),
          clicks: sql`count(*) filter (where ${analyticsEvents.eventType} = 'link_click')::int`.as('clicks'),
        })
        .from(analyticsEvents)
        .where(where),
      db
        .select({ count: sql`count(distinct ${analyticsEvents.profileId})::int` })
        .from(analyticsEvents)
        .where(where),
      db
        .select({
          day: sql`date_trunc('day', ${analyticsEvents.createdAt})::date`.as('day'),
          views: sql`count(*) filter (where ${analyticsEvents.eventType} = 'page_view')::int`.as('views'),
          clicks: sql`count(*) filter (where ${analyticsEvents.eventType} = 'link_click')::int`.as('clicks'),
        })
        .from(analyticsEvents)
        .where(where)
        .groupBy(sql`date_trunc('day', ${analyticsEvents.createdAt})::date`)
        .orderBy(sql`date_trunc('day', ${analyticsEvents.createdAt})::date`),
      db
        .select({
          deviceType: analyticsEvents.deviceType,
          count: sql`count(*)::int`.as('count'),
        })
        .from(analyticsEvents)
        .where(and(where, eq(analyticsEvents.eventType, 'page_view')))
        .groupBy(analyticsEvents.deviceType)
        .orderBy(desc(sql`count(*)`)),
      db
        .select({
          linkId: links.id,
          title: links.title,
          url: links.url,
          icon: links.icon,
          clicks: sql`count(*)::int`.as('clicks'),
        })
        .from(analyticsEvents)
        .innerJoin(links, eq(links.id, analyticsEvents.linkId))
        .where(and(where, eq(analyticsEvents.eventType, 'link_click')))
        .groupBy(links.id)
        .orderBy(desc(sql`count(*)`))
        .limit(10),
    ]);

    const views = totalsRow.views;
    const clicks = totalsRow.clicks;

    const totalClicks = Math.max(clicks, 1);
    const topLinks = topLinkRows.map((link) => ({
      ...link,
      percentage: roundToOne((link.clicks / totalClicks) * 100),
    }));

    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    deviceRows.forEach((row) => {
      if (row.deviceType && Object.prototype.hasOwnProperty.call(devices, row.deviceType)) {
        devices[row.deviceType] = row.count;
      }
    });

    return {
      period: resolvedPeriod,
      totals: {
        views,
        clicks,
        ctr: computeCtr(clicks, views),
        engagedProfiles: engagedRow.count,
        topLinks,
        devices,
      },
      trend: buildDaySeries(trendRows, days),
    };
  }

  static async listPageStats({
    page = 1,
    limit = 10,
    search = '',
    sort = 'views',
    status = 'all',
  } = {}) {
    const offset = (page - 1) * limit;
    const filters = [];

    if (search) {
      const pattern = `%${search}%`;
      filters.push(sql`(${profiles.username} ilike ${pattern} or ${profiles.displayName} ilike ${pattern})`);
    }
    if (status === 'live') {
      filters.push(eq(profiles.isSuspended, false));
    } else if (status === 'suspended') {
      filters.push(eq(profiles.isSuspended, true));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const [countRow] = await db
      .select({ count: sql`count(*)::int` })
      .from(profiles)
      .where(whereClause);

    const sortOrders = {
      username: asc(profiles.username),
      views: desc(sql`count(*) filter (where ${analyticsEvents.eventType} = 'page_view')`),
      clicks: desc(sql`count(*) filter (where ${analyticsEvents.eventType} = 'link_click')`),
      lastActiveAt: desc(sql`max(${analyticsEvents.createdAt})`),
    };
    const orderBy = sortOrders[sort] || sortOrders.views;

    const rows = await db
      .select({
        id: profiles.id,
        username: profiles.username,
        displayName: profiles.displayName,
        isSuspended: profiles.isSuspended,
        views: sql`count(*) filter (where ${analyticsEvents.eventType} = 'page_view')::int`.as('views'),
        clicks: sql`count(*) filter (where ${analyticsEvents.eventType} = 'link_click')::int`.as('clicks'),
        last7: sql`count(*) filter (where ${analyticsEvents.createdAt} >= now() - interval '7 days')::int`.as('last7'),
        lastActiveAt: sql`max(${analyticsEvents.createdAt})`.as('lastActiveAt'),
      })
      .from(profiles)
      .leftJoin(analyticsEvents, eq(analyticsEvents.profileId, profiles.id))
      .where(whereClause)
      .groupBy(profiles.id)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const items = rows.map((row) => ({
      ...row,
      ctr: computeCtr(row.clicks, row.views),
    }));

    const totalPages = Math.max(1, Math.ceil(countRow.count / limit));
    return {
      items,
      pagination: {
        page,
        limit,
        total: countRow.count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static async listPageStatsForExport({ search = '', status = 'all' } = {}) {
    const filters = [];

    if (search) {
      const pattern = `%${search}%`;
      filters.push(sql`(${profiles.username} ilike ${pattern} or ${profiles.displayName} ilike ${pattern})`);
    }
    if (status === 'live') {
      filters.push(eq(profiles.isSuspended, false));
    } else if (status === 'suspended') {
      filters.push(eq(profiles.isSuspended, true));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const rows = await db
      .select({
        username: profiles.username,
        displayName: profiles.displayName,
        isSuspended: profiles.isSuspended,
        views: sql`count(*) filter (where ${analyticsEvents.eventType} = 'page_view')::int`.as('views'),
        clicks: sql`count(*) filter (where ${analyticsEvents.eventType} = 'link_click')::int`.as('clicks'),
        last7: sql`count(*) filter (where ${analyticsEvents.createdAt} >= now() - interval '7 days')::int`.as('last7'),
        lastActiveAt: sql`max(${analyticsEvents.createdAt})`.as('lastActiveAt'),
      })
      .from(profiles)
      .leftJoin(analyticsEvents, eq(analyticsEvents.profileId, profiles.id))
      .where(whereClause)
      .groupBy(profiles.id)
      .orderBy(desc(sql`count(*) filter (where ${analyticsEvents.eventType} = 'page_view')`));

    return rows.map((row) => ({
      username: row.username,
      displayName: row.displayName,
      status: row.isSuspended ? 'suspended' : 'live',
      pageViews: row.views,
      linkClicks: row.clicks,
      ctr: computeCtr(row.clicks, row.views),
      last7Days: row.last7,
      lastActiveAt: formatTimestamp(row.lastActiveAt),
    }));
  }

  /** Ensures a query param is a non-negative page integer. */
  static parseSort(value) {
    return /^[a-zA-Z_]+$/.test(String(value || '')) ? String(value) : 'views';
  }

  static assertValidSort(value) {
    if (!['username', 'views', 'clicks', 'lastActiveAt'].includes(value)) {
      throw new ApiError('Invalid sort option', 400);
    }
  }
>>>>>>> Stashed changes
}