<<<<<<< Updated upstream
import AnalyticsService from '../services/analytics.service.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';

const truncate = (value, max) => (value && value.length > max ? value.slice(0, max) : value);
const parseUuid = (value) => (typeof value === 'string' && value.trim() ? value.trim().toLowerCase() : null);

function extractSource(req) {
  const ref = req.headers.referer || req.headers.referrer || '';
  try {
    const host = new URL(ref).hostname;
    if (!host || host === 'localhost') return 'direct';
    return host.toLowerCase().replace(/^www\./, '');
  } catch {
    return 'direct';
  }
}

const buckets = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_HITS = 60;

function isRateLimited(ip) {
  const now = Date.now();
  const key = `${ip}`;
  const entries = (buckets.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (entries.length >= MAX_HITS) {
    if (entries.length % 10 === 0) buckets.delete(key);
    return true;
  }
  entries.push(now);
  buckets.set(key, entries);
  return false;
=======
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { profiles } from '../models/schema.js';
import { AnalyticsService } from '../services/analytics.service.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { sendCsv } from '../utils/csv.js';

const trackSchema = z.object({
  username: z.string().min(1).max(50),
  eventType: z.enum(['page_view', 'link_click']),
  linkId: z.string().uuid().optional(),
  referrer: z.string().max(100).optional(),
  deviceType: z.enum(['mobile', 'desktop', 'tablet']).optional(),
});

const PERIOD_FILTERS = new Set(['7d', '30d', '90d', 'all']);
const STATUS_FILTERS = new Set(['all', 'live', 'suspended']);
const SORTS = new Set(['username', 'views', 'clicks', 'lastActiveAt']);

function parsePeriod(query) {
  const value = String(query.period || '30d');
  return PERIOD_FILTERS.has(value) ? value : '30d';
>>>>>>> Stashed changes
}

function parsePagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
<<<<<<< Updated upstream
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 20));
=======
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 10));
>>>>>>> Stashed changes
  const search = String(query.search || '').trim();
  return { page, limit, search };
}

<<<<<<< Updated upstream
export default class AnalyticsController {
  static async recordPageView(req, res, next) {
    try {
      const ip = req.ip || req.socket?.remoteAddress || 'unknown';
      if (isRateLimited(ip)) throw new ApiError('Too many requests. Please slow down.', 429);

      const profileId = parseUuid(req.body?.profileId);
      if (!profileId) throw new ApiError('profileId is required.', 400);

      await AnalyticsService.recordPageView({
        profileId,
        source: extractSource(req),
        userAgent: truncate(req.headers['user-agent'], 255),
      });

      return ApiResponse.success(res, 'Page view recorded', {});
    } catch (err) {
      next(err);
    }
  }

  static async recordLinkClick(req, res, next) {
    try {
      const ip = req.ip || req.socket?.remoteAddress || 'unknown';
      if (isRateLimited(ip)) throw new ApiError('Too many requests. Please slow down.', 429);

      const profileId = parseUuid(req.body?.profileId);
      const linkId = parseUuid(req.body?.linkId);
      if (!profileId || !linkId) throw new ApiError('profileId and linkId are required.', 400);

      await AnalyticsService.recordLinkClick({
        profileId,
        linkId,
        source: extractSource(req),
        userAgent: truncate(req.headers['user-agent'], 255),
      });

      return ApiResponse.success(res, 'Link click recorded', {});
=======
function parseStatus(query) {
  const value = String(query.status || 'all');
  return STATUS_FILTERS.has(value) ? value : 'all';
}

function parseSort(query) {
  const value = String(query.sort || 'views');
  return SORTS.has(value) ? value : 'views';
}

export class AnalyticsController {
  static async track(req, res, next) {
    try {
      const validation = trackSchema.safeParse(req.body);
      if (!validation.success) {
        return ApiResponse.success(res, 'Analytics event skipped', { recorded: false });
      }

      const { username, eventType, linkId, referrer, deviceType } = validation.data;
      const result = await AnalyticsService.recordEvent({
        username,
        eventType,
        linkId,
        referrer,
        deviceType,
      });

      return ApiResponse.success(res, 'Analytics event recorded', result);
>>>>>>> Stashed changes
    } catch (err) {
      next(err);
    }
  }

<<<<<<< Updated upstream
  static async getAdminAnalytics(req, res, next) {
    try {
      const data = await AnalyticsService.getAdminAnalytics();
      return ApiResponse.success(res, 'Analytics retrieved', data);
=======
  static async getMySummary(req, res, next) {
    try {
      const [profile] = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.userId, req.user.id))
        .limit(1);

      if (!profile) {
        throw new ApiError('Profile not found', 404);
      }

      const summary = await AnalyticsService.getProfileSummary({
        profileId: profile.id,
        period: parsePeriod(req.query),
      });
      return ApiResponse.success(res, 'Analytics summary retrieved', summary);
>>>>>>> Stashed changes
    } catch (err) {
      next(err);
    }
  }

<<<<<<< Updated upstream
  static async listPageStats(req, res, next) {
    try {
      const { page, limit, search } = parsePagination(req.query);
      const data = await AnalyticsService.listPageStats({ page, limit, search });
      return ApiResponse.success(res, 'Page stats retrieved', data);
=======
  static async getMyLinks(req, res, next) {
    try {
      const [profile] = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.userId, req.user.id))
        .limit(1);

      if (!profile) {
        throw new ApiError('Profile not found', 404);
      }

      const links = await AnalyticsService.getProfileLinkStats({
        profileId: profile.id,
        userId: req.user.id,
        period: parsePeriod(req.query),
      });
      return ApiResponse.success(res, 'Link analytics retrieved', { items: links });
>>>>>>> Stashed changes
    } catch (err) {
      next(err);
    }
  }

<<<<<<< Updated upstream
  static async exportPageStats(req, res, next) {
    try {
      const { search } = parsePagination(req.query);
      const { items } = await AnalyticsService.listPageStats({ page: 1, limit: 1000, search });
      return ApiResponse.success(res, 'Page stats exported', { items });
=======
  static async getSummary(req, res, next) {
    try {
      const summary = await AnalyticsService.getSummary({ period: parsePeriod(req.query) });
      return ApiResponse.success(res, 'Analytics summary retrieved', summary);
    } catch (err) {
      next(err);
    }
  }

  static async listPages(req, res, next) {
    try {
      const result = await AnalyticsService.listPageStats({
        ...parsePagination(req.query),
        sort: parseSort(req.query),
        status: parseStatus(req.query),
      });
      return ApiResponse.success(res, 'Page stats retrieved', result);
    } catch (err) {
      next(err);
    }
  }

  static async exportPages(req, res, next) {
    try {
      const rows = await AnalyticsService.listPageStatsForExport({
        search: String(req.query.search || '').trim(),
        status: parseStatus(req.query),
      });
      sendCsv(res, 'page-stats.csv', rows);
>>>>>>> Stashed changes
    } catch (err) {
      next(err);
    }
  }
}