import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { ZipArchive } from 'archiver';
import { transporter } from '../config/mailer.js';

// Helper to get Google Service Account Private Key
function getGoogleServiceAccountKey() {
  try {
    const keyPath = path.resolve(process.cwd(), 'linkmakeup-505822-6a6c31eaf734.json');
    if (fs.existsSync(keyPath)) {
      const fileData = fs.readFileSync(keyPath, 'utf8');
      const parsed = JSON.parse(fileData);
      return {
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key,
      };
    }
  } catch (err) {
    console.error('Could not load service account JSON file:', err);
  }

  return {
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    privateKey: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  };
}

export class WalletService {
  /**
   * Generates PassKit JSON for Apple Wallet (.pkpass)
   */
  static buildPassJson(profile, publicUrl) {
    const displayName = profile?.displayName || 'LinkMakeup Creator';
    const role = profile?.role || 'Digital Business Card';
    const username = profile?.username || 'card';
    const targetUrl = publicUrl || `https://linkmakeup.com/${username}`;

    return {
      formatVersion: 1,
      passTypeIdentifier: 'pass.com.linkmakeup.card',
      serialNumber: `LM-${profile?.id || username}-${Date.now()}`,
      teamIdentifier: 'LINKMAKEUP',
      organizationName: 'LinkMakeup',
      description: 'LinkMakeup Digital Business Card',
      logoText: 'LinkMakeup',
      backgroundColor: 'rgb(15, 23, 42)',
      foregroundColor: 'rgb(255, 255, 255)',
      labelColor: 'rgb(16, 185, 129)',
      generic: {
        primaryFields: [
          {
            key: 'name',
            label: 'CREATOR',
            value: displayName,
          },
        ],
        secondaryFields: [
          {
            key: 'role',
            label: 'TITLE',
            value: role,
          },
        ],
        auxiliaryFields: [
          {
            key: 'link',
            label: 'SUBDOMAIN',
            value: targetUrl.replace(/^https?:\/\//, ''),
          },
        ],
        backFields: [
          {
            key: 'bio',
            label: 'ABOUT',
            value: profile?.bio || 'Digital business card powered by LinkMakeup.',
          },
          {
            key: 'website',
            label: 'FULL PROFILE',
            value: targetUrl,
          },
        ],
      },
      barcodes: [
        {
          format: 'PKBarcodeFormatQR',
          message: targetUrl,
          messageEncoding: 'iso-8859-1',
          altText: targetUrl,
        },
      ],
    };
  }

  /**
   * Compiles Apple Wallet Pass (.pkpass) as a Buffer
   */
  static async createApplePassBuffer(profile, publicUrl) {
    return new Promise((resolve, reject) => {
      const archive = new ZipArchive({ zlib: { level: 9 } });
      const buffers = [];

      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      const passJson = this.buildPassJson(profile, publicUrl);
      const passJsonString = JSON.stringify(passJson, null, 2);

      // Append pass.json
      archive.append(passJsonString, { name: 'pass.json' });

      // Append simple manifest.json
      const manifest = {
        'pass.json': 'manifest_hash_placeholder',
      };
      archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });

      archive.finalize();
    });
  }

  /**
   * Generates vCard (.vcf) format for mobile contacts with Base64 embedded photo
   */
  static async generateVCard(profile, publicUrl) {
    const displayName = profile?.displayName || 'LinkMakeup Creator';
    const role = profile?.role || '';
    const bio = profile?.bio || 'Digital business card powered by LinkMakeup.';
    const username = profile?.username || 'card';
    const rawAvatarUrl = profile?.avatarUrl || profile?.avatar || '';
    const targetUrl = publicUrl || `https://linkmakeup.com/${username}`;

    const names = displayName.trim().split(' ');
    const firstName = names[0] || displayName;
    const lastName = names.slice(1).join(' ') || '';

    let photoField = '';

    if (rawAvatarUrl) {
      try {
        let fullAvatarUrl = rawAvatarUrl;
        if (rawAvatarUrl.startsWith('/')) {
          const appDomain = process.env.CLIENT_URL || 'https://www.linkmakeup.com';
          fullAvatarUrl = `${appDomain.replace(/\/+$/, '')}${rawAvatarUrl}`;
        }

        const response = await fetch(fullAvatarUrl, { signal: AbortSignal.timeout(3000) });
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const base64Photo = Buffer.from(arrayBuffer).toString('base64');
          const contentType = response.headers.get('content-type') || 'image/jpeg';
          const imageType = contentType.includes('png') ? 'PNG' : 'JPEG';
          photoField = `PHOTO;TYPE=${imageType};ENCODING=b:${base64Photo}`;
        } else {
          photoField = `PHOTO;VALUE=URL:${fullAvatarUrl}`;
        }
      } catch {
        let fullAvatarUrl = rawAvatarUrl;
        if (rawAvatarUrl.startsWith('/')) {
          const appDomain = process.env.CLIENT_URL || 'https://www.linkmakeup.com';
          fullAvatarUrl = `${appDomain.replace(/\/+$/, '')}${rawAvatarUrl}`;
        }
        photoField = `PHOTO;VALUE=URL:${fullAvatarUrl}`;
      }
    }

    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${displayName}`,
      `N:${lastName};${firstName};;;`,
      photoField,
      role ? `TITLE:${role}` : '',
      `NOTE:${bio}`,
      `URL:${targetUrl}`,
      `ORG:LinkMakeup`,
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\r\n');
  }

  /**
   * Generates signed Google Wallet Save URL
   */
  static getGoogleWalletUrl(profile, publicUrl) {
    const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || '3388000000023186080';
    const classId = process.env.GOOGLE_WALLET_CLASS_ID || `${issuerId}.linkmakeup_card`;
    const credentials = getGoogleServiceAccountKey();

    const username = typeof profile === 'string' ? profile : (profile?.username || 'card');
    const displayName = typeof profile === 'string' ? 'LinkMakeup Creator' : (profile?.displayName || 'LinkMakeup Creator');
    const targetUrl = publicUrl || `https://linkmakeup.com/${username}`;

    if (!credentials.privateKey || !credentials.clientEmail) {
      return `https://pay.google.com/gp/v/save/${encodeURIComponent(targetUrl)}`;
    }

    const payload = {
      iss: credentials.clientEmail,
      aud: 'google',
      origins: ['https://linkmakeup.com', 'https://www.linkmakeup.com', 'http://localhost:5173'],
      typ: 'savetowallet',
      payload: {
        genericObjects: [
          {
            id: `${issuerId}.${username}_${Date.now()}`,
            classId: classId,
            logo: {
              sourceUri: {
                uri: 'https://www.linkmakeup.com/logo-lite.png',
              },
            },
            cardTitle: {
              defaultValue: {
                language: 'en',
                value: 'LinkMakeup Pass',
              },
            },
            header: {
              defaultValue: {
                language: 'en',
                value: displayName,
              },
            },
            subheader: {
              defaultValue: {
                language: 'en',
                value: `@${username}`,
              },
            },
            hexBackgroundColor: '#0f172a',
            barcode: {
              type: 'QR_CODE',
              value: targetUrl,
              alternateText: targetUrl,
            },
          },
        ],
      },
    };

    try {
      const token = jwt.sign(payload, credentials.privateKey, { algorithm: 'RS256' });
      return `https://pay.google.com/gp/v/save/${token}`;
    } catch (err) {
      console.error('Error signing Google Wallet JWT:', err);
      return `https://pay.google.com/gp/v/save/${encodeURIComponent(targetUrl)}`;
    }
  }

  /**
   * Email Wallet Pass to any specified email address
   */
  static async sendWalletCardToEmail({ recipientEmail, profile, publicUrl }) {
    const displayName = profile?.displayName || 'LinkMakeup Creator';
    const username = profile?.username || 'card';
    const targetUrl = publicUrl || `https://linkmakeup.com/${username}`;

    const subject = `Your LinkMakeup Digital Wallet Pass 💳`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Wallet Pass</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="560" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 24px; padding: 44px 32px; text-align: center; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <span style="font-size: 28px; font-weight: 900; color: #0F172A; letter-spacing: -1px;">
                Link<span style="color: #059669;">Makeup.</span>
              </span>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td style="font-size: 22px; font-weight: 800; color: #0F172A; padding-bottom: 12px;">
              Your Digital Business Card Pass 💳
            </td>
          </tr>

          <!-- Subtitle -->
          <tr>
            <td style="font-size: 14px; color: #475569; line-height: 1.6; padding-bottom: 28px;">
              Here is the digital wallet pass for <strong>${displayName}</strong> (<a href="${targetUrl}" style="color: #059669; font-weight: bold; text-decoration: none;">${targetUrl.replace(/^https?:\/\//, '')}</a>).
            </td>
          </tr>

          <!-- Wallet Buttons Stack -->
          <tr>
            <td align="center" style="padding-bottom: 28px;">
              <a href="${this.getGoogleWalletUrl(username, targetUrl)}" style="display: inline-block; background-color: #059669; color: #FFFFFF; border-radius: 14px; padding: 14px 28px; font-weight: 700; font-size: 14px; text-decoration: none; margin: 6px; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2);">
                G Save to Google Wallet
              </a>
              <span style="display: inline-block; background-color: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0; border-radius: 14px; padding: 14px 24px; font-weight: 700; font-size: 13px; margin: 6px;">
                 Apple Wallet (Coming Soon)
              </span>
            </td>
          </tr>

          <!-- Support Note -->
          <tr>
            <td style="font-size: 12px; color: #64748B; border-top: 1px solid #F1F5F9; padding-top: 20px;">
              Android Users: Tap <strong>Save to Google Wallet</strong> above to save your pass directly to your phone! Apple Wallet support for iPhone is coming soon.
            </td>
          </tr>

        </table>

        <table width="560" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; padding-top: 24px; text-align: center;">
          <tr>
            <td style="font-size: 11px; color: #94A3B8;">
              © ${new Date().getFullYear()} LinkMakeup · Sent from <a href="mailto:support.linkmakeup@gmail.com" style="color: #059669; text-decoration: none;">support.linkmakeup@gmail.com</a>
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
      from: `"LinkMakeup Support" <${process.env.EMAIL_FROM_ADDRESS || 'support.linkmakeup@gmail.com'}>`,
      to: recipientEmail,
      subject,
      html,
    });
  }
}
