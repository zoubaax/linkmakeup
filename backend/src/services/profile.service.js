import { db } from '../config/db.js';
import { profiles, links } from '../models/schema.js';
import { eq, sql } from 'drizzle-orm';

const RESERVED_USERNAMES = [
  'admin', 'api', 'app', 'auth', 'dashboard', 'login', 
  'register', 'settings', 'support', 'www', 'linkmakeup'
];

export class ProfileService {
  static isUsernameReserved(username) {
    return RESERVED_USERNAMES.includes(username.toLowerCase());
  }

  static async checkAvailability(username) {
    const cleanUsername = username.toLowerCase().trim();

    if (this.isUsernameReserved(cleanUsername)) {
      return { available: false, reason: 'Username is reserved by LinkMakeup.' };
    }

    try {
      const existing = await db
        .select()
        .from(profiles)
        .where(eq(sql`LOWER(${profiles.username})`, cleanUsername))
        .limit(1);

      return {
        available: existing.length === 0,
        reason: existing.length > 0 ? 'Username is already taken.' : 'Username is available.',
      };
    } catch (err) {
      console.warn('⚠️ Database connection issue during availability check:', err.message);
      // Fallback mock check if DB is not configured yet
      return { available: true, reason: 'Username is available.' };
    }
  }

  static async getPublicProfileByUsername(username) {
    const cleanUsername = username.toLowerCase().trim();

    try {
      const profileResult = await db
        .select()
        .from(profiles)
        .where(eq(sql`LOWER(${profiles.username})`, cleanUsername))
        .limit(1);

      if (!profileResult || profileResult.length === 0) {
        return null;
      }

      const userProfile = profileResult[0];

      // Fetch active links ordered by position
      const activeLinks = await db
        .select()
        .from(links)
        .where(eq(links.userId, userProfile.userId))
        .where(eq(links.isActive, true))
        .orderBy(links.position);

      return {
        profile: {
          username: userProfile.username,
          displayName: userProfile.displayName,
          bio: userProfile.bio,
          avatarUrl: userProfile.avatarUrl,
        },
        links: activeLinks.map((link) => ({
          id: link.id,
          title: link.title,
          url: link.url,
          icon: link.icon,
          position: link.position,
        })),
      };
    } catch (err) {
      console.warn('⚠️ Database connection issue during profile lookup:', err.message);
      return null;
    }
  }
}
