import { supabase } from './supabaseClient';

export async function addToCart(productId, quantity = 1) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Authenticated user: Insert to database
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: quantity
        });

      if (error) {
        console.error('Cart database error:', error);
        throw error;
      }
    } else {
      // Guest user: Store in localStorage
      let cart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const existing = cart.find(item => item.product_id === productId);

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ product_id: productId, quantity });
      }

      localStorage.setItem('guest_cart', JSON.stringify(cart));
    }

    // Update cart badge
    updateCartBadge();
    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error };
  }
}

export async function removeFromCart(productId) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Authenticated user: Remove from database
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Cart removal error:', error);
        throw error;
      }
    } else {
      // Guest user: Remove from localStorage
      let cart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      cart = cart.filter(item => item.product_id !== productId);
      localStorage.setItem('guest_cart', JSON.stringify(cart));
    }

    updateCartBadge();
    return { success: true };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, error };
  }
}

export async function updateCartQuantity(productId, quantity) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Authenticated user: Update in database
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Cart update error:', error);
        throw error;
      }
    } else {
      // Guest user: Update in localStorage
      let cart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const item = cart.find(item => item.product_id === productId);

      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
          cart = cart.filter(cartItem => cartItem.product_id !== productId);
        }
        localStorage.setItem('guest_cart', JSON.stringify(cart));
      }
    }

    updateCartBadge();
    return { success: true };
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return { success: false, error };
  }
}

export async function getCartItems() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Authenticated user: Get from database
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          products (
            id,
            name,
            price,
            sku,
            discount_percentage
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cart from database:', error);
        return [];
      }

      return data || [];
    } else {
      // Guest user: Get from localStorage
      const cart = JSON.parse(localStorage.getItem('guest_cart') || '[]');

      // Fetch product details for guest cart items
      if (cart.length > 0) {
        const productIds = cart.map(item => item.product_id);
        const { data: products, error } = await supabase
          .from('products')
          .select('id, name, price, sku, discount_percentage')
          .in('id', productIds);

        if (error) {
          console.error('Error fetching products for guest cart:', error);
          return [];
        }

        // Combine cart items with product details
        return cart.map(cartItem => {
          const product = products.find(p => p.id === cartItem.product_id);
          return {
            id: `guest-${cartItem.product_id}`,
            quantity: cartItem.quantity,
            products: product || null
          };
        }).filter(item => item.products);
      }

      return [];
    }
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
}

export async function syncCart() {
  try {
    const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
    if (guestCart.length === 0) return { success: true };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'No authenticated user' };

    // Clear existing database cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    // Insert guest cart items into database
    const { error } = await supabase
      .from('cart_items')
      .insert(
        guestCart.map(item => ({
          user_id: user.id,
          product_id: item.product_id,
          quantity: item.quantity
        }))
      );

    if (error) {
      console.error('Error syncing cart:', error);
      return { success: false, error };
    }

    // Clear localStorage
    localStorage.removeItem('guest_cart');

    // Update cart badge
    updateCartBadge();

    return { success: true };
  } catch (error) {
    console.error('Error syncing cart:', error);
    return { success: false, error };
  }
}

export function updateCartBadge() {
  // This function will be called to update the cart badge in the UI
  // It can be implemented in the component that displays the cart count
  if (typeof window !== 'undefined') {
    // Dispatch custom event for React components to listen to
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }
}

export async function getCartTotal() {
  try {
    const cartItems = await getCartItems();
    let total = 0;

    cartItems.forEach(item => {
      if (item.products) {
        const price = item.products.price || 0;
        const discount = item.products.discount_percentage || 0;
        const discountedPrice = price * (1 - discount / 100);
        total += discountedPrice * item.quantity;
      }
    });

    return total;
  } catch (error) {
    console.error('Error calculating cart total:', error);
    return 0;
  }
}

export async function clearCart() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Authenticated user: Clear database cart
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing database cart:', error);
        throw error;
      }
    } else {
      // Guest user: Clear localStorage
      localStorage.removeItem('guest_cart');
    }

    updateCartBadge();
    return { success: true };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, error };
  }
}
