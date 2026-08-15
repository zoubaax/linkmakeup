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
  statusBadge: z.string().max(150).optional(),
  showStatusBadge: z.boolean().optional(),
});

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  role: z.string().max(150).optional(),
  bio: z.string().max(250).optional(),
  avatarUrl: z.string().max(500_000, 'Avatar image is too large').optional(),
  statusBadge: z.string().max(150).optional(),
  showStatusBadge: z.boolean().optional(),
  themeConfig: z.object({
    preset: z.string().optional(),
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
}
