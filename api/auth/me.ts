import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../lib/supabase-server.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS').end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);

    // Verify the session token with Supabase Auth
    const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !authUser) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Get or create user in our custom users table
    let { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, username, created_at')
      .eq('id', authUser.id)
      .single();

    // Fallback: find by email (handles mismatched UUIDs from prior attempts)
    if (!user) {
      const { data: byEmail } = await supabaseAdmin
        .from('users')
        .select('id, email, username, created_at')
        .eq('email', authUser.email?.toLowerCase() || '')
        .single();
      user = byEmail ?? null;
    }

    // If still not found, create the user
    if (!user) {
      if (!username) {
        return res.status(400).json({ error: 'Username is required for new users' });
      }

      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .upsert({
          id: authUser.id,
          email: authUser.email?.toLowerCase() || '',
          username: username.trim(),
        }, { onConflict: 'email' })
        .select()
        .single();

      if (createError || !newUser) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ error: 'Failed to create user profile' });
      }

      user = newUser;
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Error in me endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
