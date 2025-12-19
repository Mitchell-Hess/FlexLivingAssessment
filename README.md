# Flex Living Reviews Dashboard

Reviews management dashboard for property managers. Filter and analyze guest reviews from multiple booking channels, and control what displays on public property pages.

## Tech Stack

Next.js 16, TypeScript, Tailwind CSS 4

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

**Pages:**
- `/` - Homepage
- `/dashboard` - Manager dashboard
- `/property/2B-N1` - Property page

## API Endpoints

**GET /api/reviews/hostaway**
Fetch reviews. Query params: `property`, `channel`, `minRating`, `sort`, `order`

**GET /api/reviews/approve**
Get approved review IDs

**POST /api/reviews/approve**
```bash
curl -X POST http://localhost:3000/api/reviews/approve \
  -H "Content-Type: application/json" \
  -d '{"reviewId": 7453, "approved": true}'
```

## Project Structure

```
app/
├── api/reviews/         # API routes
├── dashboard/           # Manager dashboard
├── property/[id]/       # Property pages
└── page.tsx            # Homepage
components/             # React components
lib/types/             # TypeScript types
public/data/           # Mock review data
```

## How It Works

**Manager Dashboard:** View all reviews, apply filters, click "Approve" to publish reviews to property pages.

**Property Pages:** Display only approved reviews with ratings and category breakdowns.

The app uses mock data by default. All features work out of the box.

## Deployment

```bash
npm run build
npm start
```

Or deploy to Vercel:
```bash
vercel deploy
```

No environment variables needed.

## Troubleshooting

**Port in use:**
```bash
PORT=3001 npm run dev
```

**Dependency issues:**
```bash
rm -rf node_modules package-lock.json && npm install
```

## Google Reviews Integration

Google Reviews integration was explored but not implemented. The Google Places API requires:
- Business verification and API key setup
- Per-request costs (approximately $0.017 per review fetch)
- Complex OAuth flow for business owner verification

For this assessment, the focus remained on the Hostaway API integration with extensible architecture that could accommodate Google Reviews in the future.

## License

Created as a developer assessment for Flex Living.
