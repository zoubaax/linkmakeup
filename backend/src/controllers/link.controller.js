import { LinkService } from '../services/link.service.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { z } from 'zod';

const createLinkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  subtitle: z.string().max(255).optional(),
  url: z.string().url('Must be a valid URL'),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
});

const updateLinkSchema = createLinkSchema.partial();

const reorderSchema = z.object({
  linkIds: z.array(z.string().uuid()),
});

export class LinkController {
  static async getUserLinks(req, res, next) {
    try {
      const userId = req.user.id;
      const links = await LinkService.getUserLinks(userId);
      return ApiResponse.success(res, 'User links fetched successfully', links);
    } catch (err) {
      next(err);
    }
  }

  static async createLink(req, res, next) {
    try {
      const userId = req.user.id;
      const validation = createLinkSchema.safeParse(req.body);

      if (!validation.success) {
        throw new ApiError('Validation error', 400, validation.error.flatten());
      }

      const newLink = await LinkService.createLink(userId, validation.data);
      return ApiResponse.success(res, 'Link created successfully', newLink, 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateLink(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const validation = updateLinkSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ApiError('Validation error', 400, validation.error.flatten());
      }

      const updatedLink = await LinkService.updateLink(userId, id, validation.data);
      if (!updatedLink) {
        throw new ApiError('Link not found or user unauthorized', 444);
      }

      return ApiResponse.success(res, 'Link updated successfully', updatedLink);
    } catch (err) {
      next(err);
    }
  }

  static async deleteLink(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const success = await LinkService.deleteLink(userId, id);
      if (!success) {
        throw new ApiError('Link not found or user unauthorized', 404);
      }

      return ApiResponse.success(res, 'Link deleted successfully');
    } catch (err) {
      next(err);
    }
  }

  static async reorderLinks(req, res, next) {
    try {
      const userId = req.user.id;
      const validation = reorderSchema.safeParse(req.body);

      if (!validation.success) {
        throw new ApiError('Invalid payload for reordering', 400, validation.error.flatten());
      }

      const reorderedLinks = await LinkService.reorderLinks(userId, validation.data.linkIds);
      return ApiResponse.success(res, 'Links reordered successfully', reorderedLinks);
    } catch (err) {
      next(err);
    }
  }
}
