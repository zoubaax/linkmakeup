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
}

function parsePagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 20));
  const search = String(query.search || '').trim();
  return { page, limit, search };
}

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
    } catch (err) {
      next(err);
    }
  }

  static async getAdminAnalytics(req, res, next) {
    try {
      const data = await AnalyticsService.getAdminAnalytics();
      return ApiResponse.success(res, 'Analytics retrieved', data);
    } catch (err) {
      next(err);
    }
  }

  static async listPageStats(req, res, next) {
    try {
      const { page, limit, search } = parsePagination(req.query);
      const data = await AnalyticsService.listPageStats({ page, limit, search });
      return ApiResponse.success(res, 'Page stats retrieved', data);
    } catch (err) {
      next(err);
    }
  }

  static async exportPageStats(req, res, next) {
    try {
      const { search } = parsePagination(req.query);
      const { items } = await AnalyticsService.listPageStats({ page: 1, limit: 1000, search });
      return ApiResponse.success(res, 'Page stats exported', { items });
    } catch (err) {
      next(err);
    }
  }
}