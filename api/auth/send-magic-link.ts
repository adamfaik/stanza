import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase-server.js';
import {
  checkRateLimit,
  validateEmail,
} from '../../lib/middleware.js';
import { getClientIp } from '../../lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    // Use Supabase Auth to send magic link
    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase(),
      options: {
        emailRedirectTo: `${process.env.APP_URL || 'http://localhost:3000'}`,
      },
    });

    if (error) {
      console.error('Error sending magic link:', error);
      return res.status(500).json({ error: 'Failed to send magic link' });
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
