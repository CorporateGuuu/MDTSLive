import { z } from 'zod';

// UAE Governorates
export const UAE_GOVERNORATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Fujairah',
  'Ras Al Khaimah',
  'Umm Al Quwain'
] as const;

// Shipping Address Schema
export const shippingAddressSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^(\+971|0)?[50-56]\d{7}$/, 'Please enter a valid UAE phone number'),
  governorate: z.enum(UAE_GOVERNORATES).refine(val => UAE_GOVERNORATES.includes(val), {
    message: 'Please select a valid governorate'
  }),
  city: z.string().min(2, 'City is required'),
  area: z.string().min(2, 'Area is required'),
  streetAddress: z.string().min(5, 'Street address must be at least 5 characters'),
  buildingNumber: z.string().min(1, 'Building number is required'),
  floor: z.string().optional(),
  apartment: z.string().optional(),
  additionalInstructions: z.string().optional()
});

// Payment Schema
export const stripePaymentSchema = z.object({
  number: z.string().regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'Please enter a valid card number'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Please enter a valid expiry date (MM/YY)'),
  cvc: z.string().regex(/^\d{3,4}$/, 'Please enter a valid CVC'),
  name: z.string().min(2, 'Cardholder name is required')
});

export const paymentMethodSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('stripe'),
    cardDetails: stripePaymentSchema
  }),
  z.object({
    type: z.literal('cod')
  })
]);

// Complete Order Schema
export const orderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: paymentMethodSchema
});

export type ShippingAddressForm = z.infer<typeof shippingAddressSchema>;
export type PaymentMethodForm = z.infer<typeof paymentMethodSchema>;
export type OrderForm = z.infer<typeof orderSchema>;
