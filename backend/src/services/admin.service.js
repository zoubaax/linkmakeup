import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { analyticsEvents, links, profiles, users } from '../models/schema.js';
import { ApiError } from '../utils/apiResponse.js';
import { buildDayTrend } from '../utils/trend.js';
import { AdminAuditService } from './adminAudit.service.js';
import { EmailService } from './email.service.js';
import {
  assertCanModerateTarget,
  resolveUserEmailForLink,
  resolveUserEmailForProfile,
} from '../utils/adminSafeguards.js';

const SIGNUP_TREND_DAYS = 14;

<<<<<<< Updated upstream
function localDayKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toDayKey(value) {
  if (!value) return '';
  if (value instanceof Date) {
    return localDayKey(value);
  }
  return String(value).slice(0, 10);
}

function buildDailyTrend(rows) {
  const countsByDay = new Map(
    rows.map((row) => [toDayKey(row.day), row.count]),
  );

  const trend = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let offset = SIGNUP_TREND_DAYS - 1; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    const key = localDayKey(day);
    trend.push({ date: key, count: countsByDay.get(key) ?? 0 });
  }

  return trend;
}

=======
>>>>>>> Stashed changes
function buildPagination(total, page, limit) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

<<<<<<< Updated upstream
function buildUserFilters({ search, status }) {
=======
/** Shared WHERE builder for the users list (search + onboarding status). */
function buildUsersWhere({ search, status }) {
>>>>>>> Stashed changes
  const filters = [];

  if (search) {
    const pattern = `%${search}%`;
    filters.push(or(ilike(users.email, pattern), ilike(users.name, pattern)));
  }

  if (status === 'with_profile') {
<<<<<<< Updated upstream
    filters.push(sql`${profiles.id} is not null`);
  } else if (status === 'awaiting_profile') {
    filters.push(sql`${profiles.id} is null`);
  }

  return filters;
}

function buildProfileFilters({ search, status }) {
=======
    filters.push(sql`${profiles.id} is not null and ${profiles.username} is not null and ${profiles.username} != ''`);
  } else if (status === 'awaiting_profile') {
    filters.push(sql`(${profiles.id} is null or ${profiles.username} is null or ${profiles.username} = '')`);
  }

  return filters.length > 0 ? and(...filters) : undefined;
}

/** Shared WHERE builder for the profiles list (search + live/suspended status). */
function buildProfilesWhere({ search, status }) {
>>>>>>> Stashed changes
  const filters = [];

  if (search) {
    const pattern = `%${search}%`;
    filters.push(or(
      ilike(profiles.username, pattern),
      ilike(profiles.displayName, pattern),
      ilike(users.email, pattern),
    ));
  }

  if (status === 'live') {
    filters.push(eq(profiles.isSuspended, false));
  } else if (status === 'suspended') {
    filters.push(eq(profiles.isSuspended, true));
  }

<<<<<<< Updated upstream
  return filters;
}

function buildLinkFilters({ search, status }) {
=======
  return filters.length > 0 ? and(...filters) : undefined;
}

/** Shared WHERE builder for the links list (search + active/hidden status). */
function buildLinksWhere({ search, status }) {
>>>>>>> Stashed changes
  const filters = [];

  if (search) {
    const pattern = `%${search}%`;
    filters.push(or(
      ilike(links.title, pattern),
      ilike(links.url, pattern),
      ilike(profiles.username, pattern),
      ilike(users.email, pattern),
    ));
  }

  if (status === 'active') {
    filters.push(eq(links.isActive, true));
  } else if (status === 'hidden') {
    filters.push(eq(links.isActive, false));
  }

<<<<<<< Updated upstream
  return filters;
}

function linkCountsTable() {
  return db
    .select({ userId: links.userId, count: sql`count(*)::int`.as('count') })
    .from(links)
    .groupBy(links.userId)
    .as('link_counts');
}

function linkStatsTable() {
  return db
    .select({
      userId: links.userId,
      linkCount: sql`count(*)::int`.as('linkCount'),
      activeLinkCount: sql`count(*) filter (where ${links.isActive})::int`.as('activeLinkCount'),
    })
    .from(links)
    .groupBy(links.userId)
    .as('link_stats');
=======
  return filters.length > 0 ? and(...filters) : undefined;
>>>>>>> Stashed changes
}

export class AdminService {
  static async getPlatformStats() {
    const [
      [userCount],
      [profileCount],
      [linkCount],
      [activeLinkCount],
      [usersWithoutProfile],
      [suspendedProfileCount],
      [hiddenLinkCount],
      signupTrendRows,
      profileTrendRows,
      linkTrendRows,
      recentUsers,
      recentProfiles,
      recentLinks,
    ] = await Promise.all([
      db.select({ count: sql`count(*)::int` }).from(users),
      db.select({ count: sql`count(*)::int` }).from(profiles),
      db.select({ count: sql`count(*)::int` }).from(links),
      db.select({ count: sql`count(*)::int` }).from(links).where(eq(links.isActive, true)),
      db
        .select({ count: sql`count(*)::int` })
        .from(users)
        .leftJoin(profiles, eq(profiles.userId, users.id))
        .where(sql`${profiles.id} is null`),
      db
        .select({ count: sql`count(*)::int` })
        .from(profiles)
        .where(eq(profiles.isSuspended, true)),
      db
        .select({ count: sql`count(*)::int` })
        .from(links)
        .where(eq(links.isActive, false)),
      db
        .select({
          day: sql`date_trunc('day', ${users.createdAt})::date`.as('day'),
          count: sql`count(*)::int`.as('count'),
        })
        .from(users)
        .where(sql`${users.createdAt} >= now() - interval '14 days'`)
        .groupBy(sql`date_trunc('day', ${users.createdAt})::date`)
        .orderBy(sql`date_trunc('day', ${users.createdAt})::date`),
      db
        .select({
          day: sql`date_trunc('day', ${profiles.createdAt})::date`.as('day'),
          count: sql`count(*)::int`.as('count'),
        })
        .from(profiles)
        .where(sql`${profiles.createdAt} >= now() - interval '14 days'`)
        .groupBy(sql`date_trunc('day', ${profiles.createdAt})::date`)
        .orderBy(sql`date_trunc('day', ${profiles.createdAt})::date`),
      db
        .select({
          day: sql`date_trunc('day', ${links.createdAt})::date`.as('day'),
          count: sql`count(*)::int`.as('count'),
        })
        .from(links)
        .where(sql`${links.createdAt} >= now() - interval '14 days'`)
        .groupBy(sql`date_trunc('day', ${links.createdAt})::date`)
        .orderBy(sql`date_trunc('day', ${links.createdAt})::date`),
      db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          createdAt: users.createdAt,
          username: profiles.username,
        })
        .from(users)
        .leftJoin(profiles, eq(profiles.userId, users.id))
        .orderBy(desc(users.createdAt))
        .limit(8),
      db
        .select({
          id: profiles.id,
          username: profiles.username,
          displayName: profiles.displayName,
          createdAt: profiles.createdAt,
        })
        .from(profiles)
        .orderBy(desc(profiles.createdAt))
        .limit(8),
      db
        .select({
          id: links.id,
          title: links.title,
          url: links.url,
          isActive: links.isActive,
          createdAt: links.createdAt,
          username: profiles.username,
        })
        .from(links)
        .leftJoin(profiles, eq(profiles.userId, links.userId))
        .orderBy(desc(links.createdAt))
        .limit(8),
    ]);

    const totalUsers = userCount.count;
    const totalProfiles = profileCount.count;
    const totalLinks = linkCount.count;
<<<<<<< Updated upstream
    const signupTrend = buildDailyTrend(signupTrendRows);
    const profileTrend = buildDailyTrend(profileTrendRows);
    const linkTrend = buildDailyTrend(linkTrendRows);
=======
    const signupTrend = buildDayTrend(signupTrendRows, SIGNUP_TREND_DAYS);
>>>>>>> Stashed changes
    const signupsLast7Days = signupTrend.slice(-7).reduce((sum, day) => sum + day.count, 0);
    const signupsPrev7Days = signupTrend.slice(-14, -7).reduce((sum, day) => sum + day.count, 0);
    const profileCompletionRate = totalUsers > 0
      ? Math.round((totalProfiles / totalUsers) * 100)
      : 0;
    const avgLinksPerProfile = totalProfiles > 0
      ? Math.round((totalLinks / totalProfiles) * 10) / 10
      : 0;

    const [
      [suspendedCount],
      [hiddenLinksCount],
      signupsPrior7DaysRows,
      analyticsCurrent,
      analyticsPrior,
    ] = await Promise.all([
      db.select({ count: sql`count(*)::int` }).from(profiles).where(eq(profiles.isSuspended, true)),
      db.select({ count: sql`count(*)::int` }).from(links).where(eq(links.isActive, false)),
      db
        .select({ count: sql`count(*)::int` })
        .from(users)
        .where(sql`${users.createdAt} >= now() - interval '14 days' and ${users.createdAt} < now() - interval '7 days'`),
      db
        .select({
          views: sql`count(*) filter (where ${analyticsEvents.eventType} = 'page_view')::int`.as('views'),
          clicks: sql`count(*) filter (where ${analyticsEvents.eventType} = 'link_click')::int`.as('clicks'),
        })
        .from(analyticsEvents)
        .where(sql`${analyticsEvents.createdAt} >= now() - interval '24 hours'`),
      db
        .select({
          views: sql`count(*) filter (where ${analyticsEvents.eventType} = 'page_view')::int`.as('views'),
          clicks: sql`count(*) filter (where ${analyticsEvents.eventType} = 'link_click')::int`.as('clicks'),
        })
        .from(analyticsEvents)
        .where(sql`${analyticsEvents.createdAt} >= now() - interval '48 hours' and ${analyticsEvents.createdAt} < now() - interval '24 hours'`),
    ]);

    const signupsPrior7Days = signupsPrior7DaysRows[0]?.count ?? 0;
    const signupDelta = signupsLast7Days - signupsPrior7Days;

    const currentViews = analyticsCurrent?.views ?? 0;
    const currentClicks = analyticsCurrent?.clicks ?? 0;
    const priorViews = analyticsPrior?.views ?? 0;
    const priorClicks = analyticsPrior?.clicks ?? 0;

    const attentionItems = [];
    if (usersWithoutProfile.count > 0) {
      attentionItems.push({
        type: 'awaiting_setup',
        label: 'Users awaiting setup',
        count: usersWithoutProfile.count,
        href: '/admin/users?status=awaiting_profile',
      });
    }
    if (suspendedCount.count > 0) {
      attentionItems.push({
        type: 'suspended_profiles',
        label: 'Suspended profiles',
        count: suspendedCount.count,
        href: '/admin/profiles?status=suspended',
      });
    }
    if (hiddenLinksCount.count > 0) {
      attentionItems.push({
        type: 'hidden_links',
        label: 'Hidden links',
        count: hiddenLinksCount.count,
        href: '/admin/links?status=hidden',
      });
    }

    return {
      totals: {
        users: totalUsers,
        profiles: totalProfiles,
        links: totalLinks,
        activeLinks: activeLinkCount.count,
        hiddenLinks: hiddenLinkCount.count,
        suspendedProfiles: suspendedProfileCount.count,
        usersWithoutProfile: usersWithoutProfile.count,
        signupsLast7Days,
        signupsPrev7Days,
        profileCompletionRate,
        avgLinksPerProfile,
      },
      deltas: {
        signupsLast7Days: {
          value: signupsLast7Days,
          prior: signupsPrior7Days,
          change: signupDelta,
          direction: signupDelta > 0 ? 'up' : signupDelta < 0 ? 'down' : 'flat',
          label: 'vs prior 7 days',
        },
        profileCompletionRate: {
          value: profileCompletionRate,
          label: 'onboarding completion',
        },
      },
      analyticsSnapshot: {
        views24h: currentViews,
        clicks24h: currentClicks,
        viewsDelta: currentViews - priorViews,
        clicksDelta: currentClicks - priorClicks,
      },
      attentionItems,
      signupTrend,
      profileTrend,
      linkTrend,
      recentUsers,
      recentProfiles,
      recentLinks,
    };
  }

  static async search({ query, limit = 8 }) {
    const q = String(query || '').trim();
    if (q.length < 2) {
      return { users: [], profiles: [], links: [] };
    }

    const pattern = `%${q}%`;
    const perGroup = Math.min(Math.max(limit, 1), 20);

    const [userRows, profileRows, linkRows] = await Promise.all([
      db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          username: profiles.username,
        })
        .from(users)
        .leftJoin(profiles, eq(profiles.userId, users.id))
        .where(or(ilike(users.email, pattern), ilike(users.name, pattern)))
        .orderBy(desc(users.createdAt))
        .limit(perGroup),
      db
        .select({
          id: profiles.id,
          userId: profiles.userId,
          username: profiles.username,
          displayName: profiles.displayName,
          isSuspended: profiles.isSuspended,
        })
        .from(profiles)
        .where(or(ilike(profiles.username, pattern), ilike(profiles.displayName, pattern)))
        .orderBy(desc(profiles.createdAt))
        .limit(perGroup),
      db
        .select({
          id: links.id,
          userId: links.userId,
          title: links.title,
          url: links.url,
          isActive: links.isActive,
          username: profiles.username,
        })
        .from(links)
        .leftJoin(profiles, eq(profiles.userId, links.userId))
        .where(or(ilike(links.title, pattern), ilike(links.url, pattern)))
        .orderBy(desc(links.createdAt))
        .limit(perGroup),
    ]);

    return { users: userRows, profiles: profileRows, links: linkRows };
  }

  static async getUserDetail(userId) {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const [profile] = await db
      .select({
        id: profiles.id,
        username: profiles.username,
        displayName: profiles.displayName,
        bio: profiles.bio,
        avatarUrl: profiles.avatarUrl,
        isSuspended: profiles.isSuspended,
        createdAt: profiles.createdAt,
      })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    const userLinks = await db
      .select({
        id: links.id,
        title: links.title,
        subtitle: links.subtitle,
        url: links.url,
        isActive: links.isActive,
        position: links.position,
        createdAt: links.createdAt,
      })
      .from(links)
      .where(eq(links.userId, userId))
      .orderBy(asc(links.position), desc(links.createdAt));

    return {
      user,
      profile: profile || null,
      links: userLinks,
    };
  }

  static async listUsers({ page, limit, search, status = 'all' }) {
    const offset = (page - 1) * limit;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    const filters = [];

    if (search) {
      const pattern = `%${search}%`;
      filters.push(or(ilike(users.email, pattern), ilike(users.name, pattern)));
    }

    if (status === 'with_profile') {
      filters.push(sql`${profiles.id} is not null and ${profiles.username} is not null and ${profiles.username} != ''`);
    } else if (status === 'awaiting_profile') {
      filters.push(sql`(${profiles.id} is null or ${profiles.username} is null or ${profiles.username} = '')`);
    }

=======
    const filters = buildUserFilters({ search, status });
>>>>>>> Stashed changes
    const whereClause = filters.length > 0 ? and(...filters) : undefined;
=======
    const whereClause = buildUsersWhere({ search, status });
>>>>>>> Stashed changes

    const [countRow] = await db
      .select({ count: sql`count(*)::int` })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(whereClause);

    const linkCounts = linkCountsTable();

    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
        username: profiles.username,
        profileId: profiles.id,
        displayName: profiles.displayName,
        isSuspended: profiles.isSuspended,
        linkCount: sql`coalesce(${linkCounts.count}, 0)::int`.as('linkCount'),
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .leftJoin(linkCounts, eq(linkCounts.userId, users.id))
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      items: rows,
      pagination: buildPagination(countRow.count, page, limit),
    };
  }

<<<<<<< Updated upstream
  static async exportUsers({ search, status = 'all' }) {
    const filters = buildUserFilters({ search, status });
    const whereClause = filters.length > 0 ? and(...filters) : undefined;
    const linkCounts = linkCountsTable();
=======
  static async listUsersForExport({ search, status = 'all' } = {}) {
    const whereClause = buildUsersWhere({ search, status });
>>>>>>> Stashed changes

    return db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
<<<<<<< Updated upstream
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
        username: profiles.username,
        profileId: profiles.id,
        displayName: profiles.displayName,
        isSuspended: profiles.isSuspended,
        linkCount: sql`coalesce(${linkCounts.count}, 0)::int`.as('linkCount'),
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .leftJoin(linkCounts, eq(linkCounts.userId, users.id))
=======
        createdAt: users.createdAt,
        username: profiles.username,
        displayName: profiles.displayName,
        isSuspended: profiles.isSuspended,
        linkCount: sql`(
          select count(*)::int from ${links}
          where ${links.userId} = ${users.id}
        )`.as('linkCount'),
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
>>>>>>> Stashed changes
      .where(whereClause)
      .orderBy(desc(users.createdAt));
  }

  static async listProfiles({ page, limit, search, status = 'all' }) {
    const offset = (page - 1) * limit;
<<<<<<< Updated upstream
    const filters = buildProfileFilters({ search, status });
    const whereClause = filters.length > 0 ? and(...filters) : undefined;
=======
    const whereClause = buildProfilesWhere({ search, status });
>>>>>>> Stashed changes

    const [countRow] = await db
      .select({ count: sql`count(*)::int` })
      .from(profiles)
      .leftJoin(users, eq(users.id, profiles.userId))
      .where(whereClause);

    const linkStats = linkStatsTable();

    const rows = await db
      .select({
        id: profiles.id,
        userId: profiles.userId,
        username: profiles.username,
        displayName: profiles.displayName,
        bio: profiles.bio,
        avatarUrl: profiles.avatarUrl,
        isSuspended: profiles.isSuspended,
        createdAt: profiles.createdAt,
        email: users.email,
        linkCount: sql`coalesce(${linkStats.linkCount}, 0)::int`.as('linkCount'),
        activeLinkCount: sql`coalesce(${linkStats.activeLinkCount}, 0)::int`.as('activeLinkCount'),
      })
      .from(profiles)
      .leftJoin(users, eq(users.id, profiles.userId))
      .leftJoin(linkStats, eq(linkStats.userId, profiles.userId))
      .where(whereClause)
      .orderBy(desc(profiles.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      items: rows,
      pagination: buildPagination(countRow.count, page, limit),
    };
  }

<<<<<<< Updated upstream
  static async exportProfiles({ search, status = 'all' }) {
    const filters = buildProfileFilters({ search, status });
    const whereClause = filters.length > 0 ? and(...filters) : undefined;
    const linkStats = linkStatsTable();

    return db
      .select({
        id: profiles.id,
        userId: profiles.userId,
        username: profiles.username,
        displayName: profiles.displayName,
=======
  static async listProfilesForExport({ search, status = 'all' } = {}) {
    const whereClause = buildProfilesWhere({ search, status });

    return db
      .select({
        username: profiles.username,
        displayName: profiles.displayName,
        email: users.email,
>>>>>>> Stashed changes
        bio: profiles.bio,
        avatarUrl: profiles.avatarUrl,
        isSuspended: profiles.isSuspended,
        createdAt: profiles.createdAt,
<<<<<<< Updated upstream
        email: users.email,
        linkCount: sql`coalesce(${linkStats.linkCount}, 0)::int`.as('linkCount'),
        activeLinkCount: sql`coalesce(${linkStats.activeLinkCount}, 0)::int`.as('activeLinkCount'),
      })
      .from(profiles)
      .leftJoin(users, eq(users.id, profiles.userId))
      .leftJoin(linkStats, eq(linkStats.userId, profiles.userId))
=======
        linkCount: sql`(
          select count(*)::int from ${links}
          where ${links.userId} = ${profiles.userId}
        )`.as('linkCount'),
        activeLinkCount: sql`(
          select count(*)::int from ${links}
          where ${links.userId} = ${profiles.userId}
          and ${links.isActive} = true
        )`.as('activeLinkCount'),
      })
      .from(profiles)
      .leftJoin(users, eq(users.id, profiles.userId))
>>>>>>> Stashed changes
      .where(whereClause)
      .orderBy(desc(profiles.createdAt));
  }

  static async listLinks({ page, limit, search, status = 'all' }) {
    const offset = (page - 1) * limit;
<<<<<<< Updated upstream
    const filters = buildLinkFilters({ search, status });
    const whereClause = filters.length > 0 ? and(...filters) : undefined;
=======
    const whereClause = buildLinksWhere({ search, status });
>>>>>>> Stashed changes

    const [countRow] = await db
      .select({ count: sql`count(*)::int` })
      .from(links)
      .leftJoin(users, eq(users.id, links.userId))
      .leftJoin(profiles, eq(profiles.userId, links.userId))
      .where(whereClause);

    const rows = await db
      .select({
        id: links.id,
        userId: links.userId,
        title: links.title,
        subtitle: links.subtitle,
        url: links.url,
        icon: links.icon,
        isActive: links.isActive,
        position: links.position,
        createdAt: links.createdAt,
        username: profiles.username,
        email: users.email,
      })
      .from(links)
      .leftJoin(users, eq(users.id, links.userId))
      .leftJoin(profiles, eq(profiles.userId, links.userId))
      .where(whereClause)
      .orderBy(desc(links.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      items: rows,
      pagination: buildPagination(countRow.count, page, limit),
    };
  }

<<<<<<< Updated upstream
  static async exportLinks({ search, status = 'all' }) {
    const filters = buildLinkFilters({ search, status });
    const whereClause = filters.length > 0 ? and(...filters) : undefined;
=======
  static async listLinksForExport({ search, status = 'all' } = {}) {
    const whereClause = buildLinksWhere({ search, status });
>>>>>>> Stashed changes

    return db
      .select({
        id: links.id,
<<<<<<< Updated upstream
        userId: links.userId,
=======
>>>>>>> Stashed changes
        title: links.title,
        subtitle: links.subtitle,
        url: links.url,
        icon: links.icon,
        isActive: links.isActive,
        position: links.position,
        createdAt: links.createdAt,
        username: profiles.username,
        email: users.email,
      })
      .from(links)
      .leftJoin(users, eq(users.id, links.userId))
      .leftJoin(profiles, eq(profiles.userId, links.userId))
      .where(whereClause)
      .orderBy(desc(links.createdAt));
  }

  static async toggleLink(linkId, isActive, actor, reason) {
    const trimmedReason = reason != null ? String(reason).trim() : '';
    if (trimmedReason.length > 0 && trimmedReason.length < 3) {
      throw new ApiError('Reason must be at least 3 characters when provided', 400);
    }

    const ownerEmail = await resolveUserEmailForLink(linkId);
    if (!ownerEmail) {
      throw new ApiError('Link not found', 404);
    }

    assertCanModerateTarget(ownerEmail);

    const [existing] = await db
      .select()
      .from(links)
      .where(eq(links.id, linkId))
      .limit(1);

    if (!existing) {
      throw new ApiError('Link not found', 404);
    }

    const [updated] = await db
      .update(links)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(links.id, linkId))
      .returning();

    await AdminAuditService.logAction({
      actor,
      action: 'link.toggle',
      targetType: 'link',
      targetId: linkId,
      metadata: {
        reason: trimmedReason || null,
        previousValue: existing.isActive,
        newValue: isActive,
        targetLabel: existing.title,
      },
    });

    return updated;
  }

  static async deleteLink(linkId, actor, reason) {
    const ownerEmail = await resolveUserEmailForLink(linkId);
    if (!ownerEmail) {
      throw new ApiError('Link not found', 404);
    }

    assertCanModerateTarget(ownerEmail);

    const [existing] = await db
      .select()
      .from(links)
      .where(eq(links.id, linkId))
      .limit(1);

    if (!existing) {
      throw new ApiError('Link not found', 404);
    }

    await db.delete(links).where(eq(links.id, linkId));

    await AdminAuditService.logAction({
      actor,
      action: 'link.delete',
      targetType: 'link',
      targetId: linkId,
      metadata: {
        reason,
        targetLabel: existing.title,
        url: existing.url,
      },
    });

    return { id: linkId, deleted: true };
  }

  static async setProfileSuspension(profileId, suspended, actor, reason) {
    const ownerEmail = await resolveUserEmailForProfile(profileId);
    if (!ownerEmail) {
      throw new ApiError('Profile not found', 404);
    }

    assertCanModerateTarget(ownerEmail);

    const [existing] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, profileId))
      .limit(1);

    if (!existing) {
      throw new ApiError('Profile not found', 404);
    }

    const [updated] = await db
      .update(profiles)
      .set({ isSuspended: suspended, updatedAt: new Date() })
      .where(eq(profiles.id, profileId))
      .returning();

    await AdminAuditService.logAction({
      actor,
      action: suspended ? 'profile.suspend' : 'profile.unsuspend',
      targetType: 'profile',
      targetId: profileId,
      metadata: {
        reason,
        previousValue: existing.isSuspended,
        newValue: suspended,
        targetLabel: `@${existing.username}`,
      },
    });

    return updated;
  }

  static async sendOnboardingReminder(userId, actor) {
    const [user] = await db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    await EmailService.sendOnboardingReminderEmail({
      email: user.email,
      name: user.name,
    });

    await AdminAuditService.logAction({
      actor,
      action: 'user.onboarding_reminded',
      targetType: 'user',
      targetId: userId,
      metadata: { targetLabel: user.email },
    });

    return { success: true, email: user.email };
  }

  static async sendBulkOnboardingReminders(actor) {
    const awaitingUsers = await db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(sql`(${profiles.id} is null or ${profiles.username} is null or ${profiles.username} = '')`);

    let sentCount = 0;
    for (const u of awaitingUsers) {
      try {
        await EmailService.sendOnboardingReminderEmail({
          email: u.email,
          name: u.name,
        });
        sentCount += 1;
      } catch (err) {
        console.error(`Failed to send onboarding reminder to ${u.email}:`, err);
      }
    }

    await AdminAuditService.logAction({
      actor,
      action: 'users.bulk_onboarding_reminded',
      targetType: 'users',
      targetId: 'bulk',
      metadata: { totalTargeted: awaitingUsers.length, sentCount },
    });

    return { totalTargeted: awaitingUsers.length, sentCount };
  }
}
