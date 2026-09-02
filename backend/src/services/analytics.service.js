import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
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
const PAGE_VIEW = 'page_view';
const LINK_CLICK = 'link_click';

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

    const values = {
      profileId: profile.id,
      eventType,
      referrer: referrer || null,
      deviceType: deviceType || null,
      ...(resolvedLinkId ? { linkId: resolvedLinkId } : {}),
    };

    await db.insert(analyticsEvents).values(values);
    return { recorded: true };
  }

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
      deviceType: detectDeviceType(userAgent),
    });

    return { recorded: true };
  }

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
      deviceType: detectDeviceType(userAgent),
    });

    return { recorded: true };
  }

  static async getProfileSummary({ profileId, period = '30d' }) {
    const resolvedPeriod = cleanPeriod(period);
    const pWhere = periodWhere(resolvedPeriod);
    const where = pWhere
      ? and(eq(analyticsEvents.profileId, profileId), pWhere)
      : eq(analyticsEvents.profileId, profileId);

    const days = PERIOD_DAYS[resolvedPeriod] || ALL_TREND_DAYS;

    const [[totalsRow], trendRows, deviceRows, referrerRows, topLinkRows] = await Promise.all([
      db
        .select({
          views: sql`count(*) filter (where ${analyticsEvents.eventType} = 'page_view')::int`,
          clicks: sql`count(*) filter (where ${analyticsEvents.eventType} = 'link_click')::int`,
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
        .groupBy(analyticsEvents.deviceType),
      db
        .select({
          referrer: analyticsEvents.referrer,
          count: sql`count(*)::int`.as('count'),
        })
        .from(analyticsEvents)
        .where(and(where, eq(analyticsEvents.eventType, 'page_view')))
        .groupBy(analyticsEvents.referrer)
        .orderBy(desc(sql`count(*)`))
        .limit(5),
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
        .groupBy(links.id, links.title, links.url, links.icon)
        .orderBy(desc(sql`count(*)`))
        .limit(10),
    ]);

    const views = totalsRow?.views || 0;
    const clicks = totalsRow?.clicks || 0;

    const totalClicks = Math.max(clicks, 1);
    const topLinks = topLinkRows.map((link) => ({
      ...link,
      percentage: roundToOne((link.clicks / totalClicks) * 100),
    }));

    const referrers = referrerRows.map((r) => ({
      label: r.referrer || 'direct',
      count: r.count,
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
        devices,
        referrers,
        topLinks,
      },
      trend: buildDaySeries(trendRows, days),
    };
  }

  static async getProfileLinkStats({ profileId, userId, period = '30d' }) {
    const resolvedPeriod = cleanPeriod(period);
    const pWhere = periodWhere(resolvedPeriod);

    const userLinks = await db
      .select({
        id: links.id,
        title: links.title,
        url: links.url,
        icon: links.icon,
        isActive: links.isActive,
        position: links.position,
      })
      .from(links)
      .where(eq(links.userId, userId))
      .orderBy(asc(links.position));

    if (userLinks.length === 0) return [];

    const where = pWhere
      ? and(
          eq(analyticsEvents.profileId, profileId),
          eq(analyticsEvents.eventType, 'link_click'),
          pWhere
        )
      : and(eq(analyticsEvents.profileId, profileId), eq(analyticsEvents.eventType, 'link_click'));

    const clickRows = await db
      .select({
        linkId: analyticsEvents.linkId,
        clicks: sql`count(*)::int`.as('clicks'),
      })
      .from(analyticsEvents)
      .where(where)
      .groupBy(analyticsEvents.linkId);

    const clickMap = new Map();
    clickRows.forEach((r) => {
      if (r.linkId) clickMap.set(r.linkId, r.clicks);
    });

    const totalClicks = Array.from(clickMap.values()).reduce((a, b) => a + b, 0);

    return userLinks.map((l) => {
      const clicks = clickMap.get(l.id) || 0;
      return {
        ...l,
        clicks,
        share: totalClicks > 0 ? roundToOne((clicks / totalClicks) * 100) : 0,
      };
    });
  }

  static async getSummary({ period = '30d' } = {}) {
    const resolvedPeriod = cleanPeriod(period);
    const pWhere = periodWhere(resolvedPeriod);
    const where = pWhere ? pWhere : undefined;
    const days = PERIOD_DAYS[resolvedPeriod] || ALL_TREND_DAYS;

    const [
      [totalsRow],
      [engagedRow],
      trendRows,
      deviceRows,
      topLinkRows,
    ] = await Promise.all([
      db
        .select({
          views: sql`count(*) filter (where ${analyticsEvents.eventType} = 'page_view')::int`,
          clicks: sql`count(*) filter (where ${analyticsEvents.eventType} = 'link_click')::int`,
        })
        .from(analyticsEvents)
        .where(where),
      db
        .select({
          count: sql`count(distinct ${analyticsEvents.profileId})::int`,
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

    const views = totalsRow?.views || 0;
    const clicks = totalsRow?.clicks || 0;

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
        engagedProfiles: engagedRow?.count || 0,
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
      const tokens = String(search).trim().split(/\s+/).filter(Boolean).slice(0, 5);
      const tokenClauses = tokens.map((tok) => {
        const pat = `%${String(tok).replace(/[%_\\]/g, (m) => `\\${m}`)}%`;
        return sql`(${profiles.username} ilike ${pat} or ${profiles.displayName} ilike ${pat} or ${profiles.bio} ilike ${pat})`;
      });
      if (tokenClauses.length === 1) filters.push(tokenClauses[0]);
      else if (tokenClauses.length > 1) filters.push(and(...tokenClauses));
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

    const totalPages = Math.max(1, Math.ceil((countRow?.count || 0) / limit));
    return {
      items,
      pagination: {
        page,
        limit,
        total: countRow?.count || 0,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static async listPageStatsForExport({ search = '', status = 'all' } = {}) {
    const filters = [];

    if (search) {
      const tokens = String(search).trim().split(/\s+/).filter(Boolean).slice(0, 5);
      const tokenClauses = tokens.map((tok) => {
        const pat = `%${String(tok).replace(/[%_\\]/g, (m) => `\\${m}`)}%`;
        return sql`(${profiles.username} ilike ${pat} or ${profiles.displayName} ilike ${pat} or ${profiles.bio} ilike ${pat})`;
      });
      if (tokenClauses.length === 1) filters.push(tokenClauses[0]);
      else if (tokenClauses.length > 1) filters.push(and(...tokenClauses));
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

  static parseSort(value) {
    return /^[a-zA-Z_]+$/.test(String(value || '')) ? String(value) : 'views';
  }

  static assertValidSort(value) {
    if (!['username', 'views', 'clicks', 'lastActiveAt'].includes(value)) {
      throw new ApiError('Invalid sort option', 400);
    }
  }
}

export default AnalyticsService;