import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { adminAuditLogs } from '../models/schema.js';

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

function buildLogFilters({ actionFilter = 'all', actor = '' }) {
  const filters = [];

  if (actionFilter === 'links') {
    filters.push(eq(adminAuditLogs.targetType, 'link'));
  } else if (actionFilter === 'profiles') {
    filters.push(eq(adminAuditLogs.targetType, 'profile'));
  }

  if (actor) {
    filters.push(ilike(adminAuditLogs.actorEmail, `%${actor}%`));
  }

  return filters;
}

export class AdminAuditService {
  static async logAction({ actor, action, targetType, targetId, metadata = {} }) {
    const [entry] = await db
      .insert(adminAuditLogs)
      .values({
        actorEmail: actor.email,
        actorType: actor.type,
        action,
        targetType,
        targetId,
        metadata,
      })
      .returning();

    return entry;
  }

  static async listLogs({ page, limit, actionFilter = 'all', actor = '' }) {
    const offset = (page - 1) * limit;
    const filters = buildLogFilters({ actionFilter, actor });
    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const [countRow] = await db
      .select({ count: sql`count(*)::int` })
      .from(adminAuditLogs)
      .where(whereClause);

    const items = await db
      .select()
      .from(adminAuditLogs)
      .where(whereClause)
      .orderBy(desc(adminAuditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      items,
      pagination: buildPagination(countRow.count, page, limit),
    };
  }

  static async exportLogs({ actionFilter = 'all', actor = '' }) {
    const filters = buildLogFilters({ actionFilter, actor });
    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    return db
      .select()
      .from(adminAuditLogs)
      .where(whereClause)
      .orderBy(desc(adminAuditLogs.createdAt));
  }

  static async listRecent(limit = 5) {
    return db
      .select()
      .from(adminAuditLogs)
      .orderBy(desc(adminAuditLogs.createdAt))
      .limit(limit);
  }
}
