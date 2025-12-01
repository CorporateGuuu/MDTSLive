'use client';

import React, { useState, useEffect } from 'react';
import { Product, FacetFilter } from '../../types';

interface FacetedFiltersProps {
  products: Product[];
  onFiltersChange: (filters: {
    brands: string[];
    categories: string[];
    priceRange: { min: number; max: number };
    conditions?: string[];
  }) => void;
  initialFilters?: {
    brands: string[];
    categories: string[];
    priceRange: { min: number; max: number };
    conditions?: string[];
  };
  showConditionFilter?: boolean;
  availableConditions?: string[];
}

export default function FacetedFilters({
  products,
  onFiltersChange,
  initialFilters = { brands: [], categories: [], priceRange: { min: 0, max: 1000 } },
  showConditionFilter = false,
  availableConditions = []
}: FacetedFiltersProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters.brands);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories);
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange);
  const [facets, setFacets] = useState<FacetFilter>({ brands: {}, categories: {}, priceRanges: {} });
  const [isOpen, setIsOpen] = useState(false);

  // Calculate facets from products
  useEffect(() => {
    const brandCounts: { [key: string]: number } = {};
    const categoryCounts: { [key: string]: number } = {};
    const priceRangeCounts: { [key: string]: number } = {};

    products.forEach(product => {
      // Count brands
      brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;

      // Count categories
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;

      // Count price ranges
      const price = product.price;
      if (price < 50) priceRangeCounts['Under $50'] = (priceRangeCounts['Under $50'] || 0) + 1;
      else if (price < 100) priceRangeCounts['$50 - $99'] = (priceRangeCounts['$50 - $99'] || 0) + 1;
      else if (price < 200) priceRangeCounts['$100 - $199'] = (priceRangeCounts['$100 - $199'] || 0) + 1;
      else priceRangeCounts['$200+'] = (priceRangeCounts['$200+'] || 0) + 1;
    });

    setFacets({ brands: brandCounts, categories: categoryCounts, priceRanges: priceRangeCounts });
  }, [products]);

  // Notify parent of filter changes
  useEffect(() => {
    onFiltersChange({
      brands: selectedBrands,
      categories: selectedCategories,
      priceRange
    });
  }, [selectedBrands, selectedCategories, priceRange, onFiltersChange]);

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands(prev => [...prev, brand]);
    } else {
      setSelectedBrands(prev => prev.filter(b => b !== brand));
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    }
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 1000 });
  };

  const hasActiveFilters = selectedBrands.length > 0 || selectedCategories.length > 0 ||
    priceRange.min > 0 || priceRange.max < 1000;

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 font-medium text-gray-900"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {selectedBrands.length + selectedCategories.length +
               (priceRange.min > 0 || priceRange.max < 1000 ? 1 : 0)}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Content */}
      {isOpen && (
        <div className="p-4 space-y-6">
          {/* Brand Filter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Brand</h3>
            <div className="space-y-2">
              {Object.entries(facets.brands)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([brand, count]) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => handleBrandChange(brand, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                    <span className="text-xs text-gray-500 ml-auto">({count})</span>
                  </label>
                ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Category</h3>
            <div className="space-y-2">
              {Object.entries(facets.categories)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([category, count]) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={(e) => handleCategoryChange(category, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                    <span className="text-xs text-gray-500 ml-auto">({count})</span>
                  </label>
                ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Min Price</label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1000"
                    min="0"
                  />
                </div>
              </div>

              {/* Price range presets */}
              <div className="space-y-2">
                {Object.entries(facets.priceRanges).map(([range, count]) => (
                  <div key={range} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{range}</span>
                    <span className="text-gray-500">({count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Condition Filter */}
          {showConditionFilter && availableConditions && availableConditions.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Condition</h3>
              <div className="space-y-2">
                {availableConditions.map((condition) => (
                  <label key={condition} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={initialFilters?.conditions?.includes(condition) || false}
                      onChange={() => {}} // Placeholder - implement when needed
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
