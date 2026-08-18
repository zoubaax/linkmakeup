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
}