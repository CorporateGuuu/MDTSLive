import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.5.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',  // Latest as of Dec 2025
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig ?? '',
      Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.user_id;

      if (!userId) {
        console.error('No user_id in session metadata');
        return new Response('Missing user_id', { status: 400 });
      }

      console.log('Processing payment for user:', userId, 'session:', session.id);

      // Update order status to paid
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_session_id', session.id)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Failed to update order status:', updateError);
        return new Response('Failed to update order', { status: 500 });
      }

      // Clear user's cart after successful payment
      const { error: cartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (cartError) {
        console.error('Failed to clear cart:', cartError);
        // Don't fail the webhook for cart clearing issues
      }

      console.log('Payment processed successfully for session:', session.id);

      // Optional: Send email confirmation
      // You can integrate with SendGrid or Supabase email here

    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      console.log('Payment failed:', paymentIntent.id);

      // Optionally update order status to failed
      // This depends on your business logic
    }

    return new Response('OK', { status: 200 });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return new Response('Internal server error', { status: 500 });
  }
});
