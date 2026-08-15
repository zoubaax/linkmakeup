export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  appDomain: import.meta.env.VITE_APP_DOMAIN || (typeof window !== 'undefined' ? window.location.host : 'linkmakeup.com'),
};

/**
 * Utility to generate full public user page URL from username
 */
export const getPublicUserUrl = (username) => {
  if (!username) return '';
  const domain = env.appDomain;
  const protocol = domain.includes('localhost') ? 'http://' : 'https://';
  
  // For local development on single port without custom DNS mapping
  if (domain.includes('localhost')) {
    return `${protocol}${domain}/${username}`;
  }
  
  return `${protocol}${username}.${domain}`;
};
