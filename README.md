# Stanza.

![Stanza](public/og-image.png)

A minimalist platform for time-limited ideas.

---

## What is Stanza?

Stanza is a text-first discussion space where every post lives for exactly 24 hours and then disappears. It is designed for people who want to share a thought, spark a conversation, and let it go.

There are no follower counts, no profiles, no algorithmic feeds. Only writing, reading, voting, and time running out.

---

## Product

### The Core Idea

Most social platforms are designed for permanence. Content accumulates, gets indexed, and follows you forever. Stanza works in the opposite direction: posts are ephemeral by design. The 24-hour lifespan creates a sense of urgency that encourages genuine, in-the-moment participation rather than performative posting.

### Who Is It For?

Stanza is for people who want to share something worth reading — a reflection, a question, a take — without the pressure of building an audience or maintaining a presence. It works particularly well for literary and intellectual communities where the quality of the idea matters more than the identity of the person sharing it.

### Design Principles

- **Text first.** The reading experience is the product. Typography, whitespace, and silence are the primary design tools.
- **Ephemerality as feature.** Posts expire. The feed is always fresh. There is no archive to curate.
- **Minimal identity.** Users have a username. That is all. No bios, no avatars, no follower counts.
- **Urgency by design.** Posts approaching expiration are visually flagged, creating a natural rhythm of discovery and loss.

---

## Features

### Authentication
- Passwordless sign-in via magic link email (Supabase Auth)
- First-time users choose a username on their first login
- Sessions persist across page reloads

### Posts
- Create a post with a title, body, and optional cover image
- Posts expire automatically 24 hours after creation
- Images are stored in Supabase Storage

### Feed
- Four sort modes: **Top** (most votes), **Undiscovered** (fewest votes), **Just Added** (newest), **Last Call** (expiring soonest)
- Feed refreshes every 30 seconds automatically
- Expired posts are never shown

### Voting
- One upvote per post per device
- Vote counts are updated atomically via a PostgreSQL function

### Comments
- Comments require authentication
- Comment counts are shown on post cards in the feed

### Urgency Indicators
- Posts with less than 4 hours remaining are flagged visually in the feed

---

## Tech Stack

**Frontend**
- React 19, TypeScript, Vite
- Tailwind CSS (via CDN)
- Merriweather (serif) + Inter (sans-serif) typography
- Lucide React icons

**Backend**
- Vercel Serverless Functions (Node.js, ESM)
- Supabase (PostgreSQL, Row Level Security, Storage, Auth)

**Deployment**
- Vercel (frontend + API routes)
- GitHub (source, triggers Vercel deploys on push)

---

## Project Structure

```
stanza/
├── api/                  # Vercel serverless functions
│   ├── auth/             # Magic link, session, logout
│   ├── posts/            # Create, list, fetch by id
│   ├── votes/            # Upvote
│   └── comments/         # Create comment
├── components/           # React UI components
├── context/              # AppContext (global state + API calls)
├── lib/                  # Supabase clients (browser + server)
├── supabase/
│   └── schema.sql        # Database schema and RLS policies
├── public/               # Static assets (favicon, OG image)
├── docs/                 # Setup and deployment guides
└── index.html            # Entry point
```

---

## Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Vercel](https://vercel.com) account

### 1. Clone and install

```bash
git clone https://github.com/yourusername/stanza.git
cd stanza
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```bash
# Supabase — frontend (exposed to browser via Vite)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Supabase — backend (server-side only, not exposed)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key

# Application
APP_URL=http://localhost:3000
```

### 3. Set up the database

In your Supabase project, open the SQL Editor and run the contents of `supabase/schema.sql`. This creates all tables, indexes, RLS policies, and the `increment_post_votes` function.

Then create a Storage bucket named `post-images` with public read access.

### 4. Configure Supabase Auth

In the Supabase Dashboard under **Authentication → URL Configuration**:
- Set **Site URL** to your production domain (e.g. `https://stanza-app.vercel.app`)
- Add your production domain to **Redirect URLs**

To customise the magic link email, go to **Authentication → Email Templates → Magic Link**.

### 5. Run locally

```bash
npm run dev
```

The app runs on `http://localhost:3000`. API routes are served by Vite's dev proxy.

### 6. Deploy to Vercel

1. Push to GitHub
2. Import the repository in the Vercel dashboard
3. Add the following environment variables in Vercel (Settings → Environment Variables):

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (keep secret) |
| `APP_URL` | Your Vercel production URL |

4. Deploy. Vercel picks up the `vercel.json` configuration automatically.

---

## Database Schema

| Table | Purpose |
|---|---|
| `users` | User profiles (id, email, username) |
| `posts` | Post content, author, expiry, vote count |
| `comments` | Comments linked to posts and users |
| `votes` | One vote per post per device (unique constraint) |

Row Level Security is enabled on all tables. The service role key is only used server-side in API routes.

---

## License

MIT
