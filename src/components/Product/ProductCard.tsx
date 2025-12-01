'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '../../../contexts/CartContext';
import { useQuote } from '../../../contexts/QuoteContext';
import { useSession } from 'next-auth/react';
import { Product } from '../../types';
import { getDiscountedPrice, getRoleBadge } from '../../lib/pricing';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { addToQuote } = useQuote();
  const { data: session } = useSession();
  const [isCompared, setIsCompared] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const role = (session?.user?.role as any) || 'retail';
  const isLoggedIn = !!session;
  const price = getDiscountedPrice(product.price, role);
  const badge = getRoleBadge(role);

  const handleCompareToggle = () => {
    setIsCompared(!isCompared);
    // TODO: Add to compare context when implemented
  };

  const handleQuickView = () => {
    setShowQuickView(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.gallery.length - 1 : prev - 1
    );
  };

  return (
    <>
      <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200">
        {/* Compare Checkbox */}
        <div className="absolute top-3 left-3 z-10">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isCompared}
              onChange={handleCompareToggle}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              aria-label="Compare product"
            />
            <span className="sr-only">Compare {product.name}</span>
          </label>
        </div>

        {/* Quick View Trigger */}
        <div
          className="relative overflow-hidden rounded-t-lg cursor-pointer"
          onMouseEnter={handleQuickView}
        >
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={192}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={() => setShowQuickView(true)}
              className="bg-white text-gray-900 px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium"
            >
              Quick View
            </button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
          <h3 className="mt-1 text-lg font-medium text-gray-900 line-clamp-2">
            <Link href={`/products/${product.id}`} className="hover:text-blue-600 transition-colors">
              {product.name}
            </Link>
          </h3>

          {/* Rating Stars */}
          <div className="mt-2 flex items-center">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= 4 ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">4.8 (120)</span>
          </div>

          {/* Price Section */}
          <div className="mt-3">
            {isLoggedIn ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-900">${price}</span>
                  {role !== 'retail' && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ${product.price}
                    </span>
                  )}
                </div>
                {role !== 'retail' && (
                  <span className={`text-xs px-2 py-1 rounded text-white ${badge.color}`}>
                    {badge.text}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-center py-2">
                <span className="text-sm text-gray-600">Login for Pricing</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          {isLoggedIn ? (
            <button
              onClick={() => addToCart({ id: product.id, name: product.name, price: price, images: [product.image, ...product.gallery] })}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700"
            >
              Add to Cart – ${price}
            </button>
          ) : (
            <button
              onClick={() => addToQuote({ id: product.id, name: product.name, price: price, images: [product.image, ...product.gallery] })}
              className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-gray-200"
            >
              Add to Quote – ${price}
            </button>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <button
                onClick={() => setShowQuickView(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close quick view"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image Gallery */}
                <div className="relative">
                  <Image
                    src={product.gallery[currentImageIndex] || product.image}
                    alt={product.name}
                    width={400}
                    height={256}
                    className="w-full h-64 object-cover rounded-lg"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  />
                  {product.gallery.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
                        aria-label="Previous image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
                        aria-label="Next image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  <div className="flex mt-2 space-x-2">
                    {product.gallery.slice(0, 4).map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        width={64}
                        height={64}
                        className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                          index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                      />
                    ))}
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= 4 ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">4.8 (120 reviews)</span>
                  </div>

                  {isLoggedIn ? (
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-gray-900">${price}</span>
                      {role !== 'retail' && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${product.price}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-gray-50 rounded text-center">
                      <span className="text-sm text-gray-600">Login for Pricing</span>
                    </div>
                  )}

                  <p className="text-sm text-gray-700 mb-4">{product.description}</p>

                  {isLoggedIn ? (
                    <button
                      onClick={() => addToCart({ ...product, price })}
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => addToQuote({ ...product, price })}
                      className="w-full bg-gray-100 text-gray-900 py-2 rounded-md hover:bg-gray-200 transition-colors font-medium"
                    >
                      Add to Quote
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
