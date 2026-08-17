import nodemailer from 'nodemailer';

const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
const isSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: smtpPort,
  secure: isSecure,
  auth: {
    user: process.env.SMTP_USER || 'support.linkmakeup@gmail.com',
    pass: process.env.SMTP_PASS || '',
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

/**
 * Verify SMTP Transport connection
 */
export async function verifySmtpConnection() {
  if (!process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP_PASS is missing in environment variables. Email sending is dormant until App Password is configured.');
    return false;
  }

  try {
    await transporter.verify();
    console.log('📧 SMTP Transporter connected successfully (support.linkmakeup@gmail.com)');
    return true;
  } catch (error) {
    console.error('❌ SMTP Connection Error:', error.message);
    return false;
  }
}
