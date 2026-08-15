import { AuthService } from '../services/auth.service.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { env } from '../config/env.js';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import { db } from '../config/db.js';
import { profiles } from '../models/schema.js';
import { eq } from 'drizzle-orm';

const googleClient = new OAuth2Client(
  env.googleClientId,
  env.googleClientSecret
);

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  // 1. Email & Password Sign Up
  static async signup(req, res, next) {
    try {
      const validation = signupSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ApiError('Validation error', 400, validation.error.flatten());
      }

      const { email, password, name } = validation.data;
      const result = await AuthService.registerWithEmail(email, password, name);

      res.cookie('session_token', `session_${result.user.id}`, {
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: 'lax',
        domain: env.cookieDomain === 'localhost' ? 'localhost' : '.linkmakeup.com',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return ApiResponse.success(res, 'Account created successfully', result, 201);
    } catch (err) {
      next(err);
    }
  }

  // 2. Email & Password Login
  static async login(req, res, next) {
    try {
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ApiError('Validation error', 400, validation.error.flatten());
      }

      const { email, password } = validation.data;
      const result = await AuthService.loginWithEmail(email, password);

      res.cookie('session_token', `session_${result.user.id}`, {
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: 'lax',
        domain: env.cookieDomain === 'localhost' ? 'localhost' : '.linkmakeup.com',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return ApiResponse.success(res, 'Logged in successfully', result);
    } catch (err) {
      next(err);
    }
  }

  // 3. Initiate Google OAuth Redirect
  static async getGoogleAuthUrl(req, res, next) {
    try {
      const redirectBackendUri = `${env.backendUrl}/api/v1/auth/google/callback`;

      if (!env.googleClientId) {
        throw new ApiError('Google Client ID is not configured in backend environment.', 500);
      }

      const googleUrl = googleClient.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
        ],
        redirect_uri: redirectBackendUri,
      });

      return ApiResponse.success(res, 'Google Auth URL generated', { url: googleUrl });
    } catch (err) {
      next(err);
    }
  }

  // 4. Handle Google OAuth Callback
  static async handleGoogleCallback(req, res, next) {
    try {
      const { code } = req.query;

      if (!code) {
        throw new ApiError('Authorization code missing from Google callback.', 400);
      }

      const redirectBackendUri = `${env.backendUrl}/api/v1/auth/google/callback`;
      const { tokens } = await googleClient.getToken({
        code,
        redirect_uri: redirectBackendUri,
      });
      googleClient.setCredentials(tokens);

      const userinfo = await googleClient.request({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });

      const googleProfile = {
        googleId: userinfo.data.sub,
        email: userinfo.data.email,
        name: userinfo.data.name || userinfo.data.email.split('@')[0],
        avatarUrl: userinfo.data.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userinfo.data.email)}`,
      };

      const result = await AuthService.findOrCreateGoogleUser(googleProfile);

      res.cookie('session_token', `session_${result.user.id}`, {
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: 'lax',
        domain: env.cookieDomain === 'localhost' ? 'localhost' : '.linkmakeup.com',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Redirect back to frontend
      return res.redirect(`${env.clientUrl}?authenticated=true`);
    } catch (err) {
      console.error('❌ Google OAuth Callback Error:', err.message || err);
      // Redirect to frontend login page gracefully instead of showing raw 400 crash page
      return res.redirect(`${env.clientUrl}/login?error=google_auth_failed`);
    }
  }

  // 5. Fetch Current User Identity + Profile
  static async getCurrentUser(req, res, next) {
    try {
      const user = req.user;

      res.set('Cache-Control', 'no-store');

      // Also fetch the user's profile to determine if onboarding is complete
      const profileResult = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, user.id))
        .limit(1);

      const profile = profileResult[0] || null;

      return ApiResponse.success(res, 'Current authenticated user retrieved', {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        profile,
      });
    } catch (err) {
      next(err);
    }
  }

  // 6. Logout Action
  static async logout(req, res, next) {
    try {
      res.clearCookie('session_token', {
        domain: env.cookieDomain === 'localhost' ? 'localhost' : '.linkmakeup.com',
      });
      return ApiResponse.success(res, 'Logged out successfully');
    } catch (err) {
      next(err);
    }
  }
}
