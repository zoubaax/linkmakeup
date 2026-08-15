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
 * Resolve post-login destination.
 * @param {string | null | undefined} queryReturnTo
 * @param {boolean} hasProfile
 */
export function resolvePostLoginPath(queryReturnTo, hasProfile) {
  const stored = getStoredReturnTo();
  const candidate = queryReturnTo || stored;

  if (candidate && isSafeReturnPath(candidate)) {
    return candidate;
  }

  return hasProfile ? '/dashboard' : '/onboarding';
}

/** @param {string} targetPath */
export function loginPathWithReturnTo(targetPath) {
  if (!isSafeReturnPath(targetPath)) return '/';
  return `/?returnTo=${encodeURIComponent(targetPath)}`;
}
