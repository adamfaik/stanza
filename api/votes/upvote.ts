import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../lib/supabase';
import { getClientIp } from '../../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS').end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { postId, deviceId } = req.body;

    // Validate inputs
    if (!postId || !deviceId) {
      return res.status(400).json({ error: 'Post ID and device ID are required' });
    }

    // Get client IP for additional spam prevention
    const clientIp = getClientIp(new Headers(req.headers as any));

    // Check if this device has already voted on this post
    const { data: existingVote, error: checkError } = await supabaseAdmin
      .from('votes')
      .select('id')
      .eq('post_id', postId)
      .eq('device_id', deviceId)
      .single();

    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted on this post' });
    }

    // Record the vote
    const { error: voteError } = await supabaseAdmin
      .from('votes')
      .insert({
        post_id: postId,
        device_id: deviceId,
        ip_address: clientIp,
      });

    if (voteError) {
      console.error('Error recording vote:', voteError);
      return res.status(500).json({ error: 'Failed to record vote' });
    }

    // Increment vote count on post
    const { error: updateError } = await supabaseAdmin
      .from('posts')
      .update({ votes: supabaseAdmin.raw('votes + 1') as any })
      .eq('id', postId);

    if (updateError) {
      console.error('Error updating vote count:', updateError);
      return res.status(500).json({ error: 'Failed to update vote count' });
    }

    // Get updated post
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('votes')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return res.status(500).json({ error: 'Failed to fetch updated post' });
    }

    return res.status(200).json({
      success: true,
      votes: post.votes,
    });
  } catch (error) {
    console.error('Error in upvote:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
