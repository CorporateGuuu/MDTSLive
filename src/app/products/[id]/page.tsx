'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById } from '../../../lib/supabase';
import { Product } from '../../../types';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Loader2, ShoppingCart, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const productData = await getProductById(params.id as string);
        if (productData) {
          setProduct(productData);
        } else {
          toast.error('Product not found');
          router.push('/products');
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        toast.error('Failed to load product');
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id, router]);

  const handleAddToCart = () => {
    if (!product) return;

    // For now, just show a toast. In a real app, you'd add to cart context/state
    toast.success(`${product.name} added to cart!`);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [product.image, ...product.gallery].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-700">Products</Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={allImages[selectedImage] || product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative overflow-hidden rounded-lg bg-gray-100 border-2 transition-colors ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.isNew && <Badge variant="secondary">New</Badge>}
                {product.isFeatured && <Badge variant="default">Featured</Badge>}
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <Badge variant="destructive">-{product.discountPercentage}%</Badge>
                )}
                <Badge variant={product.inStock ? "outline" : "secondary"}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <span className="text-sm text-green-600 font-medium">
                    Save ${((product.originalPrice || product.price) - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* SKU and Brand */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                {product.sku && <span>SKU: {product.sku}</span>}
                {product.brand && <span>Brand: {product.brand}</span>}
                {product.condition && <span>Condition: {product.condition}</span>}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            </div>

            {/* Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-medium">Quantity</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>

                  <Button variant="outline" size="lg">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Warranty Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-medium text-blue-900">Free Shipping</h3>
                  <p className="text-sm text-blue-700">Orders over $50</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-900">1 Year Warranty</h3>
                  <p className="text-sm text-green-700">Parts & Labor</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                <RotateCcw className="h-6 w-6 text-orange-600" />
                <div>
                  <h3 className="font-medium text-orange-900">30-Day Returns</h3>
                  <p className="text-sm text-orange-700">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section (placeholder for now) */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="text-center py-12 text-gray-500">
            <p>Related products will be displayed here based on category and tags.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
