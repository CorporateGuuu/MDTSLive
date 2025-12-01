import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';

interface CartStore {
  items: CartItem[];
  itemCount: number;
  subtotal: number;

  // Actions
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.id === item.id);

        if (existingItem) {
          // Update quantity if item exists
          const updatedItems = items.map(i =>
            i.id === item.id
              ? { ...i, qty: i.qty + 1 }
              : i
          );
          set({
            items: updatedItems,
            itemCount: updatedItems.reduce((sum, i) => sum + i.qty, 0),
            subtotal: updatedItems.reduce((sum, i) => sum + i.price * i.qty, 0)
          });
        } else {
          // Add new item
          const newItems = [...items, { ...item, qty: 1 }];
          set({
            items: newItems,
            itemCount: newItems.reduce((sum, i) => sum + i.qty, 0),
            subtotal: newItems.reduce((sum, i) => sum + i.price * i.qty, 0)
          });
        }
      },

      removeItem: (id) => {
        const { items } = get();
        const newItems = items.filter(i => i.id !== id);
        set({
          items: newItems,
          itemCount: newItems.reduce((sum, i) => sum + i.qty, 0),
          subtotal: newItems.reduce((sum, i) => sum + i.price * i.qty, 0)
        });
      },

      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }

        const { items } = get();
        const updatedItems = items.map(i =>
          i.id === id ? { ...i, qty } : i
        );
        set({
          items: updatedItems,
          itemCount: updatedItems.reduce((sum, i) => sum + i.qty, 0),
          subtotal: updatedItems.reduce((sum, i) => sum + i.price * i.qty, 0)
        });
      },

      clearCart: () => {
        set({
          items: [],
          itemCount: 0,
          subtotal: 0
        });
      }
    }),
    {
      name: 'cart-storage', // localStorage key
      // Only persist items, computed values will be recalculated
      partialize: (state) => ({ items: state.items })
    }
  )
);

// Initialize computed values on store creation
useCart.subscribe((state) => {
  useCart.setState({
    itemCount: state.items.reduce((sum, i) => sum + i.qty, 0),
    subtotal: state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  });
});
