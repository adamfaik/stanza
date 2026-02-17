// Email service integration using Resend
// Alternative: SendGrid, AWS SES, Postmark, etc.

const RESEND_API_KEY = process.env.EMAIL_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@stanza.app';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Send email via Resend API
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error('EMAIL_API_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to send email:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Generate magic link email HTML
export function generateMagicLinkEmail(token: string, email: string): string {
  const magicLink = `${APP_URL}?token=${token}`;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to Stanza</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 600; color: #111827; font-family: Georgia, 'Times New Roman', serif;">
                Stanza
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #374151;">
                Hello,
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #374151;">
                Click the button below to sign in to your Stanza account:
              </p>
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="${magicLink}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 4px;">
                      Sign in to Stanza
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 8px 0 0; font-size: 14px; line-height: 20px; color: #6b7280; word-break: break-all;">
                ${magicLink}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #9ca3af;">
                This link will expire in 15 minutes. If you didn't request this email, you can safely ignore it.
              </p>
              <p style="margin: 12px 0 0; font-size: 12px; line-height: 18px; color: #9ca3af;">
                Sent to ${email}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Send magic link email
export async function sendMagicLinkEmail(
  email: string,
  token: string
): Promise<boolean> {
  const html = generateMagicLinkEmail(token, email);
  
  return sendEmail({
    to: email,
    subject: 'Sign in to Stanza',
    html,
  });
}
