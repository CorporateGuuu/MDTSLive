'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import { useCart } from '../stores/cartStore';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutForm() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    const createPaymentRequest = async () => {
      const stripe = await stripePromise;
      if (!stripe) return;

      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Nexus Tech Hub Order',
          amount: Math.round(items.reduce((sum, i) => sum + (i.price * i.qty), 0) * 100),
        },
        displayItems: items.map(i => ({
          label: i.name,
          amount: Math.round(i.price * i.qty * 100),
        })),
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.on('paymentmethod', async (event) => {
        setLoading(true);
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, paymentMethodId: event.paymentMethod.id }),
        });
        const { clientSecret } = await res.json();
        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: event.paymentMethod.id,
        });
        if (error) {
          event.complete('fail');
          toast.error(error.message);
        } else {
          event.complete('success');
          window.location.href = '/success';
        }
        setLoading(false);
      });

      setPaymentRequest(pr);
    };

    createPaymentRequest();
  }, [items]);

  if (!paymentRequest) {
    return <div>Loading payment options...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentRequestButtonElement
        options={{ paymentRequest }}
        className="w-full mb-4"
      />
      {/* Fallback to card form */}
      <div>Your card form here...</div>
    </Elements>
  );
}
