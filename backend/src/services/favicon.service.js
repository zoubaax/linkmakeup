const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const BLOCKED_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

function isValidDomain(domain) {
  if (!domain || domain.length > 253) return false;
  const normalized = domain.toLowerCase().replace(/^www\./, '');
  if (BLOCKED_HOSTS.has(normalized)) return false;
  if (normalized.endsWith('.local') || normalized.endsWith('.internal')) return false;
  return DOMAIN_RE.test(normalized);
}

async function fetchPageHtml(url, timeoutMs = 3000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchImage(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/*,*/*;q=0.8',
      },
    });

    if (!response.ok) return null;

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/') && !contentType.includes('svg') && contentType !== 'application/octet-stream') {
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length) return null;

    return {
      buffer,
      contentType: contentType.split(';')[0].trim() || 'image/png',
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

    const candidates = [];

    // 1. Try extracting actual favicon URL directly from website HTML head
    try {
      const html = await fetchPageHtml(`https://${domain}/`);
      if (html) {
        const match =
          html.match(/<link[^>]*rel=[\"'](?:shortcut )?icon[\"'][^>]*href=[\"']([^\"']+)[\"']/i) ||
          html.match(/<link[^>]*href=[\"']([^\"']+)[\"'][^>]*rel=[\"'](?:shortcut )?icon[\"']/i);

        if (match && match[1]) {
          let iconUrl = match[1];
          if (iconUrl.startsWith('//')) iconUrl = `https:${iconUrl}`;
          else if (iconUrl.startsWith('/')) iconUrl = `https://${domain}${iconUrl}`;
          else if (!iconUrl.startsWith('http')) iconUrl = `https://${domain}/${iconUrl}`;
          candidates.push(iconUrl);
        }
      }
    } catch {
      // ignore HTML parse error
    }

    // Prioritize Google + DuckDuckGo (reliable, no HTML fetch needed) before direct /favicon.ico which often 404s or times out on serverless.
    // Order: extracted HTML icon (if any) → Google S2 → DuckDuckGo → direct favicon files
    candidates.push(
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
      `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`,
      `https://${domain}/favicon.ico`,
      `https://${domain}/favicon.png`,
      `https://${domain}/favicon.svg`
    );

    for (const url of candidates) {
      const result = await fetchImage(url);
      if (result) {
        return { ...result, domain };
      }
    }

    return null;
  }
}
