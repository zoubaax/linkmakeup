import { db } from '../config/db.js';
import { profiles } from '../models/schema.js';

export class SeoController {
  /**
   * Dynamic sitemap.xml for search engine crawlers (Google, Bing, Yandex)
   */
  static async getSitemapXml(req, res, next) {
    try {
      const host = req.headers.host || 'www.linkmakeup.com';
      const baseUrl = host.includes('localhost') ? `http://${host}` : 'https://www.linkmakeup.com';

      // Fetch all public user profiles
      const userProfiles = await db
        .select({ username: profiles.username, updatedAt: profiles.updatedAt })
        .from(profiles);

      const staticPages = [
        { url: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
        { url: `${baseUrl}/pricing`, priority: '0.95', changefreq: 'weekly' },
        { url: `${baseUrl}/login`, priority: '0.9', changefreq: 'monthly' },
        { url: `${baseUrl}/signup`, priority: '0.9', changefreq: 'monthly' },
        { url: `${baseUrl}/link-in-bio`, priority: '0.9', changefreq: 'weekly' },
        { url: `${baseUrl}/why-us`, priority: '0.85', changefreq: 'weekly' },
        { url: `${baseUrl}/server-specs`, priority: '0.7', changefreq: 'monthly' },
        { url: `${baseUrl}/features/digital-business-card`, priority: '0.9', changefreq: 'weekly' },
        { url: `${baseUrl}/features/nfc`, priority: '0.9', changefreq: 'weekly' },
        { url: `${baseUrl}/for/engineers`, priority: '0.85', changefreq: 'weekly' },
        { url: `${baseUrl}/for/linkedin-creators`, priority: '0.85', changefreq: 'weekly' },
        { url: `${baseUrl}/for/founders`, priority: '0.85', changefreq: 'weekly' },
        { url: `${baseUrl}/for/nfc-business-cards`, priority: '0.85', changefreq: 'weekly' },
        { url: `${baseUrl}/fr/carte-de-visite-digitale-maroc`, priority: '0.95', changefreq: 'weekly' },
        { url: `${baseUrl}/fr/carte-nfc-maroc`, priority: '0.9', changefreq: 'weekly' },
      ];

      const profilePages = userProfiles.map((p) => ({
        url: `${baseUrl}/${p.username}`,
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
        priority: '0.9',
        changefreq: 'weekly',
      }));

      const allPages = [...staticPages, ...profilePages];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq || 'weekly'}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.status(200).send(xml);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Dynamic robots.txt search engine directive
   */
  static async getRobotsTxt(req, res) {
    const host = req.headers.host || 'www.linkmakeup.com';
    const baseUrl = host.includes('localhost') ? `http://${host}` : 'https://www.linkmakeup.com';

    const txt = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /settings
Disallow: /onboarding
Disallow: /admin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(txt);
  }
}
