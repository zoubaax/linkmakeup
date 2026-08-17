import { WalletService } from '../services/wallet.service.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { db } from '../config/db.js';
import { profiles } from '../models/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '../config/env.js';

export class WalletController {
  /**
   * Serve Apple Wallet (.pkpass) direct file download
   */
  static async getApplePass(req, res, next) {
    try {
      const { username } = req.params;
      if (!username) throw new ApiError('Username required', 400);

      const profileResult = await db
        .select()
        .from(profiles)
        .where(eq(profiles.username, username.toLowerCase()))
        .limit(1);

      if (profileResult.length === 0) {
        throw new ApiError('Profile not found', 404);
      }

      const profile = profileResult[0];
      const publicUrl = `${env.clientUrl}/${profile.username}`;
      const passBuffer = await WalletService.createApplePassBuffer(profile, publicUrl);

      res.set({
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="${profile.username}-linkmakeup.pkpass"`,
        'Content-Length': passBuffer.length,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      });

      return res.send(passBuffer);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Redirect to Google Wallet Save URL
   */
  static async getGooglePass(req, res, next) {
    try {
      const { username } = req.params;
      if (!username) throw new ApiError('Username required', 400);

      const publicUrl = `${env.clientUrl}/${username}`;
      const googleUrl = WalletService.getGoogleWalletUrl(username, publicUrl);

      return res.redirect(googleUrl);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Send Wallet Card pass to any specified email
   */
  static async sendWalletEmail(req, res, next) {
    try {
      const { recipientEmail, username } = req.body;
      if (!recipientEmail || !username) {
        throw new ApiError('Recipient email and username are required', 400);
      }

      const profileResult = await db
        .select()
        .from(profiles)
        .where(eq(profiles.username, username.toLowerCase()))
        .limit(1);

      if (profileResult.length === 0) {
        throw new ApiError('Profile not found', 404);
      }

      const profile = profileResult[0];
      const publicUrl = `${env.clientUrl}/${profile.username}`;

      await WalletService.sendWalletCardToEmail({
        recipientEmail,
        profile,
        publicUrl,
      });

      return ApiResponse.success(res, `Wallet card sent to ${recipientEmail}`);
    } catch (err) {
      next(err);
    }
  }
}
