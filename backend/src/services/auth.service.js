import { db } from '../config/db.js';
import { users, profiles } from '../models/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/apiResponse.js';
import { toPublicUser } from '../utils/adminAccess.js';

export class AuthService {
  // 1. Email & Password Registration
  static async registerWithEmail(email, password, name) {
    const cleanEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    if (existingUser.length > 0) {
      throw new ApiError('An account with this email already exists.', 400);
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user record in Neon PostgreSQL
    const [newUser] = await db
      .insert(users)
      .values({
        email: cleanEmail,
        passwordHash,
        name: name || cleanEmail.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
      })
      .returning();

    return {
      user: toPublicUser(newUser),
      profile: null,
      isNewUser: true,
    };
  }

  // 2. Email & Password Login
  static async loginWithEmail(email, password) {
    const cleanEmail = email.toLowerCase().trim();

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    if (userResult.length === 0) {
      throw new ApiError('Invalid email or password', 401);
    }

    const user = userResult[0];

    if (!user.passwordHash) {
      throw new ApiError('This account was registered with Google OAuth. Please click "Continue with Google".', 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError('Invalid email or password', 401);
    }

    // Fetch user profile if exists
    const userProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1);

    return {
      user: toPublicUser(user),
      profile: userProfile[0] || null,
      isNewUser: !userProfile[0],
    };
  }

  // 3. Google OAuth User Lookup or Creation
  static async findOrCreateGoogleUser(googleProfile) {
    const { googleId, email, name, avatarUrl } = googleProfile;
    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    if (existingUser.length > 0) {
      const user = existingUser[0];
      
      const updateData = {};
      if (!user.googleId) updateData.googleId = googleId;
      if (avatarUrl && (!user.avatarUrl || user.avatarUrl.includes('dicebear'))) updateData.avatarUrl = avatarUrl;

      if (Object.keys(updateData).length > 0) {
        await db.update(users).set(updateData).where(eq(users.id, user.id));
      }

      const userProfile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, user.id))
        .limit(1);

      const profileData = userProfile[0] || null;
      if (profileData && avatarUrl && (!profileData.avatarUrl || profileData.avatarUrl.includes('dicebear'))) {
        await db.update(profiles).set({ avatarUrl }).where(eq(profiles.id, profileData.id));
        profileData.avatarUrl = avatarUrl;
      }

      return {
        user: toPublicUser({
          ...user,
          avatarUrl: updateData.avatarUrl || user.avatarUrl || avatarUrl,
        }),
        profile: profileData,
        isNewUser: !profileData,
      };
    }

    // Create new Google User in Neon PostgreSQL
    const [newUser] = await db
      .insert(users)
      .values({
        googleId,
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0],
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
      })
      .returning();

    return {
      user: toPublicUser(newUser),
      profile: null,
      isNewUser: true,
    };
  }
}
