import { transporter } from '../config/mailer.js';

export class EmailService {
  /**
   * Helper to format sender header
   */
  static get fromHeader() {
    const name = process.env.EMAIL_FROM_NAME || 'LinkMakeup Support';
    const address = process.env.EMAIL_FROM_ADDRESS || 'support.linkmakeup@gmail.com';
    return `"${name}" <${address}>`;
  }

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
        <table width="540" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 24px; padding: 40px 32px; text-align: center; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size: 26px; font-weight: 800; color: #0F172A; tracking-tight: -0.5px;">
                    Link<span style="color: #059669;">Makeup.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="font-size: 22px; font-weight: 700; color: #0F172A; padding-bottom: 12px;">
              Verify Your Email Address
            </td>
          </tr>

          <!-- Subtitle -->
          <tr>
            <td style="font-size: 14px; color: #475569; line-height: 1.6; padding-bottom: 28px;">
              Hi @${username || 'creator'}, use the 6-digit verification code below to confirm your email and complete your LinkMakeup registration:
            </td>
          </tr>

          <!-- OTP Code Box -->
          <tr>
            <td align="center" style="padding-bottom: 28px;">
              <div style="display: inline-block; background-color: #F1F5F9; border: 1px solid #CBD5E1; border-radius: 16px; padding: 18px 36px; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #059669; font-family: 'Courier New', Courier, monospace;">
                ${code}
              </div>
            </td>
          </tr>

          <!-- Expiry Notice -->
          <tr>
            <td style="font-size: 12px; color: #64748B; border-top: 1px solid #F1F5F9; padding-top: 20px;">
              This verification code expires in 15 minutes. If you didn't request this code, you can safely ignore this email.
            </td>
          </tr>

        </table>

        <!-- Email Footer -->
        <table width="540" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; padding-top: 24px; text-align: center;">
          <tr>
            <td style="font-size: 11px; color: #94A3B8; line-height: 1.5;">
              © ${new Date().getFullYear()} LinkMakeup · All rights reserved.<br>
              Sent from <a href="mailto:support.linkmakeup@gmail.com" style="color: #059669; text-decoration: none;">support.linkmakeup@gmail.com</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return transporter.sendMail({
      from: this.fromHeader,
      to: email,
      subject,
      html,
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
          
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <table border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center" style="font-size: 32px; font-weight: 900; color: #0F172A; letter-spacing: -1px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    Link<span style="color: #059669;">Makeup</span><span style="color: #059669; font-size: 36px; line-height: 0;">.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Single-Line Welcome Headline (Mobile Optimized) -->
          <tr>
            <td align="center" style="font-size: 19px; font-weight: 800; color: #0F172A; white-space: nowrap; padding-bottom: 16px; line-height: 1.2;">
              Welcome to LinkMakeup! 🎉
            </td>
          </tr>

          <!-- Greeting Body Text -->
          <tr>
            <td style="font-size: 15px; color: #475569; line-height: 1.6; padding-bottom: 32px;">
              Hi <strong>${displayName || username}</strong>,<br><br>
              We're thrilled to have you onboard! Get started by setting up your bio link profile and claiming your custom subdomain.
            </td>
          </tr>

          <!-- Primary CTA Button -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <a href="${dashboardUrl}" style="display: inline-block; background-color: #059669; color: #FFFFFF; border-radius: 14px; padding: 16px 36px; font-size: 15px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);">
                Set Up Your Page in Dashboard →
              </a>
            </td>
          </tr>

          <!-- Divider & Support Note -->
          <tr>
            <td style="border-top: 1px solid #F1F5F9; padding-top: 24px; font-size: 13px; color: #64748B; line-height: 1.6;">
              Need help customizing your page or adding social links? Visit your dashboard anytime to update your profile.
            </td>
          </tr>

        </table>

        <!-- Footer -->
        <table width="560" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; padding-top: 24px; text-align: center;">
          <tr>
            <td style="font-size: 11px; color: #94A3B8; line-height: 1.5;">
              © ${new Date().getFullYear()} LinkMakeup · The link page that works with you.<br>
              Sent from <a href="mailto:support.linkmakeup@gmail.com" style="color: #059669; text-decoration: none;">support.linkmakeup@gmail.com</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return transporter.sendMail({
      from: this.fromHeader,
      to: email,
      subject,
      html,
    });
  }
}
