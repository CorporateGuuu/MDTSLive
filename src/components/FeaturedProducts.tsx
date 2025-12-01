'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';

const products = [
  {
    id: 'ip15-pro-max-screen',
    name: 'iPhone 15 Pro Max OLED Screen - Aftermarket Pro',
    price: 89.99,
    originalPrice: 129.99,
    image: '/images/products/iphone-15-pro-max-screen.svg',
    badge: 'Bulk Discount'
  },
  {
    id: 'sg-s24-ultra-screen',
    name: 'Samsung Galaxy S24 Ultra Screen Assembly',
    price: 79.99,
    originalPrice: 109.99,
    image: '/images/products/samsung-s21-screen.jpg',
    badge: 'OEM Quality'
  },
  {
    id: 'ipad-pro-12-9-screen',
    name: 'iPad Pro 12.9" Liquid Retina XDR Display',
    price: 149.99,
    originalPrice: 199.99,
    image: '/images/products/ipad-pro-screen.jpg',
    badge: 'Premium Grade'
  }
];

export default function FeaturedProducts() {
  const { user } = useAuth();
  const { addToCart } = useCart();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Featured Products</h2>
        <p className="text-center text-gray-600 mb-12">Top-selling wholesale parts with competitive pricing</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="relative h-64">
                <Image src={p.image} alt={p.name} fill className="object-cover" />
                <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {p.badge}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  <Link href={`/products/${p.id}`} className="hover:text-red-600 transition">
                    {p.name}
                  </Link>
                </h3>
                <div className="mb-4">
                  {user ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">${p.price}</span>
                      <span className="text-gray-500 line-through">${p.originalPrice}</span>
                    </div>
                  ) : (
                    <p className="text-red-600 font-medium">Login for Pricing</p>
                  )}
                </div>
                {user ? (
                  <button
                    onClick={() => addToCart(p)}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <Link href="/login" className="block text-center w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition">
                    Add to Quote
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
