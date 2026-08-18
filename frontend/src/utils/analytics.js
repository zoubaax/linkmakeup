import { env } from '../config/env';

const TRACK_URL = `${env.apiUrl}/analytics/track`;
const PAGE_VIEW_DEDUPE_MS = 30 * 1000;
const LINK_CLICK_DEDUPE_MS = 2 * 1000;

const pageViewCache = new Map();
const linkClickCache = new Map();

export function detectDeviceType() {
  if (typeof navigator === 'undefined') return 'desktop';

  if (typeof window.matchMedia === 'function') {
    if (window.matchMedia('(pointer: coarse)').matches && window.matchMedia('(max-width: 1024px)').matches) {
      return 'mobile';
    }
  }

  const ua = navigator.userAgent || '';
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return 'mobile';

  return 'desktop';
}

export function getRefReferrer() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (ref && /^[a-zA-Z0-9_-]{1,40}$/.test(ref)) return ref;
  return 'direct';
}

function sendBeacon(payload) {
  const body = JSON.stringify(payload);

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      const blob = new Blob([body], { type: 'text/plain' });
      navigator.sendBeacon(TRACK_URL, blob);
      return;
    } catch {
      // Fallback to fetch if sendBeacon throws
    }
  }

  fetch(TRACK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
    credentials: 'include',
  }).catch(() => {});
}

export function trackPageView(username) {
  if (!username) return;

  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const dedupeMs = isLocalhost ? 2000 : PAGE_VIEW_DEDUPE_MS;
  const now = Date.now();
  const lastTracked = pageViewCache.get(username) || 0;
  if (now - lastTracked < dedupeMs) return;
  pageViewCache.set(username, now);

  sendBeacon({
    username,
    eventType: 'page_view',
    referrer: getRefReferrer(),
    deviceType: detectDeviceType(),
  });
}

export function trackLinkClick(username, linkId) {
  if (!username || !linkId) return;

  const key = `${username}:${linkId}`;
  const now = Date.now();
  const lastTracked = linkClickCache.get(key) || 0;
  if (now - lastTracked < LINK_CLICK_DEDUPE_MS) return;
  linkClickCache.set(key, now);

  sendBeacon({
    username,
    eventType: 'link_click',
    linkId,
    referrer: getRefReferrer(),
    deviceType: detectDeviceType(),
  });
}

// Trim dedupe caches periodically
setInterval(() => {
  const now = Date.now();
  for (const [username, timestamp] of pageViewCache) {
    if (now - timestamp > PAGE_VIEW_DEDUPE_MS) pageViewCache.delete(username);
  }
  for (const [key, timestamp] of linkClickCache) {
    if (now - timestamp > LINK_CLICK_DEDUPE_MS) linkClickCache.delete(key);
  }
}, 10 * 1000);