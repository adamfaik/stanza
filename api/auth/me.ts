import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSessionFromCookies } from '../../lib/auth.js';
import { supabaseAdmin } from '../../lib/supabase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS').end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookieHeader = req.headers.cookie;
    const session = getSessionFromCookies(cookieHeader);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch fresh user data from database
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, username, created_at')
      .eq('id', session.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'User not found' });
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
