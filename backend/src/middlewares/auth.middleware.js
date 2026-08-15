import { ApiError } from '../utils/apiResponse.js';
import { db } from '../config/db.js';
import { users } from '../models/schema.js';
import { eq } from 'drizzle-orm';

export const requireAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.session_token || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

    if (!token) {
      return next(new ApiError('Authentication required. Please sign in.', 401));
    }

    // Extract User ID from session token
    let userId = token.startsWith('session_') ? token.replace('session_', '') : token;

    // Fetch exact authenticated user from Neon PostgreSQL database
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userResult || userResult.length === 0) {
      return next(new ApiError('Invalid session or user not found. Please sign in again.', 401));
    }

    // Attach real database user object to request
    req.user = userResult[0];
    return next();
  } catch (err) {
    console.error('❌ Auth Middleware Error:', err.message);
    return next(new ApiError('Authentication error. Please sign in again.', 401));
  }
};
