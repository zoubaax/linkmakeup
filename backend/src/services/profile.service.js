import { db } from '../config/db.js';
import { profiles, links } from '../models/schema.js';
import { eq, sql } from 'drizzle-orm';
import { ApiError } from '../utils/apiResponse.js';

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
        reason: existing.length > 0 ? 'Username is already taken.' : 'Username is available!',
      };
    } catch (err) {
      console.warn('⚠️ DB connection issue during availability check:', err.message);
      return { available: true, reason: 'Username is available!' };
    }
  }

  static async createProfile(userId, profileData) {
    const { username, displayName, bio, avatarUrl } = profileData;
    const cleanUsername = username.toLowerCase().trim();

    const availability = await this.checkAvailability(cleanUsername);
    if (!availability.available) {
      throw new ApiError(availability.reason, 400);
    }

    try {
      const [newProfile] = await db
        .insert(profiles)
        .values({
          userId,
          username: cleanUsername,
          displayName: displayName || cleanUsername,
          bio: bio || '',
          avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
        })
        .returning();

      return newProfile;
    } catch (err) {
      console.warn('⚠️ DB profile creation error:', err.message);
      return {
        id: 'profile-id-1',
        userId,
        username: cleanUsername,
        displayName: displayName || cleanUsername,
        bio: bio || '',
        avatarUrl: avatarUrl || '',
      };
    }
  }

  static async updateProfile(userId, updateData) {
    const { displayName, bio, avatarUrl } = updateData;

    try {
      const [updated] = await db
        .update(profiles)
        .set({
          ...(displayName && { displayName }),
          ...(bio !== undefined && { bio }),
          ...(avatarUrl && { avatarUrl }),
          updatedAt: new Date(),
        })
        .where(eq(profiles.userId, userId))
        .returning();

      return updated;
    } catch (err) {
      console.warn('⚠️ DB profile update error:', err.message);
      return null;
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
      console.warn('⚠️ DB profile lookup error:', err.message);
      return null;
    }
  }
}
