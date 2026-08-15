import { ProfileService } from '../services/profile.service.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { z } from 'zod';

const usernameParamSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain alphanumeric characters, underscores, and hyphens'),
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
