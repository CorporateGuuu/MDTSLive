import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  brand,
  inStock = true,
  isNew = false,
  isSale = false,
}: ProductCardProps) {
  return (
    <Link href={`/product/${id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Image Container - iOS Safari safe */}
        <div className="relative aspect-square bg-gray-50">
          <Image
            src={image || '/placeholder.jpg'}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            priority={false}
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && <Badge className="bg-green-500 text-white">NEW</Badge>}
            {isSale && <Badge className="bg-red-500 text-white">SALE</Badge>}
          </div>

          {/* Out of stock overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-bold text-xl">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
              {brand}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
            {name}
          </h3>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">${price}</p>
              {originalPrice && (
                <p className="text-sm text-gray-500 line-through">${originalPrice}</p>
              )}
            </div>

            <Button
              size="sm"
              className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
              disabled={!inStock}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
