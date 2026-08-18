import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { profiles } from '../models/schema.js';
import { ApiError } from '../utils/apiResponse.js';

export const rejectSuspendedAccount = async (req, _res, next) => {
  try {
    const profileResult = await db
      .select({ isSuspended: profiles.isSuspended })
      .from(profiles)
      .where(eq(profiles.userId, req.user.id))
      .limit(1);

    if (profileResult[0]?.isSuspended) {
      return next(new ApiError('Your account is suspended. Studio access is temporarily disabled.', 403));
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
