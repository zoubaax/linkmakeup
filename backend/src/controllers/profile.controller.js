import { ProfileService } from '../services/profile.service.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { z } from 'zod';

const usernameParamSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
});

const createProfileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  displayName: z.string().min(1, 'Display Name is required').max(100),
  role: z.string().max(150).optional(),
  bio: z.string().max(250).optional(),
  avatarUrl: z.string().max(500_000, 'Avatar image is too large').optional(),
  avatarShape: z.enum(['circle', 'rounded', 'square']).optional(),
  avatarSize: z.enum(['small', 'medium', 'large']).optional(),
  statusBadge: z.string().max(150).optional(),
  showStatusBadge: z.boolean().optional(),
  themeConfig: z.object({
    preset: z.string().optional(),
    layoutStyle: z.string().optional(),
    backgroundColor: z.string().optional(),
    cardColor: z.string().optional(),
    accentColor: z.string().optional(),
    textColor: z.string().optional(),
  }).optional(),
});

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  role: z.string().max(150).optional(),
  bio: z.string().max(250).optional(),
  avatarUrl: z.string().max(500_000, 'Avatar image is too large').optional(),
  avatarShape: z.enum(['circle', 'rounded', 'square']).optional(),
  avatarSize: z.enum(['small', 'medium', 'large']).optional(),
  statusBadge: z.string().max(150).optional(),
  showStatusBadge: z.boolean().optional(),
  themeConfig: z.object({
    preset: z.string().optional(),
    layoutStyle: z.enum(['classic', 'minimal', 'glass', 'maximal', 'neo']).optional(),
    backgroundColor: z.string().optional(),
    cardColor: z.string().optional(),
    accentColor: z.string().optional(),
    textColor: z.string().optional(),
  }).optional(),
});

export class ProfileController {
  static async checkUsernameAvailability(req, res, next) {
    try {
      const { username } = req.query;
      if (!username) {
        throw new ApiError('Username query parameter is required', 400);
      }

      const parseResult = usernameParamSchema.safeParse({ username });
      if (!parseResult.success) {
        return ApiResponse.success(res, 'Invalid username format', {
          available: false,
          reason: parseResult.error.errors[0].message,
        });
      }

      const result = await ProfileService.checkAvailability(username);
      return ApiResponse.success(res, 'Availability checked', result);
    } catch (err) {
      next(err);
    }
  }

  static async createProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const validation = createProfileSchema.safeParse(req.body);

      if (!validation.success) {
        throw new ApiError('Validation error', 400, validation.error.flatten());
      }

      const profile = await ProfileService.createProfile(userId, validation.data);
      return ApiResponse.success(res, 'Profile created successfully', profile, 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const validation = updateProfileSchema.safeParse(req.body);

      if (!validation.success) {
        throw new ApiError('Validation error', 400, validation.error.flatten());
      }

      const updated = await ProfileService.updateProfile(userId, validation.data);
      if (!updated) {
        throw new ApiError('Profile not found.', 404);
      }
      return ApiResponse.success(res, 'Profile updated successfully', updated);
    } catch (err) {
      next(err);
    }
  }

  static async getPublicProfile(req, res, next) {
    try {
      const { username } = req.params;
      const parseResult = usernameParamSchema.safeParse({ username });
      
      if (!parseResult.success) {
        throw new ApiError('Invalid username format', 400);
      }

      const profileData = await ProfileService.getPublicProfileByUsername(username);
      
      if (!profileData) {
        throw new ApiError(`Profile for username '${username}' was not found`, 404);
      }

      return ApiResponse.success(res, 'Profile retrieved successfully', profileData);
    } catch (err) {
      next(err);
    }
  }

  static async checkOgRoute(req, res, next) {
    try {
      const rawHost = req.headers['x-forwarded-host'] || req.headers.host || '';
      const host = rawHost.split(',')[0].trim().split(':')[0];
      const path = req.headers['x-matched-path'] || req.headers['x-forwarded-uri'] || req.url || '';

      let username = null;
      const domainParts = host.split('.');

      // 1. Check subdomain: e.g. mee.linkmakeup.com -> username = "mee"
      if (domainParts.length >= 3 && !['www', 'api', 'app', 'localhost'].includes(domainParts[0])) {
        username = domainParts[0].toLowerCase();
      }

      // 2. Check path: e.g. linkmakeup.com/mee -> username = "mee"
      if (!username) {
        const match = path.match(/^\/(?:u\/)?([a-zA-Z0-9_-]+)/);
        if (match && !['api', 'dashboard', 'login', 'register', 'settings', 'profiles'].includes(match[1].toLowerCase())) {
          username = match[1].toLowerCase();
        }
      }

      // 3. Check query param: e.g. check-og?u=mee
      if (!username && req.query.u) {
        username = String(req.query.u).toLowerCase();
      }

      if (username) {
        req.params = { username };
        return ProfileController.getPublicProfileOgHtml(req, res, next);
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send('<!DOCTYPE html><html><head><title>LinkMakeup — Create Your Bio Link Page</title><meta property="og:title" content="LinkMakeup — Create Your Bio Link Page"><meta property="og:description" content="Create your custom bio link page, showcase social links, portfolio, and custom themes."><meta property="og:type" content="website"></head><body>LinkMakeup</body></html>');
    } catch (err) {
      next(err);
    }
  }

  static async getPublicProfileOgHtml(req, res, next) {
    try {
      const { username } = req.params;
      const profileData = await ProfileService.getPublicProfileByUsername(username);

      if (!profileData || !profileData.profile) {
        return res.status(404).send('<!DOCTYPE html><html><head><title>Profile Not Found | LinkMakeup</title></head><body>Profile Not Found</body></html>');
      }

      const p = profileData.profile;

      // Construct Title: "Display Name · Job Title"
      const ogTitle = p.displayName
        ? p.role
          ? `${p.displayName} · ${p.role}`
          : p.displayName
        : username;

      const pageTitle = `${ogTitle} | LinkMakeup`;

      // Construct Description: "Job Title — Bio"
      const description = p.role
        ? `${p.role}${p.bio ? ` — ${p.bio}` : ''}`
        : p.bio || `Check out ${p.displayName || username}'s bio link page on LinkMakeup.`;

      // Ensure valid absolute HTTPS image URL for WhatsApp / iMessage scrapers (WhatsApp ignores base64 & SVG thumbnails)
      let image = p.avatarUrl;
      if (!image || image.startsWith('data:')) {
        image = `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(username)}&size=512`;
      } else if (image.startsWith('/')) {
        image = `https://${req.headers['x-original-host'] || req.headers.host || 'linkmakeup.com'}${image}`;
      }

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph / WhatsApp / iMessage / Facebook -->
  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="LinkMakeup">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:width" content="600">
  <meta property="og:image:height" content="600">
  <meta property="og:url" content="https://${req.headers['x-original-host'] || req.headers.host || 'linkmakeup.com'}/">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  
  <!-- Favicon / Apple Touch Icon for WhatsApp & iMessage preview thumbnails -->
  <link rel="icon" href="${image}">
  <link rel="apple-touch-icon" href="${image}">
</head>
<body style="font-family:system-ui,sans-serif;padding:2rem;text-align:center;background:#0f172a;color:#fff;">
  <img src="${image}" alt="${p.displayName || username}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin-bottom:1rem;" />
  <h1 style="margin:0 0 0.5rem;font-size:1.75rem;">${p.displayName || username}</h1>
  ${p.role ? `<p style="font-size:1.1rem;color:#10b981;font-weight:600;margin:0 0 0.5rem;">${p.role}</p>` : ''}
  ${p.bio ? `<p style="color:#94a3b8;max-width:400px;margin:0 auto 1.5rem;">${p.bio}</p>` : ''}
  <a href="https://${req.headers['x-original-host'] || req.headers.host || 'linkmakeup.com'}/" style="display:inline-block;padding:0.75rem 1.5rem;background:#10b981;color:#fff;text-decoration:none;border-radius:99px;font-weight:700;">View Profile Links</a>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    } catch (err) {
      next(err);
    }
  }
}
