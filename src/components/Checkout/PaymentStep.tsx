'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stripePaymentSchema } from '../../../utils/validationSchemas';
import { useOrder } from '../../../contexts/OrderContext';
import { useCart } from '../../../contexts/CartContext';
import { useRouter } from 'next/navigation';

interface PaymentStepProps {
  onBack: () => void;
}

export default function PaymentStep({ onBack }: PaymentStepProps) {
  const { orderData, updatePaymentMethod } = useOrder();
  const { items: cartItems } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>(orderData.paymentMethod?.type || 'stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(stripePaymentSchema),
    defaultValues: orderData.paymentMethod?.cardDetails || {
      number: '',
      expiry: '',
      cvc: '',
      name: ''
    }
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  // Format card number input
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date input
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const onSubmit = async (cardData?: any) => {
    setIsProcessing(true);

    try {
      if (paymentMethod === 'stripe') {
        // Mock Stripe payment processing
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

        updatePaymentMethod({
          type: 'stripe',
          cardDetails: cardData
        });
      } else {
        // Cash on Delivery
        updatePaymentMethod({
          type: 'cod'
        });
      }

      // Redirect to success page
      router.push('/checkout/success');
    } catch (error) {
      console.error('Payment processing failed:', error);
      // In a real app, you'd show an error message here
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCODSubmit = () => {
    onSubmit();
  };

  return (
    <div className="space-y-8">
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h2>

        {/* Payment Method Selection */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <input
              id="stripe"
              name="paymentMethod"
              type="radio"
              checked={paymentMethod === 'stripe'}
              onChange={() => setPaymentMethod('stripe')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="stripe" className="ml-3 flex items-center text-sm font-medium text-gray-700">
              <span>Credit/Debit Card</span>
              <div className="ml-2 flex space-x-1">
                <div className="w-8 h-5 bg-blue-600 rounded text-xs text-white flex items-center justify-center font-bold">VISA</div>
                <div className="w-8 h-5 bg-red-500 rounded text-xs text-white flex items-center justify-center font-bold">MC</div>
              </div>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="cod"
              name="paymentMethod"
              type="radio"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="cod" className="ml-3 text-sm font-medium text-gray-700">
              Cash on Delivery
            </label>
          </div>
        </div>

        {/* Stripe Card Form */}
        {paymentMethod === 'stripe' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name *
              </label>
              <input
                {...register('name')}
                type="text"
                id="cardName"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number *
              </label>
              <input
                {...register('number')}
                type="text"
                id="cardNumber"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.number ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  e.target.value = formatted;
                }}
              />
              {errors.number && (
                <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  {...register('expiry')}
                  type="text"
                  id="expiry"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expiry ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="MM/YY"
                  maxLength={5}
                  onChange={(e) => {
                    const formatted = formatExpiry(e.target.value);
                    e.target.value = formatted;
                  }}
                />
                {errors.expiry && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiry.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                  CVC *
                </label>
                <input
                  {...register('cvc')}
                  type="text"
                  id="cvc"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cvc ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cvc && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvc.message}</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Secure Payment</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* COD Info */}
        {paymentMethod === 'cod' && (
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Cash on Delivery</h3>
                <p className="text-sm text-green-700 mt-1">
                  Pay in cash when your order is delivered to your door. No payment required now.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back to Shipping
          </button>
          <button
            onClick={paymentMethod === 'cod' ? handleCODSubmit : handleSubmit(onSubmit)}
            disabled={isProcessing}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              `Place Order - $${total.toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
