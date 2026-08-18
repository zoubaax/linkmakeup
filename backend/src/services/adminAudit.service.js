import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../config/db.js';
import { adminAuditLogs } from '../models/schema.js';

const ACTION_PREFIX_FILTERS = {
  links: ['link.'],
  profiles: ['profile.'],
};

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

  static async listLogs({ page, limit, actionFilter = 'all' }) {
    const offset = (page - 1) * limit;
    const filters = [];

    if (actionFilter === 'links') {
      filters.push(sql`${adminAuditLogs.action} like 'link.%'`);
    } else if (actionFilter === 'profiles') {
      filters.push(sql`${adminAuditLogs.action} like 'profile.%'`);
    }

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

  static async listRecent(limit = 5) {
    return db
      .select()
      .from(adminAuditLogs)
      .orderBy(desc(adminAuditLogs.createdAt))
      .limit(limit);
  }
}

export { ACTION_PREFIX_FILTERS };
