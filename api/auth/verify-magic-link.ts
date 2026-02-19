// This endpoint is no longer needed - Supabase Auth handles magic link verification automatically
// The frontend will use Supabase Auth client to manage sessions
// When a user signs in, we'll sync their data to our custom users table via the /api/auth/me endpoint

export default async function handler() {
  return new Response(JSON.stringify({ 
    message: 'This endpoint is deprecated. Use Supabase Auth client directly.' 
  }), {
    status: 410,
    headers: { 'Content-Type': 'application/json' }
  });
}
