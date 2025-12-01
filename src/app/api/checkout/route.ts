import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Stripe from 'stripe';
import { handleError } from '../../../utils/handleError';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { items, paymentMethodId, saveCard, savedCardId } = await request.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  try {
    // Create or retrieve Stripe customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
    }

    let sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'payment',
      customer: customer.id,
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            metadata: { condition: item.condition },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      })),
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      metadata: { user_id: user.id },
      shipping_address_collection: { allowed_countries: ['US'] },
      allow_promotion_codes: true,
    };

    // Handle saved card payment
    if (savedCardId) {
      // Get the saved payment method from database
      const { data: savedCard } = await supabase
        .from('payment_methods')
        .select('stripe_pm_id')
        .eq('id', savedCardId)
        .eq('user_id', user.id)
        .single();

      if (!savedCard) {
        return NextResponse.json({ error: 'Saved payment method not found' }, { status: 404 });
      }

      // For saved cards, attach the payment method to the customer first
      await stripe.paymentMethods.attach(savedCard.stripe_pm_id, {
        customer: customer.id,
      });

      sessionConfig.payment_intent_data = {
        setup_future_usage: 'off_session',
      };
    }
    // Handle Apple Pay / Google Pay
    else if (paymentMethodId) {
      sessionConfig.payment_intent_data = {
        setup_future_usage: 'off_session',
      };
    }
    // Handle new card with save option
    else if (saveCard) {
      sessionConfig.payment_intent_data = {
        setup_future_usage: 'off_session',
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
