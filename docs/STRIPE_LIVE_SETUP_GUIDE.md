# 🚀 Stripe Live Setup Guide - Nexus TechHub UAE

## ✅ **Your Current Status**

**Stripe Account**: ✅ Verified UAE Business Account  
**API Keys**: ✅ Live keys obtained  
**Webhook Endpoint**: ✅ Exists in codebase  
**Next Step**: Configure Stripe Dashboard and Deploy  

---

## 🔧 **Step 1: Configure Stripe Dashboard Settings**

### **1.1 Enable Payment Methods for AED**
1. **Go to**: https://dashboard.stripe.com/settings/payment_methods
2. **Enable these payment methods for AED**:
   - ✅ **Cards** (Visa, Mastercard, American Express)
   - ✅ **Apple Pay** (for mobile users)
   - ✅ **Google Pay** (for Android users)
   - ✅ **Link** (Stripe's payment method)

### **1.2 Enable Stripe Tax (Important for UAE VAT)**
1. **Go to**: https://dashboard.stripe.com/settings/tax
2. **Click "Enable Stripe Tax"**
3. **Configure for UAE**:
   - Country: United Arab Emirates
   - Tax Rate: 5% VAT
   - Business Type: Retail/E-commerce

### **1.3 Set Up Webhook Endpoint**
1. **Go to**: https://dashboard.stripe.com/webhooks
2. **Click "Add endpoint"**
3. **Endpoint URL**: `https://nexustechhub.netlify.app/api/stripe/webhook`
4. **Description**: "Nexus TechHub Production Webhook"
5. **Select these events**:
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.expired`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `charge.succeeded`
   - ✅ `charge.failed`
   - ✅ `refund.created`
   - ✅ `customer.created`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
6. **Click "Add endpoint"**
7. **Copy the webhook signing secret** (starts with `whsec_`)

---

## 📝 **Step 2: Environment Variables Configuration**

### **2.1 Complete Environment Variables**
Copy these to your Netlify dashboard (Site Settings > Environment Variables):

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=[YOUR_NEXTAUTH_SECRET]
NEXTAUTH_URL=https://nexustechhub.netlify.app

# Stripe Live Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[YOUR_STRIPE_PUBLISHABLE_KEY]
STRIPE_SECRET_KEY=***

# Business Configuration
BUSINESS_NAME=Nexus Tech Hub
BUSINESS_EMAIL=[YOUR_BUSINESS_EMAIL]
BUSINESS_PHONE=[YOUR_BUSINESS_PHONE]
BUSINESS_WHATSAPP=[YOUR_WHATSAPP_LINK]
BUSINESS_ADDRESS=FAMC3062, Compass Building, Al Shohada Road, AL Hamra Industrial Zone-FZ, Ras Al Khaimah, UAE
BUSINESS_TIMEZONE=Asia/Dubai
BUSINESS_CURRENCY=AED
BUSINESS_COUNTRY=AE

# PWA Configuration
NEXT_PUBLIC_VAPID_PUBLIC_KEY=[YOUR_VAPID_PUBLIC_KEY]
VAPID_PRIVATE_KEY=[YOUR_VAPID_PRIVATE_KEY]
VAPID_SUBJECT=mailto:${BUSINESS_EMAIL}
```

### **2.2 Optional Services (Add Later)**
```bash
# Email Service (for customer notifications)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=[YOUR_EMAIL]
EMAIL_SERVER_PASSWORD=[YOUR_APP_PASSWORD]
EMAIL_FROM=noreply@nexustechhub.ae

# Google OAuth (for customer login)
GOOGLE_CLIENT_ID=[YOUR_GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[YOUR_GOOGLE_CLIENT_SECRET]

# Monitoring (for error tracking)
SENTRY_DSN=[YOUR_SENTRY_DSN]
GOOGLE_ANALYTICS_ID=[YOUR_GA_ID]

# Business Automation
SLACK_WEBHOOK_URL=[YOUR_SLACK_WEBHOOK]
ZAPIER_WEBHOOK_URL=[YOUR_ZAPIER_WEBHOOK]
```

---

## 🧪 **Step 3: Test Your Configuration**

### **3.1 Test Stripe Integration**
Run this command to test your live keys:

```bash
STRIPE_SECRET_KEY=sk_live_[YOUR_STRIPE_SECRET_KEY] node Scripts/test-stripe-live.js
```

**Expected Results**:
- ✅ Tax calculation created (5% VAT for UAE)
- ✅ Payment intent created successfully
- ✅ Checkout session created
- ✅ All tests pass

### **3.2 Test Webhook Endpoint**
After deployment, test the webhook:

```bash
curl -X POST https://nexustechhub.netlify.app/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

**Expected**: Should return method not allowed (405) - this confirms the endpoint exists.

---

## 🚀 **Step 4: Deploy to Production**

### **4.1 Add Environment Variables to Netlify**
1. **Go to**: https://app.netlify.com/
2. **Navigate to**: Sites → nexustechhub → Site settings → Environment variables
3. **Add each variable** from the list above
4. **Save changes**

### **4.2 Trigger Deployment**
1. **Go to**: Deploys tab in Netlify
2. **Click "Trigger deploy"** → "Deploy site"
3. **Wait for deployment** to complete (~2-3 minutes)

### **4.3 Verify Deployment**
Run the verification script:

```bash
node Scripts/verify-live-deployment.js
```

---

## ✅ **Step 5: Final Testing**

### **5.1 Test Payment Flow**
1. **Visit**: https://nexustechhub.netlify.app/enhanced-checkout
2. **Add a test product** (use small amount like 50 AED)
3. **Complete checkout** with test card: `4242 4242 4242 4242`
4. **Verify**:
   - ✅ 5% VAT calculated correctly
   - ✅ Payment processes successfully
   - ✅ Webhook receives event
   - ✅ Order confirmation works

### **5.2 Test Mobile Experience**
1. **Open site on mobile** device
2. **Test navigation** and product browsing
3. **Test WhatsApp button**: +971 58 553 1029
4. **Verify PWA** installation prompt

---

## 🎯 **Success Criteria**

Your Nexus TechHub website is ready when:

- ✅ **Stripe payments work** with live keys
- ✅ **UAE VAT (5%) calculated** correctly
- ✅ **AED currency** displayed throughout
- ✅ **Webhook endpoint** receives events
- ✅ **Mobile responsive** design works
- ✅ **WhatsApp integration** functional
- ✅ **All pages load** without errors

---

## 🆘 **Troubleshooting**

### **Common Issues**

**1. "No valid payment method types" Error**
- **Solution**: Enable Cards for AED in Stripe Dashboard
- **Go to**: Settings → Payment methods → Enable Cards

**2. "0% VAT calculated" Issue**
- **Solution**: Enable Stripe Tax in Dashboard
- **Go to**: Settings → Tax → Enable Stripe Tax

**3. "Webhook endpoint not found" Error**
- **Solution**: Ensure environment variables are set in Netlify
- **Check**: STRIPE_WEBHOOK_SECRET is correctly configured

**4. "Site not loading" Issue**
- **Solution**: Check Netlify deployment logs
- **Go to**: Netlify Dashboard → Deploys → View logs

---

## 📞 **Support Contacts**

- **Business Phone**: [YOUR_BUSINESS_PHONE]
- **WhatsApp**: [YOUR_WHATSAPP_LINK]
- **Email**: [YOUR_BUSINESS_EMAIL]
- **Stripe Support**: https://support.stripe.com/

---

**🎉 You're ready to go live with Nexus TechHub!**
