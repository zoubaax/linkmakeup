import { FaviconService } from '../services/favicon.service.js';

export class FaviconController {
  static async getFavicon(req, res) {
    const domain = FaviconService.normalizeDomain(req.query.domain);
    if (!FaviconService.isAllowedDomain(domain)) {
      return res.status(400).json({ success: false, message: 'Invalid domain.' });
    }

    const favicon = await FaviconService.resolveFavicon(domain);
    if (!favicon) {
      return res.status(404).json({ success: false, message: 'Favicon not found.' });
    }

    res.set({
      'Content-Type': favicon.contentType,
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });

    return res.send(favicon.buffer);
  }
}
