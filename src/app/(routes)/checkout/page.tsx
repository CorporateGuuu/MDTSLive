'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, ChevronRight, MapPin, CreditCard, Truck, Package } from 'lucide-react';
import { useCart } from '../../../../contexts/CartContext';
import { useOrder } from '../../../../contexts/OrderContext';
import Image from 'next/image';

// Zod Schemas
const shippingSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Enter valid US phone number'),
  email: z.string().email('Invalid email'),
  governorate: z.string().min(1, 'Select state'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(5, 'Address is required'),
  building: z.string().optional(),
  notes: z.string().optional(),
});

type ShippingForm = z.infer<typeof shippingSchema>;

const usStates = [
  'California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const { items, subtotal, clearCart } = useCart();
  const { shipping, paymentMethod, setShipping, setPaymentMethod, clear } = useOrder();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: shipping || {},
  });

  const onShippingSubmit = (data: ShippingForm) => {
    setShipping(data);
    setStep(2);
  };

  const placeOrder = () => {
    clearCart();
    clear();
    router.push('/checkout/success');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <Link href="/products" className="text-red-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center ${s < 3 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Review Cart</span>
            <span>Shipping</span>
            <span>Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Cart Review */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Order Summary
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image src={item.images[0]} alt={item.name} fill className="object-cover rounded" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Shipping calculated at next step</p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="mt-6 w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  Continue to Shipping
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Shipping Address
                </h2>
                <form onSubmit={handleSubmit(onShippingSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        {...register('fullName')}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                      {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        {...register('phone')}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                        placeholder="+1-888-545-2121"
                      />
                      {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <select
                        {...register('governorate')}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Select</option>
                        {usStates.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      {errors.governorate && <p className="text-red-600 text-xs mt-1">{errors.governorate.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City/Area</label>
                      <input
                        {...register('city')}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                        placeholder="Al Barsha"
                      />
                      {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Street Address</label>
                    <input
                      {...register('address')}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="Building 12, Street 5"
                    />
                    {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address.message}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Building/Villa (Optional)</label>
                      <input
                        {...register('building')}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Villa 5A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Delivery Notes (Optional)</label>
                      <textarea
                        {...register('notes')}
                        rows={2}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Near mosque, call on arrival"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-red-500 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Cash on Delivery (COD)</p>
                      <p className="text-sm text-gray-600">Pay when you receive</p>
                    </div>
                    <Truck className="w-8 h-8 text-gray-400" />
                  </label>

                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-red-500 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Secure payment via Stripe</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-10 h-6 bg-gray-200 rounded" />
                      <div className="w-10 h-6 bg-gray-200 rounded" />
                    </div>
                  </label>

                  {paymentMethod === 'card' && (
                    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-600 mb-4">Demo Card: 4242 4242 4242 4242 | Any future date | Any CVC</p>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="4242 4242 4242 4242" className="px-4 py-2 border rounded-lg" />
                        <input type="text" placeholder="MM/YY" className="px-4 py-2 border rounded-lg" />
                        <input type="text" placeholder="CVC" className="px-4 py-2 border rounded-lg col-span-2" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={!paymentMethod}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 transition"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              {shipping && (
                <div className="mt-6 pt-6 border-t text-sm">
                  <p className="font-medium mb-2">Shipping to:</p>
                  <p>{shipping.fullName}</p>
                  <p>{shipping.address}, {shipping.city}</p>
                  <p>{shipping.governorate}, USA</p>
                  <p className="mt-1">{shipping.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
