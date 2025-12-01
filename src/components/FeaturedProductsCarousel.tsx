'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Star, ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

export default function FeaturedProductsCarousel() {
  const [isVisible, setIsVisible] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const products: Product[] = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max Screen',
      price: 299.99,
      image: '/images/products/iphone-screen.jpg',
      rating: 4.5,
      reviews: 128
    },
    {
      id: 2,
      title: 'MacBook Pro 16" Keyboard',
      price: 189.99,
      image: '/images/products/macbook-keyboard.jpg',
      rating: 4.7,
      reviews: 89
    },
    {
      id: 3,
      title: 'Samsung Galaxy S24 Battery',
      price: 79.99,
      image: '/images/products/samsung-battery.jpg',
      rating: 4.3,
      reviews: 156
    },
    {
      id: 4,
      title: 'iPad Air 5 Display',
      price: 249.99,
      image: '/images/products/ipad-screen.jpg',
      rating: 4.6,
      reviews: 94
    },
    {
      id: 5,
      title: 'Apple Watch Series 9 Screen',
      price: 149.99,
      image: '/images/products/watch-screen.jpg',
      rating: 4.4,
      reviews: 67
    },
    {
      id: 6,
      title: 'PlayStation 5 Controller',
      price: 89.99,
      image: '/images/products/ps5-controller.jpg',
      rating: 4.8,
      reviews: 203
    },
    {
      id: 7,
      title: 'AirPods Pro 2 Drivers',
      price: 129.99,
      image: '/images/products/airpods-parts.jpg',
      rating: 4.2,
      reviews: 78
    },
    {
      id: 8,
      title: 'MacBook Air M2 Battery',
      price: 159.99,
      image: '/images/products/macbook-battery.jpg',
      rating: 4.5,
      reviews: 112
    }
  ];

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute inset-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <section
      ref={carouselRef}
      className={`py-12 bg-gray-50 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ height: '500px' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300"
          >
            View All →
          </Link>
        </div>

        {/* Custom Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ width: '320px' }}
              >
                <div className="grid grid-cols-1 gap-0">
                  {/* Product Image */}
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div
                      className="w-full h-80 bg-gray-200 flex items-center justify-center"
                      style={{ height: '320px' }}
                    >
                      <div className="text-center text-gray-500">
                        <div className="text-sm font-medium">{product.title}</div>
                        <div className="text-xs mt-1">400x400 Image</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300" />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-300">
                      {product.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center space-x-1">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-red-600">
                        ${product.price}
                      </span>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center space-x-2">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.ceil(products.length / 5) }).map((_, index) => (
              <button
                key={index}
                className="w-3 h-3 rounded-full bg-gray-300 hover:bg-blue-500 transition-colors duration-300"
                onClick={() => {
                  if (carouselRef.current) {
                    const scrollAmount = index * (320 + 24) * 5; // 320px card width + 24px gap, times 5 cards
                    carouselRef.current.scrollTo({
                      left: scrollAmount,
                      behavior: 'smooth'
                    });
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
