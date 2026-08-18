import { env } from '../config/env';

const TRACK_URL = `${env.apiUrl}/analytics/track`;
const PAGE_VIEW_DEDUPE_MS = 30 * 1000;
const pageViewCache = new Map();

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
  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      if (navigator.sendBeacon(TRACK_URL, blob)) return;
    } catch {
      // fall through to fetch keep-alive
    }
  }

  fetch(TRACK_URL, {
    method: 'POST',
    body: blob,
    keepalive: true,
    credentials: 'include',
  }).catch(() => {});
}

export function trackPageView(username) {
  if (!username) return;

  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const now = Date.now();
  const lastTracked = pageViewCache.get(username) || 0;
  if (!isLocalhost && now - lastTracked < PAGE_VIEW_DEDUPE_MS) return;
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

  sendBeacon({
    username,
    eventType: 'link_click',
    linkId,
    referrer: getRefReferrer(),
    deviceType: detectDeviceType(),
  });
}

// Trim the page-view dedupe cache so it cannot grow indefinitely.
setInterval(() => {
  const cutoff = Date.now() - PAGE_VIEW_DEDUPE_MS;
  for (const [username, timestamp] of pageViewCache) {
    if (timestamp < cutoff) pageViewCache.delete(username);
  }
}, PAGE_VIEW_DEDUPE_MS);