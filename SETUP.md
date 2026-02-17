# Stanza Production Setup Guide

This guide will walk you through setting up all the necessary services to deploy Stanza to production.

## Prerequisites

- Node.js 18+ installed
- A GitHub account (for Vercel deployment)
- Email address for service signups

## Step 1: Supabase Database Setup

### 1.1 Create Supabase Account and Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up
3. Create a new project:
   - Choose a project name (e.g., "stanza")
   - Create a strong database password (save this!)
   - Select a region close to your users
   - Wait for the project to be provisioned (~2 minutes)

### 1.2 Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (⚠️ Keep this secret!)

### 1.3 Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click **Run** to execute
6. Verify tables were created: Go to **Table Editor** and you should see:
   - users
   - posts
   - comments
   - votes
   - magic_links

### 1.4 Create Storage Bucket for Images

1. In Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Name it: `post-images`
4. Make it **Public bucket** (check the box)
5. Click **Create bucket**
6. Click on the bucket name, then go to **Policies**
7. Add a policy:
   - Policy name: "Public read access"
   - Target roles: `public`
   - Allowed operations: SELECT
   - Policy definition: `true`

## Step 2: Email Service Setup (Resend)

### 2.1 Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up with your email
3. Verify your email address

### 2.2 Get API Key

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it: "Stanza Production"
4. Copy the API key (you won't be able to see it again!)

### 2.3 Configure Domain (Optional but Recommended)

For production, you should use your own domain:

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `stanza.app`)
4. Follow the DNS setup instructions
5. Wait for verification (~10 minutes)

For development, you can use Resend's test domain (`onboarding@resend.dev`).

## Step 3: Configure Environment Variables

### 3.1 Local Development

1. Open `.env.local` in your project
2. Fill in the values you collected:

```bash
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Email Service (Resend)
EMAIL_API_KEY=re_xxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# Application Settings
APP_URL=http://localhost:3000
JWT_SECRET=your_random_secret_here

# Optional: Gemini (if using AI features)
GEMINI_API_KEY=your_gemini_key_if_needed
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.2 Production Environment

1. Open `.env.production`
2. Use the same values as `.env.local` but:
   - Change `APP_URL` to your Vercel domain (e.g., `https://stanza.vercel.app`)
   - Use production email address for `EMAIL_FROM`
   - Generate a NEW `JWT_SECRET` for production (different from dev)

## Step 4: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- `@supabase/supabase-js` - Supabase client
- `jsonwebtoken` - JWT token generation
- `cookie` - Cookie parsing
- `formidable` - File upload handling

## Step 5: Test Locally

1. Start the development server:
```bash
npm run dev
```

2. Open `http://localhost:3000` in your browser

3. Test the following:
   - ✅ View posts feed
   - ✅ Click "Sign In" and enter your email
   - ✅ Check your email inbox for magic link
   - ✅ Click the magic link to sign in
   - ✅ Create a new post (with and without image)
   - ✅ Upvote a post
   - ✅ Add a comment
   - ✅ Check that posts show correct time remaining

## Step 6: Deploy to Vercel

### 6.1 Push to GitHub

1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Production-ready Stanza"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin https://github.com/yourusername/stanza.git
git branch -M main
git push -u origin main
```

### 6.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click **Add New** → **Project**
4. Import your GitHub repository
5. Vercel will auto-detect Vite configuration
6. **Before deploying**, add environment variables:
   - Click **Environment Variables**
   - Add ALL variables from `.env.production`:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_KEY`
     - `EMAIL_API_KEY`
     - `EMAIL_FROM`
     - `APP_URL` (use your Vercel domain)
     - `JWT_SECRET`
7. Click **Deploy**
8. Wait for deployment to complete (~2 minutes)

### 6.3 Update APP_URL

1. After first deployment, Vercel will give you a URL like `https://stanza-abc123.vercel.app`
2. Go to your project settings → **Environment Variables**
3. Update `APP_URL` to your actual Vercel URL
4. Redeploy the project

### 6.4 Configure Custom Domain (Optional)

1. In Vercel project settings, go to **Domains**
2. Add your custom domain (e.g., `stanza.app`)
3. Follow the DNS configuration instructions
4. Update `APP_URL` environment variable to your custom domain
5. Update `EMAIL_FROM` in Resend to use your custom domain

## Step 7: Post-Deployment Verification

Test your production app:

1. ✅ Visit your Vercel URL
2. ✅ Test authentication flow (magic link email)
3. ✅ Create a post with an image
4. ✅ Verify image loads correctly
5. ✅ Test voting and commenting
6. ✅ Verify posts expire after 24 hours

## Troubleshooting

### Magic Link Emails Not Sending

- Check `EMAIL_API_KEY` is correct in Vercel environment variables
- Verify Resend domain is verified (if using custom domain)
- Check Resend dashboard for error logs

### Images Not Uploading

- Verify Supabase Storage bucket `post-images` exists and is public
- Check `SUPABASE_SERVICE_KEY` is set correctly
- Check Vercel function logs for errors

### Database Errors

- Verify all environment variables are set in Vercel
- Check Supabase SQL Editor for any schema errors
- Verify RLS policies are created correctly

### Session Not Persisting

- Verify `JWT_SECRET` is set in Vercel
- Check that cookies are being set (browser dev tools → Application → Cookies)
- Ensure `APP_URL` matches your actual domain

## Monitoring and Maintenance

### Set Up Automated Post Cleanup

Posts should automatically expire after 24 hours. To ensure cleanup:

1. In Supabase dashboard, go to **Database** → **Functions**
2. The `cleanup_expired_posts()` function was created by the schema
3. Set up a cron job (Vercel Cron or Supabase Edge Function) to run daily:
```sql
SELECT cleanup_expired_posts();
```

### Monitor Usage

- **Supabase**: Dashboard shows database size, API requests, storage usage
- **Resend**: Dashboard shows email delivery stats
- **Vercel**: Dashboard shows function invocations, bandwidth, build logs

### Rate Limits (Free Tier)

- **Supabase Free**: 500MB database, 1GB file storage, 2GB bandwidth
- **Resend Free**: 3,000 emails/month, 100 emails/day
- **Vercel Free**: 100GB bandwidth, unlimited function invocations

## Security Checklist

- ✅ Environment variables are set in Vercel (not in code)
- ✅ `.env.local` and `.env.production` are in `.gitignore`
- ✅ `SUPABASE_SERVICE_KEY` is kept secret (only used server-side)
- ✅ `JWT_SECRET` is randomly generated and unique per environment
- ✅ Supabase RLS policies are enabled
- ✅ Rate limiting is configured for auth endpoints
- ✅ User input is sanitized in API endpoints

## Support

If you encounter issues:

1. Check Vercel function logs for errors
2. Check Supabase logs in dashboard
3. Check Resend logs for email delivery issues
4. Review this guide for missed steps

---

**Congratulations! Your Stanza app is now live in production! 🎉**
