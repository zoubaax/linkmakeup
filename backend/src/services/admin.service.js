import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { links, profiles, users } from '../models/schema.js';
import { ApiError } from '../utils/apiResponse.js';
import { AdminAuditService } from './adminAudit.service.js';
import { EmailService } from './email.service.js';
import {
  assertCanModerateTarget,
  resolveUserEmailForLink,
  resolveUserEmailForProfile,
} from '../utils/adminSafeguards.js';

const SIGNUP_TREND_DAYS = 14;

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

function buildUserFilters({ search, status }) {
  const filters = [];

  if (search) {
    const pattern = `%${search}%`;
    filters.push(or(ilike(users.email, pattern), ilike(users.name, pattern)));
  }

  if (status === 'with_profile') {
    filters.push(sql`${profiles.id} is not null`);
  } else if (status === 'awaiting_profile') {
    filters.push(sql`${profiles.id} is null`);
  }

  return filters;
}

function buildProfileFilters({ search, status }) {
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

  return filters;
}

function buildLinkFilters({ search, status }) {
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
    const signupTrend = buildDailyTrend(signupTrendRows);
    const profileTrend = buildDailyTrend(profileTrendRows);
    const linkTrend = buildDailyTrend(linkTrendRows);
    const signupsLast7Days = signupTrend.slice(-7).reduce((sum, day) => sum + day.count, 0);
    const signupsPrev7Days = signupTrend.slice(-14, -7).reduce((sum, day) => sum + day.count, 0);
    const profileCompletionRate = totalUsers > 0
      ? Math.round((totalProfiles / totalUsers) * 100)
      : 0;
    const avgLinksPerProfile = totalProfiles > 0
      ? Math.round((totalLinks / totalProfiles) * 10) / 10
      : 0;

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
      signupTrend,
      profileTrend,
      linkTrend,
      recentUsers,
      recentProfiles,
      recentLinks,
    };
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

  static async exportUsers({ search, status = 'all' }) {
    const filters = buildUserFilters({ search, status });
    const whereClause = filters.length > 0 ? and(...filters) : undefined;
    const linkCounts = linkCountsTable();

    return db
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
      .orderBy(desc(users.createdAt));
  }

  static async listProfiles({ page, limit, search, status = 'all' }) {
    const offset = (page - 1) * limit;
    const filters = buildProfileFilters({ search, status });
    const whereClause = filters.length > 0 ? and(...filters) : undefined;

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
      .orderBy(desc(profiles.createdAt));
  }

  static async listLinks({ page, limit, search, status = 'all' }) {
    const offset = (page - 1) * limit;
    const filters = buildLinkFilters({ search, status });
    const whereClause = filters.length > 0 ? and(...filters) : undefined;

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

  static async exportLinks({ search, status = 'all' }) {
    const filters = buildLinkFilters({ search, status });
    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    return db
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
      .orderBy(desc(links.createdAt));
  }

  static async toggleLink(linkId, isActive, actor, reason) {
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
        reason: reason || null,
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
