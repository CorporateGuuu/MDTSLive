'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../src/lib/supabase';
import { useSession } from 'next-auth/react';
import { RealtimeChannel } from '@supabase/supabase-js';

interface CartItem {
  id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  addToCart: (product: { id: string; name: string; price: number; images: string[] }) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncWithSupabase: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  subtotal: 0,
  isLoading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  syncWithSupabase: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  // Load cart from localStorage initially
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Sync with Supabase when user logs in
  useEffect(() => {
    if (session?.user?.id) {
      syncWithSupabase();
      setupRealtimeSubscription();
    } else {
      // Clean up realtime subscription when user logs out
      if (realtimeChannel) {
        realtimeChannel.unsubscribe();
        setRealtimeChannel(null);
      }
    }

    return () => {
      if (realtimeChannel) {
        realtimeChannel.unsubscribe();
      }
    };
  }, [session?.user?.id]);

  const setupRealtimeSubscription = useCallback(() => {
    if (!session?.user?.id || realtimeChannel) return;

    const channel = supabase
      .channel(`cart-${session.user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log('Cart realtime update:', payload);
          syncWithSupabase();
        }
      )
      .subscribe();

    setRealtimeChannel(channel);
  }, [session?.user?.id, realtimeChannel]);

  const syncWithSupabase = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const { data: cartData, error } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          products (
            id,
            name,
            price,
            images
          )
        `)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error syncing cart with Supabase:', error);
        return;
      }

      if (cartData) {
        const syncedItems: CartItem[] = cartData.map((item: any) => ({
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          images: item.products.images || [],
          quantity: item.quantity,
        }));

        setItems(syncedItems);
      }
    } catch (error) {
      console.error('Error in syncWithSupabase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: { id: string; name: string; price: number; images: string[] }) => {
    if (!session?.user?.id) {
      // Handle local cart for non-logged-in users
      setItems(prev => {
        const existing = prev.find(i => i.id === product.id);
        if (existing) {
          return prev.map(i =>
            i.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          images: product.images,
          quantity: 1
        }];
      });
      return;
    }

    try {
      // Check if item already exists in Supabase cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', session.user.id)
        .eq('product_id', product.id)
        .single();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1, updated_at: new Date().toISOString() })
          .eq('user_id', session.user.id)
          .eq('product_id', product.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: session.user.id,
            product_id: product.id,
            quantity: 1,
          });

        if (error) throw error;
      }

      // Update local state
      setItems(prev => {
        const existing = prev.find(i => i.id === product.id);
        if (existing) {
          return prev.map(i =>
            i.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          images: product.images,
          quantity: 1
        }];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (id: string) => {
    if (!session?.user?.id) {
      // Handle local cart
      setItems(prev => prev.filter(item => item.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.user.id)
        .eq('product_id', id);

      if (error) throw error;

      // Update local state
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (id: string, qty: number) => {
    if (qty <= 0) {
      await removeFromCart(id);
      return;
    }

    if (!session?.user?.id) {
      // Handle local cart
      setItems(prev => prev.map(item =>
        item.id === id
          ? { ...item, quantity: qty }
          : item
      ));
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: qty, updated_at: new Date().toISOString() })
        .eq('user_id', session.user.id)
        .eq('product_id', id);

      if (error) throw error;

      // Update local state
      setItems(prev => prev.map(item =>
        item.id === id
          ? { ...item, quantity: qty }
          : item
      ));
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!session?.user?.id) {
      // Handle local cart
      setItems([]);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.user.id);

      if (error) throw error;

      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      syncWithSupabase
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
