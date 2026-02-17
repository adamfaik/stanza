# Stanza Deployment Checklist

Use this checklist to ensure all steps are completed before and after deployment.

## Pre-Deployment Setup

### 1. Service Accounts
- [ ] Create Supabase account and project
- [ ] Create Resend account and get API key
- [ ] Create Vercel account

### 2. Supabase Configuration
- [ ] Copy Project URL and API keys
- [ ] Run `supabase/schema.sql` in SQL Editor
- [ ] Verify all 5 tables created (users, posts, comments, votes, magic_links)
- [ ] Create `post-images` storage bucket
- [ ] Set bucket to public
- [ ] Configure bucket policies for public read access

### 3. Resend Configuration
- [ ] Get API key from Resend dashboard
- [ ] (Optional) Configure custom domain
- [ ] Test email sending with a test email

### 4. Environment Variables
- [ ] Fill in `.env.local` with all values
- [ ] Generate secure JWT_SECRET
- [ ] Create `.env.production` with production values
- [ ] Verify all required variables are set:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
  - `EMAIL_API_KEY`
  - `EMAIL_FROM`
  - `APP_URL`
  - `JWT_SECRET`

### 5. Local Testing
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Test: View posts feed
- [ ] Test: Send magic link email
- [ ] Test: Click magic link and authenticate
- [ ] Test: Create post without image
- [ ] Test: Create post with image
- [ ] Test: Upvote a post
- [ ] Test: Add comment
- [ ] Test: Logout functionality
- [ ] Verify: Urgency indicator shows for posts < 4 hours

## Deployment

### 6. GitHub Setup
- [ ] Initialize git repository
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Verify `.gitignore` excludes `.env*` files

### 7. Vercel Deployment
- [ ] Import project from GitHub
- [ ] Add all environment variables in Vercel dashboard
- [ ] Deploy project
- [ ] Note the Vercel URL
- [ ] Update `APP_URL` environment variable with Vercel URL
- [ ] Redeploy after updating APP_URL

### 8. Domain Configuration (Optional)
- [ ] Add custom domain in Vercel
- [ ] Configure DNS records
- [ ] Update `APP_URL` to custom domain
- [ ] Update `EMAIL_FROM` to use custom domain
- [ ] Redeploy

## Post-Deployment Testing

### 9. Production Verification
- [ ] Visit production URL
- [ ] Test: Authentication flow with real email
- [ ] Test: Receive magic link email
- [ ] Test: Click magic link and sign in
- [ ] Test: Create post with image
- [ ] Test: Verify image displays correctly
- [ ] Test: Upvote from different devices
- [ ] Test: Add comments
- [ ] Test: Session persists on page reload
- [ ] Test: Logout functionality
- [ ] Test: View post detail page
- [ ] Test: All 4 sort options (Top, Undiscovered, Just Added, Last Call)

### 10. Monitoring Setup
- [ ] Check Vercel Analytics dashboard
- [ ] Check Supabase usage dashboard
- [ ] Check Resend email delivery stats
- [ ] Set up error monitoring (optional: Sentry)
- [ ] Set up automated post cleanup cron job

## Security Verification

### 11. Security Checklist
- [ ] Environment variables are not committed to git
- [ ] `SUPABASE_SERVICE_KEY` is only used server-side
- [ ] JWT secret is random and unique
- [ ] Rate limiting is active on auth endpoints
- [ ] RLS policies are enabled on Supabase tables
- [ ] CORS headers are properly configured
- [ ] Cookie settings are secure (httpOnly, sameSite)
- [ ] User input is sanitized in API endpoints

## Performance Optimization (Optional)

### 12. Performance Enhancements
- [ ] Enable Vercel Edge Functions (if needed)
- [ ] Configure CDN caching for images
- [ ] Add database indexes (already in schema.sql)
- [ ] Enable Supabase connection pooling
- [ ] Implement pagination for large feeds

## Troubleshooting

If you encounter issues:

**Emails not sending:**
- Verify EMAIL_API_KEY in Vercel
- Check Resend dashboard for errors
- Ensure EMAIL_FROM is verified domain

**Images not uploading:**
- Check Supabase Storage bucket exists
- Verify bucket is public
- Check SUPABASE_SERVICE_KEY is set

**Authentication failing:**
- Verify JWT_SECRET is set
- Check APP_URL matches actual domain
- Inspect browser cookies in DevTools

**Database errors:**
- Verify schema.sql ran successfully
- Check Supabase logs for errors
- Verify all environment variables are set

## Launch Checklist

### 13. Final Steps Before Public Launch
- [ ] Test with multiple users
- [ ] Verify post expiration works (24 hours)
- [ ] Test on multiple devices (desktop, mobile)
- [ ] Test on different browsers
- [ ] Check responsive design
- [ ] Verify all links work
- [ ] Test edge cases (very long titles, no image, etc.)
- [ ] Review Vercel logs for any errors
- [ ] Review Supabase logs for any errors
- [ ] Set up monitoring alerts
- [ ] Prepare announcement/launch post

## Post-Launch

### 14. After Launch
- [ ] Monitor error logs daily (first week)
- [ ] Check email delivery rate
- [ ] Monitor database growth
- [ ] Watch for spam/abuse patterns
- [ ] Collect user feedback
- [ ] Plan future enhancements

---

## Quick Reference

**Key Files:**
- `/supabase/schema.sql` - Database schema
- `/api/auth/*` - Authentication endpoints
- `/api/posts/*` - Post endpoints
- `/api/votes/*` - Voting endpoint
- `/api/comments/*` - Comment endpoint
- `/lib/*` - Shared utilities
- `/vercel.json` - Deployment config
- `/.env.local` - Local environment variables
- `/.env.production` - Production environment variables

**Key Commands:**
```bash
npm install          # Install dependencies
npm run dev         # Run locally
npm run build       # Build for production
npm run preview     # Preview production build
git push            # Deploy to Vercel (if auto-deploy enabled)
```

**Important URLs:**
- Supabase Dashboard: https://app.supabase.com
- Resend Dashboard: https://resend.com/dashboard
- Vercel Dashboard: https://vercel.com/dashboard

---

**Status:** Ready for deployment! 🚀
