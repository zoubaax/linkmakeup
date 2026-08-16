const DEFAULT_APP_DOMAIN = 'linkmakeup.com';

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
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
