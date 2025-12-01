'use client';

import { createContext, useContext, useState } from 'react';

interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  governorate: string;
  city: string;
  address: string;
  building?: string;
  notes?: string;
}

interface OrderContextType {
  shipping: ShippingAddress | null;
  paymentMethod: 'card' | 'cod' | null;
  setShipping: (data: ShippingAddress) => void;
  setPaymentMethod: (method: 'card' | 'cod') => void;
  clear: () => void;
}

const OrderContext = createContext<OrderContextType>({
  shipping: null,
  paymentMethod: null,
  setShipping: () => {},
  setPaymentMethod: () => {},
  clear: () => {},
});

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [shipping, setShipping] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | null>(null);

  const clear = () => {
    setShipping(null);
    setPaymentMethod(null);
  };

  return (
    <OrderContext.Provider value={{ shipping, setShipping, paymentMethod, setPaymentMethod, clear }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);
