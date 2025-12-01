'use client';

import { Button } from '../components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Boundary caught:', error);
    // Optional: log to Sentry
    // Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-4">
          We're having trouble loading this page. Our team has been notified.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Error ID: {error.digest || 'UNKNOWN'}
        </p>
        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
          <Button variant="outline" asChild className="w-full">
            <a href="/support-ticket">Contact Support</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
