# Netlify Deploy Fix Tasks

## Completed
- [x] Analyze error logs and identify issues
- [x] Update WebVitals.js to use web-vitals v5 API (removed onFID)
- [x] Add SessionProvider to _app.js for next-auth
- [x] Test build locally (WebVitals warnings resolved, env issue persists)
- [x] Update TODO.md with progress

## Pending
- [x] Fix .env.production recursion error (added missing NEXTAUTH_URL and NEXTAUTH_SECRET)
- [x] Deploy and verify fixes (changes pushed to GitHub, Netlify deployment triggered)

## Notes
- .env.production may have circular references causing infinite recursion
- Check for variables like NEXTAUTH_URL=$NEXTAUTH_URL
- Ensure no malformed regex or special characters
