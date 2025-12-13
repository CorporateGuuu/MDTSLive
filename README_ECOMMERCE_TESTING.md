# 🧪 E-Commerce Testing Guide

## Complete Testing Flow for the E-Commerce System

### Prerequisites
- ✅ Next.js app running: `npm run dev`
- ✅ Supabase database seeded with products
- ✅ Stripe test account configured
- ✅ Environment variables set

---

## 🧪 **Automated Testing**

Run the automated test script to verify setup:

```bash
node test-ecommerce-flow.js
```

This will check:
- Database tables exist and are accessible
- Products are seeded
- Cart operations work
- Stripe environment variables are configured

---

## 📋 **Manual Testing Steps**

### **Step 1: Add Items to Cart (Guest Mode)**
1. Visit the homepage (`http://localhost:3000`)
2. Click "Add to Cart" on any toolkit in the carousel
3. Notice the cart badge in the header updates with item count
4. Click the cart icon to preview items (optional)

**Expected:** Cart badge shows "1", items persist in localStorage

---

### **Step 2: Login & Cart Sync**
1. Click "Sign In" in the header
2. Use the AuthModal to create an account or sign in
3. After successful authentication, the guest cart automatically syncs

**Expected:**
- AuthModal closes
- Cart badge remains (items transferred to database)
- Header shows "My Account" instead of "Sign In"

**Verify in Supabase:**
- Check `cart_items` table for your user_id
- Items should appear with correct quantities

---

### **Step 3: Stripe Checkout**
1. Click the cart icon in header or go to `/cart`
2. Review cart items and quantities
3. Click "Proceed to Checkout"
4. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date (e.g., 12/30)
   - Any CVC (e.g., 123)
   - Any name/email

**Expected:**
- Redirects to Stripe hosted checkout
- Payment processes successfully
- Redirects back to `/success`

---

### **Step 4: Verify Success & Database**
1. Check you're on the success page
2. Order details should display correctly

**Verify in Supabase:**
- Check `orders` table for new entry
- Status should be "paid"
- `stripe_session_id` should match the session
- User's cart should be empty (cleared after payment)

---

### **Step 5: Test Search Functionality**
1. Go back to homepage
2. Type in the search bar (e.g., "iPhone", "repair", etc.)
3. Autocomplete dropdown should appear with product suggestions
4. Click on a result to navigate to product details

**Expected:**
- Fast autocomplete responses
- Relevant product suggestions
- Proper navigation to product pages

---

## 🔧 **Testing Commands**

### **Database Verification**
```bash
# Check orders table
psql -h your-db-host -U postgres -d postgres -c "SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;"

# Check cart items
psql -h your-db-host -U postgres -d postgres -c "SELECT * FROM cart_items LIMIT 10;"

# Check products
psql -h your-db-host -U postgres -d postgres -c "SELECT id, name, price FROM products LIMIT 5;"
```

### **Stripe Testing**
```bash
# Test webhook locally (requires Stripe CLI)
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook

# List recent payments in Stripe dashboard
# Go to: https://dashboard.stripe.com/test/payments
```

---

## 🚨 **Common Issues & Solutions**

### **Cart Not Syncing After Login**
- Check browser console for errors
- Verify Supabase auth is working
- Check localStorage has guest_cart data

### **Stripe Checkout Not Loading**
- Verify NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set
- Check Stripe dashboard for test mode
- Ensure @stripe/stripe-js is installed

### **Webhook Not Processing**
- Deploy Edge Function: `supabase functions deploy stripe-webhook`
- Set environment variables in Supabase dashboard
- Configure webhook endpoint in Stripe dashboard

### **Products Not Showing**
- Run the seeding script: `node Scripts/seed-supabase.js`
- Check Supabase dashboard for products table data

---

## 📊 **Test Checklist**

- [ ] Homepage loads with products
- [ ] Add to cart works (guest mode)
- [ ] Cart badge updates correctly
- [ ] Authentication modal opens
- [ ] User can sign up/sign in
- [ ] Guest cart syncs after login
- [ ] Cart page shows items correctly
- [ ] Quantity controls work
- [ ] Checkout button works
- [ ] Stripe checkout loads
- [ ] Test payment succeeds
- [ ] Redirects to success page
- [ ] Order appears in database as "paid"
- [ ] Cart is cleared after payment
- [ ] Search autocomplete works
- [ ] Product navigation works

---

## 🎯 **Full User Journey Test**

1. **Browse** → Homepage with toolkits
2. **Add to Cart** → Guest cart storage
3. **Sign In** → Supabase authentication
4. **Cart Sync** → Database persistence
5. **Checkout** → Stripe payment
6. **Success** → Order confirmation
7. **Search** → Product discovery

**Result:** Complete e-commerce experience from browse to purchase! 🛒💳✅
