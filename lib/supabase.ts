import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set');
}

// Client for frontend (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for backend API with service role (bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database types
export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  author_id: string;
  created_at: string;
  expires_at: string;
  votes: number;
  comment_count: number;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
}

export interface Vote {
  id: string;
  post_id: string;
  device_id: string;
  ip_address?: string;
  created_at: string;
}

export interface MagicLink {
  token: string;
  email: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}
