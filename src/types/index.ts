export type UserRole = 'retail' | 'wholesale' | 'dealer' | 'admin';

export interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  category: string;
  brand: string;
  badge?: string;
  inStock: boolean;
  description: string;
  specs?: Record<string, string>;
  sku?: string;
  condition?: string;
  carrier?: string;
  stockStatus?: string;
  slug?: string;
  shortDescription?: string;
  weight?: number;
  dimensions?: string;
  tags?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  discountPercentage?: number;
  lowStockThreshold?: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id?: string;
  email: string;
  name?: string;
  password?: string;
  role: UserRole;
  wholesaleApproved: boolean;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  shippingAddress?: object;
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface FacetFilter {
  brands: { [key: string]: number };
  categories: { [key: string]: number };
  priceRanges: { [key: string]: number };
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  condition: string;
  qty: number;
}

// Stripe-related types
export interface StripeCheckoutSession {
  id: string;
  url: string;
}

export interface CheckoutRequest {
  items: CartItem[];
  successUrl: string;
  cancelUrl: string;
}

export interface StripeOrder {
  id: string;
  userId: string;
  stripeSessionId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: {
    name: string;
    email: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}
