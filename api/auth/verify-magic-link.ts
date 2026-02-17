import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../lib/supabase';
import { generateToken, createSessionCookie } from '../../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS').end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, username } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify magic link token
    const { data: magicLink, error: linkError } = await supabaseAdmin
      .from('magic_links')
      .select('*')
      .eq('token', token)
      .single();

    if (linkError || !magicLink) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Check if token is expired or already used
    if (magicLink.used || new Date(magicLink.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Token has expired or already been used' });
    }

    // Mark token as used
    await supabaseAdmin
      .from('magic_links')
      .update({ used: true })
      .eq('token', token);

    // Get or create user
    let { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', magicLink.email.toLowerCase())
      .single();

    // If user doesn't exist, create them
    if (userError || !user) {
      if (!username) {
        return res.status(400).json({ error: 'Username is required for new users' });
      }

      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          email: magicLink.email.toLowerCase(),
          username: username.trim(),
        })
        .select()
        .single();

      if (createError || !newUser) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ error: 'Failed to create user' });
      }

      user = newUser;
    }

    // Generate JWT session token
    const sessionToken = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    // Set session cookie
    const cookie = createSessionCookie(sessionToken);
    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Error in verify-magic-link:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
