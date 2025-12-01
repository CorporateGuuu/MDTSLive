import { z } from 'zod';

// =============================================================================
// Midas Technical Solutions - Zod Validation Schemas
// =============================================================================

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  discount_percentage: z.number().min(0).max(100).optional().default(0),
  stock_quantity: z.number().int().min(0).optional().default(0),
  category_id: z.string().uuid().optional(),
  brand_id: z.string().uuid().optional(),
  image_url: z.string().url().optional(),
  is_active: z.boolean().optional().default(true),
});

// File validation schema for product images
export const productImageFileSchema = z.object({
  imageFile: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'File must be a valid image (JPEG, PNG, WebP)'
    )
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
});

// Order schemas
export const shippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().optional(),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required').default('AE'),
});

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['cod', 'card'], 'Payment method must be either "cod" or "card"'),
});

// User profile schemas
export const updateProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').optional(),
  last_name: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().optional(),
});

// Address schemas
export const createAddressSchema = z.object({
  address_type: z.enum(['shipping', 'billing', 'both']).default('shipping'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  address_line1: z.string().min(1, 'Address line 1 is required'),
  address_line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required').default('AE'),
  phone: z.string().optional(),
  is_default: z.boolean().optional().default(false),
});

// Wholesale request schema
export const wholesaleRequestSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  business_type: z.string().min(1, 'Business type is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  tax_id: z.string().min(1, 'Tax ID is required'),
});

// Upload schemas
export const uploadSignedUrlSchema = z.object({
  fileName: z.string()
    .min(1, 'File name is required')
    .regex(/\.(jpg|jpeg|png|gif|webp)$/i, 'File must be an image (.jpg, .png, .gif, .webp)')
    .refine((name) => {
      // Check file size by parsing data URL or checking filename pattern
      // For now, we'll validate the extension and assume size check happens elsewhere
      return name.length <= 255; // Reasonable filename length limit
    }, 'File name is too long'),
  bucket: z.enum(['products', 'avatars'], 'Bucket must be either "products" or "avatars"'),
});

// Search and filter schemas
export const productSearchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.string().transform(val => val ? parseFloat(val) : undefined).optional(),
  maxPrice: z.string().transform(val => val ? parseFloat(val) : undefined).optional(),
  limit: z.string().transform(val => Math.min(parseInt(val || '20'), 100)).optional(),
  offset: z.string().transform(val => Math.max(parseInt(val || '0'), 0)).optional(),
});

// Utility function to validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}
