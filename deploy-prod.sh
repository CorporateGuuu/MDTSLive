#!/bin/bash
# deploy-prod.sh

echo "Starting Production Deploy..."

# 1. Build
npm run build

# 2. Push to Git (Vercel)
git add .
git commit -m "chore: deploy to production"
git push origin main

# 3. Run Supabase Prod Migrations
supabase db push --project-ref YOUR-PROD-PROJECT-ID

# 4. Verify
echo "Deploy complete! Check: https://nexustechhub.com/"
echo "Admin: https://nexustechhub.com/admin"
