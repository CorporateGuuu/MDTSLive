'use client';

import { Button } from '../ui/button';
import { useCart } from '../../stores/cart-store';

export function AddToCart({ productId, name, price, image }: { productId: string; name: string; price: number; image?: string }) {
  const { addToCart } = useCart();

  return (
    <Button
      size="lg"
      className="w-full bg-blue-600 hover:bg-blue-700 text-lg font-bold py-7"
      onClick={() => {
        addToCart({ id: productId, name, price, images: image ? [image] : [] });
        console.log(`${name} added to cart!`);
      }}
    >
      Add to Cart
    </Button>
  );
}
