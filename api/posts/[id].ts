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
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    // Fetch post with author info
    const { data: post, error: postError } = await supabase
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
      .eq('id', id)
      .single();

    if (postError || !post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if post is expired
    if (new Date(post.expires_at) < new Date()) {
      return res.status(404).json({ error: 'Post has expired' });
    }

    // Fetch comments for this post
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select(`
        id,
        post_id,
        author_id,
        content,
        created_at,
        users!comments_author_id_fkey (
          id,
          username
        )
      `)
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
    }

    // Transform post data
    const transformedPost = {
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
    };

    // Transform comments data
    const transformedComments = (comments || []).map(comment => ({
      id: comment.id,
      postId: comment.post_id,
      authorId: comment.author_id,
      authorName: (comment.users as any)?.username || 'Unknown',
      content: comment.content,
      createdAt: new Date(comment.created_at).getTime(),
    }));

    return res.status(200).json({
      post: transformedPost,
      comments: transformedComments,
    });
  } catch (error) {
    console.error('Error in get post:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
