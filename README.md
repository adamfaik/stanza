# Stanza

**A minimalist, text-first social platform for book lovers to share fleeting thoughts and discussions.**

Every post has a strict 24-hour lifespan, creating a sense of urgency and casual conversation—like a pop-up book club that disappears.

## ✨ Features

- **Magic Link Authentication** - Passwordless email sign-in
- **24-Hour Posts** - All content expires after 24 hours
- **Image Support** - One image per post, stored in cloud
- **Voting System** - Simple upvote with spam prevention
- **Comments** - Login-required discussions
- **Smart Sorting** - Top, Undiscovered, Just Added, Last Call
- **Urgency Indicators** - Visual alerts for posts expiring soon
- **Polished Design** - Clean typography, whitespace, modern aesthetics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account (database & storage)
- Resend account (email service)
- Vercel account (hosting)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stanza.git
   cd stanza
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your API keys (see docs/guides/SETUP.md)
   ```

4. **Set up Supabase database**
   - Run the SQL in `supabase/schema.sql`
   - Create `post-images` storage bucket

5. **Deploy to Vercel**
   ```bash
   git push origin main
   # Then import into Vercel dashboard
   ```

📖 **Detailed instructions**: See [`docs/NEXT_STEPS.md`](docs/NEXT_STEPS.md)

## 📁 Project Structure

```
stanza/
├── api/                    # Vercel serverless functions
│   ├── auth/              # Authentication endpoints
│   ├── posts/             # Posts CRUD operations
│   ├── votes/             # Voting system
│   └── comments/          # Comments system
├── components/            # React components
├── context/               # React context (state management)
├── lib/                   # Shared utilities
│   ├── supabase.ts       # Database client
│   ├── auth.ts           # JWT & session management
│   ├── middleware.ts     # Rate limiting, validation
│   └── email.ts          # Email templates
├── supabase/             # Database schema
├── docs/                 # Documentation
│   ├── NEXT_STEPS.md    # Start here!
│   ├── specs.md         # Original specifications
│   └── guides/          # Detailed guides
└── public/              # Static assets
```

## 🛠️ Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- Lucide Icons

**Backend:**
- Vercel Serverless Functions
- Supabase (PostgreSQL)
- Supabase Storage
- JWT Authentication

**Services:**
- Resend (Email)
- Vercel (Hosting)

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[docs/NEXT_STEPS.md](docs/NEXT_STEPS.md)** | 👈 Start here! Quick action guide |
| [docs/guides/SETUP.md](docs/guides/SETUP.md) | Detailed setup instructions |
| [docs/guides/QUICK_DEPLOY.md](docs/guides/QUICK_DEPLOY.md) | Fast deployment guide |
| [docs/guides/DEPLOYMENT_CHECKLIST.md](docs/guides/DEPLOYMENT_CHECKLIST.md) | Interactive deployment checklist |
| [docs/guides/LOCAL_DEVELOPMENT.md](docs/guides/LOCAL_DEVELOPMENT.md) | Local development guide |
| [docs/IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md) | Technical implementation details |

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- HTTP-only secure cookies
- CSRF protection via SameSite cookies
- Rate limiting on authentication endpoints
- Input validation and sanitization
- Service keys kept server-side only

## 🌐 Environment Variables

Required environment variables:

```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Email Service
EMAIL_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com

# Application
APP_URL=https://your-domain.vercel.app
JWT_SECRET=your_random_secret
```

See [`.env.example`](.env.example) for a complete template.

## 🚢 Deployment

**Recommended**: Deploy to Vercel for automatic serverless function handling.

1. Push to GitHub
2. Import into Vercel
3. Add environment variables
4. Deploy!

📖 **Full guide**: See [`docs/guides/QUICK_DEPLOY.md`](docs/guides/QUICK_DEPLOY.md)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with care for book lovers who value meaningful, ephemeral conversations.**
