import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../lib/supabase';
import { getSessionFromCookies } from '../../lib/auth';
import { sanitizeInput } from '../../lib/middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS').end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const cookieHeader = req.headers.cookie;
    const session = getSessionFromCookies(cookieHeader);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { postId, content } = req.body;

    // Validate inputs
    if (!postId || !content) {
      return res.status(400).json({ error: 'Post ID and content are required' });
    }

    const sanitizedContent = sanitizeInput(content, 2000);

    if (sanitizedContent.length === 0) {
      return res.status(400).json({ error: 'Comment cannot be empty' });
    }

    // Verify post exists and is not expired
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('id, expires_at')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (new Date(post.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Cannot comment on expired post' });
    }

    // Create comment
    const { data: comment, error: createError } = await supabaseAdmin
      .from('comments')
      .insert({
        post_id: postId,
        author_id: session.userId,
        content: sanitizedContent,
      })
      .select(`
        id,
        post_id,
        author_id,
        content,
        created_at
      `)
      .single();

    if (createError || !comment) {
      console.error('Error creating comment:', createError);
      return res.status(500).json({ error: 'Failed to create comment' });
    }

    // Transform response
    const transformedComment = {
      id: comment.id,
      postId: comment.post_id,
      authorId: comment.author_id,
      authorName: session.username,
      content: comment.content,
      createdAt: new Date(comment.created_at).getTime(),
    };

    return res.status(201).json({ comment: transformedComment });
  } catch (error) {
    console.error('Error in create comment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
