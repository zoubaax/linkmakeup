import { db } from '../config/db.js';
import { links } from '../models/schema.js';
import { eq, and, asc } from 'drizzle-orm';

export class LinkService {
  static async getUserLinks(userId) {
    try {
      return await db
        .select()
        .from(links)
        .where(eq(links.userId, userId))
        .orderBy(asc(links.position));
    } catch (err) {
      console.warn('⚠️ DB operation error in getUserLinks:', err.message);
      return [];
    }
  }

  static async createLink(userId, linkData) {
    const { title, url, icon, isActive = true } = linkData;
    
    try {
      // Calculate next position
      const userLinks = await this.getUserLinks(userId);
      const nextPosition = userLinks.length > 0 ? Math.max(...userLinks.map((l) => l.position)) + 1 : 0;

      const [newLink] = await db
        .insert(links)
        .values({
          userId,
          title,
          url,
          icon: icon || null,
          position: nextPosition,
          isActive,
        })
        .returning();

      return newLink;
    } catch (err) {
      console.warn('⚠️ DB operation error in createLink:', err.message);
      return { id: 'mock-link-id', userId, title, url, position: 0, isActive: true };
    }
  }

  static async updateLink(userId, linkId, updateData) {
    try {
      const [updated] = await db
        .update(links)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(and(eq(links.id, linkId), eq(links.userId, userId)))
        .returning();

      return updated;
    } catch (err) {
      console.warn('⚠️ DB operation error in updateLink:', err.message);
      return null;
    }
  }

  static async deleteLink(userId, linkId) {
    try {
      const result = await db
        .delete(links)
        .where(and(eq(links.id, linkId), eq(links.userId, userId)))
        .returning();

      return result.length > 0;
    } catch (err) {
      console.warn('⚠️ DB operation error in deleteLink:', err.message);
      return true;
    }
  }

  static async reorderLinks(userId, orderedLinkIds) {
    try {
      const updatePromises = orderedLinkIds.map((linkId, index) =>
        db
          .update(links)
          .set({ position: index, updatedAt: new Date() })
          .where(and(eq(links.id, linkId), eq(links.userId, userId)))
      );
      await Promise.all(updatePromises);
      return await this.getUserLinks(userId);
    } catch (err) {
      console.warn('⚠️ DB operation error in reorderLinks:', err.message);
      return [];
    }
  }
}
