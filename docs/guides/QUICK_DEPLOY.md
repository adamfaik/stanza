# Quick Deploy to Vercel (Recommended!)

Skip local development hassles - deploy now and test on a live URL in ~10 minutes!

## Why Deploy First?

- ✅ No Vercel CLI permission issues
- ✅ Test with real production environment
- ✅ Get a live URL immediately
- ✅ Easier than local setup
- ✅ Free hosting on Vercel's free tier

## Steps (10 Minutes Total)

### 1. Push to GitHub (2 minutes)

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Production-ready Stanza app"

# Create repository on GitHub
# Go to github.com → New repository → Name it "stanza"

# Push to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/stanza.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. **Import** your GitHub repository
4. Vercel will auto-detect Vite configuration
5. **Before clicking Deploy**, add environment variables:

Click **"Environment Variables"** and add these (copy from your `.env.local`):

```
SUPABASE_URL=https://hokalnhnbgtctclttrua.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_KEY=eyJhbGciOi...
EMAIL_API_KEY=re_aNWav39E...
EMAIL_FROM=adam.faik.perso@gmail.com
APP_URL=https://your-app.vercel.app
JWT_SECRET=da5b1812c9b691bef5c821f927f5379b502bc851e223f802ff50d29b0f072688
```

**Important**: For `APP_URL`, use a placeholder first, we'll update it after deployment.

6. Click **"Deploy"**
7. Wait ~2 minutes for build to complete

### 3. Update APP_URL (2 minutes)

After deployment:

1. Vercel will give you a URL like `https://stanza-abc123.vercel.app`
2. Go to your project **Settings** → **Environment Variables**
3. Edit `APP_URL` and change it to your actual Vercel URL
4. Click **"Save"**
5. Go to **Deployments** tab
6. Click the **"..."** menu on the latest deployment
7. Click **"Redeploy"** to rebuild with the correct URL

### 4. Test Your Live App! (1 minute)

Visit your Vercel URL and test:

- ✅ Click "Sign In"
- ✅ Enter your email (use a real email you can access)
- ✅ Check your inbox for magic link
- ✅ Click the link to sign in
- ✅ Create a post with an image
- ✅ Upvote and comment
- ✅ Test all features!

## Troubleshooting

### Email not arriving?

- Check spam folder
- Verify `EMAIL_API_KEY` is correct in Vercel
- Check Resend dashboard for delivery logs

### "Internal Server Error"?

- Check Vercel function logs: Project → Logs
- Verify all environment variables are set
- Make sure `APP_URL` matches your actual Vercel domain

### Images not uploading?

- Verify Supabase `post-images` bucket exists and is public
- Check `SUPABASE_SERVICE_KEY` is set correctly

### Can't sign in?

- Make sure `JWT_SECRET` is set
- Verify `APP_URL` matches your Vercel domain exactly
- Check browser cookies are enabled

## After Deployment

Your app is now live! 🎉

Share your URL with others or:
- Add a custom domain in Vercel settings
- Monitor usage in Vercel, Supabase, and Resend dashboards
- Make changes and push to GitHub for automatic redeployment

## Future Development

Once deployed, you can:
1. Make changes locally
2. Push to GitHub
3. Vercel auto-deploys the new version
4. No need to run locally if you don't want to!

## Custom Domain (Optional)

To use your own domain:
1. In Vercel: Settings → Domains
2. Add your domain (e.g., `stanza.app`)
3. Follow DNS setup instructions
4. Update `APP_URL` environment variable to your custom domain
5. Redeploy

---

**Current Status**: Ready to deploy!  
**Time Required**: ~10 minutes  
**Next Step**: Push to GitHub and import into Vercel
