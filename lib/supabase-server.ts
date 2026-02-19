// Backend Supabase client (Node.js/API routes only)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables for server');
}

// Client for frontend  (anon key - if needed server-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for backend API with service role (bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Re-export types
export type { User, Post, Comment, Vote, MagicLink } from './supabase';
