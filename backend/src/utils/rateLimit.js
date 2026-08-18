import { ApiError } from './apiResponse.js';

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Minimal in-memory fixed-window rate limiter.
 * Keyed by client IP by default. Returns a middleware that responds
 * with 429 + Retry-After once the per-window max is exceeded.
 */
export function createRateLimiter({ windowMs = 60 * 1000, max = 30, keyFn } = {}) {
  const hitsByKey = new Map();

  const cleanup = () => {
    if (hitsByKey.size === 0) return;
    const cutoff = Date.now() - windowMs;
    for (const [key, timestamps] of hitsByKey) {
      const remaining = timestamps.filter((ts) => ts > cutoff);
      if (remaining.length === 0) hitsByKey.delete(key);
      else hitsByKey.set(key, remaining);
    }
  };
  const cleanupTimer = setInterval(cleanup, CLEANUP_INTERVAL_MS);
  if (typeof cleanupTimer.unref === 'function') cleanupTimer.unref();

  return function rateLimiter(req, _res, next) {
    const key = keyFn ? keyFn(req) : req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const now = Date.now();
    const cutoff = now - windowMs;
    const timestamps = (hitsByKey.get(key) || []).filter((ts) => ts > cutoff);

    if (timestamps.length >= max) {
      const retryAfterSeconds = Math.max(1, Math.ceil(windowMs / 1000));
      return next(new ApiError('Too many requests. Please try again shortly.', 429));
    }

    timestamps.push(now);
    hitsByKey.set(key, timestamps);
    return next();
  };
}