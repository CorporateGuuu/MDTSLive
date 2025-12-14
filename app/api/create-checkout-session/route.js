import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { user_id, shipping_address } = await req.json();

    if (!user_id) {
      return Response.json({ error: 'User ID required' }, { status: 400 });
    }

    // Fetch cart items with product details
    const { data: itemsWithProducts, error: cartError } = await supabase
      .from('cart_items')
      .select('quantity, products(name, price)')
      .eq('user_id', user_id)
      .limit(100);

    if (cartError) {
      console.error('Cart fetch error:', cartError);
      return Response.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }

    if (!itemsWithProducts || itemsWithProducts.length === 0) {
      return Response.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Create line items for Stripe
    const lineItems = itemsWithProducts.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.products.name,
        },
        unit_amount: Math.round(item.products.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Calculate total
    const total = itemsWithProducts.reduce(
      (sum, item) => sum + (item.quantity * item.products.price),
      0
    );

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment', // One-time payment; use 'subscription' for recurring
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cart`,
      metadata: {
        user_id: user_id.toString()
      }, // For webhook identification
    });

    // Create pending order in database
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id,
        stripe_session_id: session.id,
        total: total,
        status: 'pending'
      });

    if (orderError) {
      console.error('Order creation error:', orderError);
      // Don't fail the request, but log the error
    }

    return Response.json({
      sessionId: session.id,
      url: session.url // Stripe-hosted checkout URL
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return Response.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
