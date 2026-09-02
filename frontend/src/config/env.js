const DEFAULT_APP_DOMAIN = 'linkmakeup.com';
const DEFAULT_API_URL = 'https://api.linkmakeup.com/api/v1';

function resolveApiUrl() {
  const raw = String(import.meta.env.VITE_API_URL || '').trim();
  // In production on *.linkmakeup.com, a stale build that still points to
  // localhost will break favicons + all API calls on subdomains. Auto-correct.
  if (typeof window !== 'undefined') {
    const host = window.location.hostname || '';
    const isProdHost = host.endsWith('linkmakeup.com') && host !== 'localhost' && !host.startsWith('127.') && !host.includes('localhost');
    if (isProdHost) {
      if (!raw || raw.includes('localhost') || raw.includes('127.0.0.1')) return DEFAULT_API_URL;
    }
  }
  return raw || 'http://localhost:5000/api/v1';
}

export const env = {
  apiUrl: resolveApiUrl(),
  // Do not derive this from window.location.host. On a profile subdomain that
  // would turn "zoubaa.linkmakeup.com" into "username.zoubaa.linkmakeup.com".
  appDomain: import.meta.env.VITE_APP_DOMAIN || DEFAULT_APP_DOMAIN,
};

/**
 * Returns the one canonical URL used for every profile-share action.
 * Production: https://username.linkmakeup.com/
 * Local development: http://localhost:5173/username
 */
export const getPublicUserUrl = (username) => {
  const normalizedUsername = String(username || '').trim().toLowerCase();
  if (!normalizedUsername) return '';

  // Accept an accidentally configured protocol/trailing slash without
  // generating malformed URLs such as "username.https://linkmakeup.com".
  const domain = env.appDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const protocol = domain.includes('localhost') ? 'http://' : 'https://';
  
  // For local development on single port without custom DNS mapping
  if (domain.includes('localhost')) {
    return `${protocol}${domain}/${encodeURIComponent(normalizedUsername)}`;
  }
  
  return `${protocol}${encodeURIComponent(normalizedUsername)}.${domain}/`;
};
