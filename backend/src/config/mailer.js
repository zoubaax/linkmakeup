import nodemailer from 'nodemailer';
import { Resend } from 'resend';

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

export const resendClient = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Unified email sending service (Resend primary, Nodemailer fallback)
 */
export async function sendEmail({ to, subject, html, attachments = [] }) {
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev';
  const fromName = process.env.EMAIL_FROM_NAME || 'LinkMakeup';
  const from = `"${fromName}" <${fromAddress}>`;

  if (resendClient) {
    try {
      const data = await resendClient.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'LinkMakeup <onboarding@resend.dev>',
        to,
        subject,
        html,
        attachments,
      });
      console.log(`🚀 Email sent via Resend API to ${to}:`, data?.id || 'success');
      return { success: true, provider: 'resend', id: data?.id };
    } catch (error) {
      console.error('⚠️ Resend API error, falling back to SMTP:', error.message);
    }
  }

  // Fallback to Nodemailer SMTP
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
    attachments,
  });
  console.log(`📧 Email sent via SMTP to ${to}:`, info?.messageId || 'success');
  return { success: true, provider: 'smtp', id: info?.messageId };
}

/**
 * Verify SMTP / Resend connection state
 */
export async function verifySmtpConnection() {
  if (process.env.RESEND_API_KEY) {
    console.log('🚀 Resend API Client initialized successfully for inbox deliverability.');
    return true;
  }

  if (!process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP_PASS is missing in environment variables. Email sending dormant.');
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
