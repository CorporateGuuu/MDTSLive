'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import FacetedFilters from './FacetedFilters';
import { Product } from '../../types';
import { getProductsBySubcategory } from '../../lib/supabase/products';

interface ProductGridProps {
  products?: Product[];
  subcategory?: string;
  showFilters?: boolean;
  showNewBadge?: boolean;
}

export default function ProductGrid({ products: initialProducts, subcategory, showFilters = false, showNewBadge = false }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    brands: [] as string[],
    categories: [] as string[],
    priceRange: { min: 0, max: 10000 },
  });

  // Fetch products if subcategory is provided
  useEffect(() => {
    if (subcategory && !initialProducts) {
      setLoading(true);
      getProductsBySubcategory(subcategory)
        .then(setProducts)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [subcategory, initialProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filter by brands
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      // Filter by categories
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Filter by price range
      if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && products.length > 0 && (
        <FacetedFilters
          products={products}
          onFiltersChange={handleFiltersChange}
          initialFilters={filters}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && products.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products match your current filters.</p>
          <button
            onClick={() => setFilters({ brands: [], categories: [], priceRange: { min: 0, max: 10000 } })}
            className="mt-4 text-blue-600 hover:text-blue-800 underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
