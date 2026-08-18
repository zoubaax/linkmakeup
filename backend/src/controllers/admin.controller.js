import { AdminService } from '../services/admin.service.js';
import { AdminAuditService } from '../services/adminAudit.service.js';
import { AdminNotesService } from '../services/adminNotes.service.js';
import { AnalyticsController } from './analytics.controller.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { sendCsv } from '../utils/csv.js';

const USER_STATUS_FILTERS = new Set(['all', 'with_profile', 'awaiting_profile']);
const PROFILE_STATUS_FILTERS = new Set(['all', 'live', 'suspended']);
const LINK_STATUS_FILTERS = new Set(['all', 'active', 'hidden']);
const AUDIT_ACTION_FILTERS = new Set(['all', 'links', 'profiles', 'user']);

function parsePagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 10));
  const search = String(query.search || '').trim();
  return { page, limit, search };
}

function parseUserStatus(query) {
  const status = String(query.status || 'all');
  return USER_STATUS_FILTERS.has(status) ? status : 'all';
}

function parseProfileStatus(query) {
  const status = String(query.status || 'all');
  return PROFILE_STATUS_FILTERS.has(status) ? status : 'all';
}

function parseLinkStatus(query) {
  const status = String(query.status || 'all');
  return LINK_STATUS_FILTERS.has(status) ? status : 'all';
}

function parseAuditFilter(query) {
  const action = String(query.action || 'all');
  return AUDIT_ACTION_FILTERS.has(action) ? action : 'all';
}

function parseActorFilter(query) {
  return String(query.actor || '').trim();
}

function requireReason(reason, message = 'A reason is required for this action') {
  const trimmed = String(reason || '').trim();
  if (trimmed.length < 3) {
    throw new ApiError(message, 400);
  }
  return trimmed;
}

export class AdminController {
  static async getStats(req, res, next) {
    try {
      const [stats, recentActivity] = await Promise.all([
        AdminService.getPlatformStats(),
        AdminAuditService.listRecent(5),
      ]);
      return ApiResponse.success(res, 'Platform stats retrieved', {
        ...stats,
        recentActivity,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getUserDetail(req, res, next) {
    try {
      const detail = await AdminService.getUserDetail(req.params.userId);
      return ApiResponse.success(res, 'User detail retrieved', detail);
    } catch (err) {
      next(err);
    }
  }

  static async listUsers(req, res, next) {
    try {
      const result = await AdminService.listUsers({
        ...parsePagination(req.query),
        status: parseUserStatus(req.query),
      });
      return ApiResponse.success(res, 'Users retrieved', result);
    } catch (err) {
      next(err);
    }
  }

  static async listProfiles(req, res, next) {
    try {
      const result = await AdminService.listProfiles({
        ...parsePagination(req.query),
        status: parseProfileStatus(req.query),
      });
      return ApiResponse.success(res, 'Profiles retrieved', result);
    } catch (err) {
      next(err);
    }
  }

  static async listLinks(req, res, next) {
    try {
      const result = await AdminService.listLinks({
        ...parsePagination(req.query),
        status: parseLinkStatus(req.query),
      });
      return ApiResponse.success(res, 'Links retrieved', result);
    } catch (err) {
      next(err);
    }
  }

  static async listAuditLogs(req, res, next) {
    try {
      const targetIdsRaw = String(req.query.targetIds || '').trim();
      const targetIds = targetIdsRaw
        ? targetIdsRaw.split(',').map((id) => id.trim()).filter(Boolean)
        : undefined;

      const result = await AdminAuditService.listLogs({
        ...parsePagination(req.query),
        actionFilter: parseAuditFilter(req.query),
        actor: String(req.query.actor || '').trim(),
        targetId: String(req.query.targetId || '').trim() || undefined,
        targetType: String(req.query.targetType || '').trim() || undefined,
        targetIds,
      });
      return ApiResponse.success(res, 'Audit logs retrieved', result);
    } catch (err) {
      next(err);
    }
  }

  static async search(req, res, next) {
    try {
      const limit = Math.min(20, Math.max(1, Number.parseInt(req.query.limit, 10) || 8));
      const result = await AdminService.search({
        query: String(req.query.q || ''),
        limit,
      });
      return ApiResponse.success(res, 'Search results retrieved', result);
    } catch (err) {
      next(err);
    }
  }

  static async listNotes(req, res, next) {
    try {
      const notes = await AdminNotesService.listNotes({
        targetType: req.query.targetType,
        targetId: req.query.targetId,
      });
      return ApiResponse.success(res, 'Notes retrieved', { items: notes });
    } catch (err) {
      next(err);
    }
  }

  static async createNote(req, res, next) {
    try {
      const { targetType, targetId, body } = req.body;
      const note = await AdminNotesService.createNote({
        targetType,
        targetId,
        body,
        authorEmail: req.adminActor.email,
      });
      return ApiResponse.success(res, 'Note created', note);
    } catch (err) {
      next(err);
    }
  }

  static async deleteNote(req, res, next) {
    try {
      const result = await AdminNotesService.deleteNote(
        req.params.noteId,
        req.adminActor.email,
      );
      return ApiResponse.success(res, 'Note deleted', result);
    } catch (err) {
      next(err);
    }
  }

  static async patchLink(req, res, next) {
    try {
      const { isActive } = req.body;
      if (typeof isActive !== 'boolean') {
        throw new ApiError('isActive must be a boolean', 400);
      }

      const updated = await AdminService.toggleLink(
        req.params.linkId,
        isActive,
        req.adminActor,
        req.body.reason,
      );
      return ApiResponse.success(res, 'Link updated', updated);
    } catch (err) {
      next(err);
    }
  }

  static async deleteLink(req, res, next) {
    try {
      const reason = requireReason(req.body?.reason, 'A reason is required to delete a link');
      const result = await AdminService.deleteLink(
        req.params.linkId,
        req.adminActor,
        reason,
      );
      return ApiResponse.success(res, 'Link deleted', result);
    } catch (err) {
      next(err);
    }
  }

  static async patchProfileSuspension(req, res, next) {
    try {
      const { suspended } = req.body;
      if (typeof suspended !== 'boolean') {
        throw new ApiError('suspended must be a boolean', 400);
      }

      const reason = requireReason(
        req.body?.reason,
        'A reason is required to change profile suspension',
      );

      const updated = await AdminService.setProfileSuspension(
        req.params.profileId,
        suspended,
        req.adminActor,
        reason,
      );
      return ApiResponse.success(res, suspended ? 'Profile suspended' : 'Profile restored', updated);
    } catch (err) {
      next(err);
    }
  }

  static async sendOnboardingReminder(req, res, next) {
    try {
      const result = await AdminService.sendOnboardingReminder(
        req.params.userId,
        req.adminActor,
      );
      return ApiResponse.success(res, `Onboarding reminder sent to ${result.email}`, result);
    } catch (err) {
      next(err);
    }
  }

  static async sendBulkOnboardingReminders(req, res, next) {
    try {
      const result = await AdminService.sendBulkOnboardingReminders(req.adminActor);
      return ApiResponse.success(
        res,
        `Sent onboarding reminders to ${result.sentCount} users awaiting setup`,
        result,
      );
    } catch (err) {
      next(err);
    }
  }

  static async exportUsers(req, res, next) {
    try {
      const rows = await AdminService.listUsersForExport({
        search: String(req.query.search || '').trim(),
        status: parseUserStatus(req.query),
      });

      const csvRows = rows.map((row) => ({
        email: row.email,
        name: row.name || '',
        username: row.username || '',
        status: row.isSuspended === true ? 'suspended' : (row.username ? 'active' : 'awaiting_profile'),
        linkCount: row.linkCount,
        createdAt: row.createdAt ? row.createdAt.toISOString() : '',
      }));

      sendCsv(res, 'users.csv', csvRows);
    } catch (err) {
      next(err);
    }
  }

  static async exportProfiles(req, res, next) {
    try {
      const rows = await AdminService.listProfilesForExport({
        search: String(req.query.search || '').trim(),
        status: parseProfileStatus(req.query),
      });

      const csvRows = rows.map((row) => ({
        username: row.username,
        displayName: row.displayName,
        email: row.email || '',
        status: row.isSuspended ? 'suspended' : 'live',
        bio: row.bio || '',
        linkCount: row.linkCount,
        activeLinkCount: row.activeLinkCount,
        avatarUrl: row.avatarUrl || '',
        createdAt: row.createdAt ? row.createdAt.toISOString() : '',
      }));

      sendCsv(res, 'profiles.csv', csvRows);
    } catch (err) {
      next(err);
    }
  }

  static async exportLinks(req, res, next) {
    try {
      const rows = await AdminService.listLinksForExport({
        search: String(req.query.search || '').trim(),
        status: parseLinkStatus(req.query),
      });

      const csvRows = rows.map((row) => ({
        title: row.title,
        url: row.url,
        username: row.username || '',
        email: row.email || '',
        status: row.isActive ? 'active' : 'hidden',
        position: row.position,
        subtitle: row.subtitle || '',
        icon: row.icon || '',
        createdAt: row.createdAt ? row.createdAt.toISOString() : '',
      }));

      sendCsv(res, 'links.csv', csvRows);
    } catch (err) {
      next(err);
    }
  }

  static async exportAuditLogs(req, res, next) {
    try {
      const rows = await AdminAuditService.listLogsForExport({
        actionFilter: parseAuditFilter(req.query),
        actor: String(req.query.actor || '').trim(),
      });

      const csvRows = rows.map((row) => ({
        createdAt: row.createdAt ? row.createdAt.toISOString() : '',
        actorEmail: row.actorEmail,
        actorType: row.actorType,
        action: row.action,
        targetType: row.targetType,
        targetId: row.targetId,
        reason: row.metadata?.reason || '',
        targetLabel: row.metadata?.targetLabel || '',
      }));

      sendCsv(res, 'audit-logs.csv', csvRows);
    } catch (err) {
      next(err);
    }
  }
}
