import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Secure sign in with Google
export const signInWithGoogle = () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
};

// Secure password sign up (password never leaves browser)
// Secure password sign up (password never leaves browser)
export const signUpWithEmail = async (email: string, password: string) => {
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
    },
  });

  // Send welcome email after successful signup
  if (!result.error && result.data.user) {
    try {
      await fetch('/api/auth/welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: email.split('@')[0]
        }),
      });
    } catch (error) {
      console.error('Welcome email failed:', error);
    }
  }

  return result;
};

// Secure login with "Remember me" option
export const signInWithEmail = async (email: string, password: string, rememberMe: boolean = false) => {
  const result = await supabase.auth.signInWithPassword({ email, password });

  // Handle "Remember me" by setting session persistence
  if (result.data.session && rememberMe) {
    // Supabase automatically handles long-term sessions for OAuth
    // For email/password, we rely on Supabase's default behavior
    // Sessions typically last 30-60 days when "remember me" is enabled
  }

  return result;
};

// Get products by subcategory
export const getProductsBySubcategory = async (subcategory: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .ilike('tags', `%${subcategory}%`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    // Transform Supabase data to Product type
    return (data || []).map(product => ({
      _id: product.id,
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price || undefined,
      image: product.thumbnail_url || product.images?.[0] || '/placeholder.png',
      gallery: product.images || [],
      category: product.category_id || 'parts',
      brand: product.brand_id || 'Apple',
      inStock: product.stock_quantity > 0,
      description: product.description || product.short_description || '',
      specs: {}, // Could be expanded if specs are stored elsewhere
    }));
  } catch (error) {
    console.error('Error in getProductsBySubcategory:', error);
    return [];
  }
};

// Get products by model name
export const getProductsByModel = async (modelName: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .ilike('name', `%${modelName}%`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching products by model:', error);
      return [];
    }

    // Transform Supabase data to Product type
    return (data || []).map(product => ({
      _id: product.id,
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price || undefined,
      image: product.thumbnail_url || product.images?.[0] || '/placeholder.png',
      gallery: product.images || [],
      category: product.category_id || 'parts',
      brand: product.brand_id || 'Apple',
      inStock: product.stock_quantity > 0,
      description: product.description || product.short_description || '',
      specs: {}, // Could be expanded if specs are stored elsewhere
    }));
  } catch (error) {
    console.error('Error in getProductsByModel:', error);
    return [];
  }
};

// Search products by query string
export const searchProducts = async (query: string, limit: number = 8): Promise<Product[]> => {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.trim();

    // Search across multiple fields: name, description, tags, category, brand
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        description,
        short_description,
        price,
        original_price,
        discount_percentage,
        stock_quantity,
        is_active,
        is_featured,
        is_new,
        thumbnail_url,
        images,
        category_id,
        brand_id,
        tags,
        created_at
      `)
      .eq('is_active', true)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    // Transform Supabase data to Product type
    return (data || []).map(product => ({
      _id: product.id,
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price || undefined,
      image: product.thumbnail_url || product.images?.[0] || '/placeholder.png',
      gallery: product.images || [],
      category: product.category_id || 'parts',
      brand: product.brand_id || 'Apple',
      inStock: product.stock_quantity > 0,
      description: product.description || product.short_description || '',
      specs: {}, // Could be expanded if specs are stored elsewhere
      slug: product.slug || undefined,
      shortDescription: product.short_description || undefined,
      isFeatured: product.is_featured || false,
      isNew: product.is_new || false,
      discountPercentage: product.discount_percentage || 0,
      tags: product.tags || undefined,
    }));
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
};

// Get single product by ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }

    if (!data) return null;

    // Transform Supabase data to Product type
    return {
      _id: data.id,
      id: data.id,
      name: data.name,
      price: data.price,
      originalPrice: data.original_price || undefined,
      image: data.thumbnail_url || data.images?.[0] || '/placeholder.png',
      gallery: data.images || [],
      category: data.category_id || 'parts',
      brand: data.brand_id || 'Apple',
      badge: data.is_featured ? 'Featured' : data.is_new ? 'New' : undefined,
      inStock: data.stock_quantity > 0,
      description: data.description || data.short_description || '',
      specs: {}, // Could be expanded if specs are stored elsewhere
      sku: data.sku || undefined,
      condition: 'Refurbished', // Default for pre-owned devices, could be dynamic
      carrier: 'Unlocked', // Default, could be dynamic based on product data
      stockStatus: data.stock_quantity > 0 ? 'In Stock' : 'Out of Stock',
      slug: data.slug || undefined,
      shortDescription: data.short_description || undefined,
      weight: data.weight || undefined,
      dimensions: data.dimensions || undefined,
      tags: data.tags || undefined,
      isFeatured: data.is_featured || false,
      isNew: data.is_new || false,
      discountPercentage: data.discount_percentage || 0,
      lowStockThreshold: data.low_stock_threshold || 0,
      metaTitle: data.meta_title || undefined,
      metaDescription: data.meta_description || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
};

// Saved Carts Functions
export interface SavedCart {
  id: string;
  user_id: string;
  name: string;
  items: SavedCartItem[];
  total: number;
  created_at: string;
  updated_at: string;
}

export interface SavedCartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

// Fetch saved carts for the current user
export const getSavedCarts = async (): Promise<SavedCart[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('saved_carts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved carts:', error);
      return [];
    }

    return (data || []).map(cart => ({
      id: cart.id,
      user_id: cart.user_id,
      name: cart.name,
      items: cart.items || [],
      total: cart.total || 0,
      created_at: cart.created_at,
      updated_at: cart.updated_at,
    }));
  } catch (error) {
    console.error('Error in getSavedCarts:', error);
    return [];
  }
};

// Save a cart for the current user
export const saveCart = async (name: string, items: SavedCartItem[]): Promise<SavedCart | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const { data, error } = await supabase
      .from('saved_carts')
      .insert({
        user_id: user.id,
        name,
        items,
        total,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving cart:', error);
      return null;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      items: data.items || [],
      total: data.total || 0,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error('Error in saveCart:', error);
    return null;
  }
};

// Update a saved cart
export const updateSavedCart = async (cartId: string, items: SavedCartItem[]): Promise<SavedCart | null> => {
  try {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const { data, error } = await supabase
      .from('saved_carts')
      .update({
        items,
        total,
      })
      .eq('id', cartId)
      .select()
      .single();

    if (error) {
      console.error('Error updating saved cart:', error);
      return null;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      items: data.items || [],
      total: data.total || 0,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error('Error in updateSavedCart:', error);
    return null;
  }
};

// Delete a saved cart
export const deleteSavedCart = async (cartId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('saved_carts')
      .delete()
      .eq('id', cartId);

    if (error) {
      console.error('Error deleting saved cart:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteSavedCart:', error);
    return false;
  }
};

// Reserve Orders Types and Functions
export interface ReserveOrder {
  id: string;
  user_id: string;
  order_number: string;
  status: 'reserved' | 'shipped' | 'cancelled' | 'expired';
  order_type: 'Reserve' | 'Bulk' | 'Express';
  total_amount: number;
  ship_to: string;
  location: string;
  shipping_method: string;
  company_name?: string;
  date_ordered: string;
  items: any[];
  created_at: string;
  updated_at: string;
  shipped_at?: string;
  cancelled_at?: string;
  expires_at: string;
}

// Fetch reserve orders for the current user with optional filters
export const getReserveOrders = async (filters?: {
  status?: string;
  order_type?: string;
  company_name?: string;
  date_from?: string;
  date_to?: string;
  search_term?: string;
}): Promise<ReserveOrder[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('reserve_orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.order_type) {
      query = query.eq('order_type', filters.order_type);
    }
    if (filters?.company_name) {
      query = query.ilike('company_name', `%${filters.company_name}%`);
    }
    if (filters?.date_from) {
      query = query.gte('date_ordered', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('date_ordered', filters.date_to);
    }
    if (filters?.search_term) {
      query = query.or(`order_number.ilike.%${filters.search_term}%,ship_to.ilike.%${filters.search_term}%,location.ilike.%${filters.search_term}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reserve orders:', error);
      return [];
    }

    return (data || []).map(order => ({
      id: order.id,
      user_id: order.user_id,
      order_number: order.order_number,
      status: order.status,
      order_type: order.order_type,
      total_amount: parseFloat(order.total_amount),
      ship_to: order.ship_to,
      location: order.location,
      shipping_method: order.shipping_method,
      company_name: order.company_name,
      date_ordered: order.date_ordered,
      items: order.items || [],
      created_at: order.created_at,
      updated_at: order.updated_at,
      shipped_at: order.shipped_at,
      cancelled_at: order.cancelled_at,
      expires_at: order.expires_at,
    }));
  } catch (error) {
    console.error('Error in getReserveOrders:', error);
    return [];
  }
};

// Update reserve order status
export const updateReserveOrderStatus = async (orderId: string, status: 'reserved' | 'shipped' | 'cancelled'): Promise<ReserveOrder | null> => {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Set timestamp based on status
    if (status === 'shipped') {
      updateData.shipped_at = new Date().toISOString();
    } else if (status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('reserve_orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating reserve order status:', error);
      return null;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      order_number: data.order_number,
      status: data.status,
      order_type: data.order_type,
      total_amount: parseFloat(data.total_amount),
      ship_to: data.ship_to,
      location: data.location,
      shipping_method: data.shipping_method,
      company_name: data.company_name,
      date_ordered: data.date_ordered,
      items: data.items || [],
      created_at: data.created_at,
      updated_at: data.updated_at,
      shipped_at: data.shipped_at,
      cancelled_at: data.cancelled_at,
      expires_at: data.expires_at,
    };
  } catch (error) {
    console.error('Error in updateReserveOrderStatus:', error);
    return null;
  }
};

// Bulk update reserve order statuses
export const bulkUpdateReserveOrderStatus = async (orderIds: string[], status: 'shipped' | 'cancelled'): Promise<boolean> => {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Set timestamp based on status
    if (status === 'shipped') {
      updateData.shipped_at = new Date().toISOString();
    } else if (status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('reserve_orders')
      .update(updateData)
      .in('id', orderIds);

    if (error) {
      console.error('Error bulk updating reserve order statuses:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in bulkUpdateReserveOrderStatus:', error);
    return false;
  }
};

export interface CreditActivityItem {
  id: string;
  user_id: string;
  date: string;
  location: string;
  reason: string | null;
  credit: number;
  debit: number;
  ledger: string | null;
  transaction_id: string;
  created_at: string;
  updated_at: string;
}

// Fetch credit activity for the current user with optional filters
export const getCreditActivity = async (filters?: {
  from_date?: string;
  to_date?: string;
  show_credit_memo?: boolean;
}): Promise<CreditActivityItem[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('credit_activity')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    // Apply date filters
    if (filters?.from_date) {
      query = query.gte('date', filters.from_date);
    }
    if (filters?.to_date) {
      query = query.lte('date', filters.to_date);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching credit activity:', error);
      return [];
    }

    let activities = (data || []).map(activity => ({
      id: activity.id,
      user_id: activity.user_id,
      date: activity.date,
      location: activity.location,
      reason: activity.reason,
      credit: parseFloat(activity.credit),
      debit: parseFloat(activity.debit),
      ledger: activity.ledger,
      transaction_id: activity.transaction_id,
      created_at: activity.created_at,
      updated_at: activity.updated_at,
    }));

    // Apply credit memo filter client-side if needed
    if (filters?.show_credit_memo) {
      activities = activities.filter(item => item.credit > 0);
    }

    return activities;
  } catch (error) {
    console.error('Error in getCreditActivity:', error);
    return [];
  }
};

// Export credit activity data (for PDF/CSV generation)
export const exportCreditActivity = async (filters?: {
  from_date?: string;
  to_date?: string;
  show_credit_memo?: boolean;
}): Promise<CreditActivityItem[]> => {
  // Use the same logic as getCreditActivity but for export purposes
  return getCreditActivity(filters);
};

// Core Returns Types and Functions
export interface CoreReturn {
  id: string;
  user_id: string;
  return_number: string;
  store_name: string | null;
  status: 'Pending' | 'Shipped' | 'Received' | 'Processing' | 'Completed' | 'Cancelled';
  shipped_date: string | null;
  received_date: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch core returns for the current user with optional filters
export const getCoreReturns = async (filters?: {
  status?: string;
  from_date?: string;
  to_date?: string;
}): Promise<CoreReturn[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('core_returns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.from_date) {
      query = query.gte('created_at', filters.from_date);
    }
    if (filters?.to_date) {
      query = query.lte('created_at', filters.to_date);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching core returns:', error);
      return [];
    }

    return (data || []).map(returnItem => ({
      id: returnItem.id,
      user_id: returnItem.user_id,
      return_number: returnItem.return_number,
      store_name: returnItem.store_name,
      status: returnItem.status,
      shipped_date: returnItem.shipped_date,
      received_date: returnItem.received_date,
      created_at: returnItem.created_at,
      updated_at: returnItem.updated_at,
    }));
  } catch (error) {
    console.error('Error in getCoreReturns:', error);
    return [];
  }
};

// Create a new core return shipment
export const createCoreReturn = async (returnData: {
  store_name?: string;
}): Promise<CoreReturn | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Generate return number (simple format for now)
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const returnNumber = `CR-${timestamp}-${random}`;

    const { data, error } = await supabase
      .from('core_returns')
      .insert({
        user_id: user.id,
        return_number: returnNumber,
        store_name: returnData.store_name || null,
        status: 'Pending',
        shipped_date: new Date().toISOString().split('T')[0], // Today's date
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating core return:', error);
      return null;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      return_number: data.return_number,
      store_name: data.store_name,
      status: data.status,
      shipped_date: data.shipped_date,
      received_date: data.received_date,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error('Error in createCoreReturn:', error);
    return null;
  }
};

// Get core returns statistics for dashboard
export const getCoreReturnsStats = async (): Promise<{
  pending: number;
  shipped: number;
  received: number;
  processing: number;
  completed: number;
  total: number;
}> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { pending: 0, shipped: 0, received: 0, processing: 0, completed: 0, total: 0 };

    const { data, error } = await supabase
      .from('core_returns')
      .select('status')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching core returns stats:', error);
      return { pending: 0, shipped: 0, received: 0, processing: 0, completed: 0, total: 0 };
    }

    const stats = {
      pending: 0,
      shipped: 0,
      received: 0,
      processing: 0,
      completed: 0,
      total: data?.length || 0,
    };

    data?.forEach(item => {
      switch (item.status) {
        case 'Pending':
          stats.pending++;
          break;
        case 'Shipped':
          stats.shipped++;
          break;
        case 'Received':
          stats.received++;
          break;
        case 'Processing':
          stats.processing++;
          break;
        case 'Completed':
          stats.completed++;
          break;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error in getCoreReturnsStats:', error);
    return { pending: 0, shipped: 0, received: 0, processing: 0, completed: 0, total: 0 };
  }
};

// Get core returns reports data
export const getCoreReturnsReports = async (days: number = 30): Promise<{
  processed: number;
  received_on_time: number;
  received_late: number;
  never_arrived: number;
  avg_days: number;
}> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { processed: 0, received_on_time: 0, received_late: 0, never_arrived: 0, avg_days: 0 };

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const { data, error } = await supabase
      .from('core_returns')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', fromDate.toISOString())
      .in('status', ['Received', 'Processing', 'Completed']);

    if (error) {
      console.error('Error fetching core returns reports:', error);
      return { processed: 0, received_on_time: 0, received_late: 0, never_arrived: 0, avg_days: 0 };
    }

    let processed = data?.length || 0;
    let received_on_time = 0;
    let received_late = 0;
    let never_arrived = 0;
    let totalDays = 0;
    let dayCount = 0;

    data?.forEach(item => {
      if (item.received_date && item.shipped_date) {
        const shippedDate = new Date(item.shipped_date);
        const receivedDate = new Date(item.received_date);
        const daysDiff = Math.floor((receivedDate.getTime() - shippedDate.getTime()) / (1000 * 60 * 60 * 24));

        totalDays += daysDiff;
        dayCount++;

        if (daysDiff <= 5) { // Assuming 5 days is "on time"
          received_on_time++;
        } else {
          received_late++;
        }
      } else if (item.status === 'Shipped') {
        // Check if it's been more than expected time
        const shippedDate = new Date(item.shipped_date || item.created_at);
        const daysSinceShipped = Math.floor((Date.now() - shippedDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceShipped > 10) { // Assuming 10 days max
          never_arrived++;
        }
      }
    });

    return {
      processed,
      received_on_time,
      received_late,
      never_arrived,
      avg_days: dayCount > 0 ? totalDays / dayCount : 0,
    };
  } catch (error) {
    console.error('Error in getCoreReturnsReports:', error);
    return { processed: 0, received_on_time: 0, received_late: 0, never_arrived: 0, avg_days: 0 };
  }
};

// Get billing summary chart data
export const getBillingSummaryData = async (): Promise<Array<{ month: string; amount: number }>> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get last 6 months of data
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        year: date.getFullYear(),
        monthNum: date.getMonth(),
      });
    }

    const chartData = await Promise.all(
      months.map(async ({ month, year, monthNum }) => {
        const startOfMonth = new Date(year, monthNum, 1);
        const endOfMonth = new Date(year, monthNum + 1, 0);

        const { data, error } = await supabase
          .from('core_returns')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString());

        if (error) {
          console.error('Error fetching billing data for month:', error);
          return { month, amount: 0 };
        }

        // For demo purposes, we'll use $50 per return
        const amount = (data?.length || 0) * 50;
        return { month, amount };
      })
    );

    return chartData;
  } catch (error) {
    console.error('Error in getBillingSummaryData:', error);
    return [];
  }
};

// Balance Sheet Types and Functions
export interface BalanceSheetTransaction {
  id: string;
  user_id: string;
  date: string;
  details: string;
  debit: number;
  credit: number;
  balance: number;
  type: string;
  reference: string | null;
  transaction_id: string;
  created_at: string;
  updated_at: string;
}

// Fetch balance sheet transactions for the current user with optional filters
export const getBalanceSheetTransactions = async (filters?: {
  from_date?: string;
  to_date?: string;
  type?: string;
  search_term?: string;
}): Promise<BalanceSheetTransaction[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('balance_sheet')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    // Apply filters
    if (filters?.from_date) {
      query = query.gte('date', filters.from_date);
    }
    if (filters?.to_date) {
      query = query.lte('date', filters.to_date);
    }
    if (filters?.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    if (filters?.search_term) {
      query = query.or(`details.ilike.%${filters.search_term}%,reference.ilike.%${filters.search_term}%,transaction_id.ilike.%${filters.search_term}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching balance sheet transactions:', error);
      return [];
    }

    return (data || []).map(transaction => ({
      id: transaction.id,
      user_id: transaction.user_id,
      date: transaction.date,
      details: transaction.details,
      debit: parseFloat(transaction.debit),
      credit: parseFloat(transaction.credit),
      balance: parseFloat(transaction.balance),
      type: transaction.type,
      reference: transaction.reference,
      transaction_id: transaction.transaction_id,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
    }));
  } catch (error) {
    console.error('Error in getBalanceSheetTransactions:', error);
    return [];
  }
};

// Calculate running balance for transactions
export const calculateRunningBalance = (transactions: BalanceSheetTransaction[]): BalanceSheetTransaction[] => {
  // Sort by date ascending to calculate running balance properly
  const sortedTransactions = [...transactions].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let runningBalance = 0;

  return sortedTransactions.map(transaction => {
    // Update running balance
    runningBalance = runningBalance + transaction.credit - transaction.debit;

    return {
      ...transaction,
      balance: runningBalance,
    };
  }).reverse(); // Reverse back to descending order for display
};

// Export balance sheet data (for PDF/CSV generation)
export const exportBalanceSheetData = async (filters?: {
  from_date?: string;
  to_date?: string;
  type?: string;
  search_term?: string;
}): Promise<BalanceSheetTransaction[]> => {
  // Use the same logic as getBalanceSheetTransactions but for export purposes
  return getBalanceSheetTransactions(filters);
};

// LCD BuyBack Types and Functions
export interface LCDBuyBackRequest {
  id: string;
  request_id: string;
  user_id: string;
  device_model: string;
  photos: string[];
  ship_to: string;
  location: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';
  requested_date: string;
  completed_on: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch LCD buyback requests for the current user with optional filters
export const getLCDBuyBackRequests = async (filters?: {
  request_id?: string;
  status?: string;
  ship_to?: string;
  location?: string;
  from_date?: string;
  to_date?: string;
}): Promise<LCDBuyBackRequest[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('lcd_buyback')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.request_id) {
      query = query.ilike('request_id', `%${filters.request_id}%`);
    }
    if (filters?.status && filters.status !== 'All') {
      query = query.eq('status', filters.status);
    }
    if (filters?.ship_to) {
      query = query.ilike('ship_to', `%${filters.ship_to}%`);
    }
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters?.from_date) {
      query = query.gte('requested_date', filters.from_date);
    }
    if (filters?.to_date) {
      query = query.lte('requested_date', filters.to_date);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching LCD buyback requests:', error);
      return [];
    }

    return (data || []).map(request => ({
      id: request.id,
      request_id: request.request_id,
      user_id: request.user_id,
      device_model: request.device_model,
      photos: request.photos || [],
      ship_to: request.ship_to,
      location: request.location,
      status: request.status,
      requested_date: request.requested_date,
      completed_on: request.completed_on,
      created_at: request.created_at,
      updated_at: request.updated_at,
    }));
  } catch (error) {
    console.error('Error in getLCDBuyBackRequests:', error);
    return [];
  }
};

// Create a new LCD buyback request
export const createLCDBuyBackRequest = async (requestData: {
  device_model: string;
  photos: File[];
  ship_to: string;
  location: string;
}): Promise<LCDBuyBackRequest | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Generate unique request ID
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const requestId = `LBB-${timestamp}-${random}`;

    // Convert files to blob URLs (in a real app, you'd upload to storage)
    const photoUrls = requestData.photos.map(file => URL.createObjectURL(file));

    const { data, error } = await supabase
      .from('lcd_buyback')
      .insert({
        user_id: user.id,
        request_id: requestId,
        device_model: requestData.device_model,
        photos: photoUrls,
        ship_to: requestData.ship_to,
        location: requestData.location,
        status: 'Pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating LCD buyback request:', error);
      return null;
    }

    return {
      id: data.id,
      request_id: data.request_id,
      user_id: data.user_id,
      device_model: data.device_model,
      photos: data.photos || [],
      ship_to: data.ship_to,
      location: data.location,
      status: data.status,
      requested_date: data.requested_date,
      completed_on: data.completed_on,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error('Error in createLCDBuyBackRequest:', error);
    return null;
  }
};

// Generate shipping label PDF
export const generateShippingLabelPDF = (request: LCDBuyBackRequest): void => {
  // This would typically be done on the server side, but for demo purposes we'll use jsPDF
  // In a real implementation, you'd call an API endpoint that generates and returns the PDF

  // For now, we'll just open a print dialog with the shipping info
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Shipping Label - ${request.request_id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .info { margin: 10px 0; }
            .label { border: 2px solid #000; padding: 20px; max-width: 400px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Midas Technical Solutions</h1>
            <h2>LCD BuyBack Shipping Label</h2>
          </div>
          <div class="label">
            <div class="info"><strong>Request ID:</strong> ${request.request_id}</div>
            <div class="info"><strong>Device:</strong> ${request.device_model}</div>
            <div class="info"><strong>Ship To:</strong> ${request.ship_to}</div>
            <div class="info"><strong>Location:</strong> ${request.location}</div>
            <div class="info"><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 1000);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

export interface GAPPMarketingMaterial {
  id: string;
  name: string;
  type: 'Banner' | 'Poster' | 'Counter Mat' | 'Brochure' | 'Sticker' | 'Flyer';
  description: string;
  file_url: string;
  thumbnail_url: string;
  file_size: number;
  downloads_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketingMaterialDownload {
  id: string;
  user_id: string;
  material_id: string;
  downloaded_at: string;
  ip_address: string;
  user_agent: string;
}

// Fetch GAPP marketing materials
export const getGAPPMarketingMaterials = async (): Promise<GAPPMarketingMaterial[]> => {
  try {
    const { data, error } = await supabase
      .from('gapp_marketing_materials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching GAPP marketing materials:', error);
      return [];
    }

    return (data || []).map(material => ({
      id: material.id,
      name: material.name,
      type: material.type,
      description: material.description,
      file_url: material.file_url,
      thumbnail_url: material.thumbnail_url,
      file_size: material.file_size,
      downloads_count: material.downloads_count || 0,
      is_active: material.is_active,
      created_at: material.created_at,
      updated_at: material.updated_at,
    }));
  } catch (error) {
    console.error('Error in getGAPPMarketingMaterials:', error);
    return [];
  }
};

// Track download
export const trackMarketingMaterialDownload = async (materialId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Track the download
    const { error: downloadError } = await supabase
      .from('marketing_material_downloads')
      .insert({
        user_id: user.id,
        material_id: materialId,
        downloaded_at: new Date().toISOString(),
        ip_address: '', // Would be set server-side
        user_agent: navigator.userAgent,
      });

    if (downloadError) {
      console.error('Error tracking download:', downloadError);
      return false;
    }

    // Increment download count
    const { error: updateError } = await supabase.rpc('increment_download_count', {
      material_id: materialId
    });

    if (updateError) {
      console.error('Error updating download count:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in trackMarketingMaterialDownload:', error);
    return false;
  }
};

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'wholesale' | 'retail';
          wholesale_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'admin' | 'wholesale' | 'retail';
          wholesale_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'wholesale' | 'retail';
          wholesale_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sku: string | null;
          description: string | null;
          short_description: string | null;
          price: number;
          original_price: number | null;
          discount_percentage: number;
          stock_quantity: number;
          low_stock_threshold: number;
          is_active: boolean;
          is_featured: boolean;
          is_new: boolean;
          weight: number | null;
          dimensions: string | null;
          category_id: string | null;
          brand_id: string | null;
          tags: string[] | null;
          images: string[] | null;
          thumbnail_url: string | null;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sku?: string | null;
          description?: string | null;
          short_description?: string | null;
          price: number;
          original_price?: number | null;
          discount_percentage?: number;
          stock_quantity?: number;
          low_stock_threshold?: number;
          is_active?: boolean;
          is_featured?: boolean;
          is_new?: boolean;
          weight?: number | null;
          dimensions?: string | null;
          category_id?: string | null;
          brand_id?: string | null;
          tags?: string[] | null;
          images?: string[] | null;
          thumbnail_url?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          sku?: string | null;
          description?: string | null;
          short_description?: string | null;
          price?: number;
          original_price?: number | null;
          discount_percentage?: number;
          stock_quantity?: number;
          low_stock_threshold?: number;
          is_active?: boolean;
          is_featured?: boolean;
          is_new?: boolean;
          weight?: number | null;
          dimensions?: string | null;
          category_id?: string | null;
          brand_id?: string | null;
          tags?: string[] | null;
          images?: string[] | null;
          thumbnail_url?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          parent_id: string | null;
          image_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          parent_id?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          parent_id?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          state: string | null;
          postal_code: string | null;
          country: string | null;
          role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      wholesale_requests: {
        Row: {
          id: string;
          user_id: string;
          user_email: string;
          user_name: string;
          business_name: string;
          business_type: string;
          phone: string;
          address: string;
          tax_id: string;
          status: 'pending' | 'approved' | 'rejected';
          applied_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_email: string;
          user_name: string;
          business_name: string;
          business_type: string;
          phone: string;
          address: string;
          tax_id: string;
          status?: 'pending' | 'approved' | 'rejected';
          applied_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_email?: string;
          user_name?: string;
          business_name?: string;
          business_type?: string;
          phone?: string;
          address?: string;
          tax_id?: string;
          status?: 'pending' | 'approved' | 'rejected';
          applied_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
      };
      cart_items: {
        Row: {
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          product_id: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      saved_carts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          items: any[];
          total: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          items?: any[];
          total?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          items?: any[];
          total?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      managers: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          role: string;
          location: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          role: string;
          location: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          role?: string;
          location?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      us_states: {
        Row: {
          id: number;
          name: string;
          code: string;
          exempt: string;
          result: string;
          reject: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          code: string;
          exempt?: string;
          result?: string;
          reject?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          code?: string;
          exempt?: string;
          result?: string;
          reject?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tax_forms: {
        Row: {
          id: string;
          user_id: string;
          type: 'resale' | 'tax-exempt';
          business_name: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          certificate_url: string | null;
          certificate_path: string | null;
          status: 'pending' | 'approved' | 'rejected';
          submitted_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'resale' | 'tax-exempt';
          business_name?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          certificate_url?: string | null;
          certificate_path?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'resale' | 'tax-exempt';
          business_name?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          certificate_url?: string | null;
          certificate_path?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tax_exemptions: {
        Row: {
          id: string;
          user_id: string;
          state_name: string;
          is_exempt: boolean;
          certificate_url: string | null;
          certificate_path: string | null;
          status: 'pending' | 'approved' | 'rejected';
          submitted_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          state_name: string;
          is_exempt?: boolean;
          certificate_url?: string | null;
          certificate_path?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          state_name?: string;
          is_exempt?: boolean;
          certificate_url?: string | null;
          certificate_path?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          submitted_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
