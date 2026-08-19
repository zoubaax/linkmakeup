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

export function resolveLinkIcon(icon, url) {
  if (isPlatformIcon(icon)) {
    return { type: 'platform', icon };
  }

  if (isFaviconIcon(icon)) {
    return { type: 'favicon', src: getFaviconUrl(icon) };
  }

  const domain = getDomainFromUrl(url);
  if (domain) {
    return { type: 'favicon', src: getFaviconUrl(`favicon:${domain}`) };
  }

  return { type: 'platform', icon: icon || 'website' };
}

export function iconForLinkUrl(url, currentIcon = 'website') {
  if (isPlatformIcon(currentIcon)) return currentIcon;
  return getFaviconIconValue(url);
}
