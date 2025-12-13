import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Disable Next.js body parsing for raw webhook data
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const body = await req.text();
    const sig = headers().get('stripe-signature');

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;

        // Update order status to paid
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id);

        if (updateError) {
          console.error('Failed to update order status:', updateError);
          return Response.json({ error: 'Failed to update order' }, { status: 500 });
        }

        // Clear user's cart after successful payment
        const { error: cartError } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', session.metadata.user_id);

        if (cartError) {
          console.error('Failed to clear cart:', cartError);
          // Don't fail the webhook for this
        }

        console.log('Payment successful for session:', session.id);
        break;

      case 'payment_intent.payment_failed':
        // Handle failed payments
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);

        // Optionally update order status to failed
        // This depends on your business logic

        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return Response.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
