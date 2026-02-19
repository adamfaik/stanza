import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase-server.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS').end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch all active posts (not expired)
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        description,
        image_url,
        author_id,
        created_at,
        expires_at,
        votes,
        comment_count,
        users!posts_author_id_fkey (
          id,
          username
        )
      `)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }

    // Transform data to include author name
    const transformedPosts = (posts || []).map(post => ({
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.image_url,
      authorId: post.author_id,
      authorName: (post.users as any)?.username || 'Unknown',
      createdAt: new Date(post.created_at).getTime(),
      expiresAt: new Date(post.expires_at).getTime(),
      votes: post.votes,
      commentCount: post.comment_count,
    }));

    return res.status(200).json({ posts: transformedPosts });
  } catch (error) {
    console.error('Error in posts index:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
