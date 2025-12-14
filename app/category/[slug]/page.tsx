'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../../utils/supabaseClient';
import { addToCart } from '../../../utils/cart';
import { ChevronDown, Grid, List, Filter, Search, ShoppingCart, Star, X } from 'lucide-react';

// Metadata and ISR are handled by the server component

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  discount_percentage: number;
  images: string[];
  thumbnail_url?: string;
  short_description?: string;
  is_featured: boolean;
  is_new: boolean;
  stock_quantity: number;
  brands?: { name: string };
  categories?: { name: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Structured data component for categories
function CategoryStructuredData({ category, products }: { category: any, products: any[] }) {
  const categoryUrl = `https://midastechnicalsolutions.com/category/${category.slug}`;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([
          // BreadcrumbList for category navigation
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://midastechnicalsolutions.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": category.name,
                "item": categoryUrl
              }
            ]
          },

          // CollectionPage schema for category
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": category.name,
            "description": category.description || `${category.name} wholesale parts - premium quality with lifetime warranty`,
            "url": categoryUrl,
            "mainEntity": {
              "@type": "ItemList",
              "name": `Products in ${category.name}`,
              "description": `Browse our complete collection of ${category.name.toLowerCase()} wholesale parts and accessories`,
              "numberOfItems": products.length,
              "itemListElement": products.slice(0, 10).map((product, index) => ({
                "@type": "Product",
                "position": index + 1,
                "name": product.name,
                "url": `https://midastechnicalsolutions.com/product/${product.slug}`,
                "image": product.thumbnail_url || product.images?.[0],
                "offers": {
                  "@type": "Offer",
                  "price": product.price.toString(),
                  "priceCurrency": "USD",
                  "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                }
              }))
            }
          }
        ])
      }}
    />
  );
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 24;

  // Available brands for filtering
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [slug, sortBy, filterBrand, priceRange, currentPage]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);

      // Fetch category info
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (categoryError || !categoryData) {
        console.error('Category not found:', categoryError);
        return;
      }

      setCategory(categoryData);

      // Build query for products
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          original_price,
          discount_percentage,
          images,
          thumbnail_url,
          short_description,
          is_featured,
          is_new,
          stock_quantity,
          brands (
            name
          ),
          categories (
            name
          )
        `, { count: 'exact' })
        .eq('category_id', categoryData.id)
        .eq('is_active', true);

      // Apply filters
      if (filterBrand !== 'all') {
        query = query.eq('brand_id', filterBrand);
      }

      query = query
        .gte('price', priceRange[0])
        .lte('price', priceRange[1]);

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'featured':
          query = query.order('is_featured', { ascending: false });
          break;
        default:
          query = query.order('name', { ascending: true });
      }

      // Apply pagination
      const from = (currentPage - 1) * productsPerPage;
      const to = from + productsPerPage - 1;
      query = query.range(from, to);

      const { data: productsData, error: productsError, count } = await query;

      if (productsError) {
        console.error('Products fetch error:', productsError);
        return;
      }

      setProducts((productsData || []) as unknown as Product[]);
      setTotalProducts(count || 0);

      // Fetch available brands for this category
      const { data: brandsData } = await supabase
        .from('products')
        .select(`
          brand_id,
          brands (
            id,
            name
          )
        `)
        .eq('category_id', categoryData.id)
        .eq('is_active', true);

      const uniqueBrands = Array.from(
        new Map(
          brandsData
            ?.filter((item: any) => item.brands)
            .map((item: any) => [item.brands.id, item.brands])
        ).values()
      );

      setBrands(uniqueBrands as { id: string; name: string }[]);

    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(product.name, 1);
      // Show success notification (you can implement this)
      console.log(`Added ${product.name} to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  if (loading && !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
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

  return (
    <>
      {/* Structured Data */}
      <CategoryStructuredData category={category} products={products} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-gold">Home</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{category.name}</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name} Wholesale Parts</h1>
            {category.description && (
              <p className="text-gray-600 text-lg">{category.description}</p>
            )}
            <p className="text-gray-500 mt-2">{totalProducts} premium {category.name.toLowerCase()} parts available</p>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            {/* Brand Filter */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="brand"
                    value="all"
                    checked={filterBrand === 'all'}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="text-gold focus:ring-gold"
                  />
                  <span className="text-gray-700">All Brands</span>
                </label>
                {brands.map((brand) => (
                  <label key={brand.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="brand"
                      value={brand.id}
                      checked={filterBrand === brand.id}
                      onChange={(e) => setFilterBrand(e.target.value)}
                      className="text-gold focus:ring-gold"
                    />
                    <span className="text-gray-700">{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Max</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              {/* Sort */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="featured">Featured</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gold text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gold text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Search size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={product.thumbnail_url || product.images?.[0] || '/placeholder.svg'}
                          alt={`${product.name} – MidasGold 7.0 Wholesale`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {product.is_new && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">New</span>
                          )}
                          {product.is_featured && (
                            <span className="bg-gold text-white text-xs px-2 py-1 rounded">Featured</span>
                          )}
                          {product.discount_percentage > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                              -{product.discount_percentage}%
                            </span>
                          )}
                        </div>

                        {/* Quick Add to Cart */}
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="absolute bottom-2 right-2 bg-gold hover:bg-opacity-90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Add to Cart"
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                          {product.name}
                        </h3>

                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs text-gray-500">{product.brands?.name}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gold">${product.price.toFixed(2)}</span>
                            {product.original_price && product.original_price > product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.original_price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-gray-500">
                            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                          </div>
                        </div>

                        {product.short_description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {product.short_description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
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
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
