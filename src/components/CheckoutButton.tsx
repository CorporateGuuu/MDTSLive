'use client';

import { Button } from './ui/button';
import { useCart } from '../stores/cartStore';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CheckoutButton() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      toast.error('Checkout failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading || items.length === 0}
      className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
    >
      {loading ? <Loader2 className="animate-spin mr-2" /> : null}
      Pay Now with Stripe
    </Button>
  );
}
