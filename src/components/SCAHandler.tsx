'use client';

import { useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

interface SCAHandlerProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function SCAHandler({ clientSecret, onSuccess, onError }: SCAHandlerProps) {
  const stripe = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);
  const [requiresAction, setRequiresAction] = useState(false);

  const handleSCA = async () => {
    if (!stripe) {
      onError('Stripe not loaded');
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        return_url: window.location.origin + window.location.pathname,
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          onError(error.message || 'Payment failed');
        } else {
          onError(error.message || 'Payment failed');
        }
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      } else if (paymentIntent?.status === 'requires_action') {
        // Handle 3D Secure authentication
        setRequiresAction(true);
        const { error: actionError } = await stripe.handleNextAction({
          clientSecret,
        });

        if (actionError) {
          onError('Authentication failed: ' + actionError.message);
        } else {
          // Check the updated payment intent status after authentication
          const { paymentIntent: updatedIntent } = await stripe.retrievePaymentIntent(clientSecret);
          if (updatedIntent?.status === 'succeeded') {
            onSuccess();
          } else {
            onError('Authentication was not completed');
          }
        }
      } else {
        onError('Payment processing incomplete');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'SCA processing failed');
    } finally {
      setIsProcessing(false);
      setRequiresAction(false);
    }
  };

  if (requiresAction) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Secure Authentication Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
            <div>
              <p className="text-gray-700 mb-2">
                Your bank requires additional authentication to complete this payment.
              </p>
              <p className="text-sm text-gray-600">
                You'll be redirected to your bank's secure authentication page.
              </p>
            </div>
            <Button
              onClick={handleSCA}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Processing Authentication...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Continue to Authentication
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      onClick={handleSCA}
      disabled={isProcessing || !stripe}
      className="w-full bg-green-600 hover:bg-green-700"
    >
      {isProcessing ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          Processing Payment...
        </>
      ) : (
        <>
          <Shield className="mr-2 h-4 w-4" />
          Complete Secure Payment
        </>
      )}
    </Button>
  );
}

// Test card numbers for SCA testing:
// 4000002760003184 - Requires authentication (3D Secure)
// 4000000000003063 - Authentication fails
// 4000000000003055 - Authentication succeeds

export const SCA_TEST_CARDS = {
  requiresAuth: '4000002760003184',
  authFails: '4000000000003063',
  authSucceeds: '4000000000003055',
};
