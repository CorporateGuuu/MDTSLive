import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseServer } from '../../../lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  const supabase = supabaseServer;

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Update order status to paid
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id);

        if (error) {
          console.error('Error updating order status:', error);
        } else {
          console.log(`Order ${session.id} marked as paid`);

          // Send confirmation email (you can implement this)
          // await sendOrderConfirmationEmail(session);
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log(`Payment failed for payment intent: ${paymentIntent.id}`);

        // You could update order status to failed here if needed
        // This would require storing payment_intent_id in the order

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Optional: Email sending function (implement with Resend or SendGrid)
// async function sendOrderConfirmationEmail(session: Stripe.Checkout.Session) {
//   try {
//     // Implement email sending logic here
//     // You can use Resend, SendGrid, or another email service
//
//     // Example with Resend:
//     // await fetch('https://api.resend.com/emails', {
//     //   method: 'POST',
//     //   headers: {
//     //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
//     //     'Content-Type': 'application/json',
//     //   },
//     //   body: JSON.stringify({
//     //     from: 'orders@nexustechhub.com',
//     //     to: session.customer_details?.email,
//     //     subject: 'Order Confirmation - Midas Technical Solutions',
//     //     html: generateOrderEmailHTML(session),
//     //   }),
//     // });
//
//     console.log('Order confirmation email sent');
//   } catch (error) {
//     console.error('Error sending confirmation email:', error);
//   }
// }
