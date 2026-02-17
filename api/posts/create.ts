import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../lib/supabase';
import { requireAuth } from '../../lib/middleware';
import { getSessionFromCookies } from '../../lib/auth';
import formidable from 'formidable';
import fs from 'fs';

// Disable body parsing, we'll use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

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

    // Parse form data
    const form = formidable({ multiples: false });
    
    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;

    // Validate inputs
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    if (title.length > 200) {
      return res.status(400).json({ error: 'Title is too long (max 200 characters)' });
    }

    if (description.length > 5000) {
      return res.status(400).json({ error: 'Description is too long (max 5000 characters)' });
    }

    let imageUrl: string | undefined;

    // Handle image upload if provided
    if (files.image) {
      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
      
      // Read file
      const fileBuffer = fs.readFileSync(imageFile.filepath);
      const fileName = `${session.userId}/${Date.now()}-${imageFile.originalFilename || 'image.jpg'}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('post-images')
        .upload(fileName, fileBuffer, {
          contentType: imageFile.mimetype || 'image/jpeg',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image' });
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('post-images')
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    // Create post
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const { data: post, error: createError } = await supabaseAdmin
      .from('posts')
      .insert({
        title: title.trim(),
        description: description.trim(),
        image_url: imageUrl,
        author_id: session.userId,
        expires_at: expiresAt.toISOString(),
        votes: 0,
        comment_count: 0,
      })
      .select(`
        id,
        title,
        description,
        image_url,
        author_id,
        created_at,
        expires_at,
        votes,
        comment_count
      `)
      .single();

    if (createError || !post) {
      console.error('Error creating post:', createError);
      return res.status(500).json({ error: 'Failed to create post' });
    }

    // Transform response
    const transformedPost = {
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.image_url,
      authorId: post.author_id,
      authorName: session.username,
      createdAt: new Date(post.created_at).getTime(),
      expiresAt: new Date(post.expires_at).getTime(),
      votes: post.votes,
      commentCount: post.comment_count,
    };

    return res.status(201).json({ post: transformedPost });
  } catch (error) {
    console.error('Error in create post:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
