'use client';

import { useAuth } from '../../contexts/AuthContext';

interface PricingDisplayProps {
  basePrice: number;
  productName: string;
}

export default function PricingDisplay({ basePrice, productName }: PricingDisplayProps) {
  const { user, isAuthenticated } = useAuth();

  // Only show wholesale pricing for authenticated users
  const isWholesaleUser = isAuthenticated && user?.user_metadata?.user_type === 'wholesale';
  const discount = isWholesaleUser ? 0.2 : 0; // 20% discount for wholesale users
  const discountedPrice = basePrice * (1 - discount);

  return (
    <div className="pricing-display">
      <h3>{productName}</h3>

      {isWholesaleUser ? (
        <div className="price-with-discount">
          <div className="original-price">
            <span className="line-through text-gray-500">
              USD {basePrice.toFixed(2)}
            </span>
          </div>
          <div className="discounted-price">
            <span className="text-green-600 font-bold text-lg">
              USD {discountedPrice.toFixed(2)}
            </span>
            <span className="text-sm text-green-600 ml-2">
              (20% off)
            </span>
          </div>
          <div className="role-badge">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Wholesale Pricing
            </span>
          </div>
        </div>
      ) : (
        <div className="regular-price">
          <span className="text-lg font-semibold">
            Login for wholesale pricing
          </span>
        </div>
      )}
    </div>
  );
}
