import { AdminService } from '../services/admin.service.js';
import { AdminAuditService } from '../services/adminAudit.service.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';

const USER_STATUS_FILTERS = new Set(['all', 'with_profile', 'awaiting_profile']);
const LINK_STATUS_FILTERS = new Set(['all', 'active', 'hidden']);
const PROFILE_STATUS_FILTERS = new Set(['all', 'live', 'suspended']);
const AUDIT_ACTION_FILTERS = new Set(['all', 'links', 'profiles']);

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

function parseLinkStatus(query) {
  const status = String(query.status || 'all');
  return LINK_STATUS_FILTERS.has(status) ? status : 'all';
}

function parseProfileStatus(query) {
  const status = String(query.status || 'all');
  return PROFILE_STATUS_FILTERS.has(status) ? status : 'all';
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

  static async exportUsers(req, res, next) {
    try {
      const items = await AdminService.exportUsers({
        search: parsePagination(req.query).search,
        status: parseUserStatus(req.query),
      });
      return ApiResponse.success(res, 'Users exported', { items });
    } catch (err) {
      next(err);
    }
  }

  static async exportProfiles(req, res, next) {
    try {
      const items = await AdminService.exportProfiles({
        search: parsePagination(req.query).search,
        status: parseProfileStatus(req.query),
      });
      return ApiResponse.success(res, 'Profiles exported', { items });
    } catch (err) {
      next(err);
    }
  }

  static async exportLinks(req, res, next) {
    try {
      const items = await AdminService.exportLinks({
        search: parsePagination(req.query).search,
        status: parseLinkStatus(req.query),
      });
      return ApiResponse.success(res, 'Links exported', { items });
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
      const result = await AdminAuditService.listLogs({
        ...parsePagination(req.query),
        actionFilter: parseAuditFilter(req.query),
        actor: parseActorFilter(req.query),
      });
      return ApiResponse.success(res, 'Audit logs retrieved', result);
    } catch (err) {
      next(err);
    }
  }

  static async exportAuditLogs(req, res, next) {
    try {
      const items = await AdminAuditService.exportLogs({
        actionFilter: parseAuditFilter(req.query),
        actor: parseActorFilter(req.query),
      });
      return ApiResponse.success(res, 'Audit logs exported', { items });
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
}
