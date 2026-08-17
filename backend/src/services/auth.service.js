import { db } from '../config/db.js';
import { users, profiles } from '../models/schema.js';
import { eq, and, gt } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/apiResponse.js';
import { EmailService } from './email.service.js';

export class AuthService {
  /**
   * Helper to generate a 6-digit numeric OTP code
   */
  static generateOtpCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

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
      if (existingUser[0].emailVerified) {
        throw new ApiError('An account with this email already exists. Please sign in.', 400);
      }
      // If user exists but is unverified, re-generate code and update password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const code = this.generateOtpCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await db
        .update(users)
        .set({
          passwordHash,
          name: name || cleanEmail.split('@')[0],
          verificationCode: code,
          verificationCodeExpiresAt: expiresAt,
        })
        .where(eq(users.id, existingUser[0].id));

      // Send OTP code via email
      try {
        await EmailService.sendVerificationCodeEmail({
          email: cleanEmail,
          username: cleanEmail.split('@')[0],
          code,
        });
      } catch (e) {
        console.error('⚠️ Could not dispatch OTP email:', e.message);
      }

      return {
        requiresVerification: true,
        email: cleanEmail,
        userId: existingUser[0].id,
      };
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const code = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Create new user record in Neon PostgreSQL
    const [newUser] = await db
      .insert(users)
      .values({
        email: cleanEmail,
        passwordHash,
        name: name || cleanEmail.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
        emailVerified: false,
        verificationCode: code,
        verificationCodeExpiresAt: expiresAt,
      })
      .returning();

    // Send OTP code via email
    try {
      await EmailService.sendVerificationCodeEmail({
        email: cleanEmail,
        username: cleanEmail.split('@')[0],
        code,
      });
    } catch (e) {
      console.error('⚠️ Could not dispatch OTP email:', e.message);
    }

    return {
      requiresVerification: true,
      email: cleanEmail,
      userId: newUser.id,
    };
  }

  // 2. Verify 6-Digit Email OTP Code
  static async verifyEmailCode(email, code) {
    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.toString().trim();

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    if (userResult.length === 0) {
      throw new ApiError('User account not found', 404);
    }

    const user = userResult[0];

    if (user.emailVerified) {
      return { user, verified: true };
    }

    if (!user.verificationCode || user.verificationCode !== cleanCode) {
      throw new ApiError('Invalid verification code. Please check your email and try again.', 400);
    }

    if (user.verificationCodeExpiresAt && new Date(user.verificationCodeExpiresAt) < new Date()) {
      throw new ApiError('Verification code has expired. Please request a new code.', 400);
    }

    // Mark email as verified & clear code
    const [updatedUser] = await db
      .update(users)
      .set({
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpiresAt: null,
      })
      .where(eq(users.id, user.id))
      .returning();

    // Trigger welcome email asynchronously
    const userProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1);

    const profileData = userProfile[0] || null;
    const appDomain = process.env.CLIENT_URL || 'http://localhost:5173';
    const publicUrl = profileData ? `${appDomain}/${profileData.username}` : appDomain;

    EmailService.sendWelcomeWalletEmail({
      email: updatedUser.email,
      username: profileData?.username || updatedUser.name || updatedUser.email.split('@')[0],
      displayName: profileData?.displayName || updatedUser.name,
      publicUrl,
    }).catch((e) => console.error('⚠️ Could not send Welcome Wallet Email:', e.message));

    return {
      user: updatedUser,
      profile: profileData,
      isNewUser: !profileData,
    };
  }

  // 3. Resend OTP Code
  static async resendVerificationCode(email) {
    const cleanEmail = email.toLowerCase().trim();

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    if (userResult.length === 0) {
      throw new ApiError('User account not found', 404);
    }

    const user = userResult[0];

    if (user.emailVerified) {
      throw new ApiError('This email address is already verified.', 400);
    }

    const code = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db
      .update(users)
      .set({
        verificationCode: code,
        verificationCodeExpiresAt: expiresAt,
      })
      .where(eq(users.id, user.id));

    await EmailService.sendVerificationCodeEmail({
      email: cleanEmail,
      username: cleanEmail.split('@')[0],
      code,
    });

    return { sent: true };
  }

  // 4. Email & Password Login
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

    // Check if email is verified
    if (!user.emailVerified) {
      // Re-send code and prompt frontend to open OTP verification modal
      const code = this.generateOtpCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await db
        .update(users)
        .set({
          verificationCode: code,
          verificationCodeExpiresAt: expiresAt,
        })
        .where(eq(users.id, user.id));

      EmailService.sendVerificationCodeEmail({
        email: cleanEmail,
        username: cleanEmail.split('@')[0],
        code,
      }).catch((e) => console.error('⚠️ Could not send verification email on login:', e.message));

      throw new ApiError('Please verify your email address to log in. A new 6-digit code has been sent to your email.', 403, {
        requiresVerification: true,
        email: cleanEmail,
      });
    }

    // Fetch user profile if exists
    const userProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      profile: userProfile[0] || null,
      isNewUser: !userProfile[0],
    };
  }

  // 5. Google OAuth User Lookup or Creation (Instant Verification)
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
      
      const updateData = { emailVerified: true };
      if (!user.googleId) updateData.googleId = googleId;
      if (avatarUrl && (!user.avatarUrl || user.avatarUrl.includes('dicebear'))) updateData.avatarUrl = avatarUrl;

      await db.update(users).set(updateData).where(eq(users.id, user.id));

      const userProfile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, user.id))
        .limit(1);

      const profileData = userProfile[0] || null;

      return {
        user: { id: user.id, email: user.email, name: user.name, avatarUrl: updateData.avatarUrl || user.avatarUrl || avatarUrl },
        profile: profileData,
        isNewUser: !profileData,
      };
    }

    // Create new Google User in Neon PostgreSQL with emailVerified: true
    const [newUser] = await db
      .insert(users)
      .values({
        googleId,
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0],
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
        emailVerified: true,
      })
      .returning();

    // Trigger Welcome Email for Google signups
    const appDomain = process.env.CLIENT_URL || 'http://localhost:5173';
    EmailService.sendWelcomeWalletEmail({
      email: newUser.email,
      username: newUser.name || newUser.email.split('@')[0],
      displayName: newUser.name,
      publicUrl: appDomain,
    }).catch((e) => console.error('⚠️ Could not send Google Welcome Wallet Email:', e.message));

    return {
      user: { id: newUser.id, email: newUser.email, name: newUser.name, avatarUrl: newUser.avatarUrl },
      profile: null,
      isNewUser: true,
    };
  }
}

