# Google Analytics Setup Guide

## 1. Get Your Google Analytics Tracking ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Create a new property or select existing one for Nexus TechHub
4. Go to Admin → Property → Data Streams
5. Select your web data stream
6. Copy the Measurement ID (format: G-XXXXXXXXXX)

## 2. Set Environment Variable

Add the following to your environment files:

### For Production (.env.production):
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### For Local Development (.env.local):
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Google Analytics Measurement ID.

## 3. Verify Setup

Run the verification script:
```bash
node scripts/verify-ga-setup.js
```

## 4. Test GA Tracking

1. Deploy to production
2. Open your website in a browser
3. Open Developer Tools (F12)
4. Go to Network tab
5. Filter for "google" or "gtag"
6. Refresh the page
7. You should see requests to `googletagmanager.com`

## 5. Verify Data Collection

1. Go to Google Analytics dashboard
2. Wait 24-48 hours for data to appear
3. Check Real-time reports to see active users
4. Check Acquisition reports for traffic sources

## 6. Submit Sitemap to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property: `https://nexustechhub.com`
3. Verify ownership (use HTML file method or DNS record)
4. Go to Sitemaps section
5. Submit: `https://nexustechhub.com/sitemap.xml`

## 7. UAE-Specific SEO Considerations

- Target UAE keywords: "mobile repair parts UAE", "iPhone parts Dubai", etc.
- Consider local business listings and UAE tech directories
- Monitor performance in Google Analytics for UAE traffic

## Troubleshooting

- If GA tracking ID is not working, check browser console for errors
- Ensure the GA ID format is correct (G-XXXXXXXXXX)
- Verify the Analytics component is loading in _app.js
- Check that you're not blocking Google Analytics in ad blockers

## Current Status

✅ Google Analytics component implemented
✅ Component integrated in _app.js
✅ Sitemap configured for production
✅ Robots.txt configured for production
❌ NEXT_PUBLIC_GA_ID needs to be set
❌ Testing on production needed
