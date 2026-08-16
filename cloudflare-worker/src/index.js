const SOCIAL_CRAWLER = /facebookexternalhit|facebot|whatsapp|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|applebot/i;
const RESERVED_SUBDOMAINS = new Set(['www', 'api', 'app', 'mail', 'admin']);

/**
 * Serve profile Open Graph HTML to social-media crawlers. All other profile
 * requests retain the existing behaviour: they are forwarded to the Vercel
 * frontend with the original subdomain available in X-Forwarded-Host.
 */
export default {
  async fetch(request, env) {
    const username = getUsernameFromHostname(new URL(request.url).hostname, env.ROOT_DOMAIN);
    if (!username) {
      return fetch(request);
    }

    if (request.method === 'GET' && SOCIAL_CRAWLER.test(request.headers.get('user-agent') || '')) {
      const ogUrl = new URL('/api/v1/profiles/check-og', env.API_ORIGIN);
      ogUrl.searchParams.set('u', username);

      const ogResponse = await fetch(ogUrl, {
        headers: {
          // The API uses this to keep og:url on the public profile URL rather
          // than the internal api.linkmakeup.com URL.
          'X-Original-Host': new URL(request.url).host,
          'User-Agent': request.headers.get('user-agent') || '',
        },
      });

      return new Response(ogResponse.body, {
        status: ogResponse.status,
        statusText: ogResponse.statusText,
        headers: {
          'Content-Type': ogResponse.headers.get('Content-Type') || 'text/html; charset=utf-8',
          // Profile edits should appear in future shares without a long edge cache.
          'Cache-Control': 'public, max-age=60',
        },
      });
    }

    const headers = new Headers(request.headers);
    const hostname = new URL(request.url).hostname;
    headers.set('Host', 'www.linkmakeup.com');
    headers.set('X-Forwarded-Host', hostname);

    const url = new URL(request.url);
    const targetUrl = `https://www.linkmakeup.com${url.pathname}${url.search}`;

    return fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
    });
  },
};

function getUsernameFromHostname(hostname, rootDomain) {
  const host = hostname.toLowerCase();
  const root = (rootDomain || 'linkmakeup.com').toLowerCase();
  const suffix = `.${root}`;

  if (!host.endsWith(suffix)) return null;

  const subdomain = host.slice(0, -suffix.length);
  if (!subdomain || subdomain.includes('.') || RESERVED_SUBDOMAINS.has(subdomain)) return null;

  return subdomain;
}
