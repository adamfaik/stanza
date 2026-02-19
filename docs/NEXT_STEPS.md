# Next Steps - Getting Stanza Live

Follow these steps in order to get your Stanza app running in production.

## Quick Start (15 minutes)

### 1. Set Up Supabase (5 min)

1. Create a free Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and API keys from Settings → API
4. Run the database schema:
   - Go to SQL Editor
   - Paste contents of `supabase/schema.sql`
   - Click Run
5. Create a storage bucket:
   - Go to Storage
   - Create bucket named `post-images`
   - Make it public

Supabase Auth will handle sending magic link emails automatically - no additional email service needed!

### 2. Configure Environment Variables (2 min)

Update `.env.local` with your Supabase keys:

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
APP_URL=http://localhost:3000
```

### 3. Deploy to Vercel (5 min)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your repository
4. Add the same environment variables (update APP_URL to your Vercel URL)
5. Deploy!

### 4. Configure Auth Redirect (2 min)

1. Once deployed, copy your Vercel URL
2. In Supabase dashboard → Authentication → URL Configuration:
   - Set Site URL to your Vercel URL
   - Add your Vercel URL to Redirect URLs: `https://your-project.vercel.app/**`

### 5. Test! (1 min)

1. Visit your deployed app
2. Click "Log in"
3. Enter your email
4. Check your email for the magic link from Supabase
5. Click the link and set your username

## That's It!

Your app is now live! 🎉

## Detailed Guides

For step-by-step instructions with screenshots, see:

- [Complete Setup Guide](./guides/SETUP.md) - Detailed walkthrough
- [Deployment Checklist](./guides/DEPLOYMENT_CHECKLIST.md) - Pre-launch verification

## Common Issues

**Not receiving magic link emails?**
- Check spam folder
- Verify Supabase Auth is enabled (Authentication → Providers → Email)
- For production, consider configuring custom SMTP in Supabase

**Build errors on Vercel?**
- Check environment variables are set correctly
- Review build logs in Vercel dashboard

**Can't create posts?**
- Verify storage bucket is public
- Check browser console for errors

## What's Different from Development

- Supabase Auth automatically sends real emails (no external email service needed)
- Posts and data persist in your Supabase database
- Images are stored in Supabase Storage
- Everything scales automatically with your traffic

## Cost

Both Supabase and Vercel have generous free tiers:
- **Supabase Free**: 500MB database, 1GB storage, 50,000 MAU
- **Vercel Free**: 100GB bandwidth, unlimited deployments

Perfect for launching and testing with real users!
