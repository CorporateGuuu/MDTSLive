'use client';

import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { AlertTriangle } from 'lucide-react';

export default function StripeTestModeBanner() {
  const [isTestMode, setIsTestMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if we're in development and Stripe publishable key contains 'test'
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const isDev = process.env.NODE_ENV === 'development';
    const isTestKey = publishableKey?.includes('pk_test') || publishableKey?.includes('test');

    setIsTestMode(isDev && !!isTestKey);
  }, []);

  if (!isTestMode || !isVisible) {
    return null;
  }

  return (
    <div className="bg-orange-100 border-b border-orange-200 px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">
            Stripe Test Mode Active
          </span>
          <Badge variant="outline" className="bg-orange-200 text-orange-800 border-orange-300">
            TEST
          </Badge>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-orange-600 hover:text-orange-800 text-sm underline"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
