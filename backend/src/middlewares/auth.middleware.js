import { ApiError } from '../utils/apiResponse.js';

export const requireAuth = (req, _res, next) => {
  // Extract token/session from cookies or Authorization header
  const authHeader = req.headers.authorization;
  const token = req.cookies?.session_token || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

  if (!token && !req.session?.user) {
    return next(new ApiError('Authentication required. Please sign in.', 401));
  }

  // Attach user identity to request object
  req.user = req.session?.user || { id: 'mock-user-id', email: 'user@linkmakeup.com' };
  return next();
};
