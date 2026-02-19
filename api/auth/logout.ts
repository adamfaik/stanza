// This endpoint is no longer needed - Supabase Auth handles logout on the client side
// The frontend will use supabase.auth.signOut() directly

export default async function handler() {
  return new Response(JSON.stringify({ 
    message: 'This endpoint is deprecated. Use Supabase Auth client signOut() method.' 
  }), {
    status: 410,
    headers: { 'Content-Type': 'application/json' }
  });
}
