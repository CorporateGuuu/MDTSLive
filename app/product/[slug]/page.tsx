'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../../utils/supabaseClient';
import { addToCart } from '../../../utils/cart';
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Heart, Share2, Truck, Shield, RotateCcw, Award, Plus, Minus, CheckCircle, ThumbsUp, MessageSquare, User } from 'lucide-react';
import type { Metadata } from 'next';

// Dynamic metadata for product pages with Supabase integration
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;

  try {
    // Create server Supabase client
    const { createServerClient } = await import('@supabase/ssr');
    const { cookies } = await import('next/headers');
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Fetch product with related data
    const { data: product } = await supabase
      .from('products')
      .select(`
        *,
        brands (name, slug),
        categories (name, slug)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (!product) {
      return {
        title: 'Product Not Found - Midas Technical Solutions',
        description: 'Premium wholesale phone parts and repair tools.',
      };
    }

    // Fetch review data for structured data
    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('rating, title, comment, name, verified, created_at')
      .eq('product_id', product.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Calculate aggregate rating
    let aggregateRating = null;
    let reviewCount = 0;

    if (reviewsData && reviewsData.length > 0) {
      reviewCount = reviewsData.length;
      const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviewsData.length;

      aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": Math.round(averageRating * 10) / 10,
        "reviewCount": reviewCount,
        "bestRating": 5,
        "worstRating": 1
      };
    }

    // Prepare individual reviews for schema (at least 1, prefer 3+ for rich results)
    const reviews = reviewsData?.slice(0, Math.max(3, Math.min(5, reviewsData.length))).map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "reviewBody": review.comment,
      "datePublished": review.created_at.split('T')[0], // Format as YYYY-MM-DD
      "name": review.title || `Review by ${review.name}`
    })) || [];

    // Dynamic title with product name and price
    const title = `${product.name} – MidasGold 7.0 | Wholesale Price $${product.price.toFixed(2)}`;

    // Dynamic description with product details and keywords
    const baseDescription = product.short_description || product.description?.substring(0, 120) || '';
    const description = `Buy ${product.name} wholesale with lifetime warranty. ${baseDescription} MidasGold 7.0 quality, fast shipping, authorized distributor. Bulk pricing available.`;

    // Product image for Open Graph
    const productImage = product.images?.[0] || product.thumbnail_url || '/logos/midas-logo-main.png';

    // Enhanced keywords
    const keywords = [
      product.name.toLowerCase(),
      `${product.brands?.name} ${product.categories?.name}`.toLowerCase(),
      'wholesale phone parts',
      'bulk phone parts',
      'MidasGold 7.0',
      'repair tools',
      'lifetime warranty',
      'authorized distributor',
      'fast shipping',
      'premium quality',
      'bulk pricing',
      'phone repair parts',
      'mobile parts wholesale',
      `${product.name.toLowerCase()} wholesale`,
      `${product.brands?.name} parts`,
      `${product.categories?.name} wholesale`
    ].filter(Boolean);

    // Generate structured data for rich snippets
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.short_description || product.description,
      "image": product.images || [product.thumbnail_url],
      "sku": product.sku,
      "brand": {
        "@type": "Brand",
        "name": product.brands?.name || "MidasGold"
      },
      "manufacturer": {
        "@type": "Organization",
        "name": "Midas Technical Solutions"
      },
      "category": product.categories?.name || "Phone Parts",
      "offers": {
        "@type": "Offer",
        "url": `https://midastechnicalsolutions.com/product/${slug}`,
        "priceCurrency": "USD",
        "price": product.price.toString(),
        "priceValidUntil": "2025-12-31",
        "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Midas Technical Solutions"
        },
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": product.price.toString(),
          "priceCurrency": "USD",
          "valueAddedTaxIncluded": false
        }
      },
      // Only include aggregateRating if there are reviews
      ...(aggregateRating && {
        "aggregateRating": aggregateRating
      }),
      // Include individual reviews for rich snippets
      ...(reviews && reviews.length > 0 && {
        "review": reviews
      })
    };

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: `https://midastechnicalsolutions.com/product/${slug}`,
        siteName: 'Midas Technical Solutions',
        type: 'website',
        images: [
          {
            url: productImage,
            width: 800,
            height: 600,
            alt: `${product.name} - Wholesale Phone Parts & Repair Tools`,
            type: 'image/jpeg',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [productImage],
        creator: '@MidasTechnical',
      },
      other: {
        'product:price:amount': product.price.toString(),
        'product:price:currency': 'USD',
        'product:availability': product.stock_quantity > 0 ? 'in stock' : 'out of stock',
        'product:condition': 'new',
        'product:brand': product.brands?.name || 'MidasGold',
        'product:category': product.categories?.name || 'Phone Parts',
        'product:retailer': 'Midas Technical Solutions',
        'product:retailer_title': 'Midas Technical Solutions Wholesale',
        'script:ld+json': JSON.stringify(structuredData),
      },
    };
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return {
      title: 'Product - Midas Technical Solutions',
      description: 'Premium wholesale phone parts and repair tools.',
    };
  }
}

// ISR configuration for fast indexing
export const revalidate = 3600; // Revalidate every hour

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description?: string;
  price: number;
  original_price?: number;
  discount_percentage: number;
  stock_quantity: number;
  is_featured: boolean;
  is_new: boolean;
  images: string[];
  thumbnail_url?: string;
  brands?: { name: string; slug: string };
  categories?: { name: string; slug: string };
}

interface ProductVariant {
  id: string;
  variant_type: string;
  variant_value: string;
  price_adjustment: number;
  stock_quantity: number;
  is_active: boolean;
}

interface ProductSpecification {
  id: string;
  spec_group: string;
  spec_name: string;
  spec_value: string;
  sort_order: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [aggregateRating, setAggregateRating] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    fetchReviewData();
  }, [slug]);

  const fetchReviewData = async () => {
    try {
      // Fetch review data for structured data
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('rating, title, comment, name, verified, created_at')
        .eq('product_id', product?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate aggregate rating
      let aggregateRating = null;
      let reviewCount = 0;

      if (reviewsData && reviewsData.length > 0) {
        reviewCount = reviewsData.length;
        const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviewsData.length;

        aggregateRating = {
          "@type": "AggregateRating",
          "ratingValue": Math.round(averageRating * 10) / 10,
          "reviewCount": reviewCount,
          "bestRating": 5,
          "worstRating": 1
        };
      }

      // Prepare individual reviews for schema (at least 1, prefer 3+ for rich results)
      const reviews = reviewsData?.slice(0, Math.max(3, Math.min(5, reviewsData.length))).map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": review.name
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": 5,
          "worstRating": 1
        },
        "reviewBody": review.comment,
        "datePublished": review.created_at.split('T')[0], // Format as YYYY-MM-DD
        "name": review.title || `Review by ${review.name}`
      })) || [];

      setAggregateRating(aggregateRating);
      setReviews(reviews);
    } catch (error) {
      console.error('Error fetching review data:', error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);

      // Fetch main product details
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          brands (name, slug),
          categories (name, slug)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (productError || !productData) {
        console.error('Product not found:', productError);
        return;
      }

      setProduct(productData);

      // Fetch review data after product is set
      fetchReviewData();

      // Fetch product variants
      const { data: variantsData } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productData.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      setVariants(variantsData || []);

      // Fetch product specifications
      const { data: specsData } = await supabase
        .from('product_specifications')
        .select('*')
        .eq('product_id', productData.id)
        .order('spec_group', { ascending: true })
        .order('sort_order', { ascending: true });

      setSpecifications(specsData || []);

      // Fetch related products (same category, excluding current product)
      const { data: relatedData } = await supabase
        .from('products')
        .select(`
          *,
          brands (name)
        `)
        .eq('category_id', productData.category_id)
        .neq('id', productData.id)
        .eq('is_active', true)
        .limit(4);

      setRelatedProducts(relatedData || []);

    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = (variantType: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantType]: value
    }));
  };

  const calculateFinalPrice = () => {
    if (!product) return 0;

    let basePrice = product.price;

    // Add variant price adjustments
    Object.entries(selectedVariants).forEach(([type, value]) => {
      const variant = variants.find(v =>
        v.variant_type === type && v.variant_value === value
      );
      if (variant) {
        basePrice += variant.price_adjustment;
      }
    });

    return basePrice;
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      await addToCart(product.name, quantity);
      // You could show a success message here
      console.log(`Added ${quantity} x ${product.name} to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.short_description || product.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const nextImage = () => {
    if (product?.images) {
      setSelectedImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  // Group specifications by spec_group
  const groupedSpecs = specifications.reduce((acc, spec) => {
    if (!acc[spec.spec_group]) {
      acc[spec.spec_group] = [];
    }
    acc[spec.spec_group].push(spec);
    return acc;
  }, {} as Record<string, ProductSpecification[]>);

  // Group variants by variant_type
  const groupedVariants = variants.reduce((acc, variant) => {
    if (!acc[variant.variant_type]) {
      acc[variant.variant_type] = [];
    }
    acc[variant.variant_type].push(variant);
    return acc;
  }, {} as Record<string, ProductVariant[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="bg-gold hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const finalPrice = calculateFinalPrice();
  const allImages = product.images || [];

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gold">Home</Link>
              <span>/</span>
              {product.categories && (
                <>
                  <Link href={`/category/${product.categories.slug}`} className="hover:text-gold">
                    {product.categories.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-gray-900 font-medium">{product.name}</span>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={allImages[selectedImageIndex] || product.thumbnail_url || '/placeholder.svg'}
                alt={`${product.name} – MidasGold 7.0 Wholesale`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_new && (
                  <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    New
                  </span>
                )}
                {product.is_featured && (
                  <span className="bg-gold text-white text-xs px-3 py-1 rounded-full font-medium">
                    Featured
                  </span>
                )}
                {product.discount_percentage > 0 && (
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    -{product.discount_percentage}%
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-gold' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} – MidasGold 7.0 Wholesale View ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Brand */}
            <div>
              {product.brands && (
                <p className="text-gold font-medium text-sm mb-2">{product.brands.name}</p>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-500 text-sm">SKU: {product.sku}</p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gold">${finalPrice.toFixed(2)}</span>
              {product.original_price && product.original_price > finalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
              {product.discount_percentage > 0 && (
                <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
                  Save {product.discount_percentage}%
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-gray-700 text-lg">{product.short_description}</p>
            )}

            {/* Variants */}
            {Object.entries(groupedVariants).map(([variantType, variantOptions]) => (
              <div key={variantType} className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                  {variantType}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variantOptions.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(variantType, variant.variant_value)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedVariants[variantType] === variant.variant_value
                          ? 'border-gold bg-gold text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gold'
                      }`}
                    >
                      {variant.variant_value}
                      {variant.price_adjustment !== 0 && (
                        <span className="ml-1 text-xs">
                          ({variant.price_adjustment > 0 ? '+' : ''}${variant.price_adjustment.toFixed(2)})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock_quantity} in stock
                </span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock_quantity === 0}
                className="w-full bg-gold hover:bg-opacity-90 disabled:bg-gray-400 text-white py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center space-x-2"
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Adding...</span>
                  </>
                ) : product.stock_quantity === 0 ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>Add to Cart - ${(finalPrice * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => {/* Add to wishlist */}}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
              >
                <Heart size={20} />
                <span>Add to Wishlist</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
              >
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck size={16} className="text-gold" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield size={16} className="text-gold" />
                <span>Lifetime Warranty</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <RotateCcw size={16} className="text-gold" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award size={16} className="text-gold" />
                <span>Certified Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description and Specifications */}
        <div className="mt-16 space-y-12">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Specifications */}
          {Object.keys(groupedSpecs).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {Object.entries(groupedSpecs).map(([groupName, specs]) => (
                  <div key={groupName}>
                    <h3 className="text-lg font-semibold text-gold mb-4">{groupName}</h3>
                    <dl className="space-y-2">
                      {specs.map((spec) => (
                        <div key={spec.id} className="flex justify-between py-2 border-b border-gray-100">
                          <dt className="text-gray-600">{spec.spec_name}</dt>
                          <dd className="text-gray-900 font-medium">{spec.spec_value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews Section */}
          <ReviewsSection productId={product.id} productName={product.name} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/product/${relatedProduct.slug}`}
                    className="group"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                      <img
                        src={relatedProduct.thumbnail_url || relatedProduct.images?.[0] || '/placeholder.svg'}
                        alt={`${relatedProduct.name} – MidasGold 7.0 Wholesale`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gold transition-colors line-clamp-2">
                      <a href={`/product/${relatedProduct.slug}`} className="hover:underline">
                        {relatedProduct.name} wholesale parts
                      </a>
                    </h3>
                    <p className="text-gold font-bold">${relatedProduct.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Shop <a href={`/category/${product.categories?.slug}`} className="text-gold hover:underline">
                        {product.categories?.name} wholesale
                      </a> for bulk pricing
                    </p>
                  </Link>
                ))}
              </div>

              {/* Additional internal links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Looking for more <a href={`/category/${product.categories?.slug}`} className="text-gold hover:underline font-medium">
                    {product.categories?.name} repair parts
                  </a>? Browse our complete collection of <a href="/category/iphone-parts" className="text-gold hover:underline font-medium">
                    iPhone parts wholesale
                  </a>, <a href="/category/samsung-parts" className="text-gold hover:underline font-medium">
                    Samsung screen replacements
                  </a>, and <a href="/category/tools-supplies" className="text-gold hover:underline font-medium">
                    professional repair tools
                  </a>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
  );
}

// Reviews Section Component
function ReviewsSection({ productId, productName }: { productId: string; productName: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [votingStates, setVotingStates] = useState<Record<string, 'idle' | 'loading' | 'voted'>>({});
  const reviewsPerPage = 5;

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      // Fetch reviews for this product
      const { data: reviewsData, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      setReviews(reviewsData || []);

      // Calculate review statistics
      if (reviewsData && reviewsData.length > 0) {
        const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviewsData.length;

        const ratingBreakdown = reviewsData.reduce((acc, review) => {
          acc[review.rating] = (acc[review.rating] || 0) + 1;
          return acc;
        }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

        setReviewStats({
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: reviewsData.length,
          ratingBreakdown
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpfulVote = async (reviewId: string) => {
    if (votingStates[reviewId] === 'loading') return;

    try {
      setVotingStates(prev => ({ ...prev, [reviewId]: 'loading' }));

      const response = await fetch(`/api/reviews/helpful?reviewId=${reviewId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to vote');
      }

      // Update the review's helpful votes count in the local state
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId
            ? { ...review, helpful_votes: review.helpful_votes + (data.action === 'added' ? 1 : -1) }
            : review
        )
      );

      setVotingStates(prev => ({ ...prev, [reviewId]: 'voted' }));

      // Reset voted state after 5 seconds
      setTimeout(() => {
        setVotingStates(prev => ({ ...prev, [reviewId]: 'idle' }));
      }, 5000);

    } catch (error) {
      console.error('Error voting on review:', error);
      setVotingStates(prev => ({ ...prev, [reviewId]: 'idle' }));
      alert('Error voting on review. Please try again.');
    }
  };

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const handleSubmitReview = async (reviewData: any) => {
    setSubmittingReview(true);
    try {
      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating: reviewData.rating,
          title: reviewData.title,
          review: reviewData.review,
          name: reviewData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setShowReviewModal(false);
      alert(data.message || 'Thank you for your review! It will be published after approval.');
      // Note: We don't refresh reviews immediately since new reviews aren't approved yet
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number, size: number = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-gold hover:bg-opacity-90 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <MessageSquare size={18} />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Review Statistics */}
        {reviews.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-8 p-6 bg-gray-50 rounded-lg">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gold mb-2">
                {reviewStats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center mb-2">
                {renderStars(Math.round(reviewStats.averageRating), 20)}
              </div>
              <div className="text-gray-600">
                Based on {reviewStats.totalReviews} verified review{reviewStats.totalReviews !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviewStats.ratingBreakdown[rating as keyof typeof reviewStats.ratingBreakdown];
                const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-12">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star size={12} className="text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gold h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500 mb-6">Be the first to share your experience with this product.</p>
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-gold hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Write the First Review
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedReviews.map((review) => {
              const isExpanded = expandedReviews.has(review.id);
              const isLongReview = review.comment.length > 200;
              const displayText = isExpanded || !isLongReview
                ? review.comment
                : review.comment.substring(0, 200) + '...';

              return (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4 md:p-6">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gold bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} className="md:w-5 md:h-5 text-gold" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                          <span className="font-semibold text-gray-900 text-sm md:text-base truncate">
                            {review.name}
                          </span>
                          {review.is_verified_purchase && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                              <CheckCircle size={10} className="mr-1" />
                              <span className="hidden sm:inline">Verified Purchase</span>
                              <span className="sm:hidden">Verified</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            {/* Clickable Stars for Mobile */}
                            <div className="flex items-center space-x-1">
                              {renderStars(review.rating, 14)}
                            </div>
                          </div>
                          <span className="text-xs md:text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-2">
                    {review.title && (
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">{review.title}</h4>
                    )}
                    <div className="text-gray-700 leading-relaxed text-sm md:text-base">
                      <p>{displayText}</p>
                      {isLongReview && (
                        <button
                          onClick={() => toggleReviewExpansion(review.id)}
                          className="text-gold hover:text-opacity-80 font-medium text-sm mt-2 transition-colors"
                        >
                          {isExpanded ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Review Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleHelpfulVote(review.id)}
                      disabled={votingStates[review.id] === 'loading'}
                      className={`flex items-center space-x-2 transition-colors text-xs md:text-sm ${
                        votingStates[review.id] === 'voted'
                          ? 'text-gold'
                          : 'text-gray-500 hover:text-gold'
                      } ${votingStates[review.id] === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <ThumbsUp size={14} />
                      <span>
                        {votingStates[review.id] === 'loading' ? 'Voting...' :
                         votingStates[review.id] === 'voted' ? 'Voted Helpful' :
                         `Helpful (${review.helpful_votes})`}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 border rounded-md ${
                        currentPage === pageNumber
                          ? 'bg-gold text-white border-gold'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            {/* Load More Button (Alternative to pagination) */}
            {reviews.length > reviewsPerPage && totalPages <= 1 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage * reviewsPerPage >= reviews.length}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <ReviewModal
          productName={productName}
          onSubmit={handleSubmitReview}
          onClose={() => setShowReviewModal(false)}
          submitting={submittingReview}
        />
      )}
    </>
  );
}

// Review Modal Component
function ReviewModal({ productName, onSubmit, onClose, submitting }: {
  productName: string;
  onSubmit: (data: any) => void;
  onClose: () => void;
  submitting: boolean;
}) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !review.trim() || !name.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    onSubmit({ rating, title: title.trim(), review: review.trim(), name: name.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product: <span className="font-semibold">{productName}</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  </button>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {rating} star{rating !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
                placeholder="Summarize your experience..."
                required
              />
              <div className="text-xs text-gray-500 mt-1">{title.length}/100 characters</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={6}
                maxLength={1000}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors resize-vertical"
                placeholder="Share your experience with this product..."
                required
              />
              <div className="text-xs text-gray-500 mt-1">{review.length}/1000 characters</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your review will be submitted for approval before being published.
                We appreciate your feedback and will review it within 24 hours.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-gold hover:bg-opacity-90 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare size={16} />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
