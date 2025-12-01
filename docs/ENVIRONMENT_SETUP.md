# 🔧 Environment Variables Setup Guide - Nexus TechHub Phase 9

## 🔴 CRITICAL VARIABLES (Must be configured before going live)

### Stripe Payment Processing
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (starts with pk_live_)
- `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with sk_live_)
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret (starts with whsec_)

### Google OAuth Authentication
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

### Email Service
- `EMAIL_SERVER_HOST`: SMTP host (e.g., smtp.gmail.com)
- `EMAIL_SERVER_USER`: SMTP username/email
- `EMAIL_SERVER_PASSWORD`: SMTP password or app password

## 🟡 HIGH PRIORITY VARIABLES (Should be configured within 1 week)

### Error Monitoring
- `SENTRY_DSN`: Your Sentry project DSN

### Analytics
- `GOOGLE_ANALYTICS_ID`: Your Google Analytics 4 measurement ID

### Push Notifications
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: Generated VAPID public key
- `VAPID_PRIVATE_KEY`: Generated VAPID private key

## 🟢 MEDIUM PRIORITY VARIABLES (Can be configured later)

### Image Optimization
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Business Operations
- `SLACK_WEBHOOK_URL`: Slack webhook for notifications
- `ZAPIER_WEBHOOK_URL`: Zapier webhook for automation

## 📋 Setup Instructions

1. **Copy the environment variables** from netlify-env-vars.txt
2. **Go to Netlify Dashboard**: https://app.netlify.com/
3. **Navigate to**: Sites > nexustechhub > Site settings > Environment variables
4. **Add each variable** with its corresponding value
5. **Replace all "REPLACE_WITH_" placeholders** with actual values
6. **Deploy your site** to apply the changes

## 🔒 Security Notes

- Never commit real API keys to version control
- Keep private keys secure and never expose them in client-side code
- Use environment variables for all sensitive configuration
- Regularly rotate API keys and secrets

## 📞 Support

If you need help setting up any of these services:
- Email: ${ADMIN_EMAIL}
- Phone: +971 58 553 1029
- WhatsApp: https://wa.me/971585531029
