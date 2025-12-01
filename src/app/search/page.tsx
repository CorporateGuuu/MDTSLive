'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchService, SearchResult } from '../../lib/searchService';
import { Product } from '../../types';
import ProductGrid from '../../components/Product/ProductGrid';
import FacetedFilters from '../../components/Product/FacetedFilters';

// Convert SearchResult to Product format
const convertToProduct = (searchResult: SearchResult): Product => ({
  _id: searchResult.id,
  id: searchResult.id,
  name: searchResult.name,
  price: searchResult.price,
  originalPrice: searchResult.originalPrice,
  image: searchResult.image,
  gallery: searchResult.images || [searchResult.image], // Use images array or fallback to single image
  category: searchResult.category,
  brand: searchResult.brand,
  inStock: searchResult.inStock,
  description: searchResult.description,
});

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await searchService.search(query);
        setSearchResults(response.products);
      } catch (err) {
        console.error('Search failed:', err);
        setError('Failed to load search results. Please try again.');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]);

  // Convert to Product format for ProductGrid
  const products: Product[] = searchResults.map(convertToProduct);

  if (!query.trim()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Results</h1>
          <p className="text-gray-600">Please enter a search term to find products.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Searching...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Error</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          Found {products.length} product{products.length !== 1 ? 's' : ''} matching your search
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-80 flex-shrink-0">
          <FacetedFilters
            products={products}
            onFiltersChange={() => {}} // Placeholder - filters not implemented yet
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
