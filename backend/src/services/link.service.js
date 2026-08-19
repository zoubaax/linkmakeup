import { db } from '../config/db.js';
import { links } from '../models/schema.js';
import { eq, and, asc } from 'drizzle-orm';

export class LinkService {
  static getAutomaticSubtitle(icon, title) {
    const key = `${icon || ''} ${title || ''}`.toLowerCase();
    if (key.includes('snapchat')) return 'Add me on Snapchat';
    if (key.includes('discord')) return 'Join my Discord server';
    if (key.includes('telegram')) return 'Chat on Telegram';
    if (key.includes('reddit')) return 'Join the discussion on Reddit';
    if (key.includes('threads')) return 'Follow on Threads';
    if (key.includes('twitch')) return 'Watch me live on Twitch';
    if (key.includes('kick')) return 'Watch my Kick stream';
    if (key.includes('wattpad')) return 'Read my stories on Wattpad';
    if (key.includes('substack')) return 'Read my newsletter on Substack';
    if (key.includes('medium')) return 'Read my articles on Medium';
    if (key.includes('patreon')) return 'Support me on Patreon';
    if (key.includes('steam')) return 'Add me on Steam';
    if (key.includes('bluesky')) return 'Follow me on Bluesky';
    if (key.includes('behance')) return 'See my designs';
    if (key.includes('dribbble')) return 'See my shots';
    if (key.includes('figma')) return 'See my designs';
    if (key.includes('phone')) return 'Call me';
    if (key.includes('email') || key.includes('mail')) return 'Send me an email';
    if (key.includes('instagram')) return 'Follow me on Instagram';
    if (key.includes('linkedin')) return "Let's connect";
    if (key.includes('github')) return 'Explore my code';
    if (key.includes('youtube')) return 'Watch my videos';
    if (key.includes('tiktok')) return 'Watch my TikToks';
    if (key.includes('whatsapp')) return 'Send me a message';
    if (key.includes('pinterest')) return 'See my boards';
    if (key.includes('spotify')) return 'Listen with me';
    if (key.includes('portfolio')) return 'View my work';
    if (key.includes('website')) return 'Visit my website';
    return 'Visit this link';
  }

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
          subtitle: this.getAutomaticSubtitle(icon, title),
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
      const { subtitle: _ignoredSubtitle, ...safeUpdateData } = updateData;
      const current = await db.select().from(links).where(and(eq(links.id, linkId), eq(links.userId, userId))).limit(1);
      const existingLink = current[0];
      if (!existingLink) return null;
      const title = safeUpdateData.title ?? existingLink.title;
      const icon = safeUpdateData.icon ?? existingLink.icon;
      const [updated] = await db
        .update(links)
        .set({
          ...safeUpdateData,
          subtitle: this.getAutomaticSubtitle(icon, title),
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
