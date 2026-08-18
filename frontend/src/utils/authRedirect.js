const RETURN_TO_KEY = 'linkmakeup_return_to';

/** @param {string} path */
export function isSafeReturnPath(path) {
  if (!path || typeof path !== 'string') return false;
  if (!path.startsWith('/') || path.startsWith('//')) return false;
  return !path.includes('://');
}

/** @param {string} path */
export function saveReturnTo(path) {
  if (isSafeReturnPath(path)) {
    sessionStorage.setItem(RETURN_TO_KEY, path);
  }
}

export function getStoredReturnTo() {
  return sessionStorage.getItem(RETURN_TO_KEY);
}

export function clearReturnTo() {
  sessionStorage.removeItem(RETURN_TO_KEY);
}

/**
 * Primary authenticated destination based on profile state.
 * @param {{ isSuspended?: boolean } | null | undefined} profile
 */
export function getAuthenticatedHomePath(profile) {
  if (profile?.isSuspended) return '/account-suspended';
  if (profile) return '/dashboard';
  return '/onboarding';
}

/**
 * Resolve post-login destination.
 * @param {string | null | undefined} queryReturnTo
 * @param {{ isSuspended?: boolean } | null | undefined} profile
 * @param {{ isAdmin?: boolean } | null | undefined} user
 */
export function resolvePostLoginPath(queryReturnTo, profile, user) {
  const stored = getStoredReturnTo();
  const candidate = queryReturnTo || stored;

  if (profile?.isSuspended) {
    if (user?.isAdmin && candidate?.startsWith('/admin') && isSafeReturnPath(candidate)) {
      return candidate;
    }
    return '/account-suspended';
  }

  if (candidate && isSafeReturnPath(candidate)) {
    return candidate;
  }

  return getAuthenticatedHomePath(profile);
}

/** @param {string} targetPath */
export function loginPathWithReturnTo(targetPath) {
  if (!isSafeReturnPath(targetPath)) return '/';
  return `/?returnTo=${encodeURIComponent(targetPath)}`;
}
