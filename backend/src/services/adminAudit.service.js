import { and, desc, eq, sql, inArray, ilike } from 'drizzle-orm';
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

function buildLogsWhere({ actionFilter = 'all', actor = '', targetId, targetType, targetIds }) {
  const filters = [];

  if (actionFilter === 'links') {
    filters.push(sql`${adminAuditLogs.action} like 'link.%' or ${adminAuditLogs.targetType} = 'link'`);
  } else if (actionFilter === 'profiles') {
    filters.push(sql`${adminAuditLogs.action} like 'profile.%' or ${adminAuditLogs.targetType} = 'profile'`);
  } else if (actionFilter === 'user') {
    filters.push(sql`${adminAuditLogs.action} like 'user.%' or ${adminAuditLogs.targetType} = 'user'`);
  }

  const cleanActor = String(actor || '').trim().toLowerCase();
  if (cleanActor) {
    filters.push(ilike(adminAuditLogs.actorEmail, `%${cleanActor}%`));
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

  static async listLogs({ page, limit, actionFilter = 'all', actor = '', targetId, targetType, targetIds }) {
    const offset = (page - 1) * limit;
    const whereClause = buildLogsWhere({ actionFilter, actor, targetId, targetType, targetIds });

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

  static async exportLogs({ actionFilter = 'all', actor = '' } = {}) {
    const whereClause = buildLogsWhere({ actionFilter, actor });
    return db
      .select()
      .from(adminAuditLogs)
      .where(whereClause)
      .orderBy(desc(adminAuditLogs.createdAt));
  }

  static async listLogsForExport({ actionFilter = 'all', actor = '' } = {}) {
    const whereClause = buildLogsWhere({ actionFilter, actor });
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
