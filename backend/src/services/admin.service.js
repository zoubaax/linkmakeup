import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { adminAuditLogs, analyticsEvents, links, profiles, users } from '../models/schema.js';
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

function escapeLikePattern(str) {
  return String(str).replace(/[%_\\]/g, (m) => `\\${m}`);
}

function tokenizeSearch(search) {
  return String(search || '')
    .trim()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 5); // cap tokens to avoid explosion
}

function buildTokenOrClause(tokens, columns) {
  if (tokens.length === 0) return undefined;
  // Each token must match at least one column (AND across tokens, OR across columns)
  const tokenClauses = tokens.map((tok) => {
    const pattern = `%${escapeLikePattern(tok)}%`;
    const colClauses = columns.map((col) => ilike(col, pattern));
    return colClauses.length === 1 ? colClauses[0] : or(...colClauses);
  });
  return tokenClauses.length === 1 ? tokenClauses[0] : and(...tokenClauses);
}

/** Shared WHERE builder for the users list (search + onboarding status). */
function buildUsersWhere({ search, status }) {
  const filters = [];

  if (search) {
    const tokens = tokenizeSearch(search);
    const clause = buildTokenOrClause(tokens, [users.email, users.name, profiles.username, profiles.displayName]);
    if (clause) filters.push(clause);
  }

  if (status === 'with_profile') {
    filters.push(sql`${profiles.id} is not null and ${profiles.username} is not null and ${profiles.username} != ''`);
  } else if (status === 'awaiting_profile') {
    filters.push(sql`(${profiles.id} is null or ${profiles.username} is null or ${profiles.username} = '')`);
  }

  return filters.length > 0 ? and(...filters) : undefined;
}

/** Shared WHERE builder for the profiles list (search + live/suspended status). */
function buildProfilesWhere({ search, status }) {
  const filters = [];

  if (search) {
    const tokens = tokenizeSearch(search);
    const clause = buildTokenOrClause(tokens, [profiles.username, profiles.displayName, users.email, profiles.bio]);
    if (clause) filters.push(clause);
  }

  if (status === 'live') {
    filters.push(eq(profiles.isSuspended, false));
  } else if (status === 'suspended') {
    filters.push(eq(profiles.isSuspended, true));
  }

  return filters.length > 0 ? and(...filters) : undefined;
}

/** Shared WHERE builder for the links list (search + active/hidden status). */
function buildLinksWhere({ search, status }) {
  const filters = [];

  if (search) {
    const tokens = tokenizeSearch(search);
    const clause = buildTokenOrClause(tokens, [links.title, links.url, links.subtitle, links.icon, profiles.username, users.email]);
    if (clause) filters.push(clause);
  }

  if (status === 'active') {
    filters.push(eq(links.isActive, true));
  } else if (status === 'hidden') {
    filters.push(eq(links.isActive, false));
  }

  return filters.length > 0 ? and(...filters) : undefined;
}

function linkCountsTable() {
  return db
    .select({
      userId: links.userId,
      count: sql`count(*)::int`.as('count'),
    })
    .from(links)
    .groupBy(links.userId)
    .as('link_counts');
}

function linkStatsTable() {
  return db
    .select({
      userId: links.userId,
      linkCount: sql`count(*)::int`.as('linkCount'),
      activeLinkCount: sql`count(*) filter (where ${links.isActive} = true)::int`.as('activeLinkCount'),
    })
    .from(links)
    .groupBy(links.userId)
    .as('link_stats');
}

export class AdminService {
  static async getPlatformStats() {
    const [
      [usersCount],
      [profilesCount],
      [linksCount],
      [activeLinksCount],
      [suspendedProfilesCount],
      [usersAwaitingProfileCount],
      [pageViewsCount],
      [linkClicksCount],
      signupRows,
    ] = await Promise.all([
      db.select({ count: sql`count(*)::int` }).from(users),
      db.select({ count: sql`count(*)::int` }).from(profiles),
      db.select({ count: sql`count(*)::int` }).from(links),
      db.select({ count: sql`count(*)::int` }).from(links).where(eq(links.isActive, true)),
      db.select({ count: sql`count(*)::int` }).from(profiles).where(eq(profiles.isSuspended, true)),
      db
        .select({ count: sql`count(*)::int` })
        .from(users)
        .leftJoin(profiles, eq(profiles.userId, users.id))
        .where(sql`(${profiles.id} is null or ${profiles.username} is null or ${profiles.username} = '')`),
      db
        .select({ count: sql`count(*)::int` })
        .from(analyticsEvents)
        .where(eq(analyticsEvents.eventType, 'page_view')),
      db
        .select({ count: sql`count(*)::int` })
        .from(analyticsEvents)
        .where(eq(analyticsEvents.eventType, 'link_click')),
      db
        .select({
          day: sql`date_trunc('day', ${users.createdAt})::date`.as('day'),
          count: sql`count(*)::int`.as('count'),
        })
        .from(users)
        .where(sql`${users.createdAt} >= now() - interval '14 days'`)
        .groupBy(sql`date_trunc('day', ${users.createdAt})::date`)
        .orderBy(sql`date_trunc('day', ${users.createdAt})::date`),
    ]);

    return {
      totals: {
        users: usersCount?.count || 0,
        profiles: profilesCount?.count || 0,
        links: linksCount?.count || 0,
        activeLinks: activeLinksCount?.count || 0,
        suspendedProfiles: suspendedProfilesCount?.count || 0,
        usersAwaitingProfile: usersAwaitingProfileCount?.count || 0,
        pageViews: pageViewsCount?.count || 0,
        linkClicks: linkClicksCount?.count || 0,
      },
      signupTrend: buildDayTrend(signupRows, 14),
    };
  }

  static async search({ query, limit = 8 }) {
    const cleanQuery = String(query || '').trim();
    if (!cleanQuery) {
      return { users: [], profiles: [], links: [] };
    }

    const tokens = tokenizeSearch(cleanQuery);
    if (tokens.length === 0) return { users: [], profiles: [], links: [] };

    // Build ranked WHERE clauses with token AND + column OR, plus ordering by relevance
    const buildRankedWhere = (cols) => buildTokenOrClause(tokens, cols);

    // Relevance ordering: exact email/username match ranks higher
    const exactLower = cleanQuery.toLowerCase();

    const [userItems, profileItems, linkItems] = await Promise.all([
      db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          username: profiles.username,
          avatarUrl: users.avatarUrl,
        })
        .from(users)
        .leftJoin(profiles, eq(profiles.userId, users.id))
        .where(buildRankedWhere([users.email, users.name, profiles.username, profiles.displayName]))
        .orderBy(sql`case when lower(${users.email}) = ${exactLower} then 0 when lower(${users.email}) like ${`${exactLower}%`} then 1 else 2 end`, desc(users.createdAt))
        .limit(limit),

      db
        .select({
          id: profiles.id,
          userId: profiles.userId,
          username: profiles.username,
          displayName: profiles.displayName,
          avatarUrl: profiles.avatarUrl,
          isSuspended: profiles.isSuspended,
          email: users.email,
        })
        .from(profiles)
        .leftJoin(users, eq(users.id, profiles.userId))
        .where(buildRankedWhere([profiles.username, profiles.displayName, users.email, profiles.bio]))
        .orderBy(sql`case when lower(${profiles.username}) = ${exactLower} then 0 when lower(${profiles.username}) like ${`${exactLower}%`} then 1 else 2 end`, desc(profiles.createdAt))
        .limit(limit),

      db
        .select({
          id: links.id,
          title: links.title,
          url: links.url,
          icon: links.icon,
          isActive: links.isActive,
          username: profiles.username,
        })
        .from(links)
        .leftJoin(users, eq(users.id, links.userId))
        .leftJoin(profiles, eq(profiles.userId, links.userId))
        .where(buildRankedWhere([links.title, links.url, links.subtitle, links.icon, profiles.username, users.email]))
        .orderBy(sql`case when lower(${links.title}) = ${exactLower} then 0 when lower(${links.title}) like ${`${exactLower}%`} then 1 else 2 end`, desc(links.createdAt))
        .limit(limit),
    ]);

    return {
      users: userItems,
      profiles: profileItems,
      links: linkItems,
    };
  }

  static async getUserDetail(userId) {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        avatarUrl: users.avatarUrl,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    const userLinks = await db
      .select()
      .from(links)
      .where(eq(links.userId, userId))
      .orderBy(asc(links.position));

    const auditLogs = await db
      .select()
      .from(adminAuditLogs)
      .where(eq(adminAuditLogs.targetId, userId))
      .orderBy(desc(adminAuditLogs.createdAt))
      .limit(10);

    return {
      user,
      profile: profile || null,
      links: userLinks,
      recentAuditLogs: auditLogs,
    };
  }

  static async listUsers({ page, limit, search, status = 'all' }) {
    const offset = (page - 1) * limit;
    const whereClause = buildUsersWhere({ search, status });

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

  static async listUsersForExport({ search, status = 'all' } = {}) {
    const whereClause = buildUsersWhere({ search, status });

    return db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
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
      .where(whereClause)
      .orderBy(desc(users.createdAt));
  }

  static async exportUsers({ search, status = 'all' }) {
    return this.listUsersForExport({ search, status });
  }

  static async listProfiles({ page, limit, search, status = 'all' }) {
    const offset = (page - 1) * limit;
    const whereClause = buildProfilesWhere({ search, status });

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

  static async listProfilesForExport({ search, status = 'all' } = {}) {
    const whereClause = buildProfilesWhere({ search, status });

    return db
      .select({
        id: profiles.id,
        username: profiles.username,
        displayName: profiles.displayName,
        email: users.email,
        bio: profiles.bio,
        avatarUrl: profiles.avatarUrl,
        isSuspended: profiles.isSuspended,
        createdAt: profiles.createdAt,
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
      .where(whereClause)
      .orderBy(desc(profiles.createdAt));
  }

  static async exportProfiles({ search, status = 'all' }) {
    return this.listProfilesForExport({ search, status });
  }

  static async listLinks({ page, limit, search, status = 'all' }) {
    const offset = (page - 1) * limit;
    const whereClause = buildLinksWhere({ search, status });

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

  static async listLinksForExport({ search, status = 'all' } = {}) {
    const whereClause = buildLinksWhere({ search, status });

    return db
      .select({
        id: links.id,
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

  static async exportLinks({ search, status = 'all' }) {
    return this.listLinksForExport({ search, status });
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
