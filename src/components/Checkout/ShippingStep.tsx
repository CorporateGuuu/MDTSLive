'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shippingAddressSchema, USA_GOVERNORATES, ShippingAddressForm } from '../../../utils/validationSchemas';
import { useOrder } from '../../../contexts/OrderContext';

interface ShippingStepProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function ShippingStep({ onContinue, onBack }: ShippingStepProps) {
  const { orderData, updateShippingAddress } = useOrder();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ShippingAddressForm>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: orderData.shippingAddress || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      governorate: '' as any,
      city: '',
      area: '',
      streetAddress: '',
      buildingNumber: '',
      floor: '',
      apartment: '',
      additionalInstructions: ''
    }
  });

  const onSubmit = (data: ShippingAddressForm) => {
    updateShippingAddress(data);
    onContinue();
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Shipping Address</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                {...register('firstName')}
                type="text"
                id="firstName"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                {...register('lastName')}
                type="text"
                id="lastName"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                {...register('phone')}
                type="tel"
                id="phone"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+1 50 123 4567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-1">
                Governorate *
              </label>
              <select
                {...register('governorate')}
                id="governorate"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.governorate ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select governorate</option>
                {USA_GOVERNORATES.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
              {errors.governorate && (
                <p className="mt-1 text-sm text-red-600">{errors.governorate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                {...register('city')}
                type="text"
                id="city"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.city ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Area *
              </label>
              <input
                {...register('area')}
                type="text"
                id="area"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.area ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter area"
              />
              {errors.area && (
                <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
              )}
            </div>
          </div>

          {/* Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                {...register('streetAddress')}
                type="text"
                id="streetAddress"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.streetAddress ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Street name and number"
              />
              {errors.streetAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.streetAddress.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="buildingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Building Number *
              </label>
              <input
                {...register('buildingNumber')}
                type="text"
                id="buildingNumber"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.buildingNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Building/Villa number"
              />
              {errors.buildingNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.buildingNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                Floor (Optional)
              </label>
              <input
                {...register('floor')}
                type="text"
                id="floor"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Floor number"
              />
            </div>

            <div>
              <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
                Apartment/Office (Optional)
              </label>
              <input
                {...register('apartment')}
                type="text"
                id="apartment"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Apartment or office number"
              />
            </div>
          </div>

          {/* Additional Instructions */}
          <div>
            <label htmlFor="additionalInstructions" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Instructions (Optional)
            </label>
            <textarea
              {...register('additionalInstructions')}
              id="additionalInstructions"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any special delivery instructions..."
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Back to Cart
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
