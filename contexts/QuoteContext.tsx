'use client';
import { createContext, useContext, useState, useEffect } from 'react';

interface QuoteItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface QuoteContextType {
  items: QuoteItem[];
  itemCount: number;
  addToQuote: (product: { id: string; name: string; price: number; image: string }) => void;
  removeFromQuote: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearQuote: () => void;
  total: number;
}

const QuoteContext = createContext<QuoteContextType>({
  items: [],
  itemCount: 0,
  addToQuote: () => {},
  removeFromQuote: () => {},
  updateQuantity: () => {},
  clearQuote: () => {},
  total: 0
});

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('quote');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('quote', JSON.stringify(items));
  }, [items]);

  const addToQuote = (product: { id: string; name: string; price: number; image: string }) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      }];
    });
  };

  const removeFromQuote = (id: string) => {
    setItems(prev => prev.filter(item => item.productId !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromQuote(id);
      return;
    }
    setItems(prev => prev.map(item =>
      item.productId === id
        ? { ...item, quantity: qty }
        : item
    ));
  };

  const clearQuote = () => {
    setItems([]);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <QuoteContext.Provider value={{
      items, itemCount, addToQuote, removeFromQuote, updateQuantity, clearQuote, total
    }}>
      {children}
    </QuoteContext.Provider>
  );
}

export const useQuote = () => useContext(QuoteContext);
