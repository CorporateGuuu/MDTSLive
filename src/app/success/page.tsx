'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useCart } from '../../stores/cartStore';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        router.push('/');
        return;
      }

      try {
        // Verify the payment session with our API
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        const data = await response.json();

        if (response.ok) {
          // Clear the cart on successful payment
          clearCart();
          setOrderDetails(data);
          toast.success('Payment successful! Your order has been placed.');
        } else {
          toast.error('Payment verification failed. Please contact support.');
          router.push('/');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        toast.error('An error occurred. Please contact support.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, router, clearCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Payment Successful!
            </CardTitle>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {orderDetails && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">Order Number</span>
                  </div>
                  <Badge variant="secondary">{orderDetails.orderNumber || sessionId?.slice(-8)}</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">Status</span>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    Paid
                  </Badge>
                </div>

                {orderDetails.total && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Total Paid</span>
                    <span className="font-bold text-lg">${orderDetails.total.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                What's Next?
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• You'll receive an order confirmation email shortly</li>
                <li>• Our team will process your order within 1-2 business days</li>
                <li>• You'll receive shipping updates via email</li>
                <li>• Track your order status in your account dashboard</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => router.push('/account/orders')}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                View Orders
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="flex-1"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
