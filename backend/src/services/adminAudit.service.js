<<<<<<< Updated upstream
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
=======
import { and, desc, eq, sql, inArray } from 'drizzle-orm';
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
function buildLogsWhere({ actionFilter, actor, targetId, targetType, targetIds }) {
  const filters = [];

  if (actionFilter === 'links') {
    filters.push(sql`${adminAuditLogs.action} like 'link.%'`);
  } else if (actionFilter === 'profiles') {
    filters.push(sql`${adminAuditLogs.action} like 'profile.%'`);
  } else if (actionFilter === 'user') {
    filters.push(sql`${adminAuditLogs.action} like 'user.%'`);
  }

  const cleanActor = String(actor || '').trim().toLowerCase();
  if (cleanActor) {
    filters.push(eq(sql`lower(${adminAuditLogs.actorEmail})`, cleanActor));
  }

  const ids = targetIds?.length
    ? targetIds
    : (targetId ? [targetId] : []);

  if (ids.length > 0) {
    filters.push(inArray(adminAuditLogs.targetId, ids));
  }

  const cleanTargetType = String(targetType || '').trim();
  if (cleanTargetType && ids.length === 0) {
    filters.push(eq(adminAuditLogs.targetType, cleanTargetType));
  }

  return filters.length > 0 ? and(...filters) : undefined;
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  static async listLogs({ page, limit, actionFilter = 'all', actor = '' }) {
    const offset = (page - 1) * limit;
    const filters = buildLogFilters({ actionFilter, actor });
    const whereClause = filters.length > 0 ? and(...filters) : undefined;
=======
  static async listLogs({ page, limit, actionFilter = 'all', actor = '', targetId, targetType, targetIds }) {
    const offset = (page - 1) * limit;
    const whereClause = buildLogsWhere({ actionFilter, actor, targetId, targetType, targetIds });
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
  static async exportLogs({ actionFilter = 'all', actor = '' }) {
    const filters = buildLogFilters({ actionFilter, actor });
    const whereClause = filters.length > 0 ? and(...filters) : undefined;
=======
  static async listLogsForExport({ actionFilter = 'all', actor = '' } = {}) {
    const whereClause = buildLogsWhere({ actionFilter, actor });
>>>>>>> Stashed changes

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
