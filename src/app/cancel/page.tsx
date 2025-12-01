'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-orange-600" />
            </div>
            <CardTitle className="text-2xl text-orange-600">
              Payment Cancelled
            </CardTitle>
            <p className="text-gray-600">
              Your payment was cancelled. No charges have been made to your account.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-gray-700">
                Don't worry! Your cart items are still saved and ready for you to checkout when you're ready.
              </p>
              <p className="text-sm text-gray-500">
                You can modify your cart or try checking out again at any time.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => router.push('/')}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
