# Stripe Webhook Edge Function

This Supabase Edge Function handles Stripe webhook events for payment processing.

## Setup Instructions

### 1. Deploy the Function

```bash
# From your project root
supabase functions deploy stripe-webhook
```

### 2. Set Environment Variables

In your Supabase dashboard, go to Edge Functions > Environment Variables and set:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Configure Stripe Webhook

In your Stripe Dashboard:
1. Go to Webhooks > Add endpoint
2. URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. Test the Webhook

Use Stripe CLI for local testing:

```bash
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
```

## Function Behavior

- **checkout.session.completed**: Updates order status to 'paid' and clears user's cart
- **payment_intent.payment_failed**: Logs failed payment (can be extended for custom logic)

## Security

- Webhook signature verification ensures authenticity
- Service role key provides necessary database permissions
- All sensitive operations happen server-side
