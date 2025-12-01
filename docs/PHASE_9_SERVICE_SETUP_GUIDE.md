# 🚀 Phase 9: Third-Party Service Setup Guide - Nexus TechHub

## 📋 **CRITICAL SERVICES SETUP (Must Complete Before Going Live)**

### **1. Stripe Payment Processing (CRITICAL) 🔴**

#### **Account Setup:**
1. **Visit**: https://dashboard.stripe.com/register
2. **Create Account** with UAE business information:
   - Business Name: Nexus TechHub
   - Business Type: Technology/E-commerce
   - Country: United Arab Emirates
   - Address: FAMC3062, Compass Building, Al Shohada Road, AL Hamra Industrial Zone-FZ, Ras Al Khaimah, UAE
   - Phone: +971 58 553 1029

#### **Business Verification:**
1. **Complete KYC** (Know Your Customer) verification
2. **Upload required documents**:
   - UAE Trade License
   - Emirates ID of business owner
   - Bank account details
3. **Enable live payments** after verification approval

#### **API Configuration:**
1. **Get Live API Keys**:
   - Go to Developers > API keys
   - Copy Publishable key (starts with `pk_live_`)
   - Copy Secret key (starts with `sk_live_`)

2. **Set up Webhooks**:
   - Go to Developers > Webhooks
   - Add endpoint: `https://nexustechhub.netlify.app/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook signing secret (starts with `whsec_`)

#### **Environment Variables:**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your_publishable_key_here"
STRIPE_SECRET_KEY="sk_live_your_secret_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
```

---

### **2. Google OAuth Authentication (CRITICAL) 🔴**

#### **Google Cloud Console Setup:**
1. **Visit**: https://console.cloud.google.com/
2. **Create New Project**:
   - Project Name: Nexus TechHub Production
   - Organization: Your organization (if applicable)

#### **Enable APIs:**
1. **Go to**: APIs & Services > Library
2. **Enable**: Google+ API
3. **Enable**: Google Identity API

#### **OAuth Consent Screen:**
1. **Go to**: APIs & Services > OAuth consent screen
2. **User Type**: External
3. **App Information**:
   - App name: Nexus TechHub
   - User support email: support@nexustechhub.ae
   - Developer contact: admin@nexustechhub.ae
   - App domain: nexustechhub.netlify.app
   - Privacy policy: https://nexustechhub.netlify.app/privacy
   - Terms of service: https://nexustechhub.netlify.app/terms

#### **Create Credentials:**
1. **Go to**: APIs & Services > Credentials
2. **Create Credentials** > OAuth 2.0 Client IDs
3. **Application Type**: Web application
4. **Name**: Nexus TechHub Production
5. **Authorized redirect URIs**:
   - `https://nexustechhub.netlify.app/api/auth/callback/google`

#### **Environment Variables:**
```bash
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
```

---

### **3. Email Service Configuration (CRITICAL) 🔴**

#### **Option A: Gmail with App Password (Recommended)**

1. **Enable 2-Factor Authentication**:
   - Go to Google Account settings
   - Security > 2-Step Verification
   - Enable 2FA

2. **Generate App Password**:
   - Go to Security > App passwords
   - Select app: Mail
   - Select device: Other (Custom name)
   - Name: Nexus TechHub Production
   - Copy the generated 16-character password

#### **Option B: SendGrid (Alternative)**

1. **Visit**: https://sendgrid.com/
2. **Create Account** and verify email
3. **Create API Key**:
   - Go to Settings > API Keys
   - Create API Key with Full Access
   - Copy the API key

#### **Environment Variables (Gmail):**
```bash
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your_gmail_address@gmail.com"
EMAIL_SERVER_PASSWORD="your_16_character_app_password"
EMAIL_FROM="noreply@nexustechhub.ae"
```

#### **Environment Variables (SendGrid):**
```bash
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="your_sendgrid_api_key"
EMAIL_FROM="noreply@nexustechhub.ae"
```

---

## 📊 **HIGH PRIORITY SERVICES SETUP (Complete Within 1 Week)**

### **4. Sentry Error Monitoring (HIGH PRIORITY) 🟡**

#### **Account Setup:**
1. **Visit**: https://sentry.io/signup/
2. **Create Account** with business email
3. **Create New Project**:
   - Platform: Next.js
   - Project Name: nexus-techhub-production

#### **Configuration:**
1. **Get DSN**:
   - Go to Settings > Projects > nexus-techhub-production
   - Client Keys (DSN)
   - Copy the DSN URL

#### **Environment Variables:**
```bash
SENTRY_DSN="https://your_sentry_dsn_here@sentry.io/project_id"
```

---

### **5. Google Analytics 4 (HIGH PRIORITY) 🟡**

#### **Setup:**
1. **Visit**: https://analytics.google.com/
2. **Create Account**:
   - Account Name: Nexus TechHub
   - Property Name: Nexus TechHub Website
   - Industry: Technology
   - Business Size: Small business
   - Country: United Arab Emirates
   - Currency: UAE Dirham (AED)

3. **Create Data Stream**:
   - Platform: Web
   - Website URL: https://nexustechhub.netlify.app
   - Stream Name: Nexus TechHub Production

#### **Environment Variables:**
```bash
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

---

### **6. Push Notifications (HIGH PRIORITY) 🟡**

#### **Generate VAPID Keys:**

**Option A: Using web-push CLI**
```bash
npm install -g web-push
web-push generate-vapid-keys
```

**Option B: Online Generator**
- Visit: https://vapidkeys.com/
- Generate new key pair

#### **Environment Variables:**
```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your_vapid_public_key_here"
VAPID_PRIVATE_KEY="your_vapid_private_key_here"
VAPID_SUBJECT="mailto:${BUSINESS_EMAIL}"
```

---

## 🖼️ **MEDIUM PRIORITY SERVICES SETUP (Complete Within 1 Month)**

### **7. Cloudinary Image Optimization (MEDIUM PRIORITY) 🟢**

#### **Account Setup:**
1. **Visit**: https://cloudinary.com/users/register/free
2. **Create Account** with business details
3. **Verify Email** and complete setup

#### **Get API Credentials:**
1. **Go to**: Dashboard
2. **Copy**:
   - Cloud Name
   - API Key
   - API Secret

#### **Environment Variables:**
```bash
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

---

### **8. Business Operations (OPTIONAL)**

#### **Slack Webhooks:**
1. **Go to**: https://api.slack.com/apps
2. **Create New App** > From scratch
3. **Add Incoming Webhooks**
4. **Create webhook** for your channel

#### **Zapier Automation:**
1. **Visit**: https://zapier.com/
2. **Create Account** and set up workflows
3. **Create webhook** for order processing

#### **Environment Variables:**
```bash
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/your/webhook/url"
ZAPIER_WEBHOOK_URL="https://hooks.zapier.com/hooks/catch/your/webhook"
```

---

## 🔧 **NETLIFY ENVIRONMENT VARIABLES SETUP**

### **Step 1: Access Netlify Dashboard**
1. **Visit**: https://app.netlify.com/
2. **Go to**: Sites > nexustechhub
3. **Navigate to**: Site settings > Environment variables

### **Step 2: Add All Environment Variables**
Copy all the environment variables from above and add them to Netlify:

#### **Critical Variables (Must Set):**
- `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
- `NEXTAUTH_URL` = `https://nexustechhub.netlify.app`
- All Stripe variables
- All Google OAuth variables
- All Email service variables

#### **High Priority Variables:**
- Sentry DSN
- Google Analytics ID
- VAPID keys

#### **Medium Priority Variables:**
- Cloudinary credentials
- Webhook URLs

### **Step 3: Deploy and Test**
1. **Trigger Deployment** in Netlify
2. **Run Validation**: `npm run validate:production`
3. **Test Critical Features**:
   - User authentication
   - Payment processing
   - Email delivery

---

## ✅ **VERIFICATION CHECKLIST**

### **Before Going Live:**
- [ ] Stripe account verified and live keys configured
- [ ] Google OAuth working with production credentials
- [ ] Email authentication sending emails successfully
- [ ] All environment variables set in Netlify
- [ ] Site accessible at https://nexustechhub.netlify.app
- [ ] Payment test completed with small amount
- [ ] User registration and login working
- [ ] Error monitoring active in Sentry

### **Post-Launch (Within 1 Week):**
- [ ] Google Analytics tracking visitors
- [ ] Push notifications working
- [ ] Image optimization through Cloudinary
- [ ] Performance monitoring active
- [ ] Business operations workflows configured

---

## 📞 **SUPPORT CONTACTS**

**Technical Issues:**
- Email: admin@nexustechhub.ae
- Phone: +971 58 553 1029
- WhatsApp: https://wa.me/971585531029

**Service-Specific Support:**
- Stripe: https://support.stripe.com/
- Google Cloud: https://cloud.google.com/support
- Sentry: https://sentry.io/support/
- Netlify: https://docs.netlify.com/

---

*This guide ensures all third-party services are properly configured for Nexus TechHub's live production deployment in the UAE market.*
