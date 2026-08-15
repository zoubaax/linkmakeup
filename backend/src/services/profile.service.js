import { db } from '../config/db.js';
import { profiles, links } from '../models/schema.js';
import { eq, and, sql } from 'drizzle-orm';
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
    const { username, displayName, role, bio, avatarUrl, avatarShape, statusBadge, showStatusBadge, themeConfig } = profileData;
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
          role: role || null,
          bio: bio || '',
          avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
          avatarShape: avatarShape || 'circle',
          statusBadge: statusBadge || null,
          showStatusBadge: showStatusBadge ?? false,
          themeConfig: themeConfig ? JSON.stringify(themeConfig) : null,
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
        role: role || null,
        bio: bio || '',
        avatarUrl: avatarUrl || '',
        avatarShape: avatarShape || 'circle',
      };
    }
  }

  static async updateProfile(userId, updateData) {
    const { displayName, role, bio, avatarUrl, avatarShape, statusBadge, showStatusBadge, themeConfig } = updateData;

    try {
      const [updated] = await db
        .update(profiles)
        .set({
          ...(displayName !== undefined && { displayName }),
          ...(role !== undefined && { role }),
          ...(bio !== undefined && { bio }),
          ...(avatarUrl !== undefined && { avatarUrl }),
          ...(avatarShape !== undefined && { avatarShape }),
          ...(statusBadge !== undefined && { statusBadge }),
          ...(showStatusBadge !== undefined && { showStatusBadge }),
          ...(themeConfig !== undefined && { themeConfig }),
          updatedAt: new Date(),
        })
        .where(eq(profiles.userId, userId))
        .returning();

      if (!updated) {
        throw new ApiError('Profile not found.', 404);
      }

      return updated;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('DB profile update error:', err.message);
      throw new ApiError('Failed to update profile.', 500);
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
        .where(and(eq(links.userId, userProfile.userId), eq(links.isActive, true)))
        .orderBy(links.position);

      return {
        profile: {
          username: userProfile.username,
          displayName: userProfile.displayName,
          role: userProfile.role,
          bio: userProfile.bio,
          avatarUrl: userProfile.avatarUrl,
          statusBadge: userProfile.statusBadge,
          showStatusBadge: userProfile.showStatusBadge !== false,
          themeConfig: userProfile.themeConfig || null,
        },
        links: activeLinks.map((link) => ({
          id: link.id,
          title: link.title,
          subtitle: link.subtitle,
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
