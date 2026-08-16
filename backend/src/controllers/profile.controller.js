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

  static async getPublicProfileOgHtml(req, res, next) {
    try {
      const { username } = req.params;
      const profileData = await ProfileService.getPublicProfileByUsername(username);

      if (!profileData || !profileData.profile) {
        return res.status(404).send('<!DOCTYPE html><html><head><title>Linktree Profile Not Found</title></head><body>Profile Not Found</body></html>');
      }

      const p = profileData.profile;
      const title = p.displayName
        ? p.role
          ? `${p.displayName} — ${p.role}`
          : `${p.displayName} | LinkMakeup`
        : 'LinkMakeup';

      const ogTitle = p.displayName
        ? p.role
          ? `${p.displayName} · ${p.role}`
          : p.displayName
        : 'LinkMakeup';

      const description = p.role
        ? `${p.role}${p.bio ? ` — ${p.bio}` : ''}`
        : p.bio || `Check out ${p.displayName || username}'s bio link page on LinkMakeup.`;

      const image = p.avatarUrl || 'https://linkmakeup.com/logo-d.png';

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:site_name" content="LinkMakeup">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:type" content="profile">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
</head>
<body>
  <h1>${ogTitle}</h1>
  <p>${description}</p>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    } catch (err) {
      next(err);
    }
  }
}
