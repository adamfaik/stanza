# Local Development Guide

## Important: Use Vercel Dev (Not Vite Dev!)

The Stanza app uses **Vercel Serverless Functions** for the backend API. These API routes (`/api/*`) only work when:
1. Deployed to Vercel, OR
2. Running locally with **Vercel CLI**

### ❌ This Won't Work:
```bash
npm run dev:vite  # Only runs frontend, API routes don't exist
```

### ✅ This Will Work:
```bash
npm run dev  # Runs Vercel dev server (frontend + API)
```

## First Time Setup

1. **Install dependencies** (already done!):
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   - Copy `.env.example` to `.env.local`
   - Fill in all values from Supabase and Resend
   - See `SETUP.md` for detailed instructions

3. **Run with Vercel Dev**:
   ```bash
   npm run dev
   ```

4. **First run setup**:
   - Vercel CLI will ask you to log in (first time only)
   - It will link your project to Vercel
   - Answer the prompts:
     - "Set up and develop" → **Yes**
     - "Which scope?" → Choose your account
     - "Link to existing project?" → **No**
     - "What's your project's name?" → **stanza** (or your preferred name)
     - "In which directory is your code located?" → **./** (default)

5. **Access your app**:
   - Open http://localhost:3000
   - The API routes will be available at http://localhost:3000/api/*

## How Vercel Dev Works

Vercel Dev:
- ✅ Runs your Vite frontend (React app)
- ✅ Runs your API serverless functions
- ✅ Loads environment variables from `.env.local`
- ✅ Simulates the production environment locally
- ✅ Hot-reloads on file changes

## Troubleshooting

### "Command not found: vercel"

If you get this error, Vercel CLI isn't installed. Run:
```bash
npm install
```

This will install it as a dev dependency.

### "Cannot find module" errors in API routes

Make sure all dependencies are installed:
```bash
npm install
```

### Environment variables not loading

1. Make sure `.env.local` exists in the root directory
2. Restart Vercel Dev after changing env vars:
   ```bash
   # Press Ctrl+C to stop
   npm run dev  # Start again
   ```

### API routes returning 500 errors

Check the terminal output - Vercel Dev shows detailed error logs for your API functions. Common issues:
- Missing environment variables
- Database connection errors (check Supabase keys)
- Email service errors (check Resend API key)

### Port 3000 already in use

If another app is using port 3000:
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
vercel dev --listen 3001
```

## Development Workflow

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Make changes** to your code:
   - Frontend changes: Auto-reload in browser
   - API changes: Vercel Dev will restart the function

3. **View logs**:
   - Frontend logs: Browser console
   - API logs: Terminal (Vercel Dev shows function logs)

4. **Test features**:
   - Authentication (magic link emails)
   - Create posts with images
   - Voting and commenting
   - All 4 sort options

## Alternative: Deploy First, Test Later

If you prefer not to use Vercel Dev locally, you can:

1. Skip local testing
2. Deploy directly to Vercel (see `SETUP.md` Section 6)
3. Test on your live Vercel URL

This is actually faster for getting started! You can deploy in ~10 minutes and test the live app immediately.

## Commands Reference

```bash
# Start development server (frontend + API)
npm run dev

# Start only Vite (frontend only, NO API routes)
npm run dev:vite

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel --prod
```

## Next Steps

Once local development is working:
1. Test all features thoroughly
2. Follow `DEPLOYMENT_CHECKLIST.md` for testing checklist
3. Deploy to production with `vercel --prod` or via Vercel dashboard

---

**Quick Start**: Just run `npm run dev` and follow the Vercel CLI prompts!
