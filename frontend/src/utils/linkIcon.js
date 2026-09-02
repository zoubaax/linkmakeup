import { env } from '../config/env';

export const PLATFORM_ICON_IDS = new Set([
  'instagram',
  'linkedin',
  'github',
  'twitter',
  'youtube',
  'tiktok',
  'snapchat',
  'discord',
  'whatsapp',
  'telegram',
  'reddit',
  'threads',
  'twitch',
  'kick',
  'wattpad',
  'substack',
  'medium',
  'patreon',
  'steam',
  'bluesky',
  'pinterest',
  'spotify',
  'behance',
  'dribbble',
  'figma',
  'phone',
  'email',
  'portfolio',
]);

export function isPlatformIcon(icon) {
  if (!icon) return false;
  return PLATFORM_ICON_IDS.has(icon.toLowerCase());
}

export function isFaviconIcon(icon) {
  if (!icon) return false;
  return icon.startsWith('favicon:') || icon.startsWith('http://') || icon.startsWith('https://');
}

export function getDomainFromUrl(url) {
  if (!url?.trim()) return null;
  try {
    const normalized = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
    return new URL(normalized).hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return null;
  }
}

export function getFaviconIconValue(url) {
  const domain = getDomainFromUrl(url);
  return domain ? `favicon:${domain}` : 'website';
}

export function getFaviconUrl(iconOrDomain) {
  if (!iconOrDomain) return null;

  if (iconOrDomain.startsWith('favicon:')) {
    const domain = iconOrDomain.slice('favicon:'.length);
    if (!domain) return null;
    return `${env.apiUrl}/favicon?domain=${encodeURIComponent(domain)}`;
  }

  if (iconOrDomain.startsWith('http://') || iconOrDomain.startsWith('https://')) {
    const domain = getDomainFromUrl(iconOrDomain);
    if (domain) {
      return `${env.apiUrl}/favicon?domain=${encodeURIComponent(domain)}`;
    }
    return iconOrDomain;
  }

  const domain = getDomainFromUrl(iconOrDomain);
  if (!domain) return null;
  return `${env.apiUrl}/favicon?domain=${encodeURIComponent(domain)}`;
}

export function getFaviconFallbackUrls(iconOrDomain) {
  const primary = getFaviconUrl(iconOrDomain);
  if (!primary) return [];
  // Extract domain for fallbacks
  let domain = null;
  if (iconOrDomain.startsWith('favicon:')) domain = iconOrDomain.slice('favicon:'.length);
  else domain = getDomainFromUrl(iconOrDomain);
  if (!domain) return [primary];

  const fallbacks = [primary];
  // Direct Google S2 (no backend) + DuckDuckGo icons + direct favicon.ico
  // These bypass backend CORS/proxy issues on subdomains and Vercel cold starts
  fallbacks.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`);
  fallbacks.push(`https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`);
  fallbacks.push(`https://${domain}/favicon.ico`);
  return [...new Set(fallbacks)];
}

export function getFaviconSrcList(iconOrDomain) {
  return getFaviconFallbackUrls(iconOrDomain);
}

export function resolveLinkIcon(icon, url) {
  if (isFaviconIcon(icon)) {
    const srcList = getFaviconSrcList(icon);
    return { type: 'favicon', src: srcList[0] || null, srcList };
  }

  if (isPlatformIcon(icon) && icon.toLowerCase() !== 'portfolio' && icon.toLowerCase() !== 'website') {
    return { type: 'platform', icon };
  }

  const domain = getDomainFromUrl(url);
  if (domain) {
    const srcList = getFaviconSrcList(`favicon:${domain}`);
    return { type: 'favicon', src: srcList[0] || null, srcList };
  }

  return { type: 'platform', icon: icon || 'website' };
}

export function iconForLinkUrl(url, currentIcon = 'website') {
  if (isPlatformIcon(currentIcon)) return currentIcon;
  return getFaviconIconValue(url);
}
