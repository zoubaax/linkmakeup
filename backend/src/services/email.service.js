import path from 'path';
import fs from 'fs';
import { sendEmail } from '../config/mailer.js';

function getLogoAttachment() {
  return {
    path: 'https://www.linkmakeup.com/card-logo.png',
    filename: 'logo.png',
    contentId: 'logo-image',
  };
}

export class EmailService {
  /**
   * Send 6-Digit Verification OTP Code Email (Email + Password signups)
   */
  static async sendVerificationCodeEmail({ email, username, code }) {
    const subject = `${code} is your LinkMakeup verification code`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="560" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 24px; padding: 44px 32px; text-align: center; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          
          <!-- Logo Header using CID -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <img src="cid:logo-image" alt="LinkMakeup Logo" style="height: 38px; width: auto; max-width: 180px; border: 0; outline: none; text-decoration: none;" />
            </td>
          </tr>

          <!-- Single Line Headline -->
          <tr>
            <td style="font-size: 22px; font-weight: 800; color: #0F172A; padding-bottom: 12px; white-space: nowrap;">
              Verify Your Email Address 🔒
            </td>
          </tr>

          <!-- Greeting & Instructions -->
          <tr>
            <td style="font-size: 14px; color: #475569; line-height: 1.6; padding-bottom: 28px;">
              Welcome to LinkMakeup, <strong>@${username}</strong>! Enter the 6-digit code below to verify your account:
            </td>
          </tr>

          <!-- 6-Digit OTP Pill -->
          <tr>
            <td align="center" style="padding-bottom: 28px;">
              <div style="display: inline-block; background-color: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 16px; padding: 18px 36px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #059669;">
                ${code}
              </div>
            </td>
          </tr>

          <!-- Security Expiry Note -->
          <tr>
            <td style="font-size: 12px; color: #64748B; line-height: 1.5; padding-bottom: 24px;">
              This code will expire in <strong>15 minutes</strong>. If you did not request this email, please ignore it.
            </td>
          </tr>

        </table>

        <!-- Email Footer -->
        <table width="560" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; padding-top: 24px; text-align: center;">
          <tr>
            <td style="font-size: 11px; color: #94A3B8; line-height: 1.5;">
              © ${new Date().getFullYear()} LinkMakeup · All rights reserved.<br>
              Sent from <a href="mailto:support@linkmakeup.com" style="color: #059669; text-decoration: none;">support@linkmakeup.com</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return sendEmail({
      to: email,
      subject,
      html,
      attachments: [getLogoAttachment()],
    });
  }

  /**
   * Send Pure Welcome Email (Clean White Light-Mode Template)
   */
  static async sendWelcomeWalletEmail({ email, username, displayName }) {
    const appDomain = process.env.CLIENT_URL || 'http://localhost:5173';
    const dashboardUrl = `${appDomain}/dashboard`;

    const subject = `Welcome to LinkMakeup, ${displayName || username}! 🚀`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to LinkMakeup</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="560" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 24px; padding: 44px 32px; text-align: center; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          
          <!-- Logo Header using CID -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <img src="cid:logo-image" alt="LinkMakeup Logo" style="height: 38px; width: auto; max-width: 180px; border: 0; outline: none; text-decoration: none;" />
            </td>
          </tr>

          <!-- Single Line Headline -->
          <tr>
            <td style="font-size: 19px; font-weight: 800; color: #0F172A; padding-bottom: 12px; white-space: nowrap;">
              Welcome to LinkMakeup! 🎉
            </td>
          </tr>

          <!-- Subtitle / Greeting -->
          <tr>
            <td style="font-size: 14px; color: #475569; line-height: 1.6; padding-bottom: 28px;">
              Hi <strong>${displayName || username}</strong>, your account is verified! You can now build your custom bio link profile and share all your links in one place.
            </td>
          </tr>

          <!-- Single Dashboard CTA Button -->
          <tr>
            <td align="center" style="padding-bottom: 28px;">
              <a href="${dashboardUrl}" style="display: inline-block; background-color: #059669; color: #FFFFFF; border-radius: 14px; padding: 14px 28px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);">
                Set Up Your Page in Dashboard →
              </a>
            </td>
          </tr>

          <!-- Help Footer -->
          <tr>
            <td style="font-size: 12px; color: #64748B; border-top: 1px solid #F1F5F9; padding-top: 20px;">
              Need help? Simply reply to this email and our team will get back to you!
            </td>
          </tr>

        </table>

        <!-- Email Footer -->
        <table width="560" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; padding-top: 24px; text-align: center;">
          <tr>
            <td style="font-size: 11px; color: #94A3B8;">
              © ${new Date().getFullYear()} LinkMakeup · Sent from <a href="mailto:support@linkmakeup.com" style="color: #059669; text-decoration: none;">support@linkmakeup.com</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return sendEmail({
      to: email,
      subject,
      html,
      attachments: [getLogoAttachment()],
    });
  }
}
