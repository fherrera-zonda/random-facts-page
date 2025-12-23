# AquaRandom - Random Content Platform

A bilingual (Spanish/English) web application that delivers random memes, news, and fun facts with a beautiful water-themed design. Perfect for QR code campaigns to capture user metadata and contact information.

## Features

- Random content delivery (memes, environmental news, fun facts)
- Bilingual support (Spanish/English)
- Cookie consent with metadata capture
- Configurable free hits before requiring user information
- Beautiful water/ocean-themed responsive design
- SQLite database for visitor tracking
- User information collection (email, phone, name)

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# For development with auto-reload
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Configuration

Edit the `.env` file to configure:

```env
PORT=3000
NODE_ENV=development
FREE_HITS_LIMIT=3  # Number of free content views before requiring user info
```

## Project Structure

```
agua-proyecto/
├── server.js           # Express server and API routes
├── database.js         # SQLite database setup and queries
├── content-providers.js # Content APIs (facts, news, memes)
├── public/
│   ├── index.html      # Main HTML page
│   ├── styles.css      # Water-themed styles
│   └── app.js          # Frontend JavaScript
├── package.json
├── .env                # Environment configuration
└── README.md
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/visitor/init` | POST | Initialize or retrieve visitor session |
| `/api/visitor/accept-cookies` | POST | Record cookie consent |
| `/api/visitor/save-info` | POST | Save user contact information |
| `/api/content/random` | POST | Get random content (fact, news, or meme) |
| `/api/config` | GET | Get application configuration |
| `/api/admin/stats` | GET | Get visitor statistics (admin) |

## Hosting Recommendations

### Recommended: Railway.app
- One-click deployment from GitHub
- Free tier available
- Automatic HTTPS
- Easy environment variable management
- Persistent storage for SQLite

```bash
# Deploy to Railway
railway login
railway init
railway up
```

### Alternative Options:

1. **Render.com**
   - Free tier with 750 hours/month
   - Auto-deploy from GitHub
   - Easy setup

2. **Fly.io**
   - Free tier available
   - Global edge deployment
   - Persistent volumes for database

3. **DigitalOcean App Platform**
   - $5/month starter
   - Simple deployment
   - Good for production

4. **Vercel** (with serverless adapter)
   - Excellent for static + API
   - Free tier generous
   - Note: Requires database migration to external service

### For Production:
- Consider migrating SQLite to PostgreSQL (Supabase, Neon, or Railway PostgreSQL)
- Add rate limiting
- Implement proper authentication for admin routes
- Set up monitoring (e.g., Sentry)

## QR Code Setup

Generate a QR code pointing to your deployed URL. Users scanning the QR will:

1. See the cookie consent modal
2. Accept cookies to start
3. Get 3 free random content views (configurable)
4. Be prompted to provide contact info for unlimited access

## Customization

### Changing Free Hits Limit
Edit `FREE_HITS_LIMIT` in `.env`:

```env
FREE_HITS_LIMIT=5  # Allow 5 free views
```

### Adding More Content
Edit `content-providers.js` to add more:
- Fun facts in the `funFacts` array
- News items in the `environmentNews` array
- Meme templates in the `memeTemplates` array

### Theming
The CSS uses CSS variables for easy theming. Edit `public/styles.css`:

```css
:root {
  --deep-ocean: #003847;
  --ocean-blue: #006994;
  --water-blue: #0099cc;
  --aqua: #00d4ff;
  /* ... more variables */
}
```

## Data Collected

When cookies are accepted, the following metadata is captured:
- IP address
- User agent
- Browser language
- Platform
- Screen resolution
- Timezone
- Referrer

When user provides info:
- Name (optional)
- Email (required)
- Phone (optional)
- Preferred language

## License

MIT License - Feel free to use and modify for your projects.

