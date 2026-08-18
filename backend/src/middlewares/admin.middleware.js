import { timingSafeEqual } from 'crypto';
import { ApiError } from '../utils/apiResponse.js';
import { env } from '../config/env.js';
import { isAdminEmail } from '../utils/adminAccess.js';
import { requireAuth } from './auth.middleware.js';

function matchesAdminApiKey(providedKey) {
  if (!env.adminApiKey || !providedKey) return false;
  const expected = Buffer.from(env.adminApiKey);
  const received = Buffer.from(providedKey);
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

export const requireAdminAccess = (req, res, next) => {
  if (matchesAdminApiKey(req.headers['x-admin-key'])) {
    req.adminActor = { email: 'system:api-key', type: 'api_key' };
    return next();
  }

  requireAuth(req, res, (err) => {
    if (err) return next(err);

    if (req.user && isAdminEmail(req.user.email)) {
      req.adminActor = { email: req.user.email, type: 'session' };
      return next();
    }

    return next(new ApiError('Admin access required', 403));
  });
};
