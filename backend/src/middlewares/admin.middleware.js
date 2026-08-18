import { timingSafeEqual } from 'crypto';
import { eq } from 'drizzle-orm';
import { ApiError } from '../utils/apiResponse.js';
import { env } from '../config/env.js';
import { db } from '../config/db.js';
import { profiles } from '../models/schema.js';
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

  requireAuth(req, res, async (err) => {
    if (err) return next(err);

    if (req.user && isAdminEmail(req.user.email)) {
      try {
        const [profile] = await db
          .select({ isSuspended: profiles.isSuspended })
          .from(profiles)
          .where(eq(profiles.userId, req.user.id))
          .limit(1);

        if (profile?.isSuspended) {
          return next(new ApiError('Your account is suspended. Admin access is disabled.', 403));
        }
      } catch (dbErr) {
        return next(dbErr);
      }

      req.adminActor = { email: req.user.email, type: 'session', userId: req.user.id };
      return next();
    }

    return next(new ApiError('Admin access required', 403));
  });
};
