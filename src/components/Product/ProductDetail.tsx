'use client';

import { useCart } from '../../stores/cartStore';
import { useAuth } from '../../../contexts/AuthContext';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../types';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [selectedImg, setSelectedImg] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Mock related products - in real app, fetch from API
  const relatedProducts: Product[] = [
    {
      _id: '1',
      id: '1',
      name: 'Related Product 1',
      price: 299,
      image: '/placeholder.svg',
      gallery: [],
      category: 'Electronics',
      brand: 'TechBrand',
      inStock: true,
      description: 'A great related product'
    },
    {
      _id: '2',
      id: '2',
      name: 'Related Product 2',
      price: 399,
      image: '/placeholder.svg',
      gallery: [],
      category: 'Electronics',
      brand: 'TechBrand',
      inStock: true,
      description: 'Another excellent product'
    },
    {
      _id: '3',
      id: '3',
      name: 'Related Product 3',
      price: 199,
      image: '/placeholder.svg',
      gallery: [],
      category: 'Electronics',
      brand: 'TechBrand',
      inStock: true,
      description: 'Affordable quality product'
    },
    {
      _id: '4',
      id: '4',
      name: 'Related Product 4',
      price: 499,
      image: '/placeholder.svg',
      gallery: [],
      category: 'Electronics',
      brand: 'TechBrand',
      inStock: true,
      description: 'Premium product option'
    }
  ];

  const allImages = [product.image, ...(product.gallery || [])];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      condition: 'New' // Default condition for products
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    setSelectedImg(allImages[(currentImageIndex + 1) % allImages.length]);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setSelectedImg(allImages[(currentImageIndex - 1 + allImages.length) % allImages.length]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-lg">
              <Image
                src={selectedImg}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Mobile Swipe Navigation */}
              {isMobile && allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.slice(0, 6).map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedImg(img);
                    setCurrentImageIndex(i);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImg === img ? 'border-blue-600 shadow-md' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  aria-label={`View product image ${i + 1}`}
                >
                  <Image src={img} alt="" width={80} height={80} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-sm text-gray-600 mb-2">Brand: {product.brand}</p>
              <p className="text-gray-600">{product.category}</p>
            </div>

            {/* Badge */}
            {product.badge && (
              <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}

            {/* Pricing */}
            <div className="space-y-2">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-gray-700">Login for Pricing</p>
                  <p className="text-sm text-gray-600 mt-1">Sign in to view wholesale prices</p>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                <div className="bg-white rounded-lg border overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(product.specs).map(([key, value], index) => (
                        <tr key={key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200">{key}</td>
                          <td className="px-4 py-3 text-gray-700">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Add to Cart Section */}
            {product.inStock && (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <label htmlFor="quantity" className="font-medium">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-x py-2 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg"
                >
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>
              </div>
            )}

            {/* Reviews Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-lg font-semibold">4.8</span>
                <span className="text-gray-600">(124 reviews)</span>
              </div>
              <p className="text-sm text-gray-600">
                Customers love this product! Based on 124 reviews with an average rating of 4.8 stars.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart Bar */}
      {isMobile && product.inStock && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{product.name}</p>
              <p className="text-lg font-bold text-blue-600">${product.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-3 py-2 border-x min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
