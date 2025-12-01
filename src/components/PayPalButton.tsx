'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'sonner';

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  description?: string;
}

export default function PayPalButton({
  amount,
  currency = 'USD',
  description = 'Payment'
}: PayPalButtonProps) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
        <span className="text-gray-600">Loading PayPal...</span>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">
          PayPal is currently unavailable. Please try again later or use another payment method.
        </p>
      </div>
    );
  }

  return (
    <div className="paypal-button-container">
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        }}
        createOrder={async (data, actions) => {
          try {
            const response = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amount: amount.toFixed(2),
                currency,
                description
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to create PayPal order');
            }

            const order = await response.json();
            return order.id;
          } catch (error) {
            console.error('PayPal createOrder error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to initialize PayPal payment');
            throw error;
          }
        }}
        onApprove={async (data, actions) => {
          try {
            const response = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.orderID
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to capture PayPal payment');
            }

            const details = await response.json();

            toast.success('PayPal payment completed successfully!');
            // Redirect to success page with payment details
            window.location.href = `/success?payment_method=paypal&order_id=${data.orderID}`;
          } catch (error) {
            console.error('PayPal onApprove error:', error);
            toast.error(error instanceof Error ? error.message : 'Payment processing failed');
          }
        }}
        onError={(error) => {
          console.error('PayPal error:', error);
          toast.error('PayPal payment encountered an error. Please try again.');
        }}
        onCancel={(data) => {
          console.log('PayPal payment cancelled:', data);
          toast.info('PayPal payment was cancelled.');
        }}
      />
    </div>
  );
}
