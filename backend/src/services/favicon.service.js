const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const BLOCKED_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

function isValidDomain(domain) {
  if (!domain || domain.length > 253) return false;
  const normalized = domain.toLowerCase().replace(/^www\./, '');
  if (BLOCKED_HOSTS.has(normalized)) return false;
  if (normalized.endsWith('.local') || normalized.endsWith('.internal')) return false;
  return DOMAIN_RE.test(normalized);
}

async function fetchImage(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'LinkMakeup/1.0 (+https://linkmakeup.com)',
        Accept: 'image/*,*/*;q=0.8',
      },
    });

    if (!response.ok) return null;

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/') && contentType !== 'application/octet-stream') {
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length) return null;

    return {
      buffer,
      contentType: contentType.startsWith('image/') ? contentType.split(';')[0] : 'image/png',
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export class FaviconService {
  static normalizeDomain(domain = '') {
    return String(domain).trim().toLowerCase().replace(/^www\./, '');
  }

  static isAllowedDomain(domain) {
    return isValidDomain(this.normalizeDomain(domain));
  }

  static async resolveFavicon(domainInput) {
    const domain = this.normalizeDomain(domainInput);
    if (!this.isAllowedDomain(domain)) {
      return null;
    }

    const candidates = [
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
      `https://${domain}/favicon.ico`,
      `https://${domain}/favicon.png`,
    ];

    for (const url of candidates) {
      const result = await fetchImage(url);
      if (result) {
        return { ...result, domain };
      }
    }

    return null;
  }
}
