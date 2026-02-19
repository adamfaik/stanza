# Stanza Production Setup Guide

This guide will walk you through setting up Supabase for Stanza deployment.

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

Note: The `magic_links` table is no longer needed as Supabase Auth handles authentication.

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

### 1.5 Configure Supabase Auth

Supabase Auth is automatically configured to send magic link emails:

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize the "Magic Link" template if desired
4. For production, configure your SMTP settings:
   - Go to **Project Settings** → **Auth**
   - Scroll to **SMTP Settings**
   - Either use Supabase's built-in email service or configure your own SMTP

## Step 2: Configure Environment Variables

### 2.1 Local Development

1. Open `.env.local` in your project
2. Fill in the values you collected:

```bash
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Application Settings
APP_URL=http://localhost:3000
```

### 2.2 Production (Vercel)

You'll add these environment variables in Vercel during deployment (Step 3).

## Step 3: Deploy to Vercel

### 3.1 Push Code to GitHub

```bash
git add .
git commit -m "Setup for production deployment"
git push origin main
```

### 3.2 Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in with GitHub
3. Click **New Project**
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 3.3 Add Environment Variables in Vercel

Click **Environment Variables** and add:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
APP_URL=https://your-project.vercel.app
```

⚠️ Make sure to add these for all environments (Production, Preview, Development).

### 3.4 Deploy

1. Click **Deploy**
2. Wait for the build to complete (~1-2 minutes)
3. Visit your deployment URL

## Step 4: Final Configuration

### 4.1 Update Supabase Auth Redirect URL

1. Go to Supabase dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL**: `https://your-project.vercel.app`
3. Add to **Redirect URLs**: `https://your-project.vercel.app/**`

### 4.2 Test Authentication

1. Visit your deployed app
2. Click "Log in"
3. Enter your email
4. Check your email for the magic link
5. Click the link to sign in
6. You'll be prompted for a username on first login

## Troubleshooting

### Magic Link Emails Not Arriving

1. Check your email spam folder
2. In Supabase dashboard, go to **Authentication** → **Users** to verify the auth attempt
3. Check Supabase logs for email sending errors
4. Verify SMTP settings are configured correctly

### Build Errors on Vercel

1. Check the build logs in Vercel dashboard
2. Ensure all environment variables are set correctly
3. Verify Node.js version compatibility

### Database Connection Issues

1. Verify Supabase keys are correct
2. Check that RLS policies are enabled
3. Ensure your IP is not blocked in Supabase

## Next Steps

After successful deployment:

- Test all features thoroughly
- Set up custom domain (optional)
- Configure email templates in Supabase
- Monitor usage in Supabase and Vercel dashboards
- Enable database backups in Supabase

## Cost Estimates

- **Supabase**: Free tier includes 500MB database, 1GB file storage, 50,000 monthly active users
- **Vercel**: Free tier includes 100GB bandwidth, unlimited deployments

Both services should handle moderate traffic on their free tiers.
