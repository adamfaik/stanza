import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../lib/supabase';
import { sendMagicLinkEmail } from '../../lib/email';
import {
  checkRateLimit,
  errorResponse,
  successResponse,
  validateEmail,
  handleOptions,
  getCorsHeaders,
} from '../../lib/middleware';
import { getClientIp } from '../../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS').end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Rate limiting: 5 requests per IP per 15 minutes
    const clientIp = getClientIp(new Headers(req.headers as any)) || 'unknown';
    if (checkRateLimit(`magic-link:${clientIp}`, 5, 15 * 60 * 1000)) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    // Generate magic link token
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    const { data: magicLink, error: dbError } = await supabaseAdmin
      .from('magic_links')
      .insert({
        email: email.toLowerCase(),
        expires_at: expiresAt.toISOString(),
        used: false,
      })
      .select()
      .single();

    if (dbError || !magicLink) {
      console.error('Error creating magic link:', dbError);
      return res.status(500).json({ error: 'Failed to generate magic link' });
    }

    // Send email
    const emailSent = await sendMagicLinkEmail(email, magicLink.token);

    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({
      success: true,
      message: 'Magic link sent to your email',
    });
  } catch (error) {
    console.error('Error in send-magic-link:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
