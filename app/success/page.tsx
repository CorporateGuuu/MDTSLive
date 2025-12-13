'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail, Home } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

export default function SuccessPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (sessionId) {
          // Fetch order details using the session ID
          const { data: order, error } = await supabase
            .from('orders')
            .select('*')
            .eq('stripe_session_id', sessionId)
            .single();

          if (order && !error) {
            setOrderDetails(order);
          }
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Details */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Status:</span>
                  <span className="font-semibold text-green-600">Paid</span>
                </div>
                {orderDetails && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Total:</span>
                      <span className="font-semibold">${orderDetails.total?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-semibold">
                        {new Date(orderDetails.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* What's Next */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail size={20} className="text-gold mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Confirmation</h3>
                    <p className="text-sm text-gray-600">You'll receive an order confirmation email shortly.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package size={20} className="text-gold mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Order Processing</h3>
                    <p className="text-sm text-gray-600">We'll prepare your order for shipping within 1-2 business days.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Truck size={20} className="text-gold mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Shipping Updates</h3>
                    <p className="text-sm text-gray-600">Track your package and get delivery updates via email.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-gold hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Home size={20} />
              <span>Continue Shopping</span>
            </Link>
            <Link
              href="/orders"
              className="border border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View Order History
            </Link>
          </div>

          <p className="text-sm text-gray-600">
            Questions about your order?
            <a href="/contact" className="text-gold hover:underline ml-1">
              Contact our support team
            </a>
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Information</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Your order confirmation has been sent to your email address</li>
            <li>• Processing time: 1-2 business days</li>
            <li>• Shipping: FREE on all orders</li>
            <li>• Returns: 30-day return policy with lifetime warranty</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
